const { Sequelize, DataTypes } = require('sequelize');

class Category extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            b_ctg: {
                type: DataTypes.ENUM,
                values: ['외면', '내면', '관심사', '취미', '좋아하는', '싫어하는']
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Category',
            tableName: 'category',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Category.belongsToMany(db.User, {
            through: 'UserCtg',
            foreignKey: "ctg_id",
            sourceKey: "id",
        });
    }
}

module.exports = Category;