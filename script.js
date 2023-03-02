const board = document.querySelector("#board");
const players = ["white", "black"];
let turncounter = 0;

for (let i = 0; i < 18**2; i++) {
    let gridsquare = document.createElement("div");
    let gridbutton = document.createElement("button");
    gridbutton.classList.add("gridbutton");
    gridsquare.addEventListener("click", function () {
        if (!(gridbutton.classList.contains("selected"))) {
            gridbutton.style.backgroundColor = players[turncounter%2];
            turncounter += 1;
            gridbutton.classList.add("selected");
        }
    })
    gridsquare.classList.add("gridsquare");
    gridsquare.appendChild(gridbutton);
    board.appendChild(gridsquare);
}