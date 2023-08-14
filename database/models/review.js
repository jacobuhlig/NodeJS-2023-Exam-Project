import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Review extends Model {}

  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      review_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      review_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: 'Review',
      tableName: 'reviews',
      timestamps: true,
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    },
  );

  Review.associate = function (models) {
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Review.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'reviewed_book',
    });
  };

  return Review;
}
