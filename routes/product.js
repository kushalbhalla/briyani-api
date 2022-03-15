const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');
const bcrypt = require('bcryptjs');

const productController = require('../controllers/product');

//craete product 
router.post(
    '/',
    verifyTokenAndAdmin,
    productController.createProduct
);

//update product
router.put(
    '/:id', 
    verifyTokenAndAdmin, 
    productController.updateProduct
);

//delete product
router.delete(
    '/:id',
    verifyTokenAndAdmin,
    productController.deleteProduct
);

//get product
router.get(
    '/find/:id',
    verifyToken,
    productController.getProduct
);

//search product
router.get(
    '/search/:title',
    verifyToken,
    productController.searchProduct
);

//menu food count
router.get(
    '/menu',
    verifyToken,
    productController.countProduct
);

//get products by food type
router.get(
    '/menu/:type',
    verifyToken,
    productController.getTypeProducts
);

//menu food count
router.get(
    '/menu',
    verifyToken,
    productController.countProduct
);

//most rated products
router.get(
    '/popular',
    verifyToken,
    productController.getMostRatedProducts
);


module.exports = router;