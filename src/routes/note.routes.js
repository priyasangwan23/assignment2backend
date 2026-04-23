import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote
} from "../controllers/note.controller.js";

const router = express.Router();

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);

export default router;