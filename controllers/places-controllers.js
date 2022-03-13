const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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
  console.log(place);
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_PLACES.find((p) => userId === p.creatorId);
  if (!user) {
    return next(
      new HttpError(`No place found having user id = ${userId}`, 404)
    );
  }
  res.json({ user });
  console.log(user);
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlaceByUserId = getPlaceByUserId;