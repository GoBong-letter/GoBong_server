const express = require('express');
const app = express();

const {sequelize} = require('./models');
const seedCards = require('./seed/cards');


app.set('port', process.env.PORT || 3000); //포트 설정

sequelize.sync({force: false})
.then(()=>{
    console.log("DB Connected Success");
    seedCards();
})
.catch((err)=> {
    console.error(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});