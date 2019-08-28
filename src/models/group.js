const Sequelize = require('sequelize')
const sequelize = require('../clients/sequelize')

const Group = sequelize.define(
  'group',
  {
    url: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true
    },
    region: {
      type: Sequelize.STRING,
      allowNull: true
    },
    label: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {}
)

module.exports = Group
