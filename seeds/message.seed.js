const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Message } = require("../Models/Message.js");

const productSeed = async () => {
  try {
    // Conexion
    await connect();
    console.log("💡 Conexion desde el seed satisfactoria.");

    // Borrado de datos
    await Message.collection.drop();
    console.log("🧹 Mensajes eliminados correctamente");

    const messageList = [
      {
        date: "2022-11-05 09:24:17",
        message: "Ey"
      },
      {
        date: "2022-11-11 15:08:54",
        message: "Ey!"
      },
      {
        date: "2022-11-28 18:39:21",
        message: "Hola"
      },
      {
        date: "2022-12-01 11:53:59",
        message: "Que tal"
      },
      {
        date: "2022-12-12 08:38:17",
        message: "Buenas"
      },
      {
        date: "2022-12-19 21:49:35",
        message: "Alo"
      },
      {
        date: "2023-01-02 07:16:58",
        message: "Que pasa"
      },
      {
        date: "2023-01-18 16:35:42",
        message: "Como estamos"
      },
      {
        date: "2023-01-30 09:21:46",
        message: "Que me cuentas"
      },
      {
        date: "2023-02-07 16:52:59",
        message: "Eyyyy que tal"
      },
      {
        date: "2023-02-10 18:03:02",
        message: "Hello"
      },
    ];

    // Insercion de productos
    const documents = messageList.map((msg) => new Message(msg));
    await Message.insertMany(documents);
    console.log("✅ Mensajes agregados correctamente.")
  } catch (error) {
    console.error(error)
  } finally {
    mongoose.disconnect();
  }
};

productSeed();
