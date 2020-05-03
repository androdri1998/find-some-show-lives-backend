module.exports = (sequelize, DataTypes) => {
  const SavedLive = sequelize.define(
    "SavedLive",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      user_id: DataTypes.STRING,
      live_id: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      active: DataTypes.BOOLEAN,
    },
    {
      tableName: "saved_lives",
    }
  );

  return SavedLive;
};
