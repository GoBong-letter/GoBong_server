const { Sequelize, DataTypes } = require('sequelize');

class SubCategory extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'categories',
                    key : 'id'
                }
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
            modelName: 'SubCategory',
            tableName: 'sub_categories',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {}
}

module.exports = SubCategory;