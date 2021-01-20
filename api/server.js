const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const morgan = require("morgan");
const { orWhereNotExists } = require("../data/dbConfig.js");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

server.use(express.json());

server.use(helmet());
//server.use(lockout);
//server.use(morgan("dev"));
server.use(methodLogger);
server.use(addName);
server.use("/api/hubs", hubsRouter);

server.use(divisibleBy3);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

// server.delete("/", (req, res) => {
//   res.send("deleted");
// });

function methodLogger(req, res, next) {
  console.log(`${req.method} method`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || "sk";
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: "api in maintenance mode" });
  next();
}

function divisibleBy3(req, res, next) {
  const seconds = new Date().getSeconds();
  if (!(seconds % 3))
    res.status(403).json({ message: `${seconds} seconds is divisible by 3` });
  next();
}

server.use((error, req, res, next) => {
  res.status(400).json({ message: "there was an error", error });
});

module.exports = server;
