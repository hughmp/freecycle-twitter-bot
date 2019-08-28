const fs = require("fs");
const models = fs
  .readdirSync(__dirname)
  .filter(file => file !== "index.js" && file.endsWith(".js"))
  .reduce((exports, file) => {
    const key = file.slice(0, -3);
    const value = require(`./${file}`);
    return {
      ...exports,
      [key]: value
    };
  }, {});

module.exports = models;
