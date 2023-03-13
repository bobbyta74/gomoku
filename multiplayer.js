const board = document.querySelector("#board");
const players = ["white", "black"];
let turncounter = 0;
let white = ["white"];
let black = ["black"];
let color;
let positionalcondition;
let gridbuttonarray = [];

//Saves moves if you leave the page
function saveMoves() {
    localStorage.setItem("multiWhiteMoves", JSON.stringify(white));
    localStorage.setItem("multiBlackMoves", JSON.stringify(black));
}

document.querySelector("#themes").addEventListener("input", saveMoves);
document.querySelector("a").addEventListener("click", saveMoves);

//Restores game to previous state on reload
function restoreMoves() {
    let localblack = JSON.parse(localStorage.getItem("multiBlackMoves"));
    let localwhite = JSON.parse(localStorage.getItem("multiWhiteMoves"));
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

function checkWins (array) {
    for (let square of array) {
        if (winHorizontal(square, array) || winVertical(square, array) || winUpRight(square, array) || winUpLeft(square, array)) {
            alert(`${array[0]} wins!`);
            document.location.reload();
            localStorage.removeItem("singleBlackMoves");
            localStorage.removeItem("singleWhiteMoves");
            localStorage.removeItem("multiBlackMoves");
            localStorage.removeItem("multiWhiteMoves");
        }
    }
}

for (let i = 0; i < 18**2; i++) {
    let gridsquare = document.createElement("div");
    let gridbutton = document.createElement("button");
    gridbutton.classList.add("gridbutton");
    gridbuttonarray.push(gridbutton);
    gridsquare.addEventListener("click", function () {
        if (!(gridbutton.classList.contains("selected"))) {
            gridbutton.style.opacity = "1";
            color = players[turncounter%2]
            gridbutton.style.backgroundColor = players[turncounter%2];
            turncounter += 1;
            gridbutton.classList.add("selected");
            if (color == "white") {
                white.push(i);
                checkWins(white);
            } else {
                black.push(i);
                checkWins(black);
            }
        }
    })
    gridsquare.classList.add("gridsquare");
    gridsquare.appendChild(gridbutton);
    board.appendChild(gridsquare);
}
restoreMoves();