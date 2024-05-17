function getRandomIndex(length) {
    let randomArr = [];
    while(randomArr.length < 5){
        let num = Math.floor(Math.random() * length);
        if(!randomArr.includes(num)) randomArr.push(num);
    }

    return randomArr;
}

module.exports = getRandomIndex;