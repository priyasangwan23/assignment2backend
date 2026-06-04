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

// 7. DELETE /api/notes/:id — Delete single
export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  const deletedNote = await Note.findByIdAndDelete(id);
  if (!deletedNote) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
    data: null
  });
});

// 8. DELETE /api/notes/bulk — Delete multiple
export const deleteBulkNotes = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "ids array is required and cannot be empty",
      data: null
    });
  }

  await Note.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
    message: `${ids.length} notes deleted successfully`,
    data: null
  });
});

// 9. GET /api/notes/category/:category — Get by category
export const getNotesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const allowedCategories = ["work", "personal", "study"];

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Allowed: ${allowedCategories.join(", ")}`,
      data: null
    });
  }

  const notes = await Note.find({ category });
  if (notes.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No notes found for category: ${category}`,
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: `Notes fetched for category: ${category}`,
    count: notes.length,
    data: notes
  });
});

// 10. GET /api/notes/status/:isPinned — Get by pinned status
export const getNotesByStatus = asyncHandler(async (req, res) => {
  const { isPinned } = req.params;

  if (isPinned !== "true" && isPinned !== "false") {
    return res.status(400).json({
      success: false,
      message: "isPinned must be true or false",
      data: null
    });
  }

  const pinned = isPinned === "true";
  const notes = await Note.find({ isPinned: pinned });

  res.status(200).json({
    success: true,
    message: pinned ? "Fetched all pinned notes" : "Fetched all unpinned notes",
    count: notes.length,
    data: notes
  });
});

// 11. GET /api/notes/:id/summary — Get note summary
export const getNoteSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      data: null
    });
  }

  const note = await Note.findById(id).select("title category isPinned createdAt");
  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "Note summary fetched successfully",
    data: note
  });
});

// 12. GET /api/notes/filter — General filter
export const filterNotes = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.isPinned !== undefined) {
    filter.isPinned = req.query.isPinned === "true";
  }

  const notes = await Note.find(filter);
  res.status(200).json({
    success: true,
    message: "Notes fetched successfully",
    count: notes.length,
    data: notes
  });
});

// 13. GET /api/notes/filter/pinned — Get pinned notes (optional category query)
export const getPinnedNotes = asyncHandler(async (req, res) => {
  const filter = { isPinned: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const notes = await Note.find(filter);
  if (notes.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No pinned notes found",
      data: null
    });
  }
  res.status(200).json({
    success: true,
    message: "Pinned notes fetched successfully",
    count: notes.length,
    data: notes
  });
});

// 14. GET /api/notes/filter/category — Filter by category query param
export const filterByCategory = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Query param 'name' is required",
      data: null
    });
  }

  const notes = await Note.find({ category: name });
  res.status(200).json({
    success: true,
    message: `Notes filtered by category: ${name}`,
    count: notes.length,
    data: notes
  });
});

// 15. GET /api/notes/filter/date-range — Filter by date range
export const filterByDateRange = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: "Both 'from' and 'to' query params are required",
      data: null
    });
  }

  const notes = await Note.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to)
    }
  });

  res.status(200).json({
    success: true,
    message: `Notes fetched between ${from} and ${to}`,
    count: notes.length,
    data: notes
  });
});

// 16. GET /api/notes/paginate — Paginate all notes
export const paginateNotes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Note.countDocuments();
  const totalPages = Math.ceil(total / limit);
  const notes = await Note.find().skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    message: "Notes fetched successfully",
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: notes
  });
});

// 17. GET /api/notes/paginate/category/:category — Paginate by category
export const paginateByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Note.countDocuments({ category });
  const totalPages = Math.ceil(total / limit);
  const notes = await Note.find({ category }).skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    message: `Notes fetched for category: ${category}`,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    data: notes
  });
});

// 18. GET /api/notes/sort — Sort notes
export const sortNotes = asyncHandler(async (req, res) => {
  const { sortBy, order } = req.query;
  const allowedFields = ["title", "createdAt", "updatedAt", "category"];

  if (sortBy && !allowedFields.includes(sortBy)) {
    return res.status(400).json({
      success: false,
      message: `Invalid sortBy. Allowed: ${allowedFields.join(", ")}`,
      data: null
    });
  }

  const sortField = sortBy || "createdAt";
  const sortOrder = order === "desc" ? -1 : 1;

  const notes = await Note.find().sort({ [sortField]: sortOrder });
  res.status(200).json({
    success: true,
    message: `Notes sorted by ${sortField} in ${sortOrder === 1 ? "ascending" : "descending"} order`,
    count: notes.length,
    data: notes
  });
});

// 19. GET /api/notes/sort/pinned — Sort only pinned notes
export const sortPinnedNotes = asyncHandler(async (req, res) => {
  const { sortBy, order } = req.query;
  const allowedFields = ["title", "createdAt", "updatedAt", "category"];

  if (sortBy && !allowedFields.includes(sortBy)) {
    return res.status(400).json({
      success: false,
      message: `Invalid sortBy. Allowed: ${allowedFields.join(", ")}`,
      data: null
    });
  }

  const sortField = sortBy || "createdAt";
  const sortOrder = order === "desc" ? -1 : 1;

  const notes = await Note.find({ isPinned: true }).sort({ [sortField]: sortOrder });
  res.status(200).json({
    success: true,
    message: `Pinned notes sorted by ${sortField} in ${sortOrder === 1 ? "ascending" : "descending"} order`,
    count: notes.length,
    data: notes
  });
});

