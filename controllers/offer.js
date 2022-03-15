const { validationResult } = require("express-validator");
const Offer = require("../models/Offer");
const Product = require("../models/Product");

//create offer
exports.createOffer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    const offer = new Offer({
        userId: req.userId,
        productId: req.body.productId,
        offPrice: req.body.offPrice
    });

    offer.save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

//update offer
exports.updateOffer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    Offer.findById(req.params.id)
        .then(offer => {
            if (!offer) {
                const error = new Error('Offer not found.');
                error.statusCode = 404;
                throw error;
            }

            const offPrice = req.body.offPrice;

            offer.offPrice = offPrice
            return offer.save()

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

//delete offer
exports.deleteOffer = (req, res, next) => {

    Offer.findById(req.params.id)
        .then(offer => {
            if(!offer) {
                const error = new Error('Offer not found.');
                error.statusCode = 404;
                throw error;
            }
            return Offer.findByIdAndRemove(req.params.id);
        })
        .then(result => {
            res.status(200).json({message: 'Offer deleted'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });
};

//get offer
exports.getOffer = (req, res, next) => {

    let offerInfo;

    Offer.findById(req.params.id)
        .then(offer => {
            if(!offer) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            offerInfo = JSON.parse(JSON.stringify(offer));
            return Product.findById(offerInfo.productId);
        })
        .then(offerData => {
            offerInfo.product = offerData
            res.status(200).json(offerInfo);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

//get offers
exports.getAllOffers = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    let productsIds = [];
    let offersDetails;

    Offer.find()
        .then(offers => {
            offers.forEach(offer => {
                productsIds.push(offer.productId);
            })
            return offers;
        })
        .then(offers => {
            offersDetails = JSON.parse(JSON.stringify(offers));
            // offersDetails = offers;
            return Product.find({ _id: { $in: productsIds }});
        })
        .then(products => {
            products.forEach(productsInfo => {
                offersDetails.forEach(offer => {
                    if (offer.productId.toString() === productsInfo._id.toString()) {
                        offer.product = productsInfo
                    }
                })
            })
            res.status(200).json(offersDetails);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err); 
        });
};