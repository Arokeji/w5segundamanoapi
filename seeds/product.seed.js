const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Product } = require("../Models/Product.js");

const productSeed = async () => {
  try {
    // Conexion
    await connect();
    console.log("💡 Conexion desde el seed satisfactoria.");

    // Borrado de datos
    await Product.collection.drop();
    console.log("🧹 Productos eliminados correctamente");

    const productList = [
      {
        product: "Cicloste",
        price: 25,
        description: "Cicloste con poco uso. Conservado en su caja"
      },
      {
        product: "Crotolamo",
        price: 10,
        description: "Se vende por no usar."
      },
      {
        product: "Permatrago",
        price: 50,
        description: "Con factura y garantia"
      },
      {
        product: "Uxiono",
        price: 45,
        description: "Precio negociable"
      },
      {
        product: "Cicloste",
        price: 25,
        description: "Cicloste con poco uso. Conservado en su caja"
      },
    ];

    // Insercion de productos
    const documents = productList.map((product) => new Product(product));
    await Product.insertMany(documents);
    console.log("✅ Productos agregados correctamente.")
  } catch (error) {
    console.error(error)
  } finally {
    mongoose.disconnect();
  }
};

productSeed();
