const router = require('express').Router();
const usersMiddleware = require('../controllers/user');

router.post('/signup', usersMiddleware.signupPostMid);
router.post('/login', usersMiddleware.loginPostMid);
router.patch('/image', usersMiddleware.imagePatchMid)
router.patch('/nickname', usersMiddleware.nicknamePatchMid)

module.exports = router;