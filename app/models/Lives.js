module.exports = (sequelize, DataTypes) => {
  const Live = sequelize.define(
    "Live",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      date: DataTypes.DATE,
      reminder_in: DataTypes.INTEGER,
      creator: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      active: DataTypes.BOOLEAN,
    },
    {
      tableName: "lives",
    }
  );

  return Live;
};
