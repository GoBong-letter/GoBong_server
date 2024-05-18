const { Sequelize, DataTypes } = require('sequelize');

class Community extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model : 'users',
                    key : 'id'
                }
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            createdAt: true,
            updatedAt: true,
            underscored: false,
            modelName: 'Community',
            tableName: 'community',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}

module.exports = Community;