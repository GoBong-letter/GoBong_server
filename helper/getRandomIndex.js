function getRandomIndex(length) {
    let randomArr = [];
    
    if(length <= 5){ // 내가 작성한 편지를 제외한 편지가 5개 이하일 경우
        for(let i = 0; i<length; i++) {
            randomArr.push(i);
        }
    }else{
        while(randomArr.length < 5){
            let num = Math.floor(Math.random() * length); // 0 ~ length - 1
            if(!randomArr.includes(num)) randomArr.push(num);
        }
    }

    return randomArr;
}

module.exports = getRandomIndex;