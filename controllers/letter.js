const { Letter, LetterCtg, LetterReply, User, Category, SubCategory } = require('../models');
const { Sequelize, Op, where } = require('sequelize');
const { startOfWeek, endOfWeek, subWeeks } = require('date-fns');

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

        // 내가 작성한 편지, 이미 받은 편지를 제외하여 조회하기
        const letters = await Letter.findAll({
            where:{
                user_id: {
                    [Op.ne]: user_id // 자신이 작성한 편지가 아닌 경우
                },
                id: {
                    [Op.notIn]: Sequelize.literal(
                        '(SELECT letter_id FROM letter_reply)'  // letter_reply 테이블에 존재하지 않는 letter_id만 포함
                    )
                }
            },
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
        const { letter_id, user_id } = req.body;

        // 내가 보낸 편지인지 검사
        const myLetter = await Letter.findOne({
            where: {
                id: letter_id
            }
        })

        if(myLetter.dataValues.user_id == user_id){
            return res.status(409).json({ error: '사용자가 작성한 편지입니다.'})
        }

        // 이미 받은 편지인지 검사
        const existingReply = await LetterReply.findOne({
            where: {
              letter_id: letter_id
            }
        });
      
        if (existingReply) {
            return res.status(409).json({ error: '이미 받은 편지입니다'})
        }

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
        const { user_id, letter_id, content } = req.body;
        const letter = await LetterReply.update({
            content
        }, {
            where: {
                letter_id: letter_id,
                user_id: user_id
            }
        })

        if(letter[0] === 0) {
            return res.status(403).json({ message: '받지 않은 편지입니다.'})
        }

        return res.status(200).json({ message: '답장 작성 성공' });
    }catch(err){    
        console.error(err)
        return res.status(500).json({ error: "서버 오류로 편지 답장 실패" })
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
        return res.status(500).json({ error: "서버 오류로 답장한 편지 조회 실패" });
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
        return res.status(500).json({ error : "서버 오류로 답장 받은 편지 조회 실패" })
    }
}

// 이번주에 작성한 편지 개수 조회
exports.weekLettersGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id;

        // 이번주의 시작과 끝 날짜 계산
        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 }).toLocaleString('sv');
        const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 }).toLocaleString('sv');

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
        return res.status(500).json({ error: "서버 오류로 이번주에 작성한 편지 조회 실패" });
    }
}

// 주 별 평균 편지 작성 개수 조회
exports.weekAvgLettersGetMid = async (req, res) => {
    try{

        // 이번주의 시작과 끝 날짜 계산
        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 }).toLocaleString('sv');
        const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 }).toLocaleString('sv');

        // 이번주에 작성한 편지 개수 조회
        const letters = await Letter.count({
            where:{
                createdAt: { [Op.between]: [startOfThisWeek, endOfThisWeek] }
            }
        })

        // 총 유저 수
        const users = await User.count({})

        const avg = Math.round(letters / users);
        const response = { "letters_avg" : avg };

        res.json(response);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 편지 평균 조회 실패"})
    }
}

// 편지 카테고리 조회하기
exports.categoryGetMid = async(req, res) => {
    try{
        const letter_id = req.params.letter_id;

        let category = { '외모': [], '성격': [], '취미': [], '색': [], 'MBTI': [], '기타': []};

        // 편지 카테고리 id 조회
        const letterCategory = await LetterCtg.findAll({
        where: { letter_id: letter_id },
        include: [
            {
                model: Category,
                attributes: ['name']
            },
            {
                model: SubCategory,
                attributes: ['name']
            }
            ]
        });

        letterCategory.forEach(entry => {
            const name = entry.dataValues.subcategory_id ? entry.SubCategory.dataValues.name : entry.dataValues.value;
            category[entry.Category.dataValues.name].push(name);
        });

        res.json(category)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 카테고리 조회 실패" })
    }
}

// 내가 쓰거나 받은 편지 조회
exports.userLettersGetMid = async(req, res) => {
    try{
        const user_id = req.params.user_id;

        // 내가 쓴 편지
        const sentLetters = await Letter.findAll({
            where: {
                user_id: user_id
            },
            include: [{
                model: LetterReply,
                required: false
            }]
        });
    
        // 내가 받은 편지
        const receivedLetters = await Letter.findAll({
            include: [{
                model: LetterReply,
                required: true,
                where: {
                    user_id: user_id
                }
            }]
        });
    
        // 편지들을 순수 데이터 객체로 변환하고 send 필드를 추가
        const processedSentLetters = sentLetters.map(letter => {
            const letterData = letter.get({ plain: true });
            letterData.send = true;
            return letterData;
        });
    
        const processedReceivedLetters = receivedLetters.map(letter => {
            const letterData = letter.get({ plain: true });
            letterData.send = false;
            return letterData;
        });
    
        // 두 배열 합치기
        const allLetters = [...processedSentLetters, ...processedReceivedLetters];

        res.json(allLetters);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 편지 조회 실패"});
    }
}

// 편지 검색
exports.searchLetterGetMid = async(req, res) => {
    try{
        const user_id = req.params.user_id;
        const words = req.params.words;

        // 내가 쓴 편지
        const sentLetters = await Letter.findAll({
            where: {
                user_id: user_id,
                [Op.or]: [
                    { title: { [Op.like]: `%${words}%` } },
                    { content: { [Op.like]: `%${words}%` } },
                ],
            },
            include: [{
                model: LetterReply,
                required: false
            }]
        });
    
        // 내가 받은 편지
        const receivedLetters = await Letter.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${words}%` } },
                    { content: { [Op.like]: `%${words}%` } },
                ],
            },
            include: [{
                model: LetterReply,
                required: true,
                where: {
                    user_id: user_id
                }
            }]
        });
    
        // 편지들을 순수 데이터 객체로 변환하고 send 필드를 추가
        const processedSentLetters = sentLetters.map(letter => {
            const letterData = letter.get({ plain: true });
            letterData.send = true;
            return letterData;
        });
    
        const processedReceivedLetters = receivedLetters.map(letter => {
            const letterData = letter.get({ plain: true });
            letterData.send = false;
            return letterData;
        });
    
        // 두 배열 합치기
        const allLetters = [...processedSentLetters, ...processedReceivedLetters];

        res.json(allLetters);
    }catch(error){
        console.log(error);
    }
}

// 모든 편지 개수 조회
exports.lettersCntGetMid = async(req, res) => {
    try{
        const count = await Letter.count();

        res.json({ "count": count })
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 편지 개수 조회 실패" })
    }
}

// 저번주와 편지 개수 비교
exports.comparisonLetterGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id;

        // 현재 날짜
        const now = new Date();

        // 이번주의 시작과 끝 날짜
        const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 }).toLocaleString('sv');
        const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 }).toLocaleString('sv');

        // 저번주의 시작과 끝 날짜
        const startOfLastWeek = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }).toLocaleString('sv');
        const endOfLastWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }).toLocaleString('sv');

        // 저번주에 작성한 편지 개수
        const lastWeekletters = await Letter.count({
            where:{
                user_id: user_id,
                createdAt: { [Op.between]: [startOfLastWeek, endOfLastWeek] }
            }
        })

        // 이번주에 작성한 편지 개수
        const thisWeekletters = await Letter.count({
            where:{
                user_id: user_id,
                createdAt: { [Op.between]: [startOfThisWeek, endOfThisWeek] }
            }
        })

        res.json({ "letters": thisWeekletters - lastWeekletters});
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 편지 개수 비교 실패" })
    }
}