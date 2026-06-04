import express from "express";
import { createNote, createBulkNotes, getAllNotes } from "../controllers/note.controller.js";

const router = express.Router();

router.post("/bulk", createBulkNotes);
router.post("/", createNote);
router.get("/", getAllNotes);

export default router;