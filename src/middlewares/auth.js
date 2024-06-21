const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function ensureAuth(givenRoles) {
    return function ensureUser(req, res, next){
        try{
            const rolesArray = Array.isArray(givenRoles) ? givenRoles : [givenRoles];

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
            console.log(decodedToken.role)
            req.validRole = () => {
                if (!rolesArray.includes(decodedToken.role)) {
                    return res.status(403).send(`Must have ${givenRoles} role to access this.`);
                };
            };
            next();
        }catch(err){
            console.log(err);
            return res.status(403).send('Invalid authorization.');
        };
    };
};



module.exports = ensureAuth;