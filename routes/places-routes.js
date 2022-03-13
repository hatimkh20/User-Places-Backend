const express = require('express');

const DUMMY_PLACES= [
    {
        id: 'p1',
        title: 'Minar-e-Pakistan',
        description: 'Minar-e-Pakistan is a national monument located in Lahore, Pakistan. The tower was built between 1960 and 1968 on the site where the All-India Muslim League passed the Lahore Resolution on 23 March 1940',
        imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/19/dd/fb/84/menar-e-pakistan.jpg',
        address: 'Minar-e-Pakistan, Circular Rd, Walled City of Lahore, Lahore, Punjab 54000, Pakistan',
        location: {
            lat: 31.5925194,
            lng: 74.3072963
        },
        creatorId: 'u1'
    },
    {
        id: 'p2',
        title: 'Quaid-e-Azam Mazar',
        description: 'Quaid-e-Azam Mazar is a national monument located in Lahore, Pakistan. The tower was built between 1960 and 1968 on the site where the All-India Muslim League passed the Lahore Resolution on 23 March 1940',
        imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/19/dd/fb/84/menar-e-pakistan.jpg',
        address: 'Quaid-e-Azam Mazar, Karachi, Pakistan',
        location: {
            lat: 31.5925194,
            lng: 74.3072963
        },
        creatorId: 'u2'
    }
]

const router = express.Router();

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => placeId === p.id)
    if (!place) {
        const error = new Error(`No place found having place id = ${placeId}`);
        error.code = 404;
        return next(error);
    }
    res.json({place});
    console.log(place);
})

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_PLACES.find(p => userId === p.creatorId)
    if (!user) {
        const error = new Error(`No place found having user id = ${userId}`);
        error.code = 404;
        return next(error);
    }
    res.json({user});
    console.log(user);
})

module.exports = router;