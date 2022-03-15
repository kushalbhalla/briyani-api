const path = require('path');
const fs = require('fs');
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require('bcryptjs');


//update user
exports.updateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    if (req.body.password) {
        bcrypt.hash(req.body.password, 12)
            .then(hashedPw => {
                req.body.password = hashedPw;
                return User.findById(req.userId)
                    .then(user => {
                        if (!user) {
                            const error = new Error('User not found.');
                            error.statusCode = 404;
                            throw error;
                        }
                        const username = req.body.username;
                        const email = req.body.email;
                        let profilePicture = req.body.profilePicture;
                        const address = req.body.address;
                        const phoneNumber = req.body.phoneNumber;
                        if (req.file) {
                            profilePicture = req.file.path;
                        }
                        if (!profilePicture) {
                            const error = new Error('No file picked.');
                            error.statusCode = 422;
                            throw error;
                        }
                        if (profilePicture !== user.profilePicture && user.profilePicture !== '') {
                            clearImage(user.profilePicture);
                        }
                        user.username = username;
                        user.email = email;
                        user.password = hashedPw
                        user.profilePicture = profilePicture;
                        user.address = address;
                        user.phoneNumber = phoneNumber;
                        user.save()
                        const {password, ...userDetails} = user._doc;
                        return userDetails
                    })
                    .then(result => {
                        res.status(200).json( result );  
                    })
                    .catch(err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    });
            });
    } else {
        User.findById(req.userId)
            .then(user => {
                if (!user) {
                    const error = new Error('User not found.');
                    error.statusCode = 404;
                    throw error;
                }
                const username = req.body.username;
                const email = req.body.email;
                let profilePicture = req.body.profilePicture;
                const address = req.body.address;
                const phoneNumber = req.body.phoneNumber;
                if (req.file) {
                    profilePicture = req.file.path;
                }
                if (!profilePicture) {
                    const error = new Error('No file picked.');
                    error.statusCode = 422;
                    throw error;
                }
                if (profilePicture !== user.profilePicture && user.profilePicture !== '') {
                    clearImage(user.profilePicture);
                }
                user.username = username;
                user.email = email;
                user.profilePicture = profilePicture;
                user.address = address;
                user.phoneNumber = phoneNumber;
                user.save()
                const {password, ...userDetails} = user._doc;
                return userDetails
            })
            .then(result => {
                res.status(200).json( result );  
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });

        }
};

//delete user
exports.deleteUser = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }
            return User.findByIdAndRemove(req.userId);
        })
        .then(result => {
            res.status(200).json({ message: 'User deleted!' });  
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//get user
exports.getUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found.')
                error.statusCode = 404;
                throw error;
            }
            const {password, ...other} = user._doc;
            return other
        })
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
