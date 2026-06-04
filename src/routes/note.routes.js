import express from "express";
import { createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote } from "../controllers/note.controller.js";

const router = express.Router();

router.post("/bulk", createBulkNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);

export default router;