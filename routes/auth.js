const express = require('express')
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/User');

const router = express.Router();

//register
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.'),
        body('email').custom(value => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage('Password must be strong'),
        body('username')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.register
);

//login
router.post('/login', authController.login);

//forgot password
router.post('/reset-assword-token', authController.forgotPassword);

//set password
router.post('/reset-password', authController.setPassword);

module.exports = router;