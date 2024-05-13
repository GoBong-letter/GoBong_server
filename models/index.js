const Sequelize = require('sequelize');
const User = require('./users');
const Card = require('./cards');
const Category = require('./category');
const UserCtg = require('./user_ctg')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;
db.Card = Card;
db.Category = Category;
db.UserCtg = UserCtg;

User.init(sequelize);
Card.init(sequelize);
Category.init(sequelize);
UserCtg.init(sequelize);

db.User.belongsToMany(db.Category, {
    through: 'UserCtg',
    foreignKey: "user_id",
    sourceKey: "id",
});

db.Category.belongsToMany(db.User, {
    through: 'UserCtg',
    foreignKey: "ctg_id",
    sourceKey: "id",
});

module.exports = db;