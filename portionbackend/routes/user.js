const express = require('express');
const bcrypt = require('bcrypt');
module.exports = (session) => {
  const router = express.Router();

  // Create a user
  router.post('/create', async (req, res) => {
    const { email, profilePic ,password,name } = req.body;
    const hashedPassword = await bcrypt.hash(password,3);

    try {
      const query = `
        CREATE (u:User {email: $email, profilePic: $profilePic ,password:$password,name:$name})
        RETURN u, id(u) as userId
      `;

       
      const result = await session.run(query, { email, profilePic ,name,password:hashedPassword});
      const user = result.records[0].get('u').properties;
      const userId = result.records[0].get('userId').toNumber(); 
      res.status(201).json({ message: 'User created', userId, user });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  });

  return router;
};
