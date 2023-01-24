// All the core code that delivers the Memoria game
// Every effort has been made to make a unique game


//global variables

const gameArea = document.getElementById("gameArea");

//internal variables
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
let playerCardsDealDelay = 0;
let menuOn = false; // Bool to track if menu is being displayed
let settingsMenuOn = false;
let gameActive = false; // bool to track active game state
let allowClick = true; // bool to stop click spamming issues 
let selectLocked = false; //block selecting cards till current move finished.
let effectsOn = 'false';
let musicOn = 'false'; //using a string for local storage
let currentMusic = 'menuMusic';
let backGroundColor = '#ffffff';
let currentPlayerName = '';
let iconsOn = 'false';
let showingResetConfirm = false;
let howToPlayScreenOn = false;
let settingsRefreshRequested = false; //used within settings menu to control when to create or update elements
let backGroundThemeColor = 'false';


document.onload = displayIntro();


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

function setBackGroundToTheme(){

    if(cardTheme == 'spooky' ){
        document.body.style.backgroundColor = '#FFA219';
    }
    if(cardTheme == 'space'){
        document.body.style.backgroundColor = '#00000';
    }
    if(cardTheme == 'history'){
        document.body.style.backgroundColor = '#996600';
    }
    if(cardTheme == 'nature'){
        document.body.style.backgroundColor = '#0D9D08';
    }
    if(cardTheme == 'sea'){
        document.body.style.backgroundColor = '#0098FE';
    }
    if(cardTheme == 'science'){
        document.body.style.backgroundColor = '#FE0002';
    }
    if(cardTheme == 'all' && cardColor == 'all'){
        document.body.style.background = 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(255,162,25,1) 15%, rgba(153,102,0,1) 30%, rgba(13,157,8,1) 45%, rgba(0,152,254,1) 60%, rgba(254,0,2,1) 79%, rgba(177,0,253,1) 100%)';
    }
    if(cardTheme == 'all' && cardColor == 'white'){
        document.body.style.backgroundColor = '#ffffff';
    }
}

function displayHowToPlay() {

    if (howToPlayScreenOn) {
        playAudio('menu1', 'effect');
        removeDisplayHowToPlay()
        return;
    }
    if (menuOn) {
        removeMenu();
        setTimeout(() => {
            playAudio('menu1', 'effect');
            displayHowToPlay();
        }, 1000);
        return;
    }
    if (settingsMenuOn) {
        removeSettingsMenu();
        setTimeout(() => {
            playAudio('menu1', 'effect');
            displayHowToPlay();
        }, 1000);
        return;
    }
    playAudio('menu1', 'effect');
    let howToPlayScreen = document.createElement('div');
    howToPlayScreen.id = "howToPlayScreen";
    howToPlayScreen.classList.add("menuDrop");
    howToPlayScreen.classList.add("mainMenu");
    howToPlayScreen.innerHTML = `
                <h1 class="menuTitle">HOW TO PLAY</h1>
                <p class="welcomeText howToText">1. SELECT A THEME</p>
                <p class="welcomeText howToText">2. WATCH THE TOP OF THE SCREEN, REMEMBER THE CARDS, AND THEIR ORDER</p>
                <p class="welcomeText howToText">3. WAIT FOR YOUR CARDS AT THE BOTTOM OF THE SCREEN TO FLIP, CLICK THEM IN THE MATCHING ORDER</p>
                <p class="welcomeText howToText">4. TRY AND BEAT EVERY THEME. A 4 CARD STREAK UNLOCKS 1 STAR, 6 IS 2 STARS, AND 8 IS 3 STARS</p>
                <p class="welcomeText howToText">NOTE - BE PATIENT, YOU MUST WAIT FOR THE CARD TO BE CONFIRMED AND FLIPPED BEFORE YOU CAN CLICK THE NEXT</p>
                <h2 class="menuItem" onclick="removeDisplayHowToPlay()">CLOSE</h2>
                `;
    gameArea.appendChild(howToPlayScreen);
    howToPlayScreenOn = true;
}

function removeDisplayHowToPlay() {
    document.getElementById("howToPlayScreen").classList.remove("menuDrop");
    document.getElementById("howToPlayScreen").classList.add("menuBurn");
    setTimeout(() => {
        document.getElementById("howToPlayScreen").remove();
    }, 1000);
    howToPlayScreenOn = false;
}

function displayIntro() {
    //check for background preference
    if (localStorage.getItem('backGroundColor')) {
        backGroundColor = localStorage.getItem('backGroundColor');
        document.querySelector('body').style.backgroundColor = backGroundColor;
    }
    let introArea = document.createElement('div');
    introArea.id = "introArea";
    introArea.style.width = "100vw";
    introArea.style.height = "100vh";
    introArea.style.display = "absolute";
    introArea.style.top = "0";
    introArea.style.left = "0";
    document.querySelector('body').appendChild(introArea);
    imageQuality = 'medium';
    let introDeck = createGameDeck('all', 'all', '16');
    
    let i = 1;
    for (let card of introDeck) {
        let newCard = document.createElement('img');
        newCard.src = card.faceImgSrc;
        newCard.setAttribute('alt', 'card');
        if (i == 16) {
            newCard.src = card.backImgSrc;
        }
        newCard.id = "c" + i;
        introArea.appendChild(newCard);
        i++;
    }
    let clickToContinue = document.createElement('h1');
    clickToContinue.id = "clickToContinue";
    clickToContinue.innerText = "CLICK TO PLAY";
    clickToContinue.setAttribute("onclick", "captureUsername()");
    introArea.appendChild(clickToContinue);
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
}

function loadSettings() {
    //check to see if music preference was saved
    if (localStorage.getItem('musicOn')) {
        musicOn = localStorage.getItem('musicOn');
    }
    if (musicOn == 'true' && iconsOn) {
        document.getElementById('musicIcon').innerText = 'music_note';
    }
    if (musicOn == 'false' && iconsOn) {
        document.getElementById('musicIcon').innerText = 'music_off';
    }

    //check for audio effect preference

    if (localStorage.getItem('effectsOn')) {
        effectsOn = localStorage.getItem('effectsOn');
        if (effectsOn == 'true' && iconsOn) {
            document.getElementById('effectsIcon').innerText = 'volume_up';
        } else if (effectsOn == 'false' && iconsOn) {
            document.getElementById('effectsIcon').innerText = 'volume_off';
        }
      
    }
    //check for background preference
    if (localStorage.getItem('backGroundColor')) {
        backGroundColor = localStorage.getItem('backGroundColor');
        document.querySelector('body').style.backgroundColor = backGroundColor;
    }
        //check for background preference in game
        if (localStorage.getItem('backGroundThemeColor')) {
            backGroundThemeColor = localStorage.getItem('backGroundThemeColor');
        }
}
/**
 * This function will show/hide menu icons.
 * Tried setting display to none but it resulted in weird text pop.
 * Opacity set to 0 and pointer events none to stop clicks
 * 
 */
function showHideMenuIcons() {
    let header = document.querySelector('header');
    header.style.opacity = '0';
    header.innerHTML = `<div id="menuIconContainer" class="menuIcon"><span onclick="displayMenu()" class="material-symbols-outlined menuIcon">menu</span></div>
    <div id="settingsIconContainer" class="menuIcon"><span onclick="displaySettingsMenu()" class="material-symbols-outlined menuIcon">settings</span></div>
    <div id="musicIconContainer" class="menuIcon"><span id="musicIcon" onclick="setMusicOnOff()" class="material-symbols-outlined menuIcon">music_note</span></div>
    <div id="audioIconContainer" class="menuIcon"><span id="effectsIcon" onclick="setEffectsOnOff()" class="material-symbols-outlined menuIcon">volume_up</span></div>
    <div id="lightDarkIconContainer" class="menuIcon"><span id="lightDarkIcon" onclick="setBackgroundColor()" class="material-symbols-outlined menuIcon">contrast</span></div>
    <div id="helpIconContainer" class="menuIcon"><span id="helpIcon" onclick="displayHowToPlay()" class="material-symbols-outlined menuIcon">help</span></div>`;
    setTimeout(() => {
        header.style.opacity = '1';
        header.classList.add('dropIn');
        iconsOn = true;
        setTimeout(() => {
            header.classList.remove('dropIn');
        }, 1000);
    }, 1000);
}

function setMusicOnOff() {
    if (musicOn == 'true') {
        document.getElementById('musicIcon').innerText = 'music_off';
        fadeOutAudio(currentMusic);
        setTimeout(() => {
            document.getElementById(currentMusic).pause();
        }, 2000);
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
    if (document.getElementById('introArea')) {
        document.getElementById('introArea').classList.add('burnUpQuick');
        setTimeout(() => {
            document.getElementById('introArea').remove();
        }, 1000);
    }
    //check to see if we have a username stored
    if (!showingResetConfirm) {
        if (localStorage.getItem('name')) {
            currentPlayerName = localStorage.getItem('name');
            let userCapture = document.createElement('div');
            let currentPlayerNameTemp = currentPlayerName.toUpperCase();
            userCapture.id = "userCapture";
            userCapture.innerHTML = `
            <div class="mainMenu">
                <p class="welcomeText">WELCOME BACK TO MEMORIA <span class="bold"> ${currentPlayerNameTemp}</span>!</p>
                <p class="welcomeText">SHALL WE CONTINUE WITH YOUR SAVED GAME?</p>
                <button id="continueButton" class="menuItem" onclick="storeName()">YES, CONTINUE</button>
                <button id="resetButton" class="menuItem" onclick="resetGame('maybe')">NO, RESET GAME</button>
            </div>`;
            gameArea.appendChild(userCapture);
            userCapture.classList.add('menuDrop');
        } else {
            let userCapture = document.createElement('div');
            userCapture.id = "userCapture";
            userCapture.innerHTML = `
            <form class="mainMenu" onsubmit="storeName()">
                <p class="welcomeText">WELCOME TO MEMORIA!</p>
                <p class="welcomeText">PLEASE ENTER YOUR NAME AND CLICK SAVE</p>
                <input id="userName" class="menuItem" type="text" placeholder="ENTER NAME">
                <button id="startButton" class="menuItem" type="submit" value="submit">SAVE</button>
            </form> `;
            gameArea.appendChild(userCapture);
            userCapture.classList.add('menuDrop');
        }
    }
}

function resetGame(areYouSure) {
    if (areYouSure == 'maybe') {
        document.getElementById('resetButton').innerText = "YES I'M SURE, WIPE DATA!!"
        document.getElementById('resetButton').setAttribute('onclick', "resetGame('sure')");
        document.getElementById('resetButton').style.color = "#FE0002";
        document.getElementById('resetButton').style.fontWeight = "900";
        showingResetConfirm = true;
        return;
    } else if (areYouSure == 'sure') {
        console.log("Clearing local storage");
        localStorage.clear();
        showingResetConfirm = false;
        document.getElementById('userCapture').classList.add('menuBurn');
        setTimeout(() => {
            document.getElementById('userCapture').remove();
            captureUsername();
        }, 1000);
    }
}

function storeName() {

    event.preventDefault();
    if (document.getElementById('userName')) {
        
        if(document.getElementById('userName').value == '')
        {
            currentPlayerName = "the player that didn't enter their name :)";
            localStorage.setItem("name", currentPlayerName);
        }
        else{
            currentPlayerName = document.getElementById('userName').value;
            localStorage.setItem("name", document.getElementById('userName').value);
        }
    }
    document.getElementById('userCapture').classList.add('menuBurn');
    setTimeout(() => {
        document.getElementById('userCapture').remove();
        displayMenu();
        showHideMenuIcons()
        loadSettings();
        setupAudio();
    }, 1000);
}

function displaySettingsMenu() {
    console.log(imageQuality);
    console.log(backOfCardType);
    let settingsMenu;
    if(!settingsRefreshRequested){
        if (settingsMenuOn) {
            playAudio('menu1', 'effect');
            removeSettingsMenu();
            return;
        }
    
    
        if (menuOn) {
            removeMenu();
            setTimeout(() => {
                playAudio('menu1', 'effect');
                displaySettingsMenu();
            }, 1000);
            return;
        }
        if (howToPlayScreenOn) {
            removeDisplayHowToPlay();
            setTimeout(() => {
                playAudio('menu1', 'effect');
                displaySettingsMenu();
            }, 1000);
            return;
        }
        playAudio('menu1', 'effect');
        settingsMenu = document.createElement('div');
        settingsMenu.id = "settingsMenu";
        settingsMenu.classList.add("menuDrop");
        settingsMenu.classList.add("mainMenu");
    }

    if(settingsRefreshRequested){
        settingsMenu = document.getElementById("settingsMenu");
    }
    
    let cardImgQualityHtml = ``;
    if(imageQuality == 'low'){
        cardImgQualityHtml = `<h2 class="settingsMenuItem">CARD IMAGE QUALITY<span onclick="refreshSettingsMenu('imageQuality','low')" class="bold settingsOption"> >LOW< </span><span onclick="refreshSettingsMenu('imageQuality','medium')" class="settingsOption"> MED </span><span onclick="refreshSettingsMenu('imageQuality','high')" class="settingsOption"> HIGH </span></h2>`;
    }
    if(imageQuality == 'medium'){
        cardImgQualityHtml = `<h2 class="settingsMenuItem">CARD IMAGE QUALITY<span onclick="refreshSettingsMenu('imageQuality','low')" class="settingsOption"> LOW </span><span onclick="refreshSettingsMenu('imageQuality','medium')" class="bold settingsOption"> >MED< </span><span onclick="refreshSettingsMenu('imageQuality','high')" class="settingsOption"> HIGH </span></h2>`;
    }
    if(imageQuality == 'high'){
        cardImgQualityHtml = `<h2 class="settingsMenuItem">CARD IMAGE QUALITY<span onclick="refreshSettingsMenu('imageQuality','low')" class="settingsOption"> LOW </span><span onclick="refreshSettingsMenu('imageQuality','medium')" class="settingsOption"> MED </span><span onclick="refreshSettingsMenu('imageQuality','high')" class="bold settingsOption"> >HIGH< </span></h2>`;
    }

    let cardNamedHtml = ``;
    if(backOfCardType == 'named'){
        cardNamedHtml = `<h2 class="settingsMenuItem">SHOW LOGO ON CARDS<span onclick="refreshSettingsMenu('backOfCardType','named')" class="bold settingsOption"> >YES< </span><span onclick="refreshSettingsMenu('backOfCardType','unnamed')" class="settingsOption"> NO </span></h2>`;
    }
    if(backOfCardType == 'unnamed'){
        cardNamedHtml = `<h2 class="settingsMenuItem">SHOW LOGO ON CARDS<span onclick="refreshSettingsMenu('backOfCardType','named')" class="settingsOption"> YES </span><span onclick="refreshSettingsMenu('backOfCardType','unnamed')" class="bold settingsOption"> >NO< </span></h2>`;
    }

    let backGroundColorHtml = ``;
    if(backGroundThemeColor == 'true'){
        backGroundColorHtml = `<h2 class="settingsMenuItem">BACKGROUNDS MATCH THEMES<span onclick="refreshSettingsMenu('backGroundThemeColor','true')" class="bold settingsOption"> >YES< </span><span onclick="refreshSettingsMenu('backGroundThemeColor','false')" class="settingsOption"> NO </span></h2>`;
    }
    if(backGroundThemeColor == 'false'){
        backGroundColorHtml = `<h2 class="settingsMenuItem">BACKGROUNDS MATCH THEMES<span onclick="refreshSettingsMenu('backGroundThemeColor','true')" class="settingsOption"> YES </span><span onclick="refreshSettingsMenu('backGroundThemeColor','false')" class="bold settingsOption"> >NO< </span></h2>`;
    }


    settingsMenu.innerHTML = `
                <h1 class="menuTitle">OTHER SETTINGS</h1>
                ${cardImgQualityHtml}
                ${cardNamedHtml}
                ${backGroundColorHtml}
                <h2 class="menuItem" onclick="removeSettingsMenu()">CLOSE</h2>`;
    
                if(!settingsRefreshRequested){
                    gameArea.appendChild(settingsMenu);
                }
    
                
    settingsMenuOn = true;

    settingsRefreshRequested = false;
}

function refreshSettingsMenu(settingToUpdate, newVal){
    //refresh the display
    console.log(settingToUpdate);
    console.log(newVal);
    if(settingToUpdate == 'imageQuality'){
        imageQuality = newVal;
    }
    if(settingToUpdate == 'backOfCardType'){
        backOfCardType = newVal;
    }
    if(settingToUpdate == 'backGroundThemeColor'){
        backGroundThemeColor = newVal;
        localStorage.setItem('backGroundThemeColor', newVal);
    }


    settingsRefreshRequested = true;
    displaySettingsMenu();
}
function removeSettingsMenu() {
    document.getElementById("settingsMenu").classList.remove("menuDrop");
    document.getElementById("settingsMenu").classList.add("menuBurn");
    setTimeout(() => {
        document.getElementById("settingsMenu").remove();
    }, 1000);
    settingsMenuOn = false;
}

// check best result

function checkThemeAwards(cardTheme) {
    let themeAwardCheck = cardTheme + '_award';
    let awards;
    if (localStorage.getItem(themeAwardCheck)) {
        if (localStorage.getItem(themeAwardCheck) == '1') {
            awards = `<span class="material-symbols-outlined awardIcon">stars</span>`
        }
        if (localStorage.getItem(themeAwardCheck) == '2') {
            awards = `<span class="material-symbols-outlined awardIcon">stars</span><span class="material-symbols-outlined awardIcon">stars</span>`
        }
        if (localStorage.getItem(themeAwardCheck) == '3') {
            awards = `<span class="material-symbols-outlined awardIcon">stars</span><span class="material-symbols-outlined awardIcon">stars</span><span class="material-symbols-outlined awardIcon">stars</span>`
        }
    } else {
        awards = ``;
    }
    return awards;
}
/**
 * When the player reaches a certain round we trigger this to update local storage with the award
 * @param {String} cardTheme 
 * @param {String} awardLevel 
 * @returns 
 */
function setThemeAward(cardTheme, awardLevel) {

    if (checkThemeAwards(cardTheme) == '') {
        localStorage.setItem(cardTheme + "_award", awardLevel);
        return;
    }
    if (localStorage.getItem(cardTheme + "_award") == '1') {
        if (awardLevel == '1') {
            return;
        } else {
            localStorage.setItem(cardTheme + "_award", awardLevel);
            return;
        }
    }
    if (localStorage.getItem(cardTheme + "_award") == '2') {
        if (awardLevel == '1') {
            return;
        }
        if (awardLevel == '2') {
            return;
        } else {
            localStorage.setItem(cardTheme + "_award", awardLevel);
            return;
        }
    }
    if (localStorage.getItem(cardTheme + "_award") == '3') {
        if (awardLevel == '1') {
            return;
        }
        if (awardLevel == '2') {
            return;
        }
        if (awardLevel == '2') {
            localStorage.setItem(cardTheme + "_award", awardLevel);
            return;
        } else {
            return;
        }
    }
}

//display the main menu
function displayMenu() {
    if (menuOn) {
        playAudio('menu1', 'effect');
        removeMenu();
        return;
    }
    if (settingsMenuOn) {
        removeSettingsMenu();
        setTimeout(() => {
            playAudio('menu1', 'effect');
            displayMenu();
        }, 1000);
        return;
    }
    if (howToPlayScreenOn) {
        removeDisplayHowToPlay();
        setTimeout(() => {
            playAudio('menu1', 'effect');
            displayMenu();
        }, 1000);
        return;
    }
    playAudio('menu1', 'effect');
    let mainM = document.createElement('div');
    mainM.id = "mainMenu";
    mainM.classList.add("menuDrop");
    mainM.classList.add("mainMenu");
    if (gameActive) {
        mainM.innerHTML = `
                <h1 class="menuTitle">GAME IN PROGRESS</h1>
                <h2 class="menuItem" onclick="endGame()">END GAME</h2>
                <h2 class="menuItem" onclick="displayMenu()">CONTINUE GAME</h2> `;
    } else {
        let spooky = checkThemeAwards('spooky');
        let space = checkThemeAwards('space');
        let history = checkThemeAwards('history');
        let nature = checkThemeAwards('nature');
        let sea = checkThemeAwards('sea');
        let science = checkThemeAwards('science');
        let emma = checkThemeAwards('emma');
        let mixed = checkThemeAwards('mixed');
        let mono = checkThemeAwards('mono');
        //hidden mode is shown to players with the name Emma, mainly aimed at my wife :)
        let emmaMode = '';
        if (currentPlayerName.toUpperCase() == 'EMMA') {
            emmaMode = `<h2 id="emmaMenuItem" class="menuItem" onclick="gameStart('emma','purple','8')">EMMA ${emma}</h2>`;
        } else {
            emmaMode = ``;
        }
        mainM.innerHTML = `
                <h1 class="menuTitle">SELECT A THEME</h1>
                <h2 id="spookyMenuItem" class="menuItem" onclick="gameStart('spooky','orange','8')">SPOOKY ${spooky}</h2>
                <h2 id="spaceMenuItem" class="menuItem" onclick="gameStart('space','black','8')">SPACE ${space}</h2>
                <h2 id="historyMenuItem" class="menuItem" onclick="gameStart('history','brown','8')">HISTORY ${history}</h2>
                <h2 id="natureMenuItem" class="menuItem" onclick="gameStart('nature','green','8')">NATURE ${nature}</h2>
                <h2 id="seaMenuItem" class="menuItem" onclick="gameStart('sea','blue','8')">SEA ${sea}</h2>
                <h2 id="scienceMenuItem" class="menuItem" onclick="gameStart('science','red','8')">SCIENCE ${science}</h2>
                ${emmaMode}
                <h2 id="mixedMenuItem" class="menuItem" onclick="gameStart('all','all','16')">MIXED ${mixed}</h2>
                <h2 id="monoMenuItem" class="menuItem" onclick="gameStart('all','white','16')">MONO ${mono}</h2>`;
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
        if (window.innerWidth > 900) {
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
    menuMusic.src = "./assets/audio/menuMusic.mp3";
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
    }, 20);
    setTimeout(() => {
        clearInterval(fadeDown);
    }, 2000);
}
//Function to play audio
//creates an audio element and sets it playing
function playAudio(audioName, audioType) {
    if (audioType == 'music') {
        sound = document.getElementById(audioName);
        sound.volume = 1;
        sound.load();
        sound.play();
        sound.loop = true;
    } else if (audioType == 'effect' && effectsOn == 'true') {
        let body = document.querySelector('body');
        let audioEffect = document.createElement('audio');
        audioEffect.src = "./assets/audio/" + audioName + ".mp3";
        console.log(audioEffect.src);
        audioEffect.classList = 'audioEffect';
        audioEffect.dataset.audioType = 'effect';
        body.appendChild(audioEffect);
        audioEffect.load();
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
    let delay; //used for timing and blocking
    const playerCardsArea = document.getElementById('playerCardsArea');
    for (let i = 0; i < gameDeck.length; i++) {
        const cardContainer = document.createElement('div');
        const cardFace = document.createElement('img');
        const cardBack = document.createElement('img');
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
            playAudio('card1', 'effect');
        }, delay);
        //need to optimize and find a solution here if time allows.
        //the card deal animation needs an animation-fill-mode of both but then the flip animation needs forwards
        //this technique works for now where we trigger a delayed function to switch out style classes
        setTimeout(() => {
            if (!gameActive) {
                return;
            }
            cardContainer.classList.remove("dropIn");
            cardContainer.classList.add("cardFlipped");
        }, delay + 1000);
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
 * @param {string} cardThemeSelected 
 * @param {string} cardColorSelected 
 * @param {number} deckSizeSelected 
 */
function gameStart(cardThemeSelected, cardColorSelected, deckSizeSelected) {
    if (menuOn) {
        removeMenu(); // get rid of main menu
    }
    cardTheme = cardThemeSelected;
    cardColor = cardColorSelected;
    deckSize = deckSizeSelected;
    gameRounds = deckSize;
    if(backGroundThemeColor == 'true'){
        setBackGroundToTheme();
    }
    console.log("starting game with deckSize " + deckSize);
    if (!gameActive) {
        fadeOutAudio('menuMusic');
    }
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
    for (let card of tempDeck) {
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
        document.getElementById(cardTag).style.animationDelay = "0ms";
        document.getElementById(cardTag).classList.add("cardFlipped");
        document.getElementById(cardTag).classList.remove("cardFlippedBack");
        setTimeout(() => {
            allowClick = true;
        }, 1000);
        if (totalSelectedCards == cardsToMatch.length) {
            scatterWinSmiles(currentRound * 10);
            playAudio('wellDone', 'effect')
            //wait 3 seconds and reset
            setTimeout(() => {
                burnCards();
                if (currentRound == 4) {
                    setThemeAward(cardTheme, '1');
                }
                if (currentRound == 6) {
                    setThemeAward(cardTheme, '2');
                }
                if (currentRound == 8) {
                    setThemeAward(cardTheme, '3');
                }
                allowClick = true;
                ++currentRound;
                setTimeout(() => {
                    if (currentRound <= gameRounds) {
                        gameStart(cardTheme, cardColor, deckSize);
                    } else {
                        console.log("you win this theme. well done !!")
                        playAudio('beatTheme', 'effect');
                        setThemeAward(cardTheme, '3');
                        gameActive = false;
                        currentRound = 1;
                        //reset background
                        document.body.style.background = '';
                        document.body.style.backgroundColor = backGroundColor;
                        displayMenu();
                    }
                }, 3000);
            }, 5000);
        }
    } else {
        console.log("You failed!!!!")
        playAudio('roundLoose', 'effect')
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
            //reset background
            document.body.style.background = '';
            document.body.style.backgroundColor = backGroundColor;
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
                    playAudio('card1', 'effect');
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
        //reset background
        document.body.style.background = '';
        document.body.style.backgroundColor = backGroundColor;
        let loopCount = 0;
        for (let i = 0; i < totalElements; i++) {
            cardsToDel[0].remove();
            loopCount++;
        }
    }, 1000);
    setTimeout(() => {
        document.querySelector('body').classList.remove('burnGameArea');
        document.getElementById('roundDisplayContainer').remove();
        gameActive = false;
        currentRound = 1; // reset round back to 1
        displayMenu();
    }, 1100);
}