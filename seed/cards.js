const Card = require('../models/cards');

async function seedCards() {
  try {
    const existingCards = await Card.findAll();
    if(existingCards.length === 0){
      let card_name = ['rice', 'bean', 'egg_soy', 'emelet', 'ham_mayo', 'salmon', 'bibim']

      let cards = card_name.map(v => {
        return {name: v}
      })

      await Card.bulkCreate(cards);
    }
  } catch (error) {
    console.error('고봉 카드 추가 중 오류 발생:', error);
  }
}

module.exports = seedCards;