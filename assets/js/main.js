"strict mode";
// All the core code that delivers the Memoria game
// Every effort has been made to take a unique approach


//global variables

let cardId = 0; //keep track of how many cards have been created in this session
let audioCounter = 0; //global variable to track audio clips generated and create unique IDs
let imageQuality = 'medium'; //image file size & quality
let backOfCardType = 'named'; //show name on back of cards - use 'named' or 'unnamed'
let gameRounds = 8; //how many rounds to play in total
let currentRound = 8 // always start with round 1
let deckSize = 8; //control how big the player deck is
let cardTheme = ''; // controls what set of cards will be in the deck - 'all' adds all themes
let cardColor = ''; // controls what color cards are included - 'all' adds all colors
let playerSelectedCards = []; // array that stores the cards the player has selected
let cardsToMatch = []; // array holds the cards the player has to remember
let totalSelectedCards = 0;
let playerCardsDealDelay = 0; // deal players cards dealign till all cards they have to remmeber are displayed
let menuOn = false; // Bool to track if menu is being displayed
let gameActive = false; // bool to track active game state
let portraitDisplay = false;
let allowClick = true; // bool to stop click spamming issues 
let selectLocked = false; //block selecting cards till current move finished.
let audioEffectsOn = false;
let audioMusicOn = false;


//TESTING FUNCTIONS

// console.log("Here is the full deck");
// gameDeck = buildCardObjectArray(imageQuality, backOfCardType);
// shuffleDeck(gameDeck);
// console.log("Here is a game deck just with spooky cards");
// console.log( createGameDeck(cardTheme,cardColor) );
localStorage.setItem("name", "Will");
console.log(localStorage.getItem("name"));
console.table(localStorage);


//LISTENERS

document.onload = displayMenu();

//show menu if escape is pressed and remove it if escape is pressed again
document.addEventListener("keydown", function (e) {
    if (e.key == "Escape" && menuOn) {
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

//display the main menu

function displayMenu() {
    if (menuOn) {
        return;
    };

    let gameArea = document.getElementById("gameArea");
    mainM = document.createElement('div');
    mainM.id = "mainMenu";
    mainM.classList.add("menuDrop");

    if (gameActive) {
        mainM.innerHTML = `<section class="innerMenu">
                <h2 class="menuItem" onclick="endGame()">End Game</h2>
                </section>`;
    } else {
        mainM.innerHTML = `<section class="innerMenu">
                <h2 class="menuItem" onclick="scatterCards(createGameDeck('all','all','128'))">Scatter Full Card Deck</h2>
                <h2 class="menuItem" onclick="scatterCards(createGameDeck('all','white','56'))">Scatter White Card Deck</h2>
                <h2 class="menuItem" onclick="burnCards()">Burn All Cards</h2>
                <h2 class="menuItem" onclick="gameStart('spooky','orange',deckSize)">Spooky Game</h2>
                <h2 class="menuItem" onclick="gameStart('space','black',deckSize)">Space Game</h2>
                <h2 class="menuItem" onclick="gameStart('history','brown',deckSize)">History Game</h2>
                <h2 class="menuItem" onclick="gameStart('nature','green',deckSize)">Nature Game</h2>
                <h2 class="menuItem" onclick="gameStart('sea','blue',deckSize)">Sea Game</h2>
                <h2 class="menuItem" onclick="gameStart('science','red',deckSize)">Science Game</h2>
                <h2 class="menuItem" onclick="gameStart('emma','purple',deckSize)">Emma Game</h2>
                <h2 class="menuItem" onclick="gameStart('all','all','16')">Mixed Game</h2>
        </section>`;
    }



    gameArea.appendChild(mainM);
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



//function to test filling the screen with cards in radom positions with various sizes
//take gameDeck as input
function scatterCards(gameDeck) {

    let randWidth;
    let top;
    let left;

    for (let i = 0; i < gameDeck.length; i++) {

        //select a radom cane from the deck
        randSelect = Math.floor(Math.random() * gameDeck.length); //pick a random card form the deck
        //Generate a random width/size of card
        randWidth = randomNumber(5, 8); // setting cards to be a random % size


        const gameArea = document.getElementById('gameArea');

        left = randomNumber(0, (100 - randWidth)) + "vw";
        top = randomNumber(0, (98 - (randWidth * 1.23))) + "vh"; // messed this for ages but still have cards spilling over the bottom of the screen
        let delay = randomNumber(0, 2000); //generate a delay for the animation and (possible) audio trigger
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
        cardContainer.style.position = "absolute";
        cardContainer.style.animationDelay = delay + "ms";
        cardContainer.style.top = top;
        cardContainer.style.left = left;

        cardContainer.style.width = randWidth + "vw";
        cardContainer.style.height = (randWidth * 1.23) + "vw";
        cardContainer.style.zIndex = 10 + cardId;
        ++cardId;
        cardContainer.id = cardId;
        cardContainer.classList = "dropIn cardContainer";
        cardBack.classList = "cardBack";
        cardFace.classList = "cardFace";

        //need to optimize and find a solution here if time allows.
        //the card deal animation needs an animation-fill-mode of both but then the flip animation needs forwards
        //this technique works for now where we trigger a delayed function to switch out style classes
        setTimeout(fCard, (delay + 1000));

        function fCard() {
            cardContainer.classList.remove("dropIn");
            cardContainer.classList.add("cardFlipped");
        }

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


//Function to play audio
//creates an audio element and sets it playing
function playAudio(audioName, audioType) {

    let audioId = "audio" + audioCounter;
    ++audioCounter;
    let sound = document.createElement('audio');
    sound.src = `./assets/audio/${audioName}.mp3`;
    sound.id = audioId;
    sound.dataset.audioType = "effect";
    document.querySelector('body').appendChild(sound);
    //Need to add logic to loop or single play 
    document.getElementById(audioId).play();
}

//this function fade/burns the card by applying css to fade them out
//after 15 seconds we then call a function to remove the html elements to clean code and improve performance
//things quickly got complicated when trying to control animations

function burnCards() {

    //reset vars
    totalSelectedCards = 0;
    playerSelectedCards = [];

    const cardsToBurn = document.getElementsByClassName('cardContainer');
    const backFaces = document.getElementsByClassName('cardBack');
    const frontFaces = document.getElementsByClassName('cardFace');
    const totalToDel = backFaces.length;

    for (let i = 0; i < totalToDel; i++) {
        frontFaces[0].classList.add("cardFaceDel");
        frontFaces[0].classList.remove("cardFace");
        backFaces[0].remove();
    }

    for (let card of cardsToBurn) {
        // console.log("Adding burnUp class to card - " + card.id);
        // card.style.animationDelay = '0ms';
        card.classList.add('burnUp');

    }
    setTimeout(delCards, 15000);
    // playAudio('burn_cards');
}

// This function removes elements from the DOM with a certain class.
// Initially used 'for of' loop but this was resulting in only half the elements being removed
// The reason was, as we delete an element, that reduces the array and index
// I took the approach of setting a constant with the initial array length and then using that to loop
// Each time we then remove the element at index 0

function delCards() {

    const cardsToDel = document.getElementsByClassName('burnUp');
    const totalElements = cardsToDel.length;
    let loopCount = 0;
    for (let i = 0; i < totalElements; i++) {

        cardsToDel[0].remove();
        loopCount++;
    }

}

//build players deck and lay them out on the screen

function dealPlayerCards(gameDeck) {

    if (!gameDeck) {
        console.log("You didn't pass me cards to deal");
        return;
    }

    const gameArea = document.getElementById('gameArea');
    let delay; //used for timing and blocking

    const playerCardsArea = document.createElement('div');
    playerCardsArea.id = 'playerCardsArea';
    gameArea.appendChild(playerCardsArea);

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

        

        //need to optimize and find a solution here if time allows.
        //the card deal animation needs an animation-fill-mode of both but then the flip animation needs forwards
        //this technique works for now where we trigger a delayed function to switch out style classes
        setTimeout(fCard, (delay + 1000));

        function fCard() {
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
function gameStart(cardThemeSelected, cardColorSelected) {

    if (menuOn) {
        removeMenu(); // get rid of main menu
    }
    if ( window.innerWidth < window.innerHeight) { portraitDisplay = true;}
    cardTheme = cardThemeSelected;
    cardColor = cardColorSelected;
    gameActive = true;
    allowClick = false; //no card selection till cards are on the table

    //Display current round
    let roundDisplay = document.createElement('h1');
    roundDisplay.innerText = 'Round ' + currentRound;
    roundDisplay.id = 'roundDisplay';
    document.getElementById('gameArea').appendChild(roundDisplay);



    //generate deck based on theme
    let gameDeck = createGameDeck(cardTheme, cardColor, deckSize);
    selectCardsToMatch(gameDeck, currentRound);
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
    console.log("creategameDeck resulted in array ...");
    console.log(gameDeck);
    console.log(cardTheme);
    console.log(cardColor);

    gameDeck = shuffleDeck(gameDeck);

    //if we sleect a mixed mode then this will reduce the deck down
    while (gameDeck.length > deckSize) {
        gameDeck.pop();
    }

    return gameDeck;
}

//function that allows player to select a card

function selectCard(e) {

    if(!allowClick){
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
        console.log("you picked the right card!!")
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
            scatterCards(createGameDeck('all', 'all', (currentRound * 10)))
            //wait 3 seconds and reset
            setTimeout(() => {
                burnCards();
                document.getElementById('roundDisplay').remove();
                ++currentRound;
                allowClick = true;
                setTimeout(() => {
                    if (currentRound < gameRounds) {
                        gameStart(cardTheme, cardColor);
                    } else {
                        console.log("you win this theme. well done !!")
                        currentRound = 1;
                        gameActive = false;
                        document.getElementById('roundDisplay').remove();
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
            gameActive = false;
            
        }

        //wait 3 seconds and reset
        setTimeout(() => {
            document.getElementById('roundDisplay').remove();
            burnCards();
            currentRound = 1; // reset round back to 1
            gameActive = false;
            displayMenu()

        }, 3000);

    }
}

//function that selects cards for the player to match

function selectCardsToMatch(gameDeck, gameRound) {

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
            "color": tempGameDeck[randSelect].color
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
    let delay; // used for timing

    const cardsToMatchArea = document.createElement('div');
    cardsToMatchArea.id = 'cardsToMatchArea';
    gameArea.appendChild(cardsToMatchArea);

    for (let i = 0; i < cardsToMatch.length; i++) {


        for (let card of gameDeck) {


            if (card.name == cardsToMatch[i].name && card.color == cardsToMatch[i].color) {
                //thats the card we need to display
                

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