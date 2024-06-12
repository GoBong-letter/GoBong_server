const router = require('express').Router();
const communityMiddleware = require('../controllers/community');

router.post('/', communityMiddleware.writePostMid); // 게시물 작성
router.get('/', communityMiddleware.allPostGetMid); // 모든 게시물 조회
router.post('/comment', communityMiddleware.writeCommentPostMid); // 댓글 작성
router.get('/user/:user_id', communityMiddleware.myPostGetMid); // 나의 게시물 조회
router.get('/:post_id', communityMiddleware.postGetMid); // 특정 게시물 조회

module.exports = router;