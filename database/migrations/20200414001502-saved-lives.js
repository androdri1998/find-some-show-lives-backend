"use strict";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("saved_lives", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      live_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable("saved_lives");
  },
};
