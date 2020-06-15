const express = require("express");
const helmet = require('helmet');
const session = require('express-session') // install library
const KnexSessionStore = require('connect-session-knex')(session); // install library


const usersRouter = require("../users/users-router.js");
const dbConnection = require("../database/connection.js");
const authRouter = require("../auth/auth-router");

const requiresAuth = require('../auth/requires-auth.js')
const dbConection = require("../database/connection.js");


const server = express();

const sessionConfig = {
  name: 'monster',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
  cookie: {
    maxAge: 100 * 60 * 10,
    secure: process.env.COOKIE_SECURE || false,// true means use only over https
    httpOnly: true, // js code on the client can not access the session cookie
  },
  resave: false,
  saveUninitialized: true, // GDPR compliance, read the docs
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 6000, // delete expired sessions - in milliseconds
  }),
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig)) /// the on switch to the sessions



server.use("/api/users", requiresAuth, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
  });
  
  module.exports = server;