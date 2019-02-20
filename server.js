const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const morgan = require("morgan");
const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(teamName);
// server.use(moodyGatekeeper);
server.use(restricted);
server.use("/api/hubs", restricted, only("frodo"));

server.use("/api/hubs", hubsRouter);

// function moodyGatekeeper(req, res, next) {
//   const seconds = new Date().getSeconds();

//   if (seconds % 3 === 0) {
//     res.status(403).json("none shall pass!");
//   } else {
//     next();
//   }
// }

server.get("/", (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.authorization;

  if (password != "melon") {
    res.status(401).json("Cant Touch This");
  } else {
    next();
  }
}

// should accept a name as its only argument and return middleware that returns a 403 status if req.headers.name is different from the name specified.
function only(name) {
  return function(req, res, next) {
    const myName = req.headers.name;

    if (myName === name) {
      next();
    } else {
      res.status(403).json("uh-uhhh not TODAY");
    }
  };
}

function teamName(req, res, next) {
  req.team = "Lambda Students";

  next();
}

server.use((req, res, next) => {
  res.status(404).send("Aint Nobody got time for that!");
});

module.exports = server;
