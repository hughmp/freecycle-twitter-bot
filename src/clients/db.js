const models = require("../models");
const sequelize = require("./sequelize");

async function sync() {
  try {
    const s = await sequelize.sync({ alter: true });
    console.log("schema sync'd successfully");
    return s;
  } catch (e) {
    console.error(e.message);
  }
}

async function insertOrUpdate(model, entries) {
  const Model = models[model];
  const res = await Model.bulkCreate(entries, {
    updateOnDuplicate: [
      ...Object.keys(Model.rawAttributes).filter(a => a !== "isTweeted"),
      "updatedAt"
    ]
  });
  return res;
}

async function findByPk(model, key) {
  const Model = models[model];
  const res = await Model.findByPk(key);
  return res;
}

async function findAll(model, query = {}) {
  const Model = models[model];
  const res = await Model.findAll({ ...query, raw: true });
  return res;
}

async function update(model, values = {}, where = {}, options = {}) {
  const Model = models[model];
  const res = await Model.update(values, { where, ...options });
  return res;
}

module.exports = { sync, insertOrUpdate, findByPk, findAll, update };
