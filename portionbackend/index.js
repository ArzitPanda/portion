const express = require('express');
const cors =require('cors');
const app =express();
const neo4j = require('neo4j-driver');

const userRoutes = require('./routes/user.js');
const folderRoutes = require('./routes/folder.js');
const noteRoutes = require('./routes/note.js');

app.use(express.json());
app.use(cors())



const driver = neo4j.driver(
    'neo4j+s://4b8570ff.databases.neo4j.io', 
    neo4j.auth.basic('neo4j', 'gZEuYCp2kM2A7xOs6UtD_VArAKTJnwYHuiyugFnw-ys') // Replace with your Neo4j credentials
  );

  const session = driver.session();



app.use('/user', userRoutes(session));
app.use('/folder', folderRoutes(session));
app.use('/note', noteRoutes(session));

app.get("/",(req,res)=>{


    res.send("hello world")
})

app.listen(3000,()=>{console.log("i am listening..")});