const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const fileUpload = require("../middlewares/file-upload")

const userControllers = require("../controllers/user-controllers");

router.get("/", userControllers.getUsers);

router.post("/login", userControllers.login);

router.post(
  "/signup",
  fileUpload.single('image'),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userControllers.signup
);

module.exports = router;
