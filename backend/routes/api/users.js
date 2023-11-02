const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, sequelize } = require('../../db/models');

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
    // if (!email || !username || !firstName || !lastName) {
    //   return res.status(400).json({
    //     message: 'Bad Request',
    //     errors: {
    //       email: email ? undefined : 'Invalid email',
    //       username: username ? undefined : 'Username is required',
    //       firstName: firstName ? undefined : 'First Name is required',
    //       lastName: lastName ? undefined : 'Last Name is required',
    //     },
    //   });
    // }

    try {
      // Use a transaction to ensure data consistency
      await sequelize.transaction(async (t) => {
        const user = await User.create(
          { email, username, hashedPassword, firstName, lastName },
          { transaction: t }
        );

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
      });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        // Handle unique constraint violation
        const errors = {};

        if (err.errors.find((e) => e.message.includes('email'))) {
          errors.email = 'User with that email already exists';
        }

        if (err.errors.find((e) => e.message.includes('username'))) {
          errors.username = 'User with that username already exists';
        }

        return res.status(500).json({
          message: 'Duplicate user',
          errors,
        });
      }

      throw err; // Re-throw other errors
    }
  }
);
  module.exports = router;
