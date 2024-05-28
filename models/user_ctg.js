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
            category_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'categories',
                    key : 'id'
                }
            },
            subcategory_id:{
                type: DataTypes.INTEGER,
                allowNull: true,
                references:{
                    model : 'sub_categories',
                    key : 'id'
                }
            },
            value: {
                type: DataTypes.STRING,
                allowNull: true,
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