require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/protected", protectedRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
