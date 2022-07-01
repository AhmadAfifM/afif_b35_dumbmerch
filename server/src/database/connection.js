const Sequelize = require("sequelize");

const db = {};

const sequelize = new Sequelize(
  "b35_dumbmerch",
  "dumbways_db",
  "dumbmerch123",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

db.sequelize = sequelize;

module.exports = db;
