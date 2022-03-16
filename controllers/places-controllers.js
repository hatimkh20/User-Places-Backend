const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

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

const getPlaceByPlaceId = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => placeId === p.id);
  if (!place) {
    return next(
      new HttpError(`No place found having place id = ${placeId}`, 404)
    );
  }
  res.json({ place });
  //console.log(place);
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.filter((p) => userId === p.creatorId);
  if (!place || place.length === 0) {
    return next(
      new HttpError(`No place found having user id = ${userId}`, 404)
    );
  }
  res.json({ place });
  //console.log(user);
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Please validate your data", 422);
  }
  const { id, title, description, imageUrl, address, location, creatorId } =
    req.body;
  //console.log(req.body);
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    imageUrl,
    address,
    location,
    creatorId,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json(createdPlace);
  console.log(DUMMY_PLACES);
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Please validate your data", 422);
  }
  
  placeId = req.params.pid;
  const { title, description } = req.body;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  //console.log(DUMMY_PLACES);
  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Deleted" });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
