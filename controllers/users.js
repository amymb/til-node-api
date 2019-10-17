const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const currentUser = require('../lib/currentUser');
const userSerializer = require('../serializers/user');
const User = require('../models').User;

exports.index = async (req, res) => {
  const users = await User.findAll();
  const serializedUsers = users.map(user => userSerializer(user));
  res.json({ users: await Promise.all(serializedUsers) });
};

exports.me = async (req, res) => {
  const token = req.headers.jwt;
  const user = await currentUser(token);
  const serializedUser = await userSerializer(user);
  res.json({ user: serializedUser });
};

exports.create = async (req, res, next) => {
  try{
    const user = await User.create(req.body);
    const serializedUser = await userSerializer(user);
    const token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);
    res.json({ jwt: token, user: serializedUser });
  } catch(e) {
    console.log("here is the error!!!!!!!!!!!!!!!!!!!!!!!!! " + e.status)    
    console.log("here is the error message!!!!!!!!!!!!!!!!!!!!!!!!! " + e.message)

    next(e);
  }
};

exports.show = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    const serializedUser = await userSerializer(user);
    res.json({ user: serializedUser });
  } catch (e) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updatedUserObject= await User.update(
      { ...req.body },
      { 
        where: { id: req.params.id },
        returning: true
      },
    );
    const serializedUser = await userSerializer(updatedUserObject[1][0].dataValues);
    res.json({ user: serializedUser });
  }catch(e){
    next(e)
  }

};
