import Note from "./models/Note.js";
import { validationResult } from "express-validator";

class NotesController {
  async createNote(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error when creating a note", errors });
      }

      const { title, content } = req.body;
      const userId = req.user.id;

      const note = new Note({ title, content, userId });

      await note.save();

      return res.json({ message: "Note created successfully", note });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error when creating a note" });
    }
  }
  async updateNote(req, res) {
    try {
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error when updating a note" });
    }
  }
  async allNote(req, res) {
    try {
    } catch (err) {}
  }
  async deleteNote(req, res) {
    try {
    } catch (err) {}
  }
}

export default new NotesController();
