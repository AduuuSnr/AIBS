require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const userRouter = require("./src/routes/userRouter");

// MIDDLEWARES
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors());
app.use("/users", userRouter);

// ENV VARIABLES
const { MONGODB_URI, PORT } = process.env;

app.get("/", (req, res, next) => {
  res.status(403).json({ message: "Unauthorized access" });
});

const httpServer = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.log("error:", error);
});
app.listen(PORT, () => {
  console.log(`Server started on Port : ${PORT}...`);
});
httpServer.listen(9981, () => {
  console.log("HTTP Server running on port 9981");
});
