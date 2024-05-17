const Sequelize = require('sequelize');
const User = require('./users');
const Card = require('./cards');
const Category = require('./category');
const UserCtg = require('./user_ctg')
const Letter = require('./letters');
const LetterCtg = require('./letter_ctg');
const LetterReply = require("./letter_reply");
const Community = require("./community");
const CommunityComment = require("./community_comments");

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "mysql",
    timezone: "Asia/Seoul",
    dialectOptions: {
        charset: "utf8mb4",
        dateStrings: true,
        typeCast: true,
    },
});

db.sequelize = sequelize;

db.User = User;
db.Card = Card;
db.Category = Category;
db.UserCtg = UserCtg;
db.Letter = Letter;
db.LetterCtg = LetterCtg
db.LetterReply = LetterReply;
db.Community = Community;
db.CommunityComment = CommunityComment;

User.init(sequelize);
Card.init(sequelize);
Category.init(sequelize);
UserCtg.init(sequelize);
Letter.init(sequelize);
LetterCtg.init(sequelize);
LetterReply.init(sequelize);
Community.init(sequelize);Community
CommunityComment.init(sequelize);

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

db.Letter.belongsToMany(db.Category, {
    through: 'LetterCtg',
    foreignKey: "letter_id",
    sourceKey: "id",
});

db.Category.belongsToMany(db.Letter, {
    through: 'LetterCtg',
    foreignKey: "ctg_id",
    sourceKey: "id",
});

module.exports = db;