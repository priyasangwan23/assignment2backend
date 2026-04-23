import express from "express";
import * as ctrl from "../controllers/note.controller.js";

const router = express.Router();

router.post("/", ctrl.createNote);
router.get("/", ctrl.getAllNotes);
router.get("/:id", ctrl.getNoteById);

export default router;