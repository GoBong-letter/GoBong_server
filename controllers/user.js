const { User } = require('../models');
const getCategoryId = require('../helper/getCategoryId');
const crypto = require('crypto');

// 회원가입
exports.signupPostMid = async (req, res) => {
    try {
        const { nickname, password, email, image, category } = req.body;
        const category_json = JSON.parse(category.replace(/'/g, '\"'));

        // 비밀번호 해싱에 사용할 salt 생성
        const salt = crypto.randomBytes(16).toString('hex');

        // 사용자 비밀번호와 salt를 합쳐 해싱
        const hashedPassword = await crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

        // 회원가입
        const user = await User.create({
            nickname,
            password: hashedPassword,
            salt,
            email,
            image
        })

        // 카테고리 저장
        const user_id = user.dataValues.id;
        Object.keys(category_json).forEach(b_ctg => {
            category_json[b_ctg].forEach(name => {
                getCategoryId(b_ctg, name, user_id);
            })
        })

        return res.status(200).json({ message: '사용자 정보가 성공적으로 저장되었습니다.' });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: '사용자 정보가 성공적으로 저장되지 않았습니다.' });
    }
};