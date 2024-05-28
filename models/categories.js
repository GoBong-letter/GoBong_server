const { Sequelize, DataTypes } = require('sequelize');

class Category extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.ENUM,
                values: ['외모', '성격', '취미', '색', 'MBTI', '기타'],
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Category',
            tableName: 'categories',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {}
}

module.exports = Category;