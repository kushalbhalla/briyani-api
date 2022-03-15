const { validationResult } = require("express-validator");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


//create cart
exports.createCart = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    Cart.findOne({
            userId: req.userId
        })
        .then(cart => {
            if (!cart) {
                const newCart = new Cart({
                    userId: req.userId,
                });
                return newCart.save();
            }
            return cart;
        })
        .then(cart => {
            res.status(201).json(cart);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

//update cart
exports.updateCart = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    Cart.findById(req.params.id)
        .then(cart => {
            if (!cart) {
                const error = new Error('Cart not found.');
                error.statusCode = 404;
                throw error;
            }

            const products = req.body.products;

            cart.products = products
            return cart.save()

        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//delete cart
exports.deleteCart = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.statusCode = 422;
        throw error;
    }

    Cart.findById(req.params.id)
        .then(cart => {
            if(!cart) {
                const error = new Error('Cart not found.');
                error.statusCode = 404;
                throw error;
            }
            return Cart.findByIdAndRemove(req.params.id);
        })
        .then(result => {
            res.status(200).json({message: 'Cart deleted'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });
};

//get user cart
exports.getCart = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    let productIds = [];
    let cartDetails;
    let productsInfos = [];

    Cart.findOne({ userId: req.params.userId })
        .then(cart => {
            if (!cart) {
                const error = new Error('Cart not found.')
                error.statusCode = 404;
                throw error;
            }
            cart.products.forEach(product => {
                productIds.push(product.productId);
            });
            return cart;
        })
        .then(cart => {
            cartDetails = cart;
            return Product.find({ _id: { $in: productIds }});
        })
        .then(products => {
            products.forEach(productInfo => {
                cartDetails.products.forEach(product => {
                    if (productInfo._id.toString() === product.productId.toString()) {
                        let quantity = product.quantity;
                        productsInfos.push({ productInfo, quantity});
                    }
                })
            })
            let details = JSON.parse(JSON.stringify(cartDetails));
            details.products = productsInfos;
            res.status(200).json(details);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
