const { Letter, LetterCtg, LetterReply, User, Category } = require('../models');
const { Op, where } = require('sequelize');
const { startOfWeek, endOfWeek, differenceInWeeks } = require('date-fns');

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
exports.sentLetterGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id;

        const letterReplies = await LetterReply.findAll({
            attributes: ['letter_id'],
            where: { 
                user_id,
                content: { [Op.ne]: null }
            },
        });

        const letterIds = letterReplies.map(reply => reply.letter_id);

        const letters = await Letter.findAll({
            where: {
              id: letterIds
            },
          });

        res.json(letters);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "서버 오류로 답장한 편지 조회 실패" });
    }
}

// 답장 받은 편지 조회하기
exports.receivedLetterGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id;

        const letters = await Letter.findAll({
            attributes: ['id'],
            where: {
                user_id: user_id
            }
        })

        const letterIds = letters.map(letter => letter.id);

        const letterReplies = await LetterReply.findAll({
            where:{
                letter_id: letterIds,
                content: { [Op.ne]: null }
            }
        })

        res.json(letterReplies);
    }catch(err){
        console.error(err);
        res.status(500).json({ error : "서버 오류로 답장 받은 편지 조회 실패" })
    }
}

// 이번주에 작성한 편지 개수 조회
exports.weekLettersGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id;

        // 이번주의 시작과 끝 날짜 계산
        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

        // 이번주에 작성한 편지 개수 조회
        const letters = await Letter.count({
            where:{
                user_id: user_id,
                createdAt: { [Op.between]: [startOfThisWeek, endOfThisWeek] }
            }
        })

        const response = { "letters": letters};

        res.json(response);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "서버 오류로 이번주에 작성한 편지 조회 실패" });
    }
}

// 주 별 평균 편지 작성 개수 조회
exports.weekAvgLettersGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id;

        const user = await User.findOne({
            attributes: ['createdAt'],
            where: {
                id: user_id
            }
        })

        // 계정 생성 후 몇 주 지났는지 구하기
        const now = new Date();
        const weeksSinceCreation = differenceInWeeks(now, user.dataValues.createdAt) + 1;
        console.log(weeksSinceCreation, "createdAt!!!!!!!!");

        const letters = await Letter.count({
            where: {
                user_id: user_id,
            }
        })

        const avg = Math.round(letters / weeksSinceCreation);
        const response = { "letters_avg" : avg };

        res.json(response);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "서버 오류로 편지 평균 조회 실패"})
    }
}

// 편지 카테고리 조회하기
exports.categoryGetMid = async(req, res) => {
    try{
        const letter_id = req.params.letter_id;

        const letters = await LetterCtg.findAll({
            attributes: ['ctg_id'],
            where:{
                letter_id: letter_id
            }
        })

        const ctgIds = letters.map(letter => letter.ctg_id);

        const ctgs = await Category.findAll({
            attributes: ['name'],
            where: {
                id: ctgIds
            }
        })

        const name = ctgs.map(ctg => ctg.name);

        res.json(name)
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "서버 오류로 카테고리 조회 실패" })
    }
}