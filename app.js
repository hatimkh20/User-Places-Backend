const express = require('express');
const bodyParser = require('body-parser');

const placesRoute = require('./routes/places-routes');

const app = express();

app.use('/api/places' ,placesRoute);

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occured."})
})

app.listen(5000);
