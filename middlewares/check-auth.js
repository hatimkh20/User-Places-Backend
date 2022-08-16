const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const checkAuth = (req, res, next) => {

    if(req.method === 'OPTIONS'){
        next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1]; //Authorization: Bearer TOKEN
        if(!token) {
            throw new Error();
        }
        const decodedToken = jwt.verify(token, 'dfs9l_h5wrl3L3g24s6asf');
        req.userData = {userId: decodedToken.userId}
        next();
    }
    catch (err) {
        return next(
            new HttpError("Authentication failed.", 401)
          );
    }
}

module.exports = checkAuth;