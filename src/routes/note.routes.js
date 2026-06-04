import express from "express";
import { createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, deleteBulkNotes, getNotesByCategory, getNotesByStatus, getNoteSummary } from "../controllers/note.controller.js";

const router = express.Router();

router.post("/bulk", createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

router.get("/category/:category", getNotesByCategory);
router.get("/status/:isPinned", getNotesByStatus);

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id/summary", getNoteSummary);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;