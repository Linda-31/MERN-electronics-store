const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    console.log("Signing with Secret:", process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
