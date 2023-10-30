const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    // Validation for required fields
    if (!email || !username || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: {
          email: email ? undefined : 'Invalid email',
          username: username ? undefined : 'Username is required',
          firstName: firstName ? undefined : 'First Name is required',
          lastName: lastName ? undefined : 'Last Name is required',
        },
      });
    }

    try {
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser,
      });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        const errors = {};
        if (err.fields.includes('email')) {
          return res.status(500).json({
            message: 'User already exists with the specified email',
            errors: {
              email: 'User with that email already exists',
            },
          });
        }
        if (err.fields.includes('username')) {
          return res.status(500).json({
            message: 'User already exists with the specified username',
            errors: {
              username: 'User with that username already exists',
            },
          });
        }
      }

      throw err; // Re-throw other errors
    }
  }
);
  module.exports = router;
