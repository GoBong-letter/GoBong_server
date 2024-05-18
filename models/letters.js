const { Sequelize, DataTypes } = require('sequelize');			

class Letter extends Sequelize.Model {
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
                references:{
                    model : 'users',
                    key : 'id'
                }
            },
            envelope: {
                type: DataTypes.ENUM,
                values: ['red', 'yellow', 'green', 'blue', 'purple'],
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
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            underscored: false,
            modelName: 'Letter',
            tableName: 'letters',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        // db.Letter.hasMany(db.User, {foreignKey: 'user_id', targetKey: 'id'})
    }
}

module.exports = Letter;