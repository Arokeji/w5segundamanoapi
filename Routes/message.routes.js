const express = require("express");
const { Message } = require("../Models/Message.js");

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    console.log("Estamos en el middleware/message que comprueba parámetros");

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page;
      req.query.limit = limit;
      next();
    } else {
      console.log("Parámetros no válidos:");
      console.log(JSON.stringify(req.query));
      res.status(400).json({ error: "Params page or limit are not valid" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const messageList = await Message.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Message.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: messageList,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const message = await Message.findById(id);
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const message = new Message(req.body);

    const createdMessage = await message.save();
    return res.status(201).json(createdMessage);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const messageDeleted = await Message.findByIdAndDelete(id);
    if (messageDeleted) {
      res.json(messageDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const messageDeleted = await Message.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (messageDeleted) {
      res.json(messageDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});
