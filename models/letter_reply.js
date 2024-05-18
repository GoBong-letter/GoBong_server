const { Sequelize, DataTypes } = require('sequelize');			

class LetterReply extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            letter_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                references:{
                    model : 'letters',
                    key : 'id'
                }
            },
            user_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'users',
                    key : 'id'
                }
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            createdAt: true,
            underscored: false,
            modelName: 'LetterReply',
            tableName: 'letter_reply',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}

module.exports = LetterReply;