// eslint-disable-next-line import/no-extraneous-dependencies
import { validationResult, body } from 'express-validator';
import AppError from '../utils/appError';

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach(error => {
      errorMessages[error.path] = [error.msg];
    });
    return next(new AppError(errorMessages, 400));
  }
  next();
};

// Common validation rules
const commonValidations = {
  name: body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .escape(),

  email: body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  password: body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),

  description: body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters')
    .escape(),

  price: body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  phone: body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-]{8,}$/)
    .withMessage('Please provide a valid phone number')
};

// Validation chains for different routes
const validate = {
  signup: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('passwordConfirm')
      .trim()
      .notEmpty()
      .withMessage('Password confirmation is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    handleValidationErrors
  ],

  login: [
    commonValidations.email,
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],

  updateProfile: [
    commonValidations.name.optional(),
    commonValidations.email.optional(),
    commonValidations.phone,
    handleValidationErrors
  ],

  createCategory: [
    commonValidations.name,
    commonValidations.description,
    body('parent')
      .optional()
      .isMongoId()
      .withMessage('Invalid parent category ID'),
    handleValidationErrors
  ],

  updateCategory: [
    commonValidations.name.optional(),
    commonValidations.description,
    body('parent')
      .optional()
      .isMongoId()
      .withMessage('Invalid parent category ID'),
    handleValidationErrors
  ]
};

export default validate;
