const Sequelize = require("sequelize");
const config = require("../config");

const { username, password, database, host, port } = config.postgres;

const options = {
  username,
  password,
  database,
  host,
  port,
  dialect: "postgres",
  logging: false
};

const sequelize = new Sequelize(options);

module.exports = sequelize;
