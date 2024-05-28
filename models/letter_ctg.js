const { Sequelize, DataTypes } = require('sequelize');

class LetterCtg extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            letter_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'letters',
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
            modelName: 'LetterCtg',
            tableName: 'letter_ctg',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}

module.exports = LetterCtg;