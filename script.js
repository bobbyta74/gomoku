const board = document.querySelector("#board");
const players = ["white", "black"];
let turncounter = 1;
let white = ["white"];
let black = ["black"];
let color;
let positionalcondition;
let gridbuttonarray = [];

function isInArray (item, array) {
    return (array.indexOf(item) > -1);
}

function winHorizontal (squarenumber, array) {
    //Don't get win if overflows onto next line
    positionalcondition = squarenumber%18 <= 13;
    return (positionalcondition && isInArray(squarenumber+1, array) && isInArray(squarenumber+2, array) && isInArray(squarenumber+3, array) && isInArray(squarenumber+4, array));
}

function winVertical (squarenumber, array) {
    positionalcondition = squarenumber < 252;
    return (positionalcondition && (isInArray(squarenumber+18, array) && isInArray(squarenumber+36, array) && isInArray(squarenumber+54, array) && isInArray(squarenumber+72, array)));
}

function winUpRight (squarenumber, array) {
    //Don't get win if overflows onto next line
    positionalcondition = (squarenumber%18 <= 13) && (squarenumber >= 72);
    return (positionalcondition && (isInArray(squarenumber-17, array) && isInArray(squarenumber-34, array) && isInArray(squarenumber-51, array) && isInArray(squarenumber-68, array)));
}

function winUpLeft (squarenumber, array) {
    //Don't get win if overflows onto next line
    positionalcondition = (squarenumber%18 >= 4) && (squarenumber >= 72);
    return (positionalcondition && (isInArray(squarenumber-19, array) && isInArray(squarenumber-38, array) && isInArray(squarenumber-57, array) && isInArray(squarenumber-76, array)));
}

let gamewon = false;
function checkWins (array) {
    for (let square of array) {
        if (winHorizontal(square, array) || winVertical(square, array) || winUpRight(square, array) || winUpLeft(square, array)) {
            gamewon = true;
            alert(`${array[0]} wins!`);
        }
    }
}

function selectSquare(gridbutton, i) {
    if ((!gamewon)&&(!(gridbutton.classList.contains("selected")))) {
        color = players[(turncounter-1)%2];
        gridbutton.style.backgroundColor = color;
        gridbutton.classList.add("selected");
        if (color == "white") {
            white.push(i);
            checkWins(white);
        } else {
            black.push(i);
            checkWins(black);
        }
        turncounter += 1;
    }
}

let playerchoice;
let squarenumber;
let bot1stchoice;
let goodsquareslist = [];

//Generates list of possible squares in areas of 5x5, 7x7, 9x9 etc.
function generateGoodSquares(center, size) {
    let goodchoices = [];
    goodsquareslist = [];
    //38 for 5x5, 57 for 7x7, 76 for 9x9
    let start = center - (19+19*(size-3)/2);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= 18*(size-1); j+=18) {
            goodchoices.push(start+i+j);
        }
    }
    //Avoid putting in the center square and mathematically correct squares that aren't on the board (negative/greater than 323)
    for (let choice of goodchoices) {
        if (choice >=0 && choice <= 323 && choice!==center) {
            goodsquareslist.push(choice);
        }
    }
}

//Generates random square until it chooses an unselected one
function makeSquareNumber(max) {
    squarenumber = Math.floor(Math.random()*max);
    while (gridbuttonarray[squarenumber].classList.contains("selected")) {
        squarenumber = Math.floor(Math.random()*max);
    }
}

//Delete already selected squares from goodsquareslist so the computer doesn't try to select them
function cleanUpGoodSquares() {
    for (let i of goodsquareslist) {
        if (gridbuttonarray[i].classList.contains("selected")) {
            goodsquareslist.splice(goodsquareslist.indexOf(i), 1);
        }
    }
}

//Use bigger grid in case all squares in existing one are selected
function generateDefiniteSquares(center, size) {
    let gridsize = size;
    console.log(gridsize);
    generateGoodSquares(center, size);
    //For some reason this script has to be run 100 times to work properly
    for (let i=0;i<100;i++) {
        cleanUpGoodSquares();
    }
    while (goodsquareslist.length == 0) {
        gridsize += 2;
        console.log("wanker");
        generateGoodSquares(center, gridsize);
        for (let i=0;i<100;i++) {
            cleanUpGoodSquares();
        }
    }
    console.log("length of goodsquareslist:", goodsquareslist.length)
}

//Level 2: select squares around random 1st choice
//Level 3: select squares around player's 1st square
//Level 4: bot starts, selects squares around 1st choice
//SHITS THE BED IF 5x5 AREA FILLED IN VOLVO PLS FIX
let difficulty = 3;
function runBot() {
    if (!gamewon && (turncounter%2 == 0)) {
        generateDefiniteSquares(playerchoice, 3);
        squarenumber = goodsquareslist[Math.floor(Math.random()*(goodsquareslist.length))];
        //Choose square and remove it from selectable squares list
        selectSquare(gridbuttonarray[squarenumber], squarenumber);
    }
}

for (let i = 0; i < 18**2; i++) {
    let gridsquare = document.createElement("div");
    let gridbutton = document.createElement("button");
    gridbutton.classList.add("gridbutton");
    gridbuttonarray.push(gridbutton);
    gridsquare.addEventListener("click", function () {
        selectSquare(gridbutton, i);
        playerchoice = gridbuttonarray.indexOf(gridbutton);
        console.log(playerchoice);
        runBot();
    })
    gridsquare.classList.add("gridsquare");
    gridsquare.appendChild(gridbutton);
    board.appendChild(gridsquare);
}