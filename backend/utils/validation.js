// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors.array().forEach((error) => {
      errors[error.path] = error.msg;
    });

    // Omit the "title" field from the response
    return res.status(400).json({
      message: 'Bad Request',
      errors: errors,
    });
  }

  next();
};

module.exports = {
  handleValidationErrors,
};

// const handleValidationErrors = (req, res, next) => {
//   const validationErrors = validationResult(req);

//   if (!validationErrors.isEmpty()) {
//     const errors = {};

//     validationErrors.array().forEach((error) => {
//       // Exclude "undefined" and "null" parameters
//       if (error.param !== 'undefined' && error.param !== 'null') {
//         errors[error.param] = error.msg;
//       }
//     });

//     return res.status(400).json({
//       message: 'Bad Request',
//       errors: errors,
//     });
//   }

//   next();
// };

// module.exports = {
//   handleValidationErrors,
// };
