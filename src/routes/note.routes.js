import express from "express";
import { createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote, updateNote } from "../controllers/note.controller.js";

const router = express.Router();

router.post("/bulk", createBulkNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);

export default router;