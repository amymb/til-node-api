const User = require('../../models/user');

const randomDigits = () => {
  const pad = '0000';
  const num = Math.floor(Math.random() * 9999);
  return (pad + num).slice(-4);
};


exports.createUser = async overrides => {
  const randomNumber = randomDigits();

  const defaults = {
    firstName: `Elowyn${randomNumber}`,
    lastName: `Platzer Bartel${randomNumber}`,
    email: `elowyn${randomNumber}@example.com`,
    admin: true,
    password: 'password',
  };

  return User.create({ ...defaults, ...overrides });
};
