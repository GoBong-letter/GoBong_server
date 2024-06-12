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

// category와 sub_category 관계 설정
Category.hasMany(SubCategory, { foreignKey: 'category_id' });
SubCategory.belongsTo(Category, { foreignKey: 'category_id' });

// user와 category 다대다(user_ctg) 관계 설정
User.belongsToMany(Category, { through: UserCtg, foreignKey: 'user_id' });
Category.belongsToMany(User, { through: UserCtg, foreignKey: 'category_id' });

// user_ctg와 user, category, sub_category 관계 설정
UserCtg.belongsTo(User, { foreignKey: 'user_id' });
UserCtg.belongsTo(Category, { foreignKey: 'category_id' });
UserCtg.belongsTo(SubCategory, { foreignKey: 'subcategory_id' });

// letter와 category 다대다(letter_ctg) 관계 설정
Letter.belongsToMany(Category, { through: LetterCtg, foreignKey: 'letter_id' });
Category.belongsToMany(Letter, { through: LetterCtg, foreignKey: 'category_id' });

// letter_ctg와 letter, category, sub_category 관계 설정
LetterCtg.belongsTo(Letter, { foreignKey: 'letter_id' });
LetterCtg.belongsTo(Category, { foreignKey: 'category_id' });
LetterCtg.belongsTo(SubCategory, { foreignKey: 'subcategory_id' });

// letter와 letter_reply 관계 설정
db.Letter.hasOne(db.LetterReply, { foreignKey: 'letter_id' });
db.LetterReply.belongsTo(db.Letter, { foreignKey: 'letter_id' })

// community와 community_comment 관계 설정
db.Community.hasMany(db.CommunityComment, { foreignKey: 'post_id', sourceKey: 'id', as: 'comments' });
db.CommunityComment.belongsTo(db.Community, { foreignKey: 'post_id', targetKey: 'id' });

// community_comment와 user 관계 설정
db.CommunityComment.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id', as: 'user' });
db.User.hasMany(db.CommunityComment, { foreignKey: 'user_id', sourceKey: 'id' });

// community와 user 관계 설정
db.Community.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id'});
db.User.hasMany(db.Community, { foreignKey: 'user_id', sourceKey: 'id' });

module.exports = db;