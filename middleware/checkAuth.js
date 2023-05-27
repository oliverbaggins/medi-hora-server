const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token found' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user._id;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
