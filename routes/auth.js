const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message })
};

router.get('/allusers', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    errorResponse(res, 500, err.message)
  }
});

router.post('/signup', [
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Please provide a password that is greater than 5 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    const userAlreadyExists = await User.findOne({ email: req.body.email })
    if (userAlreadyExists) {
      return errorResponse(res, 400, 'This user already exists')
    }

    const newUser = await user.save()
    const accessToken = jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10s'
    });
    res.json({ accessToken: accessToken, user: newUser })
  } catch (err) {
    errorResponse(res, 400, err.message);
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return errorResponse(res, 400, 'Cannot find this email')
  }

  if (!req.body.password) {
    return errorResponse(res, 400, 'Password is required')
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password)
  if (!passwordMatch) {
    return errorResponse(res, 400, 'Invalid password')
  }

  const accessToken = jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10s'
  });

  const refreshToken = jwt.sign({ email: req.body.email }, process.env. REFRESH_TOKEN_SECRET, {
    expiresIn: '1m'
  })

  user.refreshTokens.push({ token: refreshToken }) 

  await user.save() 

  res.json({ accessToken, refreshToken })
})

router.post('/token', async (req, res) => {
  try {
    const refreshToken = req.headers.authorization
  
    if (!refreshToken) {
      return errorResponse(res, 401, 'Token not found')
    }

    const tokenAlreadyExists = await User.findOne({ 'refreshTokens.token': refreshToken })

    if (!tokenAlreadyExists) {
      return errorResponse(res, 400, 'Invalid refresh token')
    }
    
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const { email } = decodedToken;

    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10s'
    })
  
    res.json({ accessToken });
  } catch (error) {
    return errorResponse(res, 403, 'Invalid token')
  }
  
})

router.delete('/logout', async (req, res) => {
  try {
    const refreshToken = req.headers.authorization

    const user = await User.findOne({ 'refreshTokens.token': refreshToken })

    if (!user) {
      return errorResponse(res, 400, 'Invalid refresh token')
    }

    user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken)

    await user.save(); 

    return res.status(200).json({ message: 'Token deleted successfully' })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
})
module.exports = router
