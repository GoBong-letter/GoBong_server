const { UserCtg, LetterCtg, Category, SubCategory } = require('../models');

async function getCategoryId(b_ctg, name, id, id_name, table) {
    try {
      const category = await Category.findOne({
        attributes: ['id'],
        where:{
          name: b_ctg
        }
      })

      const categoryName = category.dataValues.id

      if(categoryName === 6) { // 기타일 때
        await table.create({
          [id_name]: id,
          category_id: categoryName,
          value: name
        })
      }else{ // 정해진 값일 때
        const subCategory = await SubCategory.findOne({
          attributes: ['id'],
          where:{
            category_id: categoryName,
            name: name
          }
        })
        const subCategoryId = subCategory.dataValues.id;

        await table.create({
          [id_name]: id,
          category_id: categoryName,
          subcategory_id: subCategoryId
        })
      }

    } catch (error) {
      console.error('Error:', error);
    }
}

module.exports = getCategoryId;