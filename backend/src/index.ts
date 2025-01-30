import express from "express";
import * as dotenv from "dotenv";
import { createServer } from "node:http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);

const io = new Server(server);

dotenv.config();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

io.on("connection", (socket) => {
  console.log(socket);
});

server.listen(8080, () => {
  console.log("server running on port 8080");
});
