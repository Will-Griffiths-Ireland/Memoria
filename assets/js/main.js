"strict mode";
// All the core code that delivers the Memoria game
// Every effort has been made to take a unique approach


//global game variables

let cardId = 0; //keep track of how many cards have been created in this session
let audioCounter  = 0; //global variable to track audio clips generated and create unique IDs
let imageQuality = 'medium'; //image file size & quality
let backFaceType = 'named'; //show name on back of cards


//TESTING FUNCTIONS

let deckTest = buildCardObjectArray(imageQuality, backFaceType);
console.log(deckTest);


//LISTENERS

//attach a listener to the body to capture right click and create a card there
document.querySelector('body').addEventListener("contextmenu", placeCard);

//BASIC UTILITY FUNCTIONS

//simple function to return a random number within a range
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//function to test filling the screen with cards
//take a cardCount as input

function scatterCards(cardCount){
    console.log("Trying to scatter " + cardCount + " cards");
    let windowX = window.innerWidth;
    let windowY = window.innerHeight;

    let newDeck = buildCardObjectArray('medium', 'named');
    let randSelect;
    let randWidth;
    
    for(let i = 0; i < cardCount; i++){

        //select a radom cane from the deck
        randSelect = Math.floor(Math.random() * newDeck.length); //pick a random card form the deck
        //Generate a random width/size of card
        randWidth = randomNumber((newDeck[randSelect].imgWidth / 6),(newDeck[randSelect].imgWidth / 3));


        let body = document.querySelector('body');
        let locX = Math.floor(Math.random() * (windowX - randWidth));
        locX = locX  + "px";
        let locY = Math.floor(Math.random() * (windowY - (randWidth * 1.23))); //offset y position based width with multiplier
        locY = locY + "px";
        console.log("Trying to create card at " + locX + " " + locY);
        let card = document.createElement('img');
        card.src = newDeck[randSelect].faceImgSrc;
        card.style.position = "fixed";
        let delay = randomNumber(1000,5000); //generate a delay for the animation and (possible) audio trigger
        card.style.animationDelay = delay + "ms"; 
        card.style.top = locY;
        card.style.left = locX;
        card.style.width = randWidth  + "px"; 
        card.style.zIndex = 10;
        ++cardId;
        card.id = cardId;
        card.classList = "dropIn cardHere";
        body.appendChild(card);
        // setTimeout(playAudio, delay); // this is an audio bomb so turning it off
    }
    playAudio('deal_cards');
}

//function that will place a card at the current mouse location
//random card from deck selected

function placeCard(e){
    e.preventDefault();
    //checking to see if user is clicking on existing card(img) and escape function
    // if(e.target.localName == "img"){
    //     console.log("Card already here");
    //     return;
    // }
    console.log(e);
    let body = document.querySelector('body');
    let newDeck = buildCardObjectArray('low', 'named');
    let randSelect = Math.floor(Math.random() * newDeck.length); 
    let locX = e.clientY - (newDeck[randSelect].imgHeight / 2 ); 
    locX = locX + "px";
    let locY = e.clientX - (newDeck[randSelect].imgWidth / 2 );
    locY = locY + "px";
    console.log("trying to create card at " + locX + " " + locY);
    let card = document.createElement('img');
    card.src = newDeck[randSelect].faceImgSrc;
    card.style.position = "absolute";
    card.style.top = locX;
    card.style.left = locY;
    card.style.width = newDeck[randSelect].imgWidth;
    card.style.zIndex = 50;
    card.classList = "dropIn cardHere"; 
    body.appendChild(card); // Attach the new card to the body
    playAudio();
    
}


//function to build deck of cards in an array of objects
//This function builds an object array. It takes an input which dictates what path to take for the image
//There will be 3 quality levels - low (mobile) - Medium (default) - High (max original res and lossless)
//backFaceType input is a user setting that controls if the cards have the games name on them
//file paths are relative and from the perspective of elements added to index.html
//store image sizes for later use during screen positioning
function buildCardObjectArray(imageQuality, backFaceType){
    
    let pathSet;
    let orgImgHeight;
    let orgImgWidth;

    if(imageQuality == "low"){
        //set image to low path
        pathSet = "./assets/images/cards_low_res_compressed/";
        orgImgHeight = 95;
        orgImgWidth = 77;
    }
    else if(imageQuality == "medium"){
        //set image to medium path
        pathSet = "./assets/images/cards_medium_res_compressed/";
        orgImgHeight = 479;
        orgImgWidth = 387;
    }
    else if(imageQuality == "high"){
        //set image to high path
        pathSet = "./assets/images/cards_full_res_lossless/";
        orgImgHeight = 1916;
        orgImgWidth = 1549;
    }
    else{
        //catch if function was called with invalid input
        console.log("function buildCardObjectArray() Error Invalid imageQuality - " + imageQuality + " - Exiting")
        return;
    }

    //this section is based on a user setting
    //Allows for back of card to display without game name

    let backFaceNaming;

    if(backFaceType == "named"){
        backFaceNaming = "_named";
    }
    else if(backFaceType == "unnamed"){
        backFaceNaming = "";
    }
    else{
        //catch if an invalid input was given, log warning to console and exit function
        console.log("function buildCardObjectArray() Invalid backFaceType - " 
        + backFaceType + " - . Exiting.")
        return;
    }

    //main card array
    //when I know more
    
    let cardObjectArray = [
    {name: "astronaut",
    faceImgSrc: pathSet + "black_astronaut.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "flying_saucer",
    faceImgSrc: pathSet + "black_flying_saucer.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "moon",
    faceImgSrc: pathSet + "black_moon.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "rocket",
    faceImgSrc: pathSet + "black_rocket.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "satellite",
    faceImgSrc: pathSet + "black_satellite.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "solar_system",
    faceImgSrc: pathSet + "black_solar_system.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "stars",
    faceImgSrc: pathSet + "black_stars.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "telescope",
    faceImgSrc: pathSet + "black_telescope.webp",
    backImgSrc: pathSet + "black_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "black"},
    {name: "astronaut",
    faceImgSrc: pathSet + "white_astronaut.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "flying_saucer",
    faceImgSrc: pathSet + "white_flying_saucer.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "moon",
    faceImgSrc: pathSet + "white_moon.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "rocket",
    faceImgSrc: pathSet + "white_rocket.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "satellite",
    faceImgSrc: pathSet + "white_satellite.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "solar_system",
    faceImgSrc: pathSet + "white_solar_system.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "stars",
    faceImgSrc: pathSet + "white_stars.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "telescope",
    faceImgSrc: pathSet + "white_telescope.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "space",
    color: "white"},
    {name: "anchor",
    faceImgSrc: pathSet + "blue_anchor.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "crab",
    faceImgSrc: pathSet + "blue_crab.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "dolphin",
    faceImgSrc: pathSet + "blue_dolphin.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "fish",
    faceImgSrc: pathSet + "blue_fish.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "octopus",
    faceImgSrc: pathSet + "blue_octopus.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "seahorse",
    faceImgSrc: pathSet + "blue_seahorse.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "shell",
    faceImgSrc: pathSet + "blue_shell.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "whale",
    faceImgSrc: pathSet + "blue_whale.webp",
    backImgSrc: pathSet + "blue_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "blue"},
    {name: "anchor",
    faceImgSrc: pathSet + "white_anchor.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "crab",
    faceImgSrc: pathSet + "white_crab.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "dolphin",
    faceImgSrc: pathSet + "white_dolphin.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "fish",
    faceImgSrc: pathSet + "white_fish.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "octopus",
    faceImgSrc: pathSet + "white_octopus.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "seahorse",
    faceImgSrc: pathSet + "white_seahorse.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "shell",
    faceImgSrc: pathSet + "white_shell.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "whale",
    faceImgSrc: pathSet + "white_whale.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "sea",
    color: "white"},
    {name: "castle",
    faceImgSrc: pathSet + "brown_castle.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "hieroglyph",
    faceImgSrc: pathSet + "brown_hieroglyph.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "key",
    faceImgSrc: pathSet + "brown_key.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "pantheon",
    faceImgSrc: pathSet + "brown_pantheon.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "pyramid",
    faceImgSrc: pathSet + "brown_pyramid.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "quill",
    faceImgSrc: pathSet + "brown_quill.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "scroll",
    faceImgSrc: pathSet + "brown_scroll.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "sword",
    faceImgSrc: pathSet + "brown_sword.webp",
    backImgSrc: pathSet + "brown_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "brown"},
    {name: "castle",
    faceImgSrc: pathSet + "white_castle.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "hieroglyph",
    faceImgSrc: pathSet + "white_hieroglyph.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "key",
    faceImgSrc: pathSet + "white_key.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "pantheon",
    faceImgSrc: pathSet + "white_pantheon.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "pyramid",
    faceImgSrc: pathSet + "white_pyramid.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "quill",
    faceImgSrc: pathSet + "white_quill.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "scroll",
    faceImgSrc: pathSet + "white_scroll.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "sword",
    faceImgSrc: pathSet + "white_sword.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "history",
    color: "white"},
    {name: "ant",
    faceImgSrc: pathSet + "green_ant.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "chameleon",
    faceImgSrc: pathSet + "green_chameleon.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "elephant",
    faceImgSrc: pathSet + "green_elephant.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "monkey",
    faceImgSrc: pathSet + "green_monkey.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "rabbit",
    faceImgSrc: pathSet + "green_rabbit.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "sloth",
    faceImgSrc: pathSet + "green_sloth.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "tiger",
    faceImgSrc: pathSet + "green_tiger.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "tree",
    faceImgSrc: pathSet + "green_tree.webp",
    backImgSrc: pathSet + "green_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "green"},
    {name: "ant",
    faceImgSrc: pathSet + "white_ant.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "chameleon",
    faceImgSrc: pathSet + "white_chameleon.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "elephant",
    faceImgSrc: pathSet + "white_elephant.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "monkey",
    faceImgSrc: pathSet + "white_monkey.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "rabbit",
    faceImgSrc: pathSet + "white_rabbit.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "sloth",
    faceImgSrc: pathSet + "white_sloth.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "tiger",
    faceImgSrc: pathSet + "white_tiger.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "tree",
    faceImgSrc: pathSet + "white_tree.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "nature",
    color: "white"},
    {name: "cauldron",
    faceImgSrc: pathSet + "orange_cauldron.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "ghost",
    faceImgSrc: pathSet + "orange_ghost.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "monster",
    faceImgSrc: pathSet + "orange_monster.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "pumpkin",
    faceImgSrc: pathSet + "orange_pumpkin.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "spider_web",
    faceImgSrc: pathSet + "orange_spider_web.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "spooky_house",
    faceImgSrc: pathSet + "orange_spooky_house.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "tree_old",
    faceImgSrc: pathSet + "orange_tree_old.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "witch_hat",
    faceImgSrc: pathSet + "orange_witch_hat.webp",
    backImgSrc: pathSet + "orange_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "orange"},
    {name: "cauldron",
    faceImgSrc: pathSet + "white_cauldron.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "ghost",
    faceImgSrc: pathSet + "white_ghost.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "monster",
    faceImgSrc: pathSet + "white_monster.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "pumpkin",
    faceImgSrc: pathSet + "white_pumpkin.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "spider_web",
    faceImgSrc: pathSet + "white_spider_web.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "spooky_house",
    faceImgSrc: pathSet + "white_spooky_house.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "tree_old",
    faceImgSrc: pathSet + "white_tree_old.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "witch_hat",
    faceImgSrc: pathSet + "white_witch_hat.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "spooky",
    color: "white"},
    {name: "bee",
    faceImgSrc: pathSet + "purple_bee.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "bread",
    faceImgSrc: pathSet + "purple_bread.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "cheese",
    faceImgSrc: pathSet + "purple_cheese.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "child_baloon",
    faceImgSrc: pathSet + "purple_child_baloon.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "desk",
    faceImgSrc: pathSet + "purple_desk.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "glasses",
    faceImgSrc: pathSet + "purple_glasses.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "lady_baby",
    faceImgSrc: pathSet + "purple_lady_baby.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "rose",
    faceImgSrc: pathSet + "purple_rose.webp",
    backImgSrc: pathSet + "purple_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "purple"},
    {name: "bee",
    faceImgSrc: pathSet + "white_bee.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "bread",
    faceImgSrc: pathSet + "white_bread.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "cheese",
    faceImgSrc: pathSet + "white_cheese.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "child_baloon",
    faceImgSrc: pathSet + "white_child_baloon.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "desk",
    faceImgSrc: pathSet + "white_desk.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "glasses",
    faceImgSrc: pathSet + "white_glasses.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "lady_baby",
    faceImgSrc: pathSet + "white_lady_baby.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "rose",
    faceImgSrc: pathSet + "white_rose.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "emma",
    color: "white"},
    {name: "atom",
    faceImgSrc: pathSet + "red_atom.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "binary",
    faceImgSrc: pathSet + "red_binary.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "dna",
    faceImgSrc: pathSet + "red_dna.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "flask",
    faceImgSrc: pathSet + "red_flask.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "magnet",
    faceImgSrc: pathSet + "red_magnet.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "microscope",
    faceImgSrc: pathSet + "red_microscope.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "neuron",
    faceImgSrc: pathSet + "red_neuron.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "newton_cradle",
    faceImgSrc: pathSet + "red_newton_cradle.webp",
    backImgSrc: pathSet + "red_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "red"},
    {name: "atom",
    faceImgSrc: pathSet + "white_atom.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"},
    {name: "binary",
    faceImgSrc: pathSet + "white_binary.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"},
    {name: "dna",
    faceImgSrc: pathSet + "white_dna.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"},
    {name: "flask",
    faceImgSrc: pathSet + "white_flask.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"},
    {name: "magnet",
    faceImgSrc: pathSet + "white_magnet.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"},
    {name: "microscope",
    faceImgSrc: pathSet + "white_microscope.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"},
    {name: "neuron",
    faceImgSrc: pathSet + "white_neuron.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"},
    {name: "newton_cradle",
    faceImgSrc: pathSet + "white_newton_cradle.webp",
    backImgSrc: pathSet + "white_backface" + backFaceNaming + ".webp",
    imgHeight: orgImgHeight,
    imgWidth: orgImgWidth,
    category: "science",
    color: "white"}
    ];

    return cardObjectArray;
}


//Function to play audio
//creates an audio element and sets it playing
function playAudio(audioName, audiotype){

    let audioId = "audio" + audioCounter;
    ++audioCounter;
    let sound = document.createElement('audio');
    sound.src = `./assets/audio/${audioName}.mp3`;
    sound.id = audioId;
    document.querySelector('body').appendChild(sound);
    //Need to add logic to loop or single play 
    document.getElementById(audioId).play();
}

//this function fade/burns the card by applying css to fade them out
//after 15 seconds we then call a function to remove the html elements to clean code and improve performance

function burnCards(){
    const cardsToBurn = document.getElementsByClassName('cardHere');
    console.log(cardsToBurn);
    for (let card of cardsToBurn)
    {
        // console.log("Adding burnUp class to card - " + card.id);
        card.classList.add('burnUp');
    }
    setTimeout(delCards, 15000);
    playAudio('burn_cards');
}

// This function removes elements from the DOM with a certain class.
// Initially used 'for of' loop but this was resulting in only half the elements being removed
// The reason was, as we delete an element, that reduces the array and index
// I took the approach of setting a constant with the initial array length and then using that to loop
// Each time we then remove the element at index 0

function delCards(){

    const cardsToDel = document.getElementsByClassName('burnUp');
    const totalElements = cardsToDel.length;
    console.log(cardsToDel);
    console.log("Found " + totalElements + " to remove");
    let loopCount = 0;
    for (let i = 0; i < totalElements; i++)
    {
        console.log("Card delete loop pass = " + loopCount);
        console.log("Details of current element");
        console.log(cardsToDel[0]);
        console.log("Deleting Card " + cardsToDel[0].id);
        cardsToDel[0].remove();
        loopCount++;
    }

}