const board = document.querySelector("#board");
const result = document.querySelector("#result");
const players = ["white", "black"];
let turncounter = 0;
let white = ["white"];
let black = ["black"];
let color;
let positionalcondition;

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
            //result.style.display = "block";
            //result.textContent = `${array[0]} wins!`;
            alert(`${array[0]} wins!`);
            let buttons = document.querySelectorAll(".gridbutton");
            for (let button of buttons) {
                button.disabled = true;
            }
        }
    }
}

for (let i = 0; i < 18**2; i++) {
    let gridsquare = document.createElement("div");
    let gridbutton = document.createElement("button");
    gridbutton.classList.add("gridbutton");
    gridsquare.addEventListener("click", function () {
        gridbutton.style.opacity = "1";
        if (!(gridbutton.classList.contains("selected"))) {
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