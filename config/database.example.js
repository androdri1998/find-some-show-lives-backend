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

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || "postgres",
  storage: "__tests__/database.sqlite",
  define: {
    underscored: true,
    underscoredAll: true,
  },
};
