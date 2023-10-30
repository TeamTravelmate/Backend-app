const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET;

//validates the token and sets the user in the request object.
//user can be accessed using req.user

module.exports = (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                message: 'Token not found'
            });
        }
        try {
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const decoded = jwt.verify(tokenWithoutBearer, secretKey);
            req.user = decoded;
            // if (!decoded.isAdmin) {
            //     return res.status(403).json({
            //       message: 'You are not authorized to access this route'
            //     });
            // }
            next();
        } catch (err) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
}