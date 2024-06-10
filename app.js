const express = require('express');
const cors = require('cors');
const app = express();

const {sequelize} = require('./models');
const seedCards = require('./seed/cards');
const seedCategory = require('./seed/categories');
const seedSubCategory = require('./seed/sub_categories')

app.set('port', process.env.PORT || 3000); //포트 설정

sequelize.sync({force: false})
.then(()=>{
    console.log("DB Connected Success");
    seedCards();
    seedCategory();
    seedSubCategory();
})
.catch((err)=> {
    console.error(err);
});

app.use(cors());
app.use(express.json());

const users = require('./routes/user');
app.use('/users', users);

const letters = require('./routes/letter');
app.use('/letters', letters);

const community = require('./routes/community');
app.use('/community', community);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});