const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).exec();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }
  if (!place) {
    return next(
      new HttpError(`No place found having place id = ${placeId}`, 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
  //console.log(place);
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let place;
  try {
    place = await Place.find({ creator: userId }).exec();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }
  if (!place || place.length === 0) {
    return next(
      new HttpError(`No place found having user id = ${userId}`, 404)
    );
  }
  res.json({ place });
  //console.log(user);
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Please validate your data", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  //console.log(req.body);
  const createdPlace = new Place({
    title,
    description,
    image: req.file.path,
    address,
    location: coordinates,
    creator: creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  console.log(user)

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session, validateModifiedOnly:true });
    user.places.push(createdPlace);
    await user.save({ session, validateModifiedOnly: true } );
    session.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Please validate your data", 422);
  }

  placeId = req.params.pid;
  const { title, description } = req.body;

  let updatedPlace;

  try {
    updatedPlace = await Place.findByIdAndUpdate(placeId, {
      title: title,
      description: description,
    }).exec();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Updating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
    console.log(place);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Deleting place failed, please try again.",
      500
    );
    return next(error);
  }
  if (!place) {
    return next(new HttpError("No place found to be deleted.", 422));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session, validateModifiedOnly: true });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Deleting place failed, please try again..",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted" });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
