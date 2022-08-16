const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const checkAuth = (req, res, next) => {

    if(req.method === 'OPTIONS'){
        return next();
    }
    let token;
    try{
        token = req.headers.authorization.split(' ')[1]; //Authorization: Bearer TOKEN
        if(!token) {
            throw new Error("Authentication failed...");
        }
        const decodedToken = jwt.verify(token, 'dfs9l_h5wrl3L3g24s6asf');
        req.userData = {userId: decodedToken.userId}
        next();
    }
    catch (err) {
        console.log("headers: ", req.headers.authorization)
        return next(
            new HttpError("Authentication failed..", 403)
          );
    }
}

module.exports = checkAuth;