const express = require("express");
const fs = require("fs");
const multer = require("multer");
const { User } = require("../Models/User.js");

const upload = multer({ dest: "public" })
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    console.log("Estamos en el middleware/user que comprueba parámetros");

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

    const userList = await User.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await User.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: userList,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.get("/name/:name", async (req, res, next) => {
  const name = req.params.name;

  try {
    const user = await User.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (user?.length) {
      res.json(user);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = new User(req.body);

    const createdUser = await user.save();
    return res.status(201).json(createdUser);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const userDeleted = await User.findByIdAndDelete(id);
    if (userDeleted) {
      res.json(userDeleted);
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
    const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (userUpdated) {
      res.json(userUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.post("/image-upload", upload.single("image"), async (req, res, next) => {
  try {
    const originalname = req.file.originalname;
    const path = req.file.path;
    const newPath = path + "_" + originalname;
    fs.renameSync(path, newPath);

    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (user) {
      user.profileImage = newPath;
      await user.save();
      res.json(user);

      console.log("Imagen de usuario modificada correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { bookRouter: router };
