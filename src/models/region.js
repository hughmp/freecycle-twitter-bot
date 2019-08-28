const Sequelize = require("sequelize");
const sequelize = require("../clients/sequelize");

const Region = sequelize.define(
  "region",
  {
    url: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false
    },
    label: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {}
);

module.exports = Region;
