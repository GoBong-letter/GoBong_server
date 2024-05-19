const router = require('express').Router();
const communityMiddleware = require('../controllers/community');

router.post('/', communityMiddleware.writePostMid);
router.get('/', communityMiddleware.allPostGetMid);
router.post('/comment', communityMiddleware.writeCommentPostMid);
router.get('/user/:user_id', communityMiddleware.myPostGetMid);
router.get('/:post_id', communityMiddleware.postGetMid);

module.exports = router;