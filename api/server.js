const express = require("express");
const helmet = require('helmet');


const usersRouter = require("../users/users-router.js");
const dbConnection = require("../database/connection.js");
const authRouter = require("../auth/auth-router")

const server = express();


server.use(helmet());
server.use(express.json());



server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
  });
  
  module.exports = server;