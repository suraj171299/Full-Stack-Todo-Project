const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({
        userId: user.id,
        email: user.email
    },process.env.JWT_SECRET, {expiresIn: '1h'})
}

module.exports = {
    generateToken
}