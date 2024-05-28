const Sequelize = require('sequelize');
const User = require('./users');
const Card = require('./cards');
const Category = require('./categories');
const SubCategory = require('./sub_categories');
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
db.SubCategory = SubCategory;

User.init(sequelize);
Card.init(sequelize);
Category.init(sequelize);
SubCategory.init(sequelize);
UserCtg.init(sequelize);
Letter.init(sequelize);
LetterCtg.init(sequelize);
LetterReply.init(sequelize);
Community.init(sequelize);
CommunityComment.init(sequelize);

// db.User.belongsToMany(db.Category, {
//     through: 'UserCtg',
//     foreignKey: "user_id",
//     sourceKey: "id",
// });

// db.Category.belongsToMany(db.User, {
//     through: 'UserCtg',
//     foreignKey: "category_id",
//     sourceKey: "id",
// });

// db.SubCategory.belongsToMany(db.)

// db.Letter.belongsToMany(db.Category, {
//     through: 'LetterCtg',
//     foreignKey: "letter_id",
//     sourceKey: "id",
// });

// db.Category.belongsToMany(db.Letter, {
//     through: 'LetterCtg',
//     foreignKey: "ctg_id",
//     sourceKey: "id",
// });
// users와 user_ctg 관계 설정
// db.UserCtg.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id'});
// db.User.hasMany(db.UserCtg, { foreignKey: 'user_id', sourceKey: 'id' });

// // categories와 user_ctg 관계 설정
// db.UserCtg.belongsTo(db.Category, { foreignKey: 'category_id', targetKey: 'id'});
// db.Category.hasMany(db.UserCtg, { foreignKey: 'category_id', sourceKey: 'id' });

// // sub_categories와 user_ctg 관계 설정
// db.UserCtg.belongsTo(db.SubCategory, { foreignKey: 'subcategory_id', targetKey: 'id'});
// db.SubCategory.hasMany(db.UserCtg, { foreignKey: 'subcategory_id', sourceKey: 'id' });

// // community와 community_comment 관계 설정
// db.Community.hasMany(db.CommunityComment, { foreignKey: 'post_id', sourceKey: 'id', as: 'comments' });
// db.CommunityComment.belongsTo(db.Community, { foreignKey: 'post_id', targetKey: 'id' });

// // 
// db.CommunityComment.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id', as: 'user' });
// db.User.hasMany(db.CommunityComment, { foreignKey: 'user_id', sourceKey: 'id' });

module.exports = db;