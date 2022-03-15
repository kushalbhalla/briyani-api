const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

const orderController = require('../controllers/order');

//craete order 
router.post(
    '/',
    verifyToken,
    orderController.createOrder
);

//update order
router.put(
    '/:id', 
    verifyToken, 
    orderController.updateOrder
);

//delete order
router.delete(
    '/:id',
    verifyTokenAndAdmin,
    orderController.deleteOrder
);

//get user orders
router.get(
    '/:userId',
    verifyToken,
    orderController.getUserOrders
);

module.exports = router;