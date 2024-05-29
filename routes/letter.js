const router = require('express').Router();
const lettersMiddleware = require('../controllers/letter');

router.post('/', lettersMiddleware.writePostMid); // 편지 작성
router.get('/sent/:user_id', lettersMiddleware.myLettersGetMid); // 작성한 편지 조회
router.get('/:letter_id', lettersMiddleware.letterGetMid); // 특정 편지 조회
router.get('/random/:user_id', lettersMiddleware.randomLetterGetMid); // 랜덤으로 5개의 편지 조회
router.post('/inbox', lettersMiddleware.receiveLetterPostMid); // 편지 받기
router.get('/received/:user_id', lettersMiddleware.inboxGetMid); // 받은 편지 조회
router.post('/reply', lettersMiddleware.writeReplyPostMid); // 편지 답장하기
router.get('/replies/sent/:user_id', lettersMiddleware.sentLetterGetMid); // 답장한 편지 조회
router.get('/replies/received/:user_id', lettersMiddleware.receivedLetterGetMid); // 답장받은 편지 조회
router.get('/this-week/:user_id', lettersMiddleware.weekLettersGetMid); // 이번주에 작성한 편지 개수 조회
router.get('/average-per-week/:user_id', lettersMiddleware.weekAvgLettersGetMid); // 주 별 평균 편지 작성 개수 조회
router.get('/category/:letter_id', lettersMiddleware.categoryGetMid) // 편지 카테고리 조회 

module.exports = router;