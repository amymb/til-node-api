const jwt = require('jsonwebtoken');
const User = require('../models').User;
const userSerializer = require('../serializers/user');

module.exports = async token => {
  try {
    const { currentUserId } = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findOne({
      where: {
        id: currentUserId
      }
    });
    const serializedUser = await userSerializer(currentUser);
    return serializedUser;
  } catch (err) {
    console.log(err)
    return undefined;
  }
};
