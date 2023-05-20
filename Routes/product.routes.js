const express = require("express");
const multer = require("multer");
const fs = require("fs");

// Modelos
const { Product } = require("../Models/Product.js");

const upload = multer({ dest: "public" });
const router = express.Router();

// CRUD: READ
router.get("/", async (req, res, next) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const products = await Product.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("user");

    // Num total de elementos
    const totalElements = await Product.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: products,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("user");
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res, next) => {
  console.log(req.headers);

  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const productDeleted = await Product.findByIdAndDelete(id);
    if (productDeleted) {
      res.json(productDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const productUpdated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (productUpdated) {
      res.json(productUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// Subida de imagen de producto

router.post("/image-upload", upload.single("image"), async (req, res, next) => {
  try {
    const originalname = req.file.originalname;
    const path = req.file.path;
    const newPath = path + "_" + originalname;
    fs.renameSync(path, newPath);

    const productId = req.body.productId;
    const product = await Product.findById(productId);

    if (product) {
      product.profileImage = newPath;
      await product.save();
      res.json(product);

      console.log("Imagen de usuario modificada correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { productRouter: router };
