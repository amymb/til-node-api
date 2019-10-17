const User = require('../models').User;

module.exports = async () => {
  const deleted = await User.destroy({
    where: {}
   });
   console.log("this many users were deleted " + deleted);
  };
