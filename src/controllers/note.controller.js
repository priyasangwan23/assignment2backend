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

// 2. POST /api/notes/bulk — Create multiple notes
export const createBulkNotes = asyncHandler(async (req, res) => {
  const { notes } = req.body;

  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return res.status(400).json({
      success: false,
      message: "notes array is required and cannot be empty",
      data: null
    });
  }

  const createdNotes = await Note.insertMany(notes);
  res.status(201).json({
    success: true,
    message: `${createdNotes.length} notes created successfully`,
    data: createdNotes
  });
});

// 3. GET /api/notes — Get all notes
export const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  res.status(200).json({
    success: true,
    message: "Notes fetched successfully",
    count: notes.length,
    data: notes
  });
});
