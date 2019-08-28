const Sequelize = require('sequelize')
const sequelize = require('../clients/sequelize')

const Country = sequelize.define(
  'country',
  {
    url: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    label: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {}
)

module.exports = Country
