const clear = document.querySelector("#clear");
const themeselect = document.querySelector("#themes");
const board1 = document.querySelector("#board");
const body = document.querySelector("body");
const gridbuttons = document.querySelectorAll(".gridbutton");
const closesettings = document.querySelector("#closesettings");
const opensettings = document.querySelector("#opensettings");
const settings = document.querySelector("#settings");


opensettings.addEventListener("click", function() {
    settings.style.display = "block";
    board1.style.filter = "blur(5px)";
    for (let button of gridbuttons) {
        button.disabled = true;
    }
})

closesettings.addEventListener("click", function() {
    settings.style.display = "none";
    board1.style.filter = "none";
    for (let button of gridbuttons) {
        button.disabled = false;
    }
})

clear.addEventListener("click", function () {
    document.location.reload();
})

const Themes = {
    wood: {
        mainbg: "woodmain.jpg",
        boardbg: "#99591c"
    },
    synthwave: {
        mainbg: "synthwavemain.jpg",
        boardbg: "linear-gradient(#dd01da, #007bf5)"
    },
    firewatch: {
        mainbg: "firewatchmain.jpg",
        boardbg: "linear-gradient(#f08132, #892e33)"
    },
    amogus: {
        mainbg: "amogusmain.jpg",
        boardbg: "#3bfdff"
    },
    roblox: {
        mainbg: "robloxmain.jpg",
        boardbg: "red"
    },
    mlg: {
        mainbg: "mlgmain.jpg",
        boardbg: "#33ff00"
    },
    fortnite: {
        mainbg: "fortnitemain.jpg",
        boardbg: "#a338de"
    }
}

let chosentheme;
function displayTheme() {
    chosentheme = JSON.parse(localStorage.getItem("chosentheme"));
    board1.style.background = chosentheme.boardbg;
    if ("mainbgcolor" in chosentheme) {
        body.style.backgroundImage = "none";
        body.style.backgroundColor = chosentheme.mainbgcolor;
    } else {
        body.style.backgroundImage = `url("${chosentheme.mainbg}")`;
    }
    for (button of gridbuttons) {
        button.style.opacity = "0";
    }
}


function changeTheme(startup=false) {
    if (startup) {
        chosentheme = Themes["wood"]
    } else {
        chosentheme = Themes[themeselect.value];
        localStorage.setItem("chosentheme", JSON.stringify(chosentheme));
    }
    displayTheme();
}

themeselect.addEventListener("change", function () {
    changeTheme();
})

console.log("wanker");
if (localStorage.getItem("chosentheme") != null) {
    displayTheme();
} else {
    changeTheme(true);
}