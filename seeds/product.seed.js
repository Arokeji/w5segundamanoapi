const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Product } = require("../Models/Product.js");
const { User } = require("../Models/User.js");
const { randomNumber } = require("../utils/randomNumber.js");

const productSeed = async () => {
  try {
    // Conexion
    await connect();
    console.log("💡 Conexion desde el seed satisfactoria.");

    // Borrado de datos
    await Product.collection.drop();
    console.log("🧹 Productos eliminados correctamente");

    // Listado de productos
    const productList = [
      {
        product: "Cicloste",
        price: 25,
        description: "Cicloste con poco uso. Conservado en su caja",
      },
      {
        product: "Crotolamo",
        price: 10,
        description: "Se vende por no usar.",
      },
      {
        product: "Permatrago",
        price: 50,
        description: "Con factura y garantia",
      },
      {
        product: "Uxiono",
        price: 45,
        description: "Precio negociable",
      },
      {
        product: "Cicloste",
        price: 25,
        description: "Cicloste con poco uso. Conservado en su caja",
      },
    ];

    // Recuperacion de usuarios para asignarlos a productos
    const allUsers = await User.find();

    if (!allUsers.length) {
      console.log("🏜️ No hay usuarios en la base de datos, no se pueden relacionar productos.");
      return;
    }

    // Asigna un usuario aleatorio a cada producto
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i];
      const randomUser = allUsers[randomNumber(0, allUsers.length - 1)];
      product.seller = randomUser._id;
    }

    // Insercion de productos
    const documents = productList.map((product) => new Product(product));
    await Product.insertMany(documents);
    console.log("✅ Productos agregados correctamente.");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

productSeed();
