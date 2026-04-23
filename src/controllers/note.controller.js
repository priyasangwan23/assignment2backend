import Note from "../models/note.model.js";
import mongoose from "mongoose";

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();

  res.json({
    success: true,
    message: "Notes fetched successfully",
    count: notes.length,
    data: notes,
  });
};


export const createNote = async (req, res) => {
  const { title, content, category, isPinned } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
      data: null,
    });
  }

  const note = await Note.create({ title, content, category, isPinned });

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: note,
  });
};