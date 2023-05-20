const { userRouter } = require("./Routes/user.routes.js");
const { productRouter } = require("./Routes/product.routes.js");
const { messageRouter } = require("./Routes/message.routes.js");
const { chatRouter } = require("./Routes/chat.routes.js");

const express = require("express");
const cors = require("cors");

// Rutas permitidas por CORS
const corsWhiteList = ["http://localhost:3000", "http://localhost:3001"];

// La intencion del main es que sea una funcion async para poder hacer await en connect
// para el despliegue en Vercel
const main = async () => {
  // Conexion a la BBDD
  const { connect } = require("./db.js");
  const database = await connect();

  // Configuracion del servidor.
  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors({ origin: corsWhiteList }));

  // Respuestas basicas de rutas
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send(`Segunda Mano API usando ${database.connection.name}`);
  });
  router.get("*", (req, res) => {
    res.status(404).send("La página solicitada no existe");
  });

  // Middlewares de aplicación
  app.use((req, res, next) => {
    const date = new Date();
    console.log(`🔗 Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date}`);
    next();
  });

  // Middleware para rutas concretas*
  app.use("/user", (req, res, next) => {
    console.log("🔑 Solicitando ruta user.");
    next();
  });
  app.use("/product", (req, res, next) => {
    console.log("🔑 Solicitando ruta product.");
    next();
  });
  app.use("/message", (req, res, next) => {
    console.log("🔑 Solicitando ruta message.");
    next();
  });

  app.use("/chat", (req, res, next) => {
    console.log("🔑 Solicitando ruta chat.");
    next();
  });

  // Uso del router
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/message", messageRouter);
  app.use("/chat", chatRouter);
  app.use("/", router);

  // Middleware para la gestion de errores
  app.use((err, req, res, next) => {
    console.log("🚩 ERROR 🚩");
    console.log(`Peticion fallida: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (err?.code === 11000) {
      console.log("Usuario duplicado");
      res.status(400).json({ error: err.errmsg });
    } else {
      res.status(500).json(err);
    }

    console.log("🚩 FIN DE ERROR 🚩");

    console.error(err);
    res.status(500).send(err.stack);
  });

  // Ejecución del servidor
  app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
  });
};

main();
