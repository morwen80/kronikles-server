const express = require('express');
const server = express();
const body_parser = require('body-parser');

const db = require('diskdb');
db.connect('./data', ['notes']);

server.use(body_parser.json());

server.get("/json", (req, res) => {
   res.json({ message: "Hello world" });
});

const port = 4000;

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});


// CREATE
server.post("/notes", (req, res) => {
   const note = req.body;
   // add new note to db
   db.notes.save(note);
   // return updated list
   res.json(db.notes.find());
});


// READ ONE NOTE
server.get("/notes/:id", (req, res) => {
   const noteId = req.params.id;
   const notes = db.notes.find({ _id: noteId });
   if (notes.length) {
      res.json(notes);
   } else {
      res.json({ message: `note ${noteId} doesn't exist` })
   }
});


// READ ALL THE NOTES
server.get("/notes", (req, res) => {
   res.json(db.notes.find());
});


// UPDATE
server.put("/notes/:id", (req, res) => {
   const noteId = req.params.id;
   const note = req.body;

   db.notes.update({ _id: noteId }, note);

   res.json(db.notes.find());
});


// DELETE
server.delete("/notes/:id", (req, res) => {
   const noteId = req.params.id;

   db.notes.remove({ _id: noteId });
   res.json(db.notes.find());
});



// add first note
if (!db.notes.find().length) {
   const note = { id: "tt0110357", name: "The Lion King", genre: "animation" };
   db.notes.save(note);
}
console.log(db.notes.find());
