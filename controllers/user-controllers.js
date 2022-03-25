const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// let DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "User One",
//     email: "user1@test.com",
//     password: "test",
//   },
//   {
//     id: "u2",
//     name: "User Two",
//     email: "user2@test.com",
//     password: "test2",
//   },
// ];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Please validate your data", 422));
  }
  const { name, email, password, places } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed. Please try agin."));
  }

  if (existingUser) {
    return next(new HttpError("User already exist, login instead", 422));
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed. Please try agin.", 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Login failed. Please try agin.", 500));
  }
  if (!user || user.password !== password) {
    return next(
      new HttpError("No user found having provided email and password.", 401)
    );
  }

  res.status(200).json({ message: "Login successful." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
