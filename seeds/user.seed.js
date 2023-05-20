const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../Models/User.js");

const userSeed = async () => {
  try {
    // Conexion
    await connect();
    console.log("💡 Conexion desde el seed satisfactoria.");

    // Borrado de datos
    await User.collection.drop();
    console.log("🧹 Usuarios eliminados correctamente");

    const userList = [
      {
        name: "Juan",
        email: "juan@gmail.com",
        password: "12345678",
      },
      {
        name: "Karl",
        email: "karl@gmail.com",
        password: "12345678",
      },
      {
        name: "Humberto",
        email: "humberto@gmail.com",
        password: "12345678",
      },
      {
        name: "Paco",
        email: "paco@gmail.com",
        password: "12345678",
      },
      {
        name: "Pepe",
        email: "pepe@gmail.com",
        password: "12345678",
      }
    ];

    // Insercion de usuarios
    const documents = userList.map((user) => new User(user));
    await User.insertMany(documents);
    console.log("✅ Usuarios agregados correctamente.")
  } catch (error) {
    console.error(error)
  } finally {
    mongoose.disconnect();
  }
};

userSeed();
