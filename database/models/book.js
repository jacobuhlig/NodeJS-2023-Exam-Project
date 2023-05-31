import { DataTypes, Model } from 'sequelize';

export default function(sequelize) {
  class Book extends Model {}

  Book.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
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
    modelName: 'Book',
    tableName: 'books',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });

  Book.associate = function(models) {
    Book.hasMany(models.Review, {
      foreignKey: 'book_id',
      as: 'reviews',
    });

    Book.belongsToMany(models.User, {
      through: models.Favorite,
      as: 'favorited_by_users',
      foreignKey: 'book_id',
    });
  }

  return Book;
}
