const getEnv = (stage) => {
  switch (stage) {
    case "test":
      return ".env.test";
    case "dev":
      return ".env.dev";
    case "dev":
      return ".env.prod";
  }
};

require("dotenv").config({
  path: getEnv(process.env.NODE_ENV),
});

const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/users");
const livesRoutes = require("./routes/lives");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRoutes);
app.use("/lives", livesRoutes);

module.exports = app;
