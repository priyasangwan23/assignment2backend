import express from "express";
import { createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, deleteBulkNotes } from "../controllers/note.controller.js";

const router = express.Router();

router.post("/bulk", createBulkNotes);
router.delete("/bulk", deleteBulkNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;