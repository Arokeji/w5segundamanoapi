const express = require("express");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");
const { User } = require("../Models/User.js");
const { Product } = require("../Models/Product.js");

const upload = multer({ dest: "public" })
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("Estamos en el middleware/user que comprueba parámetros");

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const users = await User.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await User.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("+password");
    if (user) {
      const temporalUser = user.toObject();
      const includeProducts = req.query.includeProducts === "true";
      if (includeProducts) {
        const products = await Product.find({ owner: id });
        temporalUser.products = products;
      }

      res.json(temporalUser);
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

    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const userToUpdate = await User.findById(id);
    if (userToUpdate) {
      Object.assign(userToUpdate, req.body);
      await userToUpdate.save();
      const userToSend = userToUpdate.toObject();
      delete userToSend.password;
      res.json(userToSend);
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

// LOGIN DE USUARIOS
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;

      const jwtToken = generateToken(user._id, user.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { userRouter: router };
