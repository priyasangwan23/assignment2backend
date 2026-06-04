import Note from "../models/note.model.js";
import mongoose from "mongoose";

// Helper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  });
};

// 1. POST /api/notes — Create a note
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, category, isPinned } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
      data: null
    });
  }

  const note = await Note.create({ title, content, category, isPinned });
  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: note
  });
});
