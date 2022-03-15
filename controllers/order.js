const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const Product = require("../models/Product");


//create order
exports.createOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    const order = new Order({
        userId: req.userId,
        products: req.body.products,
        amount: req.body.amount,
        address: req.body.address,
        status: req.body.status,
    });

    order.save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//update order
exports.updateOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    Order.findById(req.params.id)
        .then(order => {
            if (!order) {
                const error = new Error('Order not found.');
                error.statusCode = 404;
                throw error;
            }

            order.userId = req.body.userId;
            order.products = req.body.products;
            order.amount = req.body.amount;
            order.address = req.body.address;
            order.status = req.body.status;
            return order.save()
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

//delete order
exports.deleteOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.statusCode = 422;
        throw error;
    }

    Order.findById(req.params.id)
        .then(order => {
            if(!order) {
                const error = new Error('Order not found.');
                error.statusCode = 404;
                throw error;
            }
            return Order.findByIdAndRemove(req.params.id);
        })
        .then(result => {
            res.status(200).json({message: 'Order deleted'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });
};

//get user orders
exports.getUserOrders = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    let orderDetails;
    let orderProductsIds = [];
    let productInfos = [];

    Order.find({ userId: req.params.userId })
        .then(orders => {
            orders.forEach(order => {
                order.products.forEach(product => {
                    orderProductsIds.push(product.productId);
                });
            })
            return orders;
        })
        .then(orders => {
            orderDetails = orders;
            return Product.find({ _id: { $in: orderProductsIds}});
        })
        .then(orderProducts => {
            orderProducts.forEach(productInfo => {
                orderDetails.forEach(order => {
                    order.products.forEach(product => {
                        if (productInfo._id.toString() === product.productId.toString()) {
                            let quantity = product.quantity;
                            productInfos.push({ productInfo, quantity});
                        }
                    })
                })
            })
            // console.log(productInfos);
            let orderDetails2 = JSON.parse(JSON.stringify(orderDetails));
            productInfos.forEach(productInfos => {
                orderDetails2.forEach(order => {
                    order.products.forEach((product, index) => {
                        if ( product.productId === productInfos.productInfo._id.toString()) {
                            order.products[index] = productInfos;
                        }
                    })
                })
            })
            res.status(200).json(orderDetails2);
        })            
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
