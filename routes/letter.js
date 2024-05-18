const router = require('express').Router();
const lettersMiddleware = require('../controllers/letter');

router.post('/', lettersMiddleware.writePostMid);
router.get('/sent/:user_id', lettersMiddleware.myLettersGetMid);
router.get('/:letter_id', lettersMiddleware.letterGetMid);
router.get('/random/:user_id', lettersMiddleware.randomLetterGetMid);
router.post('/inbox', lettersMiddleware.receiveLetterPostMid);
router.get('/received/:user_id', lettersMiddleware.inboxGetMid);
router.post('/reply', lettersMiddleware.writeReplyPostMid);
router.get('/replies/sent/:user_id', lettersMiddleware.sentLetterGetMid);
router.get('/replies/received/:user_id', lettersMiddleware.receivedLetterGetMid);
router.get('/this-week/:user_id', lettersMiddleware.weekLettersGetMid);
router.get('/average-per-week/:user_id', lettersMiddleware.weekAvgLettersGetMid);
router.get('/category/:letter_id', lettersMiddleware.categoryGetMid)

module.exports = router;