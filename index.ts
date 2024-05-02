import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import fs from "fs";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
// import { createServer } from "node:http";
import { createServer } from "http";
import { Server } from "socket.io";
import { buildUsersController } from "./server/controllers/users_controller";
import { buildSessionsController } from "./server/controllers/sessions_controller";
import { buildHomeController } from "./server/controllers/home_controller";
import { UsersRepository } from "./server/repositories/users_respository";
import { buildRecipesController } from "./server/controllers/recipes_controller";
import { RecipesRepository } from "./server/repositories/recipes_repository";

const db = new PrismaClient();
const usersRepository = UsersRepository.getInstance(db);
const recipesRepository = RecipesRepository.getInstance(db);

dotenv.config();

export const DEBUG = process.env.NODE_ENV !== "production";
export const MANIFEST: Record<string, any> = DEBUG
  ? {}
  : JSON.parse(fs.readFileSync("static/.vite/manifest.json").toString());

const app = express();
const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer); // Attach socket.io to the HTTP server

// const server = createServer(app);
// const io = new Server(server);

let connections = 0;

io.on("connection", (socket) => {
  connections++;
  console.log(
    `Connection received! ${connections} ${
      connections == 1 ? "person" : "people"
    } chatting. New ID: ${socket.id}`
  );

  socket.on("disconnect", () => {
    connections--;
    console.log(
      `Client disconnected! ${connections} ${
        connections == 1 ? "person" : "people"
      } left in the chat.`
    );
  });

  socket.on("message", (data) => {
    io.emit("newMessage", data);
  });
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

if (!DEBUG) {
  app.use(express.static("static"));
} else {
  app.use((req, res, next) => {
    if (req.url.includes(".")) {
      res.redirect(`${process.env.ASSET_URL}/${req.url}`);
    } else {
      next();
    }
  });
}

app.use("/", buildHomeController());
app.use("/users", buildUsersController(usersRepository));
app.use("/sessions", buildSessionsController(db));
app.use("/recipes", buildRecipesController(recipesRepository));

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Listening on port ${process.env.PORT || 3000}...`);
// });

httpServer.listen(3000, () => {
  console.log("Listening on port 3000...");
});
