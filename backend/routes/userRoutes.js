
const router = require('express').Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middleware/auth')

router.post('/register',userController.register)
router.post('/login',userController.login)

module.exports = router;