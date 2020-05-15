module.exports = (sequelize, DataTypes) => {
  const FollowUser = sequelize.define(
    "FollowUser",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      follower_id: DataTypes.STRING,
      following_id: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      active: DataTypes.BOOLEAN,
    },
    {
      tableName: "follows_users",
    }
  );

  return FollowUser;
};
