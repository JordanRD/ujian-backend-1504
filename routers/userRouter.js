const router = require('express').Router();
const { registerUser,loginUser,deactiveUser,activateUser,closeUser } = require('../controllers').userController
const { verifyToken } = require('../helpers/tokenHelpers')
const { registerValidator } = require('../helpers/validators')


router.post('/register', registerValidator, registerUser)
router.post('/login', loginUser)
router.patch('/deactivate',verifyToken,deactiveUser)
router.patch('/activate',verifyToken, activateUser)
router.patch('/close',verifyToken, closeUser)

module.exports =router