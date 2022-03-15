const path = require('path');
const fs = require('fs');
const { validationResult } = require("express-validator");
const Product = require("../models/Product");

//create product
exports.createProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    console.log(req.file.path);
    const img = req.file.path;

    const title = req.body.title;
    const desc = req.body.desc;
    const type = req.body.type;
    const price = req.body.price;

    const product = new Product({
        title: title,
        desc : desc,
        type: type,
        img: img,
        price: price,
    });

    product.save()
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

//update product
exports.updateProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.');
                error.statusCode = 404;
                throw error;
            }

            const title = req.body.title;
            const desc = req.body.desc;
            const type = req.body.type;
            const rating = req.body.rating;
            const price = req.body.price;
            let img;

            if (!req.file) {
                if (req.body.img !== product.img) {
                    const error = new Error('No image provided.');
                    error.statusCode = 422;
                    throw error;
                } else {
                    img = req.body.img;
                }
            } else {
                img = req.file.path;
                if ( img !== product.img) {
                    clearImage(product.img);
                }
            }
            product.title = title;
            product.desc = desc;
            product.img = img;
            product.type = type;
            product.rating = rating;
            product.price = price;
            return product.save();
        })
        .then(product => {
            res.status(200).json(product);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//delete product
exports.deleteProduct = (req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.');
                error.statusCode = 404;
                throw error;
            }
            return Product.findByIdAndRemove(productId);
        })
        .then(product => {
            res.status(200).json("product deleted");
        })
            .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//get product
exports.getProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                const error = new Error('Product not found.')
                error.statusCode = 404;
                throw error;
            }
            return product;
        })
        .then(product => {
            res.status(200).json(product);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//most rated product
exports.getMostRatedProducts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }

    Product.find({
        'rating': {
            $gt: 4.2
        }
    })
    .then(products => {
        res.status(200).json(products);
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//search product
exports.searchProduct = (req,res, next) => {
    const searchTitle = req.params.title;

    Product.find({'title': {$regex: searchTitle}})
        .then(searchResult => {
            res.status(200).json(searchResult);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//count the products of single type
exports.countProduct = (req, res, next) => {
    let vegCount;
    let nonvegCount;
    let chaapCount;

    Product.find({'type': {$in: "veg"}})
        .countDocuments()
        .then(count => {
            vegCount = count;
            return Product.find({'type': {$in: "nonveg"}})
                        .countDocuments();
        })
        .then(count=> {
            nonvegCount = count;
            return Product.find({'type': {$in: "chaap"}})
                        .countDocuments();
        })
        .then(count => {
            chaapCount = count;
            res.status(200).json({veg: vegCount, nonveg: nonvegCount, chaap: chaapCount});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

//get products by type
exports.getTypeProducts = (req, res, next) => {
    const searchType = req.params.type;

    Product.find({'type': {$in: searchType}})
        .then(searchResult => {
            res.status(200).json(searchResult);
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
