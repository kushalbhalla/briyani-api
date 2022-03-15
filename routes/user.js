const router = require('express').Router();
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

const userController = require('../controllers/user');

//update user
router.put(
    '/:id', 
    verifyToken, 
    userController.updateUser
);

//delete user
router.delete(
    '/:id',
    verifyTokenAndAdmin,
    userController.deleteUser
);

//get user
router.get(
    '/find/:id',
    verifyTokenAndAuthorization,
    userController.getUser
);

module.exports = router;
