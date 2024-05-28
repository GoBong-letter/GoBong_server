const SubCategory = require('../models/sub_categories');

async function seedSubCategory() {
  try {
    const existingCategory = await SubCategory.findAll();
    if(existingCategory.length === 0){
      const outside = ['예쁜', '잘생긴', '통통한', '섹시한', '매력있는', '귀여운', '멋진', '못생긴', '우아한', '청순한', '마른', '고풍'];
      const personality = ['착한', '성실한', '순한', '조용한', '긍정적인', '활발한', '신중한', '재밌는', '털털한', '느긋한', '당돌한', '능글맞은']
      const hobby = ['운동', '독서', '덕질', 'OTT', '공부', 'SNS', '악기', '공예', '요리', '쇼핑', '게임', '여행']
      const color = ['빨간색', '주황색', '노란색', '초록색', '하늘색', '파란색', '남색', '보라색', '핑크색', '갈색', '검정색', '흰색']
      const mbti = ['INFP', 'INTP', 'INTJ', 'ISFP', 'ISTP', 'ISTJ', 'ISFJ', 'ENFP', 'ENTP', 'ENTJ', 'ENFJ', 'ESFP', 'ESTP', 'ESTJ', 'ESFJ'];

      // sub_category 값
      let sub_categories = [];

      outside.forEach(category => {
        sub_categories.push({
          category_id: 1,
          name: category
        })
      })

      personality.forEach(category => {
        sub_categories.push({
          category_id: 2,
          name: category
        })
      })

      hobby.forEach(category => {
        sub_categories.push({
          category_id: 3,
          name: category
        })
      })

      color.forEach(category => {
        sub_categories.push({
          category_id: 4,
          name: category
        })
      })

      mbti.forEach(category => {
        sub_categories.push({
          category_id: 5,
          name: category
        })
      })

      await SubCategory.bulkCreate(sub_categories);
    }
  } catch (error) {
    console.error('소 카테고리 추가 중 오류 발생:', error);
  }
}

module.exports = seedSubCategory;