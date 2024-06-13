const { Sequelize, DataTypes } = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            salt: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            image: {
                type: DataTypes.ENUM,
                values: ['chajo', 'rice', 'black', 'bean', 'multi_grain'],
                allowNull: false
            }, 
            receivedCard: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.belongsToMany(db.Category, {
            through: 'UserCtg',
            foreignKey: "user_id",
            sourceKey: "id",
        });
        db.User.hasMany(db.Letter, {foreignKey: 'user_id', sourceKey: 'id'})
    }
}

module.exports = User;