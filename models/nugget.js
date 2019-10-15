'use strict';
module.exports = (sequelize, DataTypes) => {
  const Nugget = sequelize.define('Nugget', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    externalLink: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Nugget.associate = function(models) {
    Nugget.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' })
  };
  return Nugget;
};
