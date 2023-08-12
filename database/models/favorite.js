import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Favorite extends Model {}

  Favorite.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      book_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'favorites',
      timestamps: true,
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    },
  );

  Favorite.associate = function (models) {
    Favorite.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'favorited_book',
    });

    Favorite.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return Favorite;
}
