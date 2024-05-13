const { Sequelize, DataTypes } = require('sequelize');

class Card extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Card',
            tableName: 'cards',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    // static associate(db) {
    //     //테이블과 테이블의 관계를 설정
    // }
}

module.exports = Card;