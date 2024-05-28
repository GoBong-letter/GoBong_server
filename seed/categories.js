const Category = require('../models/categories');

async function seedCategory() {
  try {
    const existingCategory = await Category.findAll();
    if(existingCategory.length === 0){
      const categories = ['외모', '성격', '취미', '색', 'MBTI', '기타'];
     
      // category 값
      const addCategories = categories.map((category, index) => {
        return {
          id: index + 1,
          name: category
        }
      })

      await Category.bulkCreate(addCategories);
    }
  } catch (error) {
    console.error('카테고리 추가 중 오류 발생:', error);
  }
}

module.exports = seedCategory;