const Sequelize = require('sequelize');
const Card = require('./cards');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.Card = Card;

Card.init(sequelize);

module.exports = db;