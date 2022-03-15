const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');

const User = require('../models/User');

//register a user
exports.register = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;

    bcrypt
        .hash(password, 12)
        .then(hashPw => {
            const user = new User({
                email: email,
                password: hashPw,
                username: username,
                address: address,
                phoneNumber: phoneNumber
            });
            return user.save();
        })
        .then(result => {
            const { password, ...other} = result._doc;
            res.status(201).json({loadedUser: other});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//login a user
exports.login = (req, res, next) => {
    const email = req.body.email;
    const userPassword = req.body.password;

    let loadedUser;

    User.findOne({email: email})
        .then(user => {
            if(!user) {
                const error = new Error('A user with this email could not be found');
                error.statusCode = 401;
                throw error;
            }
            const {password, ...other} = user._doc
            loadedUser = other;
            return bcrypt.compare(userPassword, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    userId: loadedUser._id.toString(),
                    isAdmin: loadedUser.isAdmin,
                },
                'somesupersecretsecret',
                { expiresIn: '1d'}
            );
            res.status(200).json({loadedUser, token});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

//forgot password
exports.forgotPassword = (req, res, next) => {    
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            err.statusCode = 500;
            throw err;
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    const error = new Error('A user with this email could not be found');
                    error.statusCode = 401;
                    throw error;
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.status(201).json({userId: result._id, resetToken: token});
            })
            .catch(err => {
                console.log(err);
            });
    });
};

//set new password
exports.setPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({ $or: [
                {resetToken: passwordToken},
                {resetTokenExpiration: { $gt: Date.now() }},
                {_id: userId}
            ]
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.status(200).json({message: "Password changed successfully"})
        })
        .catch(err => {
            console.log(err);
        });
};