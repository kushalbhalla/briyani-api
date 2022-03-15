const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

const cartController = require('../controllers/cart');

//craete cart 
router.post(
    '/',
    verifyToken,
    cartController.createCart
);

//update cart
router.put(
    '/:id', 
    verifyToken, 
    cartController.updateCart
);

//delete cart
router.delete(
    '/:id',
    verifyTokenAndAuthorization,
    cartController.deleteCart
);

//get user cart
router.get(
    '/find/:userId',
    verifyToken,
    cartController.getCart
);

module.exports = router;