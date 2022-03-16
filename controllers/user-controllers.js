const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "User One",
    email: "user1@test.com",
    password: "test",
  },
  {
    id: "u2",
    name: "User Two",
    email: "user2@test.com",
    password: "test2",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => user.email === email);

  if (hasUser) {
    return next(new HttpError("User already exist", 422));
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return next(
      new HttpError("No user found having provided email and password", 404)
    );
  }

  res.status(200).json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
