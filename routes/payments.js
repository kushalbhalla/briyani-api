const router = require('express').Router();
const stripeController = require('../controllers/payments');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

//craete payment
router.post(
    "/pay",
    verifyToken,
    stripeController.createPayment
);

module.exports = router;