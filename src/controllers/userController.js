const UserModel = require("../model_mongo/UserModel");
const { httpResponse } = require("../utils/helpers");

function generateAccessToken(email) {
  console.log("email:", email);

  return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: "90d" });
}

exports.createUser = async (req, res, next) => {
  const { name, surname, email, role } = req.body;
  let { password } = req.body;
  const check = await UserModel.find({ email });

  try {
  } catch (error) {
    return httpResponse(res, 500, "error", "error", error);
  }
};
