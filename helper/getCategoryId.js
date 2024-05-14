const { UserCtg, LetterCtg, Category } = require('../models');

async function getCategoryId(b_ctg, name, id, id_name, table) {
    try {
      const categoryId = await Category.findAll({
        attributes: ['id'], // 선택할 속성 지정
        where: {
          b_ctg: b_ctg,
          name: name
        }
      });
  
      await table.create({
        [id_name]: id,
        ctg_id: categoryId[0].dataValues.id
      })

    } catch (error) {
      console.error('Error:', error);
    }
}

module.exports = getCategoryId;