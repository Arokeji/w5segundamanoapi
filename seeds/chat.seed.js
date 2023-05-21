const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Chat } = require("../Models/Chat.js");
const { Message } = require("../Models/Message.js");
const { User } = require("../Models/User.js");
const { Product } = require("../Models/Product.js");
const { randomNumber } = require("../utils/randomNumber.js");

const chatSeed = async () => {
  try {
    // Conexion
    await connect();
    console.log("💡 Conexion desde el seed satisfactoria.");

    // Borrado de datos
    await Chat.collection.drop();
    console.log("🧹 Chats eliminados correctamente");

    // Recuperacion de usuarios, productos y mensajes
    const allUsers = await User.find();
    const allProducts = await Product.find();

    if (!allUsers.length || !allProducts.length) {
      console.log("🏜️ Faltan datos en la base de datos, no se pueden relacionar los chats.");
      // return;
    }

    // Preparacion del array de chats
    const chatList = [];

    // Crea varios chats
    for (let i = 0; i < 5; i++) {
      const randomSeller = allUsers[randomNumber(0, allUsers.length - 1)];
      const randomBuyer = allUsers.filter((buyer) => buyer !== randomSeller)[randomNumber(0, allUsers.length - 1)];
      const productsFromSeller = await Product.find({ seller: randomSeller._id });
      const randomProductFromSeller = productsFromSeller[randomNumber(0, productsFromSeller.length - 1)];
      // Falla al traer los mensajes de ambos, trae un array vacio
      const allTheirMessages = await Message.find({
        $or: [
          { emisor: randomBuyer._id, receptor: randomSeller._id },
          { emisor: randomSeller._id, receptor: randomBuyer._id }
        ]
      });
      const newChat = {
        buyer: randomBuyer,
        seller: randomSeller,
        product: randomProductFromSeller,
        messages: allTheirMessages,
      };
      chatList.push(newChat);
    }

    console.log(chatList);
    // Insercion de chats
    const documents = chatList.map((chat) => new Chat(chat));
    await Chat.insertMany(documents);
    console.log("✅ Mensajes agregados correctamente.");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

chatSeed();
