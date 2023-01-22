"strict mode";
// All the core code that delivers the Memoria game
// Every effort has been made to take a unique approach


//global variables

let cardId = 0; //keep track of how many cards have been created in this session
let imageQuality = 'medium'; //image file size & quality
let backOfCardType = 'named'; //show name on back of cards - use 'named' or 'unnamed'
let gameRounds = 8; //how many rounds to play in total
let currentRound = 1; // always start with round 1
let deckSize = 8; //control how big the player deck is
let cardTheme = ''; // controls what set of cards will be in the deck - 'all' adds all themes
let cardColor = ''; // controls what color cards are included - 'all' adds all colors
let playerSelectedCards = []; // array that stores the cards the player has selected
let cardsToMatch = []; // array holds the cards the player has to remember
let totalSelectedCards = 0;
let playerCardsDealDelay = 0; // deal players cards dealign till all cards they have to remmeber are displayed
let menuOn = false; // Bool to track if menu is being displayed
let settingsMenuOn = false;
let gameActive = false; // bool to track active game state
let allowClick = true; // bool to stop click spamming issues 
let selectLocked = false; //block selecting cards till current move finished.
let effectsOn = 'true';
let musicOn = 'true'; //using a string for local storage
let currentMusic = 'menuMusic';
let backGroundColor = '#ffffff';
let currentPlayerName = '';
let iconsOn = 'true';


const gameArea = document.getElementById("gameArea");


//TESTING FUNCTIONS

// console.log("Here is the full deck");
// gameDeck = buildCardObjectArray(imageQuality, backOfCardType);
// shuffleDeck(gameDeck);
// console.log("Here is a game deck just with spooky cards");
// console.log( createGameDeck(cardTheme,cardColor) );


//LISTENERS

document.onload = captureUsername();
document.onload = setupAudio();
document.onload = loadSettings();
document.onload = showHideMenuIcons();

//show menu if escape is pressed and remove it if escape is pressed again
document.addEventListener("keydown", function (e) {
    if (e.repeat) {
        return;
    } else if (e.key == "Escape" && menuOn) {
        removeMenu();
    } else if (e.key == "Escape") {
        displayMenu();
    }
    return;
});

//BASIC UTILITY FUNCTIONS


//simple function to return a random number within a range
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function setBackgroundColor(newColor) {
    //if no color is passed then switch between black and white
    if (!newColor) {
        if (backGroundColor == '#000000') {
            document.querySelector('body').style.backgroundColor = '#ffffff';
            backGroundColor = '#ffffff';
            localStorage.setItem('backGroundColor', '#ffffff');
        } else if (backGroundColor == '#ffffff') {

            document.querySelector('body').style.backgroundColor = '#000000';
            backGroundColor = '#000000';
            localStorage.setItem('backGroundColor', '#000000');
        }
    }

    //may add bg switching based on theme later

}

function loadSettings() {

    //check to see if music preference was saved
    if (localStorage.getItem('musicOn')) {
        musicOn = localStorage.getItem('musicOn');

        if (musicOn == 'true') {
            document.getElementById('musicIcon').innerText = 'music_note';
        } else if (musicOn == 'false') {
            document.getElementById('musicIcon').innerText = 'music_off';
        }
    }

    //check for audio effect preference

    if (localStorage.getItem('effectsOn')) {
        effectsOn = localStorage.getItem('effectsOn');

        if (effectsOn == 'true') {
            document.getElementById('effectsIcon').innerText = 'volume_up';

        } else if (effectsOn == 'false') {
            document.getElementById('effectsIcon').innerText = 'volume_off';
        }

        //check for background preference
        if (localStorage.getItem('backGroundColor')) {

            backGroundColor = localStorage.getItem('backGroundColor');
            document.querySelector('body').style.backgroundColor = backGroundColor;
        }

    }
}
/**
 * This function will show/hide menu icons.
 * Tried setting display to none but it resulted in weird text pop.
 * Opacity set to 0 and pointer events none to stop clicks
 * 
 */
function showHideMenuIcons(){

    if(iconsOn == 'true'){
        console.log("Setting icons OFF");
        let icons = document.getElementsByClassName('menuIcon');

        for(let icon of icons){
            icon.style.opacity = '0';
            icon.style.pointerEvents = 'none';
        }
        iconsOn = 'false';
        return;
    }
    if(iconsOn == 'false'){ 
        console.log("Setting icons ON");
        let icons = document.getElementsByClassName('menuIcon');

        for(let icon of icons){
            icon.style.opacity = '1';
            icon.style.pointerEvents = 'auto';
        }
        iconsOn = 'true';
        return;
    }
}

function setMusicOnOff() {
    if (musicOn == 'true') {
        document.getElementById('musicIcon').innerText = 'music_off';
        fadeOutAudio(currentMusic);
        musicOn = 'false';
        localStorage.setItem('musicOn', 'false');
    } else if (musicOn == 'false') {
        document.getElementById('musicIcon').innerText = 'music_note';
        musicOn = 'true';
        localStorage.setItem('musicOn', 'true');
        playAudio(currentMusic, 'music');
    }


}

function setEffectsOnOff() {
    if (effectsOn == 'true') {
        document.getElementById('effectsIcon').innerText = 'volume_off';
        effectsOn = 'false';
        localStorage.setItem('effectsOn', 'false');
    } else if (effectsOn == 'false') {
        document.getElementById('effectsIcon').innerText = 'volume_up';
        effectsOn = 'true';
        localStorage.setItem('effectsOn', 'true');
    }


}

function captureUsername() {

    //check to see if we have a username stored
    if (localStorage.getItem('name')) {

        currentPlayerName = localStorage.getItem('name');
        userCapture = document.createElement('div');
        let currentPlayerNameTemp = currentPlayerName.toUpperCase();
        userCapture.id = "userCapture";

        userCapture.innerHTML = `
            <form class="mainMenu">
                <p class="welcomeText">WELCOME BACK TO MEMORIA <span class="bold"> ${currentPlayerNameTemp}</span>!</p>
                <p class="welcomeText">SHALL WE CONTINUE WITH YOUR SAVED GAME?</p>
                <button id="continueButton" class="menuItem" type="submit" value="submit" onclick="storeName()">YES, CONTINUE</button>
                <button id="resetButton" class="menuItem" onclick="resetGame()">NO, RESET GAME</button>
            </form>
            `;

        gameArea.appendChild(userCapture);
        userCapture.classList.add('menuDrop');
    } else {
        userCapture = document.createElement('div');
        userCapture.id = "userCapture";

        userCapture.innerHTML = `
            <form class="mainMenu" onsubmit="storeName()">
                <p class="welcomeText">WELCOME TO MEMORIA!</p>
                <p class="welcomeText">PLEASE ENTER YOUR NAME AND CLICK SAVE</p>
                <input id="userName" class="menuItem" type="text" placeholder="ENTER NAME">
                <button id="startButton" class="menuItem" type="submit" value="submit">SAVE</button>
            </form>
            `;

        gameArea.appendChild(userCapture);
        userCapture.classList.add('menuDrop');

    }


}

function resetGame() {

    console.log("Clearing local storage");
    localStorage.clear();

    document.getElementById('userCapture').classList.add('menuBurn');
    setTimeout(() => {
        document.getElementById('userCapture').remove();
        captureUsername();
    }, 1000);

}

function storeName() {

    event.preventDefault();
    if (document.getElementById('userName')) {
        console.log(" here is the name" + document.getElementById('userName').value);
        localStorage.setItem("name", document.getElementById('userName').value);
        currentPlayerName = document.getElementById('userName').value;
    }
    document.getElementById('userCapture').classList.add('menuBurn');
    setTimeout(() => {
        document.getElementById('userCapture').remove();
        displayMenu();
        showHideMenuIcons()
        loadSettings();
    }, 1000);
}

function displaySettingsMenu() {

    if (settingsMenuOn) {
        removeSettingsMenu();
        return;
    }

    if (menuOn) {
        removeMenu();
        setTimeout(() => {
            displaySettingsMenu();
        }, 1000);
        return;
    }


    let gameArea = document.getElementById("gameArea");
    let settingsMenu = document.createElement('div');
    settingsMenu.id = "settingsMenu";
    settingsMenu.classList.add("menuDrop");
    settingsMenu.classList.add("mainMenu");

    settingsMenu.innerHTML = `
                <h1 class="menuTitle">ALL SETTINGS</h1>
                <h2 class="menuItem" onclick="">Current Player Name - <span class="bold">${currentPlayerName}</span></h2>
                <h2 class="menuItem" onclick="">Background Color - <span class="bold">${backGroundColor}</span></h2>
                <h2 class="menuItem" onclick="">Card Image Quality - <span class="bold">${imageQuality}</span></h2>
                <h2 class="menuItem" onclick="">Display Type Back Face - <span class="bold">${backOfCardType}</span></h2>
                <h2 class="menuItem" onclick="">Total Rounds - <span class="bold">${gameRounds}</span></h2>
                `;




    gameArea.appendChild(settingsMenu);
    settingsMenuOn = true;
}

function removeSettingsMenu() {
    document.getElementById("settingsMenu").classList.remove("menuDrop");
    document.getElementById("settingsMenu").classList.add("menuBurn");
    setTimeout(() => {
        document.getElementById("settingsMenu").remove();
    }, 1000);
    settingsMenuOn = false;
}


//display the main menu

function displayMenu() {
    if (menuOn) {
        removeMenu();
        return;
    }

    if (settingsMenuOn) {
        removeSettingsMenu();
        setTimeout(() => {
            displayMenu();
        }, 1000);
        return;
    }


    let gameArea = document.getElementById("gameArea");
    let mainM = document.createElement('div');
    mainM.id = "mainMenu";
    mainM.classList.add("menuDrop");
    mainM.classList.add("mainMenu");

    if (gameActive) {
        mainM.innerHTML = `
                <h1 class="menuTitle">GAME IN PROGRESS</h1>
                <h2 class="menuItem" onclick="endGame()">END GAME</h2>
                <h2 class="menuItem" onclick="displayMenu()">CONTINUE GAME</h2>
                `;
    } else {
        mainM.innerHTML = `
                <h1 class="menuTitle">SELECT A THEME</h1>
                <h2 id="spookyMenuItem" class="menuItem" onclick="gameStart('spooky','orange',deckSize)">SPOOKY</h2>
                <h2 id="spaceMenuItem" class="menuItem" onclick="gameStart('space','black',deckSize)">SPACE</h2>
                <h2 id="historyMenuItem" class="menuItem" onclick="gameStart('history','brown',deckSize)">HISTORY</h2>
                <h2 id="natureMenuItem" class="menuItem" onclick="gameStart('nature','green',deckSize)">NATURE</h2>
                <h2 id="seaMenuItem" class="menuItem" onclick="gameStart('sea','blue',deckSize)">SEA</h2>
                <h2 id="scienceMenuItem" class="menuItem" onclick="gameStart('science','red',deckSize)">SCIENCE</h2>
                <h2 id="emmaMenuItem" class="menuItem" onclick="gameStart('emma','purple',deckSize)">EMMA</h2>
                <h2 id="mixedMenuItem" class="menuItem" onclick="gameStart('all','all','16')">MIXED COLOURS</h2>
                <h2 id="monoMenuItem" class="menuItem" onclick="gameStart('all','white','16')">MONO CARDS</h2>`;
    }



    gameArea.appendChild(mainM);
    if (musicOn == 'true') {
        playAudio('menuMusic', 'music')
    };
    menuOn = true;
}

function removeMenu() {
    document.getElementById("mainMenu").classList.remove("menuDrop");
    document.getElementById("mainMenu").classList.add("menuBurn");
    setTimeout(() => {
        document.getElementById("mainMenu").remove();
    }, 1000);
    menuOn = false;
}

function displayRound() {

    //Display current round
    let roundDisplay = document.createElement('h1');
    let roundDisplayContainer = document.createElement('div');
    roundDisplayContainer.id = 'roundDisplayContainer';
    roundDisplayContainer.style.zIndex = '9';
    let tempTheme = cardTheme.toUpperCase();
    if (cardTheme == 'all' && cardColor == 'all') {
        tempTheme = 'MIXED';
    }
    if (cardTheme == 'all' && cardColor == 'white') {
        tempTheme = 'MONO';
    }
    console.log(cardTheme);
    console.log(tempTheme);
    roundDisplay.innerText = tempTheme + ' - ROUND ' + currentRound + "\\" + gameRounds;
    roundDisplay.id = 'roundDisplay';
    roundDisplay.classList = 'fadeIn';

    document.querySelector('body').appendChild(roundDisplayContainer);
    document.getElementById('roundDisplayContainer').appendChild(roundDisplay);
}

function scatterWinSmiles(count) {

    let randWidth;
    let top;
    let left;
    for (let i = 0; i < count; i++) {

        //choosing random widths based on screen res
        if (window.innerWidth > 600) {
            randWidth = randomNumber(4, 11);
        } else {
            randWidth = randomNumber(10, 20);
        }



        const body = document.querySelector('body');

        left = randomNumber(0, (100 - randWidth)) + "vw";
        top = randomNumber(10, (90 - randWidth)) + "vh";
        let delay = randomNumber(0, 2000); //generate a delay for the animation and (possible) audio trigger
        //create html elements

        const smile = document.createElement('img');
        //set the related images
        smile.src = "./assets/images/win_smile.webp";
        smile.style.position = "absolute";
        smile.style.animationDelay = delay + "ms";
        smile.style.top = top;
        smile.style.left = left;

        smile.style.width = randWidth + "vw";
        smile.style.height = "auto";
        smile.style.zIndex = 2000;
        smile.classList = "winSmile dropIn";
        body.appendChild(smile);
    }
}


//function to test filling the screen with cards in radom positions with various sizes
//take gameDeck as input
function scatterCards() {

    let randWidth;
    let top;
    let left;

    let cardsToScatter = buildCardObjectArray('low', backOfCardType)


    for (let i = 0; i < cardsToScatter.length; i++) {

        //select a radom cane from the deck
        randSelect = Math.floor(Math.random() * cardsToScatter.length); //pick a random card form the deck
        //Generate a random width/size of card
        randWidth = randomNumber(5, 8); // setting cards to be a random % size


        const gameArea = document.getElementById('gameArea');

        left = randomNumber(0, (100 - randWidth)) + "vw";
        top = randomNumber(0, (98 - (randWidth * 1.23))) + "vh"; // messed this for ages but still have cards spilling over the bottom of the screen
        let delay = randomNumber(0, 500); //generate a delay for the animation and (possible) audio trigger
        //create html elements
        const cardContainer = document.createElement('div');
        const cardFace = document.createElement('img');
        const cardBack = document.createElement('img');
        //set the related images
        cardFace.src = cardsToScatter[i].faceImgSrc;
        cardBack.src = "./assets/images/memoria_logo2.webp"; // cardsToScatter[i].backImgSrc;
        cardContainer.dataset.cardName = cardsToScatter[i].name;
        cardContainer.dataset.cardColor = cardsToScatter[i].color;
        cardContainer.dataset.cardTheme = cardsToScatter[i].category;
        cardContainer.style.position = "absolute";
        cardContainer.style.animationDelay = delay + "ms";
        cardContainer.style.top = top;
        cardContainer.style.left = left;

        cardContainer.style.width = randWidth + "vw";
        cardContainer.style.height = (randWidth * 1.23) + "vw";
        cardContainer.style.zIndex = 2000 + cardId;
        ++cardId;
        cardContainer.id = cardId;
        cardContainer.classList = "dropIn cardContainer";
        cardBack.classList = "cardBack";
        cardFace.classList = "cardFace";

        //need to optimize and find a solution here if time allows.
        //the card deal animation needs an animation-fill-mode of both but then the flip animation needs forwards
        //this technique works for now where we trigger a delayed function to switch out style classes
        // setTimeout(fCard, (delay + 1000));

        // function fCard() {
        //     cardContainer.classList.remove("dropIn");
        //     cardContainer.classList.add("cardFlipped");
        // }

        gameArea.appendChild(cardContainer);
        cardContainer.appendChild(cardBack);
        cardContainer.appendChild(cardFace);
        cardContainer.classList = "dropIn cardContainer";
    }
    // playAudio('deal_cards');
}

//function to build deck of cards in an array of objects
//This function builds an object array. It takes an input which dictates what path to take for the image
//There will be 3 quality levels - low (mobile) - Medium (default) - High (max original res and lossless)
//backOfCardType input is a user setting that controls if the cards have the games name on them
//file paths are relative and from the perspective of elements added to index.html
//store image sizes for later use during screen positioning
/**
 * 
 * @param {*} imageQuality 
 * @param {*} backOfCardType 
 * @returns 
 */
function buildCardObjectArray(imageQuality, backOfCardType) {

    let pathSet;
    let orgImgHeight;
    let orgImgWidth;

    if (imageQuality == "low") {
        //set image to low path
        pathSet = "./assets/images/cards_low_res_compressed/";
        orgImgHeight = 95;
        orgImgWidth = 77;
    } else if (imageQuality == "medium") {
        //set image to medium path
        pathSet = "./assets/images/cards_medium_res_compressed/";
        orgImgHeight = 479;
        orgImgWidth = 387;
    } else if (imageQuality == "high") {
        //set image to high path
        pathSet = "./assets/images/cards_full_res_lossless/";
        orgImgHeight = 1916;
        orgImgWidth = 1549;
    } else {
        //catch if function was called with invalid input
        console.log("function buildCardObjectArray() Error Invalid imageQuality - " + imageQuality + " - Exiting")
        return;
    }

    //this section is based on a user setting
    //Allows for back of card to display without game name

    let backFaceNaming;

    if (backOfCardType == "named") {
        backFaceNaming = "_named";
    } else if (backOfCardType == "unnamed") {
        backFaceNaming = "";
    } else {
        //catch if an invalid input was given, log warning to console and exit function
        console.log("function buildCardObjectArray() Invalid backOfCardType - " +
            backOfCardType + " - . Exiting.")
        return;
    }

    //main card array

    let cardObjectArray = [{
            name: "astronaut",
            faceImgSrc: pathSet + "black_astronaut.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "flying_saucer",
            faceImgSrc: pathSet + "black_flying_saucer.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "moon",
            faceImgSrc: pathSet + "black_moon.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "rocket",
            faceImgSrc: pathSet + "black_rocket.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "satellite",
            faceImgSrc: pathSet + "black_satellite.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "solar_system",
            faceImgSrc: pathSet + "black_solar_system.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "stars",
            faceImgSrc: pathSet + "black_stars.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "telescope",
            faceImgSrc: pathSet + "black_telescope.webp",
            backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "black"
        },
        {
            name: "astronaut",
            faceImgSrc: pathSet + "white_astronaut.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "flying_saucer",
            faceImgSrc: pathSet + "white_flying_saucer.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "moon",
            faceImgSrc: pathSet + "white_moon.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "rocket",
            faceImgSrc: pathSet + "white_rocket.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "satellite",
            faceImgSrc: pathSet + "white_satellite.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "solar_system",
            faceImgSrc: pathSet + "white_solar_system.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "stars",
            faceImgSrc: pathSet + "white_stars.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "telescope",
            faceImgSrc: pathSet + "white_telescope.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "space",
            color: "white"
        },
        {
            name: "anchor",
            faceImgSrc: pathSet + "blue_anchor.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "crab",
            faceImgSrc: pathSet + "blue_crab.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "dolphin",
            faceImgSrc: pathSet + "blue_dolphin.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "fish",
            faceImgSrc: pathSet + "blue_fish.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "octopus",
            faceImgSrc: pathSet + "blue_octopus.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "seahorse",
            faceImgSrc: pathSet + "blue_seahorse.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "shell",
            faceImgSrc: pathSet + "blue_shell.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "whale",
            faceImgSrc: pathSet + "blue_whale.webp",
            backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "blue"
        },
        {
            name: "anchor",
            faceImgSrc: pathSet + "white_anchor.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "crab",
            faceImgSrc: pathSet + "white_crab.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "dolphin",
            faceImgSrc: pathSet + "white_dolphin.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "fish",
            faceImgSrc: pathSet + "white_fish.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "octopus",
            faceImgSrc: pathSet + "white_octopus.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "seahorse",
            faceImgSrc: pathSet + "white_seahorse.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "shell",
            faceImgSrc: pathSet + "white_shell.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "whale",
            faceImgSrc: pathSet + "white_whale.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "sea",
            color: "white"
        },
        {
            name: "castle",
            faceImgSrc: pathSet + "brown_castle.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "hieroglyph",
            faceImgSrc: pathSet + "brown_hieroglyph.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "key",
            faceImgSrc: pathSet + "brown_key.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "pantheon",
            faceImgSrc: pathSet + "brown_pantheon.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "pyramid",
            faceImgSrc: pathSet + "brown_pyramid.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "quill",
            faceImgSrc: pathSet + "brown_quill.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "scroll",
            faceImgSrc: pathSet + "brown_scroll.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "sword",
            faceImgSrc: pathSet + "brown_sword.webp",
            backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "brown"
        },
        {
            name: "castle",
            faceImgSrc: pathSet + "white_castle.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "hieroglyph",
            faceImgSrc: pathSet + "white_hieroglyph.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "key",
            faceImgSrc: pathSet + "white_key.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "pantheon",
            faceImgSrc: pathSet + "white_pantheon.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "pyramid",
            faceImgSrc: pathSet + "white_pyramid.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "quill",
            faceImgSrc: pathSet + "white_quill.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "scroll",
            faceImgSrc: pathSet + "white_scroll.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "sword",
            faceImgSrc: pathSet + "white_sword.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "history",
            color: "white"
        },
        {
            name: "ant",
            faceImgSrc: pathSet + "green_ant.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "chameleon",
            faceImgSrc: pathSet + "green_chameleon.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "elephant",
            faceImgSrc: pathSet + "green_elephant.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "monkey",
            faceImgSrc: pathSet + "green_monkey.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "rabbit",
            faceImgSrc: pathSet + "green_rabbit.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "sloth",
            faceImgSrc: pathSet + "green_sloth.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "tiger",
            faceImgSrc: pathSet + "green_tiger.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "tree",
            faceImgSrc: pathSet + "green_tree.webp",
            backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "green"
        },
        {
            name: "ant",
            faceImgSrc: pathSet + "white_ant.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "chameleon",
            faceImgSrc: pathSet + "white_chameleon.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "elephant",
            faceImgSrc: pathSet + "white_elephant.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "monkey",
            faceImgSrc: pathSet + "white_monkey.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "rabbit",
            faceImgSrc: pathSet + "white_rabbit.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "sloth",
            faceImgSrc: pathSet + "white_sloth.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "tiger",
            faceImgSrc: pathSet + "white_tiger.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "tree",
            faceImgSrc: pathSet + "white_tree.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "nature",
            color: "white"
        },
        {
            name: "cauldron",
            faceImgSrc: pathSet + "orange_cauldron.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "ghost",
            faceImgSrc: pathSet + "orange_ghost.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "monster",
            faceImgSrc: pathSet + "orange_monster.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "pumpkin",
            faceImgSrc: pathSet + "orange_pumpkin.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "spider_web",
            faceImgSrc: pathSet + "orange_spider_web.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "spooky_house",
            faceImgSrc: pathSet + "orange_spooky_house.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "tree_old",
            faceImgSrc: pathSet + "orange_tree_old.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "witch_hat",
            faceImgSrc: pathSet + "orange_witch_hat.webp",
            backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "orange"
        },
        {
            name: "cauldron",
            faceImgSrc: pathSet + "white_cauldron.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "ghost",
            faceImgSrc: pathSet + "white_ghost.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "monster",
            faceImgSrc: pathSet + "white_monster.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "pumpkin",
            faceImgSrc: pathSet + "white_pumpkin.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "spider_web",
            faceImgSrc: pathSet + "white_spider_web.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "spooky_house",
            faceImgSrc: pathSet + "white_spooky_house.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "tree_old",
            faceImgSrc: pathSet + "white_tree_old.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "witch_hat",
            faceImgSrc: pathSet + "white_witch_hat.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "spooky",
            color: "white"
        },
        {
            name: "bee",
            faceImgSrc: pathSet + "purple_bee.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "bread",
            faceImgSrc: pathSet + "purple_bread.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "cheese",
            faceImgSrc: pathSet + "purple_cheese.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "child_baloon",
            faceImgSrc: pathSet + "purple_child_baloon.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "desk",
            faceImgSrc: pathSet + "purple_desk.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "glasses",
            faceImgSrc: pathSet + "purple_glasses.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "lady_baby",
            faceImgSrc: pathSet + "purple_lady_baby.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "rose",
            faceImgSrc: pathSet + "purple_rose.webp",
            backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "purple"
        },
        {
            name: "bee",
            faceImgSrc: pathSet + "white_bee.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "bread",
            faceImgSrc: pathSet + "white_bread.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "cheese",
            faceImgSrc: pathSet + "white_cheese.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "child_baloon",
            faceImgSrc: pathSet + "white_child_baloon.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "desk",
            faceImgSrc: pathSet + "white_desk.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "glasses",
            faceImgSrc: pathSet + "white_glasses.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "lady_baby",
            faceImgSrc: pathSet + "white_lady_baby.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "rose",
            faceImgSrc: pathSet + "white_rose.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "emma",
            color: "white"
        },
        {
            name: "atom",
            faceImgSrc: pathSet + "red_atom.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "binary",
            faceImgSrc: pathSet + "red_binary.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "dna",
            faceImgSrc: pathSet + "red_dna.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "flask",
            faceImgSrc: pathSet + "red_flask.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "magnet",
            faceImgSrc: pathSet + "red_magnet.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "microscope",
            faceImgSrc: pathSet + "red_microscope.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "neuron",
            faceImgSrc: pathSet + "red_neuron.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "newton_cradle",
            faceImgSrc: pathSet + "red_newton_cradle.webp",
            backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "red"
        },
        {
            name: "atom",
            faceImgSrc: pathSet + "white_atom.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        },
        {
            name: "binary",
            faceImgSrc: pathSet + "white_binary.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        },
        {
            name: "dna",
            faceImgSrc: pathSet + "white_dna.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        },
        {
            name: "flask",
            faceImgSrc: pathSet + "white_flask.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        },
        {
            name: "magnet",
            faceImgSrc: pathSet + "white_magnet.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        },
        {
            name: "microscope",
            faceImgSrc: pathSet + "white_microscope.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        },
        {
            name: "neuron",
            faceImgSrc: pathSet + "white_neuron.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        },
        {
            name: "newton_cradle",
            faceImgSrc: pathSet + "white_newton_cradle.webp",
            backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
            imgHeight: orgImgHeight,
            imgWidth: orgImgWidth,
            category: "science",
            color: "white"
        }
    ];

    return cardObjectArray;
}

function setupAudio() {

    let body = document.querySelector('body');

    let menuMusic = document.createElement('audio');
    menuMusic.src = "./assets/audio/testMenuMusic.mp3";
    menuMusic.id = 'menuMusic'
    menuMusic.dataset.audioType = 'music';
    body.appendChild(menuMusic);

}


function fadeOutAudio(elementId) {

    //grab passed element and then loop through reducing volume by 10% every 100ms
    let sound = document.getElementById(elementId);

    let volume = 100;
    let fadeDown = setInterval(() => {

        volume -= 1;
        sound.volume = (volume / 100);
        console.log("Setting volume to " + volume);

    }, 30);

    setTimeout(() => {
        clearInterval(fadeDown);
    }, 3000);

}


//Function to play audio
//creates an audio element and sets it playing
function playAudio(audioName, audioType) {

    if (audioType == 'music') {
        sound = document.getElementById(audioName);
        sound.volume = 1;
        sound.play();
        sound.loop = true;
    } else if (audioType == 'effect' && effectsOn == 'true') {

        let body = document.querySelector('body');
        let audioEffect = document.createElement('audio');
        audioEffect.src = "./assets/audio/card1.mp3";
        audioEffect.classList = 'audioEffect';
        audioEffect.dataset.audioType = 'effect';
        body.appendChild(audioEffect);
        audioEffect.play();

    }


}

//this function fade/burns the card by applying css to fade them out
//after 15 seconds we then call a function to remove the html elements to clean code and improve performance
//things quickly got complicated when trying to control animations

function burnCards() {

    if (menuOn) {
        removeMenu();
    };
    //reset vars
    totalSelectedCards = 0;
    playerSelectedCards = [];

    const cardsToBurn = document.getElementsByClassName('cardContainer');
    const smilesToBurn = document.getElementsByClassName('winSmile');
    const backFaces = document.getElementsByClassName('cardBack');
    const frontFaces = document.getElementsByClassName('cardFace');
    const totalToDel = backFaces.length;

    for (let i = 0; i < totalToDel; i++) {
        frontFaces[0].classList.add("cardFaceDel");
        frontFaces[0].classList.remove("cardFace");
        backFaces[0].remove();
    }

    //burn the round counter elements
    if (document.getElementById('roundDisplayContainer')) {
        document.getElementById('roundDisplayContainer').classList.add('burnUp');
    }

    for (let card of cardsToBurn) {
        // console.log("Adding burnUp class to card - " + card.id);
        card.style.animationDelay = '0ms';
        card.style.animationDuration = '2000ms';
        card.classList.add('burnUp');
    }
    for (let smile of smilesToBurn) {
        // console.log("Adding burnUp class to card - " + card.id);
        smile.style.animationDelay = '0ms';
        smile.style.animationDuration = '2000ms';
        smile.classList.add('burnUp');
    }


    setTimeout(delCards, 2000);
    // playAudio('burn_cards');
}

// This function removes elements from the DOM with a certain class.
// Initially used 'for of' loop but this was resulting in only half the elements being removed
// The reason was, as we delete an element, that reduces the array and index
// I took the approach of setting a constant with the initial array length and then using that to loop
// Each time we then remove the element at index 0

function delCards() {

    const cardsToDel = document.getElementsByClassName('burnUp');
    const audioToDel = document.getElementsByClassName('audioEffect');

    const totalElements = cardsToDel.length;

    console.log("delCards() removing a total of " + totalElements);
    for (let i = 0; i < totalElements; i++) {
        console.log("Removing - " + i + " " + cardsToDel[0].id);
        cardsToDel[0].remove();
    }

    const totalAudioElements = audioToDel.length;

    for (let i = 0; i < totalAudioElements; i++) {
        audioToDel[0].remove();
    }

}

//build players deck and lay them out on the screen

function dealPlayerCards(gameDeck) {

    if (!gameActive) {
        return;
    };

    if (!gameDeck) {
        console.log("You didn't pass me cards to deal");
        return;
    }

    const gameArea = document.getElementById('gameArea');
    let delay; //used for timing and blocking

    const playerCardsArea = document.getElementById('playerCardsArea');

    for (let i = 0; i < gameDeck.length; i++) {



        //work out placement of cards based on how many are being dealt
        //create html elements

        const cardContainer = document.createElement('div');
        const cardFace = document.createElement('img');
        const cardBack = document.createElement('img');
        //set the related images
        cardFace.src = gameDeck[i].faceImgSrc;
        cardBack.src = gameDeck[i].backImgSrc;
        cardContainer.dataset.cardName = gameDeck[i].name;
        cardContainer.dataset.cardColor = gameDeck[i].color;
        cardContainer.dataset.cardTheme = gameDeck[i].category;
        delay = 500 + (i * 250);
        cardContainer.style.animationDelay = delay + "ms"; //stagger animation for dropping in the cards

        cardBack.classList = "cardBack";
        cardFace.classList = "cardFace";
        cardContainer.addEventListener("click", selectCard);
        setTimeout(() => {
            playAudio('', 'effect');
        }, delay);


        //need to optimize and find a solution here if time allows.
        //the card deal animation needs an animation-fill-mode of both but then the flip animation needs forwards
        //this technique works for now where we trigger a delayed function to switch out style classes
        setTimeout(fCard, (delay + 1000));

        function fCard() {
            if (!gameActive) {
                return;
            }
            cardContainer.classList.remove("dropIn");
            cardContainer.classList.add("cardFlipped");

        }

        playerCardsArea.appendChild(cardContainer);
        cardContainer.appendChild(cardBack);
        cardContainer.appendChild(cardFace);
        cardContainer.classList = "dropIn cardContainer";



    }

    //allow user to select card
    setTimeout(() => {

        allowClick = true;
    }, delay + delay + 2000);
}



/**
 * 
 * @param {*} cardThemeSelected 
 * @param {*} cardColorSelected 
 */
function gameStart(cardThemeSelected, cardColorSelected, deckSizeSelected) {

    if (menuOn) {
        removeMenu(); // get rid of main menu
    }


    cardTheme = cardThemeSelected;
    cardColor = cardColorSelected;
    deckSize = deckSizeSelected;
    console.log("starting game with deckSize " + deckSize);
    gameActive = true;
    allowClick = false; //no card selection till cards are on the table


    setTimeout(() => {
        displayRound();
    }, 500);


    //generate deck based on current theme
    let gameDeck = createGameDeck(cardTheme, cardColor, deckSize);
    selectCardsToMatch(gameDeck);
    dealCardsToMatch(gameDeck, cardsToMatch);

    setTimeout(() => {
        dealPlayerCards(gameDeck);
    }, playerCardsDealDelay);




}
// build a deck with the cards required for the theme of this game
function createGameDeck(cardTheme, cardColor, deckSize) {

    console.log("createGameDeck called and 'deckSize' = " + deckSize);
    console.log("createGameDeck called and 'theme' = " + cardTheme);
    console.log("createGameDeck called and 'color' = " + cardColor);
    let tempDeck = buildCardObjectArray(imageQuality, backOfCardType);

    let gameDeck = [];

    for (card of tempDeck) {
        if ((card.category == cardTheme && card.color == cardColor) || (card.category == cardTheme && cardColor == 'all') ||
            (cardTheme == 'all' && cardColor == 'all') || (cardTheme == 'all' && card.color == cardColor)) {
            gameDeck.push(card);
        }
    }

    shuffleDeck(gameDeck); //shuffle the cards up randomly

    //get rid of cards from the top of the stack will we are down to the requested gameDeck size
    while (gameDeck.length > deckSize) {
        gameDeck.pop();
    }


    console.log("here is the final deck - ");
    console.log(gameDeck);

    return gameDeck;
}

//function that allows player to select a card

function selectCard(e) {

    if (!allowClick) {
        return;
    }
    allowClick = false;

    let target = e.target.parentElement;
    let cardTag;
    console.log(target);
    console.log("selected card was a " + target.dataset['cardColor'] + " " + target.dataset['cardName']);
    let tempCard = {
        "name": target.dataset['cardName'],
        "color": target.dataset['cardColor']
    }
    playerSelectedCards.push(tempCard);

    //add a visual cue that the card is selected
    target.classList.add("cardSelected");

    console.log("Here is the current player selected cards")
    console.log(playerSelectedCards);

    if (playerSelectedCards[totalSelectedCards].name == cardsToMatch[totalSelectedCards].name &&
        playerSelectedCards[totalSelectedCards].color == cardsToMatch[totalSelectedCards].color) {
        console.log("Correct card selected")
        cardTag = "cTM" + (totalSelectedCards + 1);
        console.log(cardTag);
        ++totalSelectedCards;
        document.getElementById(cardTag).classList.add("cardFlipped");
        document.getElementById(cardTag).classList.remove("cardFlippedBack");
        setTimeout(() => {
            allowClick = true;
        }, 1000);

        if (totalSelectedCards == cardsToMatch.length) {
            console.log("Congrats you win this round");
            scatterWinSmiles(currentRound * 25);
            //wait 3 seconds and reset
            setTimeout(() => {
                burnCards();
                ++currentRound;
                allowClick = true;
                setTimeout(() => {
                    if (currentRound < gameRounds) {
                        gameStart(cardTheme, cardColor, deckSize);
                    } else {
                        console.log("you win this theme. well done !!")
                        //need logic to update high scores
                        gameActive = false;
                        currentRound = 1; // reset round back to 1
                        displayMenu();
                    }
                }, 3000);
            }, 5000);

        }

    } else {
        console.log("You failed!!!!")
        const cardsToFlip = document.getElementsByClassName("cardsToMatch");
        for (card of cardsToFlip) {
            card.classList.add("cardFlipped");
            card.classList.remove("cardFlippedBack");
        }

        //wait 3 seconds and reset
        setTimeout(() => {
            gameActive = false;
            currentRound = 1; // reset round back to 1
            burnCards();
            displayMenu()

        }, 3000);

    }
}

//function that selects cards for the player to match

function selectCardsToMatch(gameDeck) {

    totalCards = currentRound;
    console.log("This is round " + currentRound);
    let randSelect;
    cardsToMatch = []; // clear the array
    let tempGameDeck = [];
    for (let i = 0; i < gameDeck.length; i++) {
        tempGameDeck.push(gameDeck[i]);
    }

    console.log("Here is the tempGameDeck...");
    console.log(tempGameDeck);


    for (i = 0; i < totalCards; i++) {
        //need to make sure that the next random card hasn't be added already

        randSelect = (Math.floor(Math.random() * tempGameDeck.length)); //select a random card index


        let tempCard = {
            "name": tempGameDeck[randSelect].name,
            "color": tempGameDeck[randSelect].color,
            "trackId": tempGameDeck[randSelect].trackId
        }
        cardsToMatch.push(tempCard);
        tempGameDeck.splice(randSelect, 1); //remove the card we picked from the deck of available cards
        console.log(tempGameDeck);
    }

    console.log("You need to recall " + totalCards + " cards");
    console.log("Here are the card details...");
    console.log(cardsToMatch);
}

function dealCardsToMatch(gameDeck, cardsToMatch) {

    if (!gameDeck) {
        console.log("You didn't pass me cards to deal");
        return;
    }

    const gameArea = document.getElementById('gameArea');
    const cardsToMatchArea = document.getElementById('cardsToMatchArea');
    let delay; // used for timing

    for (let i = 0; i < cardsToMatch.length; i++) {


        for (let card of gameDeck) {


            if (card.name == cardsToMatch[i].name && card.color == cardsToMatch[i].color) {
                //thats the card we need to display
                console.log(card);


                //create html elements
                const cardContainer = document.createElement('div');
                const cardFace = document.createElement('img');
                const cardBack = document.createElement('img');
                //set the related images
                cardFace.src = card.faceImgSrc;
                cardBack.src = card.backImgSrc;
                cardContainer.id = "cTM" + (i + 1); //set a unique id so we can flip it when the player gets it right
                cardContainer.dataset.cardName = card.name;
                cardContainer.dataset.cardColor = card.color;
                cardContainer.dataset.cardTheme = card.category;
                delay = 500 + (i * 250);
                cardContainer.style.animationDelay = delay + "ms"; //stagger animation for dropping in the cards

                cardBack.classList = "cardBack";
                cardFace.classList = "cardFace";

                setTimeout(() => {
                    playAudio('', 'effect');
                }, delay);

                //need to optimize and find a solution here if time allows.
                //the card deal animation needs an animation-fill-mode of both but then the flip animation needs forwards
                //this technique works for now where we trigger a delayed function to switch out style classes
                setTimeout(fCard, (delay + 1000));

                function fCard() {
                    cardContainer.classList.remove("dropIn");
                    cardContainer.classList.add("cardFlipped");
                }
                setTimeout(fBCard, (delay + delay + 2000));

                function fBCard() {
                    cardContainer.classList.remove("cardFlipped");
                    cardContainer.classList.add("cardFlippedBack");
                }
                cardsToMatchArea.appendChild(cardContainer);
                cardContainer.appendChild(cardBack);
                cardContainer.appendChild(cardFace);
                cardContainer.classList = "dropIn cardContainer cardsToMatch";
            }

            playerCardsDealDelay = (delay * 3) + 2000 + 500; // trying to set the overall time delay needed to deal the players cards

        }


    }

}


//function to shuffle deck. Uses fisher yates algo

function shuffleDeck(gameDeck) {
    console.log(gameDeck);

    for (let i = gameDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = gameDeck[i];
        gameDeck[i] = gameDeck[j];
        gameDeck[j] = temp;
    }
    console.log(gameDeck);
    return gameDeck;
}


function endGame() {
    if (menuOn) {
        gameActive = false;
        removeMenu();
    };
    document.querySelector('body').classList.add('burnGameArea');


    setTimeout(() => {
        const cardsToDel = document.getElementsByClassName('cardContainer');
        const totalElements = cardsToDel.length;
        let loopCount = 0;
        for (let i = 0; i < totalElements; i++) {

            cardsToDel[0].remove();
            loopCount++;
        }

    }, 1000);

    setTimeout(() => {
        document.querySelector('body').classList.remove('burnGameArea');
        console.log("trying to unburn playaear");
        document.getElementById('roundDisplayContainer').remove();
        gameActive = false;
        currentRound = 1; // reset round back to 1
        displayMenu();
    }, 1100);
}