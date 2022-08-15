const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
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
  if (!user) {
    return next(
      new HttpError("No user found having provided email and password.", 401)
    );
  }

  let isValidPassword = false;

  try {
    isValidPassword = await brycpt.compare(password, user.password);
  }
  catch (err) {
    return next(
      new HttpError("Login failed. Please try agin.", 500)
    );
  }

  if(!isValidPassword) {
    return next(
      new HttpError("No user found having provided email and password.", 401)
    );
  }

  res.status(200).json({
    message: "Login successful.",
    user: user.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
