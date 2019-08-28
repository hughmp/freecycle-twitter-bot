const Sequelize = require("sequelize");
const sequelize = require("../clients/sequelize");

const ScrapeConfig = sequelize.define("scrape_config", {
  group: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  frequency_seconds: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = ScrapeConfig;
