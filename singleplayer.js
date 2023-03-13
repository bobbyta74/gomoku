const board = document.querySelector("#board");
const players = ["white", "black"];
let turncounter = 1;
let white = ["white"];
let black = ["black"];
let color;
let positionalcondition;
let gridbuttonarray = [];
let previousmove;
let currentmove;


//Checks diagonals and vertical for attacks, chooses move that blocks it
function blockAttack() {
    let movechoice;
    let otherchoices = white.slice(1);
    otherchoices.splice(otherchoices.indexOf(currentmove), 1);
    for (let x of otherchoices) {
        for (let i = 17; i < 20; i++) {
            let diff = x - currentmove;
            if (diff % i == 0) {
                if (diff > 0) {
                    movechoice = currentmove - i;
                    if (gridbuttonarray[movechoice].classList.contains("selected")) {
                        movechoice = currentmove + i;
                    }
                }
                else {
                    movechoice = currentmove - i;
                    if (gridbuttonarray[movechoice].classList.contains("selected")) {
                        movechoice = currentmove + i;
                    }
                }
                if (movechoice >= 0 && movechoice <= 323) {
                    if (!(gridbuttonarray[movechoice].classList.contains("selected"))) {
                        return movechoice;
                    }
                }
            }
        }
    }
    return "whatdowethinkoftottenham";
}

//Saves moves if you leave the page
function saveMoves() {
    localStorage.setItem("singleWhiteMoves", JSON.stringify(white));
    localStorage.setItem("singleBlackMoves", JSON.stringify(black));
}

document.querySelector("#themes").addEventListener("input", saveMoves);
document.querySelector("a").addEventListener("click", saveMoves);

//Restores game to previous state on reload
function restoreMoves() {
    let localblack = JSON.parse(localStorage.getItem("singleBlackMoves"));
    let localwhite = JSON.parse(localStorage.getItem("singleWhiteMoves"));
    for (let i = 1; i < localblack.length; i++) {
        let blackbutton = gridbuttonarray[localblack[i]];
        blackbutton.style.backgroundColor = "black";
        blackbutton.style.opacity = "1";
        blackbutton.classList.add("selected");
        black.push(localblack[i]);
    }
    for (let i = 1; i < localwhite.length; i++) {
        let whitebutton = gridbuttonarray[localwhite[i]];
        whitebutton.style.opacity = "1";
        whitebutton.style.backgroundColor = "white";
        whitebutton.classList.add("selected");
        white.push(localwhite[i]);
    }
}

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
        gridbutton.style.opacity = "1";
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
    //Chooses random neighbouring square if there is no attack to be blocked
    let gridsize = size;
    generateGoodSquares(center, size);
    //For some reason this script has to be run 100 times to work properly
    for (let i=0;i<100;i++) {
        cleanUpGoodSquares();
    }
    while (goodsquareslist.length == 0) {
        gridsize += 2;
        generateGoodSquares(center, gridsize);
        for (let i=0;i<100;i++) {
            cleanUpGoodSquares();
        }
    }
}

//Level 2: select squares around random 1st choice
//Level 3: select squares around player's 1st square
//Level 4: bot starts, selects squares around 1st choice
function runBot() {
    if (!gamewon && (turncounter%2 == 0)) {
        squarenumber = blockAttack();
        console.log(squarenumber);
        if (squarenumber == "whatdowethinkoftottenham" || squarenumber == undefined) {
            generateDefiniteSquares(playerchoice, 3);
            squarenumber = goodsquareslist[Math.floor(Math.random()*(goodsquareslist.length))];
        }
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
        previousmove = playerchoice;
        playerchoice = gridbuttonarray.indexOf(gridbutton);
        currentmove = playerchoice;
        runBot();
    })
    gridsquare.classList.add("gridsquare");
    gridsquare.appendChild(gridbutton);
    board.appendChild(gridsquare);
}
restoreMoves();