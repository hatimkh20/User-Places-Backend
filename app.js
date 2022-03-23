const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

const placesRoute = require("./routes/places-routes");

const usersRoute = require("./routes/user-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoute);
app.use("/api/users", usersRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find the requested page.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured." });
});

mongoose
  .connect(
    "mongodb+srv://hatimkh20:MAo17ZeQu41vpGF1@cluster0.xyatr.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
      console.log(err);
  });
