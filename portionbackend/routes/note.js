const express = require('express');

// Export a function that takes the session and returns the router
module.exports = (session) => {
  const router = express.Router();

  // Create a note (independent or within a folder)
  router.post('/create', async (req, res) => {
    const { title, content, parentId, folderId ,userId} = req.body;

    try {
      let query;
      if (!parentId && !folderId) {
        // The note is independent and its own parent
        query = `
        MATCH(u:User)
        WHERE id(u)= $userId
        CREATE (u)-[:INDEPENDENT_NOTES]->
          (n:Note {title: $title, content: $content, date: datetime(), isDeleted: false})
          SET n.parentId = id(n)
          RETURN n, id(n) as noteId
        `;
      }
      // Case 2: Note inside a Folder
      else if (folderId && !parentId) {
        query = `
          MATCH (f:Folder)
          WHERE id(f) = $folderId
          CREATE (f)-[:CONTAINS]->(n:Note {title: $title, content: $content, date: datetime(), isDeleted: false})
          SET n.parentId = id(n)
          RETURN n, id(n) as noteId
        `;
      }
      // Case 3: Note inside another Note (nested note)
      else if (parentId) {
        query = `
          MATCH (p:Note)
          WHERE id(p) = $parentId
          CREATE (p)-[:CONTAINS_NOTE]->(n:Note {title: $title, content: $content, date: datetime(), isDeleted: false})
          SET n.parentId = $parentId
          RETURN n, id(n) as noteId
        `;
      }

      const result = await session.run(query, { title, content, parentId: parseInt(parentId), folderId: parseInt(folderId) ,userId:parseInt(userId)});
      const note = result.records[0].get('n').properties;
      const noteId = result.records[0].get('noteId').toNumber(); // Get Neo4j generated ID
      res.status(201).json({ message: 'Note created', noteId, note });
    } catch (err) {
      console.error('Error creating note:', err);
      res.status(500).json({ error: 'An error occurred while creating the note' });
    }
  });

  return router;
};
