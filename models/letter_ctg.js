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