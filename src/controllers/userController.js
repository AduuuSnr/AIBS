const { isEmail } = require("validator");
const User = require("../model_mongo/UserModel");
const { httpResponse, generateUserId } = require("../utils/helpers");
const md5 = require("md5");
const sha256 = require("sha256");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function generateAccessToken(email) {
  return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: "90d" });
}

exports.createUser = async (req, res, next) => {
  const { name, surname, email, username } = req.body;
  let { password } = req.body;

  try {
    const check = await User.find({ email });

    if (check.length !== 0) {
      return httpResponse(
        res,
        200,
        "error",
        "This email address is already registered."
      );
    }
    if (!email || !isEmail(email)) {
      return httpResponse(
        res,
        200,
        "error",
        "Please log in with a valid email address"
      );
    } else if (!name && !surname) {
      return httpResponse(
        res,
        200,
        "error",
        "Please enter your Name and Surname"
      );
    } else if (!password) {
      return httpResponse(res, 200, "error", "Please enter a valid password");
    }
    let createUserId = generateUserId(name);
    while (User.find({ userId: createUserId }).length === 0) {
      createUserId = generateUserId(name);
    }

    password = md5(md5(password) + sha256(password));

    if (check.length === 0) {
      var token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });
      const user = await User.create({
        userId: createUserId,
        name: name,
        surname: surname,
        username: username,
        email: email,
        password: password,
        token: token,
        create_date: new Date(),
      });

      return httpResponse(
        res,
        200,
        "success",
        "Account created successfuly",
        user
      );
    }
  } catch (error) {
    return httpResponse(res, 200, "error", "Something went wrong", error);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const response = await User.find({ email });
    if (response.length === 1) {
      const hash = md5(md5(password) + sha256(password));
      const login = await User.findOne({ email });

      if (login.password === hash) {
        const token = generateAccessToken({ email });
        login.token = token;
        return httpResponse(
          res,
          200,
          "success",
          "Successfully logged in.",
          login
        );
      } else {
        return httpResponse(res, 200, "error", "Invalid credentials");
      }
    } else {
      return httpResponse(
        res,
        200,
        "error",
        "This email is not registered to any account"
      );
    }
  } catch (error) {
    return httpResponse(res, 200, "error", error);
  }
};
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const response = await User.find({ email });
    if (response.length > 0) {
      return httpResponse(res, 200, "success", "Email found", response[0]);
    } else {
      return httpResponse(res, 404, "error", "Error", "Email not found");
    }
  } catch (error) {
    return httpResponse(res, 500, "error", "Error", error);
  }
};
exports.changePassword = async (req, res, next) => {
  const { newPassword, email } = req.body;
  try {
    // Şifreyi hash'leme
    const hashedPassword = md5(md5(newPassword) + sha256(newPassword));

    // Kullanıcıyı bul ve şifresini güncelle
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true } // Güncellenmiş kullanıcıyı döndür
    );

    // Güncellenmiş kullanıcıyı kontrol et
    if (!updatedUser) {
      return res.status(404).send("Kullanıcı bulunamadı.");
    }

    res.send("Şifre başarıyla güncellendi.");
  } catch (error) {
    res.status(500).send("Sunucu hatası: " + error.message);
  }
};
