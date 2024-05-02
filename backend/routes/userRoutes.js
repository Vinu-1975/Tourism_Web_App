
const router = require('express').Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middleware/auth')

router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/forgotpassword',userController.forgotPassword)
router.post('/resetpassword/:id/:token',userController.resetPassword)
router.post('/flasktrial',userController.flasktrial)
router.post('/cuisineRecc',userController.cuisineRecc)

module.exports = router;