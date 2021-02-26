const { verifyJWT } = require("./tools");
const UserModel = require("../users/schema");

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await verifyJWT(token);
    const user = await UserModel.findOne({ _id: decoded._id });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {authorize}