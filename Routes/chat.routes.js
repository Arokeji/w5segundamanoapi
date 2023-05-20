const express = require("express");

// Modelos
const { Chat } = require("../Models/Chat.js");

const router = express.Router();

// CRUD: READ
router.get("/", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const chats = await Chat.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("message");

    // Num total de elementos
    const totalElements = await Chat.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: chats,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const chat = await Chat.findById(id).populate("message");
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res) => {
  console.log(req.headers);

  try {
    const chat = new Chat(req.body);
    const createdChat = await chat.save();
    return res.status(201).json(createdChat);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const chatDeleted = await Chat.findByIdAndDelete(id);
    if (chatDeleted) {
      res.json(chatDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const chatUpdated = await Chat.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (chatUpdated) {
      res.json(chatUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = { chatRouter: router };
