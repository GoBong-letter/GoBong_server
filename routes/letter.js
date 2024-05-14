const router = require('express').Router();
const lettersMiddleware = require('../controllers/letter');

router.post('/', lettersMiddleware.writePostMid);
router.get('/user/:user_id', lettersMiddleware.myLettersGetMid);
router.get('/:letter_id', lettersMiddleware.letterGetMid);

module.exports = router;