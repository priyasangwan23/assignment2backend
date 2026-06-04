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

// 4. GET /api/notes/:id — Get note by ID
export const getNoteById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "Note fetched successfully",
    data: note
  });
});

// 5. PUT /api/notes/:id — Full replace
export const replaceNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  const replacedNote = await Note.findByIdAndUpdate(
    id,
    req.body,
    { new: true, overwrite: true, runValidators: true }
  );

  if (!replacedNote) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "Note replaced successfully",
    data: replacedNote
  });
});

// 6. PATCH /api/notes/:id — Partial update
export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields provided to update",
      data: null
    });
  }

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedNote) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    data: updatedNote
  });
});
