const { User, UserCtg, Card, Letter, Category } = require('../models');
const { Op, where } = require('sequelize');
const getCategoryId = require('../helper/getCategoryId');
const crypto = require('crypto');

// 회원가입
exports.signupPostMid = async (req, res) => {
    try {
        const { nickname, password, email, image, category } = req.body;

        // 닉네임 사용자가 존재하는지 확인
        const checkNickname = await User.findOne({
          where: {
            nickname,
          },
        });

        if(checkNickname){
          return res.status(409).json({ error: '이미 존재하는 닉네임입니다.' });
        }

        const checkEmail = await User.findOne({
          where: {
            email,
          },
        });

        if(checkEmail){
          return res.status(409).json({ error: '이미 존재하는 이메일입니다.' });
        }
        
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
                getCategoryId(b_ctg, name, user_id, 'user_id', UserCtg);
            })
        })

        return res.status(200).json({ message: '사용자 정보가 성공적으로 저장되었습니다.' });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: '사용자 정보가 성공적으로 저장되지 않았습니다.' });
    }
};

// 로그인
exports.loginPostMid = async (req, res) => {
  try {
      const { email, password } = req.body;

      // 사용자 확인
      const user = await User.findOne({
        where: {
          email,
        },
      });

      // 사용자가 존재하지 않으면 오류 응답
      if (!user) {
        return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
      }

      // 입력된 비밀번호와 저장된 salt를 사용하여 해싱
      const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('base64');
      
      // 해싱된 비밀번호 비교
      if (hashedPassword !== user.password) {
        return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
      }

      return res.status(200).json({ message: '로그인 성공', id : user.id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '사용자 정보가 성공적으로 저장되지 않았습니다.' });
  }
};

// 로그인 후 사용자 정보 조회
exports.userInfoGetMind = async (req, res) => {
  try{
    const user_id = req.params.user_id;

    const user = await User.findOne({
      attributes: ['nickname', 'image'],
      where: {
        id: user_id
      }
    })
    let response = {...user.dataValues};

    // 나의 카테고리 id 조회
    let myCategory = {'외면': [], '내면': [], '관심사': [], '취미': [], '좋아하는': [], '싫어하는': []};
    const ctgIds = await UserCtg.findAll({
      attributes: ['ctg_id'],
      where:{
        user_id: user_id
      }
    })

    // 카테고리 이름 조회
    let ctgId = ctgIds.map(ctg => ctg.ctg_id);
    const ctgNames = await Category.findAll({
      attributes: ['b_ctg', 'name'],
      where: {
        id: ctgId
      }
    })

    ctgNames.forEach(ctg => {
      myCategory[ctg.b_ctg].push(ctg.name)
    })

    response['category'] = myCategory;

    res.json(response);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "서버 오류로 사용자 정보 조회 실패" })
  }
}

// 나의 카드 조회
exports.cardsGetMid = async (req, res) => {
  try{
    const user_id = req.params.user_id;

    // 편지 개수 조회
    let letters = await Letter.count({
      where: {
        user_id: user_id
      }
    })

    // 받을 수 있는 편지 조회
    let cards = await Card.findAll({
      attributes: ['name'],
      where:{
        count: {[Op.lte]: letters}
      },
      order: [ ['count', 'ASC'] ]
    })

    let myCards = cards.map(card => card.dataValues.name);
    res.json(myCards);
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: '서버 오류로 카드 조회 실패' })
  }
}

// 프로필 사진 수정
exports.imagePatchMid = async (req, res) => {
  try {
      const { user_id, image } = req.body;

      const user = await User.update({
        image,
      }, {
        where : { id: user_id }
      })

      return res.status(200).json({ message: '프로필 이미지 성공적으로 수정'});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '프로필 이미지 수정 중 실패' });
  }
};

// 닉네임 수정
exports.nicknamePatchMid = async (req, res) => {
  try {
      const { user_id, nickname } = req.body;

      // 닉네임 사용자가 존재하는지 확인
      const checkNickname = await User.findOne({
        where: {
          nickname,
        },
      });

      if(checkNickname){
        return res.status(409).json({ error: '이미 존재하는 닉네임입니다.' });
      }

      const user = await User.update({
        nickname,
      }, {
        where : { id: user_id }
      })

      return res.status(200).json({ message: '닉네임 성공적으로 수정'});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '닉네임 수정 중 실패' });
  }
};

// 카테고리 수정
exports.categoryPatchMid = async (req, res) => {
  try{
    const { user_id, category } = req.body;

    await UserCtg.destroy({
      where: { 
        user_id: user_id 
      },
    });

    const category_json = JSON.parse(category.replace(/'/g, '\"'));
    // 카테고리 저장
    Object.keys(category_json).forEach(b_ctg => {
      category_json[b_ctg].forEach(name => {
          getCategoryId(b_ctg, name, user_id, 'user_id', UserCtg);
      })
    })

    return res.status(200).json({ message: '카테고리 성공적으로 수정'});
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: '서버 오류로 카테고리 수정 중 실패'}) 
  }
}