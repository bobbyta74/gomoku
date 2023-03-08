const board = document.querySelector("#board");
const players = ["white", "black"];
let turncounter = 0;
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
        color = players[turncounter%2];
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
function runBot() {
    if (!gamewon && (turncounter%2 == 0)) {
        squarenumber = Math.floor(Math.random()*325);
        while (gridbuttonarray[squarenumber].classList.contains("selected")) {
            squarenumber = Math.floor(Math.random()*325);
        }
        selectSquare(gridbuttonarray[squarenumber], squarenumber);
    }
}

setInterval(runBot, 10);