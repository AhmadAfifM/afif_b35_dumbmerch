require("dotenv").config();

const express = require("express");

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const PORT = 5006;

//Take Router
const routers = require("./src/routes");

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // define client origin if both client and server have different origin
  },
});

require("./src/socket")(io);
/* => const socketIo = require(("./src/socket")
socketIo(io)
*/

//CRUD nonDB
app.use("/api/v1/", routers);

app.use("/uploads", express.static("uploads"));
server.listen(PORT, () => console.log(`Server Running On PORT:${PORT}!`));
