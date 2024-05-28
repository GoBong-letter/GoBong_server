const router = require('express').Router();
const usersMiddleware = require('../controllers/user');

router.post('/signup', usersMiddleware.signupPostMid); // 회원가입
router.post('/login', usersMiddleware.loginPostMid); // 로그인
router.get('/:user_id', usersMiddleware.userInfoGetMind); // 유저 정보 조회
router.get('/card/:user_id', usersMiddleware.cardsGetMid); // 유저의 카드 정보 조회
router.patch('/image', usersMiddleware.imagePatchMid); // 이미지 수정
router.patch('/nickname', usersMiddleware.nicknamePatchMid) // 닉네임 수정
router.patch('/category', usersMiddleware.categoryPatchMid); // 카테고리 수정

module.exports = router;