// Model
import { DataTypes, Model } from 'sequelize';

export default function(sequelize) {
  class User extends Model {}

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    },
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reset_token_expiration: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });

  User.associate = function(models) {
    User.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews',
    });

    User.belongsToMany(models.Book, {
      through: models.Favorite,
      as: 'favorited_book',
      foreignKey: 'user_id',
    });
  }


  return User;
};
