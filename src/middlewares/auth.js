const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function ensureAuth(givenRoles) {
    return function ensureUser(req, res, next){
        try{
            const token = req.headers["authorization"];
            console.log(token);
            if(!token){
                return res.status(403).send('Invalid authorization.');
            };
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
                
            if(!decodedToken){
                return res.status(403).send('Invalid authorization.');
            };
            req.user = decodedToken;

            next();
        }catch(err){
            console.log(err);
            return res.status(403).send('Invalid authorization.')
            }
    }
};

module.exports = ensureAuth;