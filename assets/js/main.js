// All the core code that delivers the Memoria game
// Every effort has been made to take a unique approach


//global game variables


//TESTING FUNCTIONS

let deckTest = buildCardObjectArray('high', 'named');
console.log(deckTest);


//LISTENERS

//attach a listener to the body to capture right click and create a card there
document.querySelector('body').addEventListener("contextmenu", placeCard);


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
    let newDeck = buildCardObjectArray('medium', 'named');
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
    color: "white"}
    ];

    return cardObjectArray;
}