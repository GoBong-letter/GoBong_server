const { Sequelize, DataTypes } = require('sequelize');

class CommunityComment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'community',
                    key : 'id'
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'users',
                    key : 'id'
                }
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'CommunityComment',
            tableName: 'community_comments',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}

module.exports = CommunityComment;