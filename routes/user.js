const router = require('express').Router();
const usersMiddleware = require('../controllers/user');

router.post('/signup', usersMiddleware.signupPostMid);
router.post('/login', usersMiddleware.loginPostMid);
router.get('/:user_id', usersMiddleware.userInfoGetMind);
router.patch('/image', usersMiddleware.imagePatchMid)
router.patch('/nickname', usersMiddleware.nicknamePatchMid)
router.patch('/category', usersMiddleware.categoryPatchMid);

module.exports = router;