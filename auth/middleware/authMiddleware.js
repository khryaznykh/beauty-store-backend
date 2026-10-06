const jwt = require('jsonwebtoken');
const tokenServices = require('../services/tokenServices');
const secretKey = process.env.JWT_SECRET


const AuthMiddleware = (req, res, next) => {

    //Checks if the HTTP request method is OPTIONS.
    //OPTIONS requests are commonly sent by browsers during CORS preflight checks.
    if(req.method === 'OPTIONS') {
        return next()   //adding "return" ensures OPTIONS requests skip the rest
                        //of authentication logic entirely
    }

    const AuthHeader = req.headers.authorization;   //Reads the Authorization header from the request.
                                                    //is client sends Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
                                                    //then AuthHeader is Bearer eyJhbGciOiJIUzI1NiIs...
    if (!AuthHeader) {
        return res.status(401).json ({message: 'User is not authorized'})
    }

    try{
        const token = AuthHeader.split(' ') [1];
        if (!token) {
            return res.status(403).json({message:"User is not authorized"})
        }
                    //most important line - Checks that the token's signature is valid using secretKey.
                    //if yes, then payload(email, id, etc) is decoded
        const decodedData = jwt.verify(token, secretKey)
                    //If the token:  - has been modified,
                    //               - has expired,
                    //               - or was signed with the wrong secret,
                    //jwt.verify() throws an error.
        console.log(decodedData, "decodedData")
        req.user=decodedData
        next()
    } catch(e) {
        console.log(e)
        return res.status(403).json({message: "User is not authorized"})
    }
}

module.exports = { AuthMiddleware };