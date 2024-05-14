const { Sequelize, DataTypes } = require('sequelize');

class UserCtg extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'users',
                    key : 'id'
                }
            },
            ctg_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'category',
                    key : 'id'
                }
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'UserCtg',
            tableName: 'user_ctg',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}

module.exports = UserCtg;