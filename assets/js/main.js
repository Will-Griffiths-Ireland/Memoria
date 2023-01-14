// All the core code that delivers the Memoria game
// Every effort has been made to take a unique approach


//global game variables

let cardId = 0; //keep track of how many cards have been created in this session
let audioCounter  = 0; //global variable to track audio clips generated and create unique IDs


//TESTING FUNCTIONS

let deckTest = buildCardObjectArray('high', 'named');
console.log(deckTest);

scatterCards(300);


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

    let newDeck = buildCardObjectArray('low', 'named');
    let randSelect;
    let randWidth;
    
    for(let i = 0; i < cardCount; i++){

        //generate radom card size
        // let cardWidth = randomNumber(100,300);
        randSelect = Math.floor(Math.random() * newDeck.length); //pick a random card form the deck
        //Generate a random width/size of card that is between img size and half
        randWidth = randomNumber((newDeck[randSelect].imgWidth / 2),(newDeck[randSelect].imgWidth));


        let body = document.querySelector('body');
        let locX = Math.floor(Math.random() * (windowX - newDeck[randSelect].imgWidth));
        locX = locX  + "px";
        let locY = Math.floor(Math.random() * (windowY - newDeck[randSelect].imgHeight));
        locY = locY + "px";
        console.log("Trying to create card at " + locX + " " + locY);
        let card = document.createElement('img');
        card.src = newDeck[randSelect].faceImgSrc;
        card.style.position = "fixed";
        card.style.animationDelay = randomNumber(1000,5000) + "ms"; 
        card.style.top = locY;
        card.style.left = locX;
        card.style.width = randWidth  + "px"; 
        card.style.zIndex = 10;
        ++cardId;
        card.id = cardId;
        card.classList = "dropIn cardHere";

        body.appendChild(card);

    }
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
    color: "white"}
    ];

    return cardObjectArray;
}


//Function to play audio clip
//creates an audio element and sets it playing

function playAudio(audioName, audiotype){

    let audioId = "audio" + audioCounter;
    ++audioCounter;
    let sound = document.createElement('audio');
    sound.src = "./assets/audio/string1.mp3";
    sound.id = audioId;
    document.querySelector('body').appendChild(sound);
    //Need to add logic to loop or single play 
    document.getElementById(audioId).play();
}