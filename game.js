const canvas = document.querySelector('#game');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const game = canvas.getContext('2d');

let time;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
let bombasPosition = []
let canvasSize;
let elementsSize;
const playerPosition = {
    x: undefined,
    y:undefined
}
let variable = 0;
const giftPosition = {
    x: undefined,
    y: undefined
}


window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);
window.addEventListener('keydown',moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    }else{
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);

    elementsSize = canvasSize / 10;
    startGame()
}
function startGame() {
    game.font = elementsSize + 'px verdana';
    game.textAlign = 'end';
    const map = maps[level];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    bombasPosition = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    showLives();

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100)
    }

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) =>{            
            let emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            
            if (col == "O") {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            }else if (col == "I") {
                    giftPosition.x = posX;
                    giftPosition.y = posY;
            }else if (col == "X") {
                bombasPosition.push({
                    x: posX,
                    y: posY
                })
            }
            game.fillText(emoji, posX, posY);   
        } )
    });
    movePlayer();
}
function showLives() {
    const arraycorazon = Array(lives).fill(emojis['HEART']);

    spanLives.innerHTML = '';
    arraycorazon.forEach(corazon =>{
        spanLives.append(corazon);
    })

     
}
function showTime() {
    time = Date.now() - timeStart;
    spanTime.innerHTML = time;
}
function movePlayer() {

    const colicionX = playerPosition.x.toFixed(1) == giftPosition.x.toFixed(1);
    const colicionY = playerPosition.y.toFixed(1) == giftPosition.y.toFixed(1);
    const colicion = colicionX && colicionY;

    if (colicion) {
        levelWin();
    }

    const bombaCollision = bombasPosition.find(bomba =>{
        const bombaCollisionX = bomba.x.toFixed(1) == playerPosition.x.toFixed(1);
        const bombaCollisionY = bomba.y.toFixed(1) == playerPosition.y.toFixed(1);
        return bombaCollisionX && bombaCollisionY;
    })

    if (bombaCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);    
}
function levelFail() {
    if (lives > 1) {
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        startGame();
        lives--;
    }else{
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        lives = 3;
        level = 0;
        timeStart = undefined;
        startGame();

    }
}
function levelWin() {
    if (level < 2) {
        level++;
        startGame();

    }else{

        gameWin();
    }
}
function gameWin() {
    console.log('gano');
    clearInterval(timeInterval)
    if (!timePlayer) {
        timePlayer = time;
        spanRecord.innerHTML = timePlayer;
        console.log('gano1');
        level = 0;
        lives = 3;
        startGame();
    }

    if (timePlayer < time) {
        timePlayer = time;
        console.log('gano2');
    }

    level = 0;
    lives = 3;

    setCanvasSize();
}
function moveByKeys(event) {
    switch (event.code) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
    
        case 'ArrowRight':
            moveRight();
            break;
            
        case 'ArrowDown':
            moveDown();
            break;

        default:
            break;
    }
}
function moveUp() {  
 if ((playerPosition.y - elementsSize) < elementsSize-1) {
    console.log('no se puede');
 }else{
    playerPosition.y -= elementsSize;
    startGame();
 }
 
}
function moveLeft() {   
    if ((playerPosition.x - elementsSize) < elementsSize-1) {
        console.log('no se puede');
     }else{
        playerPosition.x -= elementsSize;
        startGame();
     }
}
function moveRight() {
 if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log('no se puede');
 }else{
    playerPosition.x += elementsSize;
    startGame();
 }
}
function moveDown() { 
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('no se puede');
     }else{
        playerPosition.y += elementsSize;
        startGame();
     }
}




