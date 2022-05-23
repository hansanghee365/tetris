import BLOCKS from "./blocks.js"

//DOM
const playground = document.querySelector('.playground > ul');
const gameText = document.querySelector('.game-text');
const scoreDisplay = document.querySelector('.score');
const restartButton = document.querySelector('.game-text > button');

//Setting
const GAME_ROS = 20;
const GAME_COLS = 10;

//Variables
let score =0;
let duration = 500;
let downInterval;
let tempMovingItem;



const movingItem = {
    type:"",
    direction:0,
    top:0,
    left:3,
};

//Music
const play_sound = new Audio();
play_sound.src = "tetris-gameboy-02.mp3";
const end_sound = new Audio();
// end_sound.src = "07_B-Type Game- Level 9 High 0 Ending.mp3";
// end_sound.loop = false;
init();

//functions
function init(){
    tempMovingItem = {...movingItem};
    for(let i=0;i<GAME_ROS;i++){
        prependNewline()
    }
    generateNewBlock();
    setTimeout(() => {
        
    }, 0);
}

function prependNewline(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0;j<GAME_COLS;j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}
function renderBlocks(moveType=""){
    //디스트럭처링
    const { type,direction,top,left} = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove(type,"moving");
    })
    BLOCKS[type][direction].some(block=>{
        const x = block[0]+left;
        const y = block[1]+top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x]: null;
        const isAvailbale = checkEmpty(target);
        if(isAvailbale){
            target.classList.add(type,"moving");
        }else{
            tempMovingItem = {...movingItem};
            if(moveType === 'retry'){
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(()=>{
                renderBlocks('retry');
                if(moveType==="top"){
                    seizeBlock();
                }
            },0);
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction; 
}
function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}
function checkMatch(){

    const childNodes = playground.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched= false;
            }
        })
        if(matched){
            child.remove();
            prependNewline();
            score++;
            scoreDisplay.innerText = score;
        }
    })

    generateNewBlock();
}
function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top', 1);
    },duration);

    const blockArray = Object.entries(BLOCKS);
    console.log(blockArray);
    const randomIndex = Math.floor(Math.random() * blockArray.length);

    movingItem.type=blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks();
}
function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}
function moveBlock(moveType,amout){
    tempMovingItem[moveType] += amout;
    renderBlocks(moveType);
}
function chageDirection(){
    const direction = tempMovingItem.direction;
    tempMovingItem.direction === 3 ? tempMovingItem.direction = 0:tempMovingItem.direction +=1;
    renderBlocks();
}
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock("top", 1);
    },10);
}

function showGameoverText(){
    end_sound.play(); 
    play_sound.pause();
    gameText.style.display = "flex";
    scoreDisplay.innerText =0;
}
//event handling

document.addEventListener("keydown",e=>{
    play_sound.play();
    switch(e.keyCode){
        case 39:
            moveBlock("left",1);
            break;
        case 37:
            moveBlock("left",-1);
            break;
        case 40:
            moveBlock("top",1);
            break;
        case 38:
            chageDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
    console.log(e);
})

restartButton.addEventListener("click",()=>{
    playground.innerHTML = "";
    gameText.style.display = "none";
    init();
})
