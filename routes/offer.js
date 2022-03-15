const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

const offerController = require('../controllers/offer');

//craete offer 
router.post(
    '/',
    verifyTokenAndAuthorization,
    offerController.createOffer
);

//update offer
router.put(
    '/:id', 
    verifyTokenAndAuthorization, 
    offerController.updateOffer
);

//delete offer
router.delete(
    '/:id',
    verifyTokenAndAuthorization,
    offerController.deleteOffer
);

//get offer
router.get(
    '/:id',
    verifyTokenAndAuthorization,
    offerController.getOffer
);

//get offers
router.get(
    '/', 
    verifyTokenAndAdmin,
    offerController.getAllOffers
);

module.exports = router;