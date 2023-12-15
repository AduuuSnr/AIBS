const express = require("express");
const {
  createUser,
  login,
  forgotPassword,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/changePassword").post(changePassword);

module.exports = router;
