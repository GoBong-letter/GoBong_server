const router = require('express').Router();
const lettersMiddleware = require('../controllers/letter');

router.post('/', lettersMiddleware.writePostMid);
router.get('/user/:user_id', lettersMiddleware.myLettersGetMid);
router.get('/:letter_id', lettersMiddleware.letterGetMid);
router.get('/random/:user_id', lettersMiddleware.randomLetterGetMid);
router.post('/inbox', lettersMiddleware.receiveLetterPostMid);
router.get('/inbox/:user_id', lettersMiddleware.inboxGetMid);
router.post('/reply', lettersMiddleware.writeReplyPostMid);

module.exports = router;