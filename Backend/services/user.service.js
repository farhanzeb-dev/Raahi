const userModel = require("../models/user.model");
module.exports.registerUser = async ({ fullname, email, password }) => {
  if (!fullname || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = await userModel.create({ fullname, email, password });
  return user;
};
