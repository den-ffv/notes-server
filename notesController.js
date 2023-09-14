import { json } from "express";
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
  async getNoteDyUser(req, res) {
    try {
      const userId = req.user.id;

      const userNote = await Note.find({ userId });

      return res.json({ notes: userNote });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error when fetching user's notes" });
    }
  }
  async updateNote(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error when updating a note", errors });
      }

      const { title, content } = req.body;
      const noteId = req.params.id;

      const existingNote = await Note.findById(noteId);

      if (!existingNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      existingNote.title = title;
      existingNote.content = content;
      existingNote.updatedAt = new Date()

      await existingNote.save();
      return res.json({
        message: "Note updated successfully",
        note: existingNote,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error when updating a note" });
    }
  }
  // async allNote(req, res) {
  //   try {
  //   } catch (err) {}
  // }
  async deleteNote(req, res) {
    try {
      const noteId = req.params.id;
      const existingNote = await Note.findById(noteId);

      if (!existingNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      existingNote.isDeleted = true;
      existingNote.isRestored = false;
      existingNote.deleteAt = new Date();

      await existingNote.save();
      return res.json({
        message: "Note marked as deleted",
        note: existingNote,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error when deleting a note" });
    }
  }
  async restoreNote(req, res) {
    try {
      const noteId = req.params.id;
      const existingNote = await Note.findById(noteId);

      if (!existingNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      existingNote.isRestored = true;
      existingNote.isDeleted = false;
      existingNote.deleteAt = null

      await existingNote.save();
      return res.json({
        message: "Note restored successfully",
        note: existingNote,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Error when restoring a note" });
    }
  }
}

export default new NotesController();
