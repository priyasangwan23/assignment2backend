import express from "express";
import { createNote, createBulkNotes } from "../controllers/note.controller.js";

const router = express.Router();

router.post("/bulk", createBulkNotes);
router.post("/", createNote);

export default router;