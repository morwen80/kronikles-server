const express = require('express');
const server = express();
const body_parser = require('body-parser');

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
});


const db = require('diskdb');
db.connect('./data', ['kronikles']);

server.use(body_parser.json());

server.get("/json", (req, res) => {
   res.json({ message: "Hello world" });
});

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});


// CREATE
server.post("/kronikles", (req, res) => {
   const note = req.body;
   // add new note to db
   db.kronikles.save(note);
   // return updated list
   res.json(db.kronikles.find());
});


// READ ONE KRONIKLE
server.get("/kronikles/:id", (req, res) => {
   const noteId = req.params.id;
   const kronikles = db.kronikles.find({ _id: noteId });
   if (kronikles.length) {
      res.json(kronikles);
   } else {
      res.json({ message: `note ${noteId} doesn't exist` })
   }
});


// READ ALL THE KRONIKLES
server.get("/kronikles", (req, res) => {
   res.json(db.kronikles.find());
});


// UPDATE A KRONIKLE
server.patch("/kronikles/:id", (req, res) => {
   const noteId = req.params.id;
   const note = req.body;

   db.kronikles.update({ _id: noteId }, note);

   res.json(db.kronikles.find());
});


// DELETE A KRONIKLE
server.delete("/kronikles/:id", (req, res) => {
   const noteId = req.params.id;

   db.kronikles.remove({ _id: noteId });
   res.json(db.kronikles.find());
});
