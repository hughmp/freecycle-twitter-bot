const Sequelize = require('sequelize')
const sequelize = require('../clients/sequelize')

const Post = sequelize.define(
  'post',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    group: {
      type: Sequelize.STRING,
      allowNull: false
    },
    json: {
      type: Sequelize.JSONB,
      allowNull: true
    },
    isTweeted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {}
)

module.exports = Post
