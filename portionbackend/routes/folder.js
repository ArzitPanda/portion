const express = require('express');

// Export a function that takes the session and returns the router
module.exports = (session) => {
  const router = express.Router();

  // Create a folder for a user
  router.post('/create-folder', async (req, res) => {
    const { userId, folderTitle } = req.body;

    try {
      const query = `
        MATCH (u:User)
        WHERE id(u) = $userId
        CREATE (u)-[:HAS_FOLDER]->(f:Folder {title: $folderTitle, isDeleted: false})
        RETURN f, id(f) as folderId
      `;
      const result = await session.run(query, { userId: parseInt(userId), folderTitle });
      const folder = result.records[0].get('f').properties;
      const folderId = result.records[0].get('folderId').toNumber(); // Get Neo4j generated ID
      res.status(201).json({ message: 'Folder created', folderId, folder });
    } catch (err) {
      console.error('Error creating folder:', err);
      res.status(500).json({ error: 'An error occurred while creating the folder' });
    }
  });

  return router;
};
