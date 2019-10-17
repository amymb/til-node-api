const bcrypt = require('bcryptjs');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { 
      type: DataTypes.STRING, 
      unique: { 
        args: true, 
        msg: "Email taken"      
      }
    },
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, 
  {
    hooks: {
      beforeSave: async (user) => {
        console.log("Before Save executed! " + user.email)
        const salt = await bcrypt.genSaltSync();
        user.password = await bcrypt.hashSync(user.password, salt);
      },
      beforeValidate: async(user) => {
        console.log("Validating! " + user.email)

        if(user.email) user.email = user.email.toLowerCase().trim();
        console.log("Validation should be successful! " + user.email)
      },
      beforeCreate: async(user) => {
        console.log('creating! ' + user.email);
      },
      beforeUpdate: async(user) => {
        console.log('updating! ' + user.email);
      }
    }
  });
  User.associate = function(models) {
    User.hasMany(models.Nugget, { as: 'nuggets' })
  };

  User.prototype.validPassword =  async function(password) {
       console.log('here is the password!!!! ' + password)
       console.log('here is this!!! ' + this);
       console.log(bcrypt.compareSync(password, this.password))
      return await bcrypt.compareSync(password, this.password);
  }
  return User;
};
