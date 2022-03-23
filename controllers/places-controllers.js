const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Minar-e-Pakistan",
    description:
      "Minar-e-Pakistan is a national monument located in Lahore, Pakistan. The tower was built between 1960 and 1968 on the site where the All-India Muslim League passed the Lahore Resolution on 23 March 1940",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/19/dd/fb/84/menar-e-pakistan.jpg",
    address:
      "Minar-e-Pakistan, Circular Rd, Walled City of Lahore, Lahore, Punjab 54000, Pakistan",
    location: {
      lat: 31.5925194,
      lng: 74.3072963,
    },
    creatorId: "u1",
  },
  {
    id: "p2",
    title: "Quaid-e-Azam Mazar",
    description:
      "Quaid-e-Azam Mazar is a national monument located in Lahore, Pakistan. The tower was built between 1960 and 1968 on the site where the All-India Muslim League passed the Lahore Resolution on 23 March 1940",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/19/dd/fb/84/menar-e-pakistan.jpg",
    address: "Quaid-e-Azam Mazar, Karachi, Pakistan",
    location: {
      lat: 31.5925194,
      lng: 74.3072963,
    },
    creatorId: "u2",
  },
];

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
  const { id, title, description, imageUrl, address, creatorId } = req.body;

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
    image: imageUrl,
    address,
    location: coordinates,
    creator: creatorId,
  });

  try {
    await createdPlace.save();
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
    place = await Place.findById(placeId);
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
    await Place.findByIdAndDelete(placeId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Deleting place failed, please try again.",
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
