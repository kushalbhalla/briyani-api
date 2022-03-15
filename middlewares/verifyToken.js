const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    req.isAdmin = decodedToken.isAdmin;
    next();
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.userId === req.params.id || req.isAdmin) {
            next()
        } else {
            const error = new Error("You are not allowed to do that!");
            error.statusCode = 403;
            throw error;
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.isAdmin) {
            next();
        } else {
            const error = new Error("You are not allowed to do that!");
            error.statusCode = 403;
            throw error;
        }
    })
}
module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}