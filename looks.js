const clear = document.querySelector("#clear");
const themeselect = document.querySelector("#themes");
const board1 = document.querySelector("#board");
const body = document.querySelector("body");
const buttons = document.querySelectorAll("button");
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

function changeTheme() {
    chosentheme = Themes[themeselect.value];
    board1.style.background = chosentheme.boardbg;
    if ("mainbgcolor" in chosentheme) {
        console.log("wanker");
        body.style.backgroundImage = "none";
        body.style.backgroundColor = chosentheme.mainbgcolor;
    } else {
        body.style.backgroundImage = `url("${chosentheme.mainbg}")`;
    }
    for (let button of buttons) {
        button.style.opacity = "0";
    }
}

themeselect.addEventListener("change", function () {
    changeTheme();
})

changeTheme();