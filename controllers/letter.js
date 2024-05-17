const { Letter, LetterCtg, LetterReply } = require('../models');
const { Op, where } = require('sequelize');

const getCategoryId = require('../helper/getCategoryId');
const getRandomIndex = require('../helper/getRandomIndex');

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

        const reply = await LetterReply.findOne({
            where:{
                letter_id: letter_id
            }
        })
 
        let response = {...letter.dataValues}
        
        // response 객체에 답장 추가
        if(reply){
            response.reply = reply.dataValues.content
        }else{
            response.reply = null
        }

        res.json(response)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 편지 조회 실패'})
    }
}

// 랜덤으로 5개의 편지 받기
exports.randomLetterGetMid = async (req, res) => {
    try{
        let user_id = req.params.user_id;

        // 내가 작성한 편지를 제외하여 조회하기
        const letters = await Letter.findAll({
            where:{
                user_id: { [Op.ne]: user_id }
            }
        })

        // 랜덤으로 다섯 개의 편지 반환
        let returnLetters = [];
        const randomArr = getRandomIndex(letters.length);
        randomArr.forEach(index => {
            returnLetters.push(letters[index]);
        })

        res.json(returnLetters);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 랜덤 편지 조회 실패'})
    }
}

// 편지 받기 (랜덤에서 뽑기)
exports.receiveLetterPostMid = async (req, res) => {
    try{
        const result = await LetterReply.create({
            ...req.body
        });

        return res.status(200).json({ message: '편지 받기 성공' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 편지 받기 실패'})
    }
}

// 받은 편지 조회하기
exports.inboxGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id;

        const letterReplies = await LetterReply.findAll({
            attributes: ['letter_id'],
            where: { 
                user_id
            },
        });

        const letterIds = letterReplies.map(reply => reply.letter_id);

        const letters = await Letter.findAll({
            where: {
              id: letterIds,
            },
          });

        res.json(letters);
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: "서버 오류로 편지 조회 실패" })
    }
}

// 편지 답장하기
exports.writeReplyPostMid = async (req, res) => {
    try{
        const { letter_id, content } = req.body;
        const letter = await LetterReply.update({
            content
        }, {
            where: {letter_id: letter_id}
        })

        return res.status(200).json({ message: '답장 작성 성고' });
    }catch(err){    
        console.error(err)
        res.status(500).json({ error: "서버 오류로 편지 답장 실패" })
    }
}

// 답장한 편지 조회하기
