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

for (let i = 0; i < 18**2; i++) {
    let gridsquare = document.createElement("div");
    let gridbutton = document.createElement("button");
    gridbutton.classList.add("gridbutton");
    gridbuttonarray.push(gridbutton);
    gridsquare.addEventListener("click", function () {
        selectSquare(gridbutton, i);
    })
    gridsquare.classList.add("gridsquare");
    gridsquare.appendChild(gridbutton);
    board.appendChild(gridsquare);
}

let squarenumber;
let bot1stchoice;
let fivebyfivelist = [];

//Generates list of possible squares in 5x5 area
function generateGoodSquares(center) {
    fivebyfivelist = [];
    for (let i = 0; i <= 4; i++) {
        fivebyfivelist.push(center-38+i, center-38+i+18, center-38+i+36, center-38+i+54, center-38+i+72);
    }
}

function chooseSquareFromList() {
    squarenumber = fivebyfivelist[Math.floor(Math.random()*(fivebyfivelist.length+1))]
}

//Level 2: select squares around 1st choice
//Level 3: select squares around player's 1st square
function runBot() {
    if (!gamewon && (turncounter%2 == 0)) {
        //If it's the beginning, select a random square to be the center of the grid
        if (turncounter == 2) {
            squarenumber = Math.floor(Math.random()*325);
            while (gridbuttonarray[squarenumber].classList.contains("selected")) {
                squarenumber = Math.floor(Math.random()*325);
            }
            bot1stchoice = squarenumber;
            generateGoodSquares(bot1stchoice);
        } else {
            //Otherwise select a random square within the 5x5 grid around the 1st choice
            squarenumber = fivebyfivelist[Math.floor(Math.random()*(fivebyfivelist.length+1))];
        }

        selectSquare(gridbuttonarray[squarenumber], squarenumber);
    }
}

//Disable this line for multiplayer
setInterval(runBot, 10);
generateGoodSquares(39);