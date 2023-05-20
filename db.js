require("dotenv").config();

const DB_CONNECTION = process.env.DB_CONNECTION;
const DB_NAME = process.env.DB_NAME;

const mongoose = require("mongoose");

// Configuracion de la conexion
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME,
};

const connect = async () => {
  console.log("🔌 Conectando a la BBDD");
  try {
    const database = await mongoose.connect(DB_CONNECTION, config);
    const name = database.connection.name;
    const host = database.connection.host;
    console.log(`✅ Conectado a ${name} en ${host}`);
    return database;
  } catch (error) {
    console.error(error);
    console.log("❌ No se ha podido conectar. Se reintentará de nuevo en 5 segundos");
    setTimeout(connect, 5000);
  }
};

module.exports = { connect };
