const { UserCtg, Category } = require('../models');

async function getCategoryId(b_ctg, name, user_id) {
    try {
      const categoryId = await Category.findAll({
        attributes: ['id'], // 선택할 속성 지정
        where: {
          b_ctg: b_ctg,
          name: name
        }
      });
  
      await UserCtg.create({
        user_id,
        ctg_id: categoryId[0].dataValues.id
      })
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

module.exports = getCategoryId;