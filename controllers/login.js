const User = require('../models').User;
const userSerializer = require('../serializers/user');
const jwt = require('jsonwebtoken');

exports.create = async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ where: {email: req.body.email} });
  } catch(e) {
    user = false;
  }
  valid = user ? await user.validPassword(req.body.password) : false;

  if (valid) {
    const serializedUser = await userSerializer(user);
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);
    console.log('token ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ' + token);
    res.json({ jwt: token, user: serializedUser });
  }else{
    const err = new Error('email or password is incorrect')
    err.status = 404;
    next(err)
  }
};
