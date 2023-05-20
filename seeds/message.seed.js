const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Message } = require("../Models/Message.js");
const { User } = require("../Models/User.js");
const { randomNumber } = require("../utils/randomNumber.js");

const productSeed = async () => {
  try {
    // Conexion
    await connect();
    console.log("💡 Conexion desde el seed satisfactoria.");

    // Borrado de datos
    await Message.collection.drop();
    console.log("🧹 Mensajes eliminados correctamente");

    // Listado de mensajes
    const messageList = [
      {
        date: "2022-11-05 09:24:17",
        message: "Ey",
      },
      {
        date: "2022-11-11 15:08:54",
        message: "Ey!",
      },
      {
        date: "2022-11-28 18:39:21",
        message: "Hola",
      },
      {
        date: "2022-12-01 11:53:59",
        message: "Que tal",
      },
      {
        date: "2022-12-12 08:38:17",
        message: "Buenas",
      },
      {
        date: "2022-12-19 21:49:35",
        message: "Alo",
      },
      {
        date: "2023-01-02 07:16:58",
        message: "Que pasa",
      },
      {
        date: "2023-01-18 16:35:42",
        message: "Como estamos",
      },
      {
        date: "2023-01-30 09:21:46",
        message: "Que me cuentas",
      },
      {
        date: "2023-02-07 16:52:59",
        message: "Eyyyy que tal",
      },
      {
        date: "2023-02-10 18:03:02",
        message: "Hello",
      },
    ];

    // Recuperacion de usuarios para asignarlos a productos
    const allUsers = await User.find();

    if (!allUsers.length) {
      console.log("🏜️ No hay usuarios en la base de datos, no se pueden relacionar mensajes.");
      return;
    }

    // Asigna un emisor aleatorio a cada mensaje
    for (let i = 0; i < messageList.length; i++) {
      const message = messageList[i];
      const randomUser = allUsers[randomNumber(0, allUsers.length - 1)];
      message.emisor = randomUser._id;
    }

    // Asigna un receptor aleatorio a cada mensaje comprobando que no se repita con el emisor
    for (let i = 0; i < messageList.length; i++) {
      let repeated = false;
      do {
        const message = messageList[i];
        const randomUser = allUsers[randomNumber(0, allUsers.length - 1)];
        if (message.emisor !== randomUser._id) {
          message.receptor = randomUser._id;
          repeated = false;
        } else {
          repeated = true;
        }
      } while (repeated);
    }

    // Insercion de mensajes
    const documents = messageList.map((msg) => new Message(msg));
    await Message.insertMany(documents);
    console.log("✅ Mensajes agregados correctamente.");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

productSeed();
