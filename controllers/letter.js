const { Letter, LetterCtg } = require('../models');
const getCategoryId = require('../helper/getCategoryId');

// 편지 작성
exports.writePostMid = async (req, res) => {
    try {
        const { user_id, envelope, title, content, category } = req.body;
        const createLetter = await Letter.create({
            user_id,
            envelope,
            title,
            content
        });

        const category_json = JSON.parse(category.replace(/'/g, '\"'));

        // 카테고리 저장
        const letter_id = createLetter.dataValues.id;
        console.log(letter_id + "LETTER_ID!!!!!");
        Object.keys(category_json).forEach(b_ctg => {
            category_json[b_ctg].forEach(name => {
                getCategoryId(b_ctg, name, letter_id, 'letter_id', LetterCtg);
            })
        })

        return res.status(201).json({ message: '편지 작성 성공' });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 오류로 편지 작성 실패' });
    }
};

// 내가 작성한 편지 조회
exports.myLettersGetMid = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const userLetters = await Letter.findAll({
            where: {
                user_id
            }
        });
      
        res.json(userLetters);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 오류로 나의 편지 조회 실패' });
    }
};

// 특정 편지 조회
exports.letterGetMid = async (req, res) => {
    try{
        let letter_id = req.params.letter_id;
        const letter = await Letter.findOne({
            where: {
                id: letter_id
            }
        })

        res.json(letter)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 편지 조회 실패'})
    }
}