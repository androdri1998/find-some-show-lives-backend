require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

module.exports = {
  username: [username],
  password: [password],
  database: [name_database],
  host: [host],
  dialect: [dialect] || "postgres",
  storage: "__tests__/database.sqlite",
  define: {
    underscored: true,
    underscoredAll: true,
  },
};
