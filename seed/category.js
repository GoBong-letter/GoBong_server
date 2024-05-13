const Category = require('../models/category');

async function seedCategory() {
  try {
    const existingCategory = await Category.findAll();
    if(existingCategory.length === 0){
      const outside = ['예쁜', '잘생긴', '순한', '섹시한', '매력있는', '귀여운', '멋진', '고풍', '우아한', '청순한', '마른'];

      let categorys = outside.map(v => {
        return {
            b_ctg: '외면',
            name: v
        }
      })

      await Category.bulkCreate(categorys);
    }
  } catch (error) {
    console.error('카테고리 추가 중 오류 발생:', error);
  }
}

module.exports = seedCategory;