const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    console.log(err);
    return next(new HttpError("Getting users failed."));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Please validate your data", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed. Please try agin.", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exist, login instead", 422));
  }
  let hashedPassword;
  try {
     hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed. Please try agin.", 500));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed. Please try agin.", 500));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      "dfs9l_h5wrl3L3g24s6asf",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Signing up failed. Please try agin.", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Login failed. Please try agin...", 500));
  }
  if (!user) {
    return next(
      new HttpError("No user found having provided email and password.", 403)
    );
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(new HttpError("Login failed. Please try agin...", 500));
  }

  if (!isValidPassword) {
    return next(
      new HttpError("No user found having provided email and password.", 403)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      "dfs9l_h5wrl3L3g24s6asf",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Login failed. Please try agin.", 500));
  }

  res.status(200).json({
    userId: user.id,
    email: user.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
