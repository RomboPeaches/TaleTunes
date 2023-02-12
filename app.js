// indicate running, volume, what else?
// shortcuts?!
// drag and drop url urls !!!
// save via cookie or file (urls, set size, discription?

// OR SELECT EFFECT i.e. FADE IN FAST and then click the iframe proxy elem
// and vice versa: selct multiple iframes and choose effect BOTH

// play/pause to hide yt logo!?!?!

// select all deselect all

// fade speed setting
// label opt. hide labels

// Class-Object that simplifies player + picker + container interactions:
// is player selected
// player vol, vol-target
// player status: playing, rdy, ...
// player url

// load players fades ... after each other?! -> sap use

// clipboard urls!?! i.e. coolers 

// push players into array to access functionalities

// when del player leave index empty, add by pushing new index, ignore empties when save  

// tooltip for describtion and way to add descriptions 

// fain + play!

//-----------------------------------------------------------------------------

class Tune {

    constructor(player, url, domId) {

        this.player = player;
        this.url = url;
        this.domId = domId;
        this.vidId = this.videoId(url);
        this.selected = false;
        this.volumeTarget = 100;
        this.describtion = "no describtion";
    }

    // convert video-url to videoId
    videoId(url) {

        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // ???
        let match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }


}

tina = new Tune("https://www.youtube.com/watch?v=aW9wBjkpWIE", "peter");
console.log(tina.info);


// Default urls
let urls = [
    "https://www.youtube.com/watch?v=Jikm8CCRbdM",
    "https://www.youtube.com/watch?v=JyyQlYRqvRs",
    "https://www.youtube.com/watch?v=HAw37tUHcOo",
    "https://www.youtube.com/watch?v=ccj1AiFE02U",
    "https://www.youtube.com/watch?v=synJbsrk0k8",
    "https://www.youtube.com/watch?v=HsdlX1E-Tv8",
    "https://www.youtube.com/watch?v=So0H1kyn6FY",
    "https://www.youtube.com/watch?v=ddMSMwKQkKI",
    "https://www.youtube.com/watch?v=4E-_Xpj0Mgo",
    "https://www.youtube.com/watch?v=hCVA_0vRisw",
    "https://www.youtube.com/watch?v=5Jzp5H4mQVE",
    "https://www.youtube.com/watch?v=Lj6Iv7plogM",
    "https://www.youtube.com/watch?v=ZnCMLyN4gQ4",
    "https://www.youtube.com/watch?v=RPkHu8M_U4c",
    "https://www.youtube.com/watch?v=yVMckBB66-w",
    "https://www.youtube.com/watch?v=665La2ZY7pA",
    "https://www.youtube.com/watch?v=U-iHnbPb60Y",
    "https://www.youtube.com/watch?v=0yTKiFXTdeI",
    "https://www.youtube.com/watch?v=OT2IfhFYVZw",
    "https://www.youtube.com/watch?v=aW9wBjkpWIE",
    "https://www.youtube.com/watch?v=FxOtJq-Tkys",
    "https://www.youtube.com/watch?v=grFQygwA27k",
    "https://www.youtube.com/watch?v=EcLZE4KVc_E",
    "https://www.youtube.com/watch?v=QlXrndlCFIk",
    "https://www.youtube.com/watch?v=n--JsJ3AlKA",
    "https://www.youtube.com/watch?v=WW4bdFhcZgw",
    "https://www.youtube.com/watch?v=7wBzL62Va1k",
    "https://www.youtube.com/watch?v=rSkX8kQ3wh4",
    "https://www.youtube.com/watch?v=t3B802PIuB0",
    "https://www.youtube.com/watch?v=P-EVYJ6GSpI",
    "https://www.youtube.com/watch?v=L_gH2MdVL78",
    "https://www.youtube.com/watch?v=KvXRg6HlDoU",
    "https://www.youtube.com/watch?v=tpi5qsXm_cM",
    "https://www.youtube.com/watch?v=zZxiJkwPJ10",
    "https://www.youtube.com/watch?v=-MwZxXwsSOs",
    "https://www.youtube.com/watch?v=-MwZxXwsSOs"
]

let numPlayers = urls.length;
numPlayers = 21;

loadScript();

// Load the YT Player-API
function loadScript() {

    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

//Convert video-url to videoID
function getYouTubeVideoId(url) {

    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // ???
    let match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

function clearSelection() {

    let pickers = document.getElementsByClassName('picker');
    for (var i = 0; i < pickers.length; i++) {
        pickers[i].style.opacity = 0.7;
    }
}

// Add player, container, picker     
function addPlayer(url, index) {

    // Create a Container for player positioning
    let playerContainer = document.createElement('div');
    playerContainer.id = 'playerContainer' + String(index);
    playerContainer.classList.add('playerContainer');
    document.getElementById('playerContainerSection').appendChild(playerContainer);

    // Create cover divs to tint if selected and to fade in 
    let picker = document.createElement('div');
    picker.id = 'picker' + index;
    picker.classList.add('picker');
    document.getElementById('playerContainer' + String(index)).appendChild(picker);

    // Add onclkick functions to pickers
    picker.onclick = function(event) {

        picker.style.opacity = 0.0;
        //document.getElementById('infoText').innerHTML = picker.id;
    }

    // Create a temp div to be replaced by the video-iframe
    let tempDivElement = document.createElement('div');
    tempDivElement.id = 'player' + String(index);
    document.getElementById('playerContainer' + String(index)).appendChild(tempDivElement);

    // Create a YT.Player object wich replaces the tempDivElement with the matching id
    let player = new YT.Player(tempDivElement.id, {

        videoId: getYouTubeVideoId(url),
        playerVars: {

            fs: 0,
            autoplay: 0,
            showinfo: 2,
            controls: 0,
            disablekb: 1,
            iv_load_policy: 3,
            allowfullscreen: 0,
        },
        events: {

            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        },
    });
    // add the iframe to the player class
    document.getElementById('player' + index).classList.add('player');
}
// This function is called by YouTube once the the API is ready
function onYouTubeIframeAPIReady() {
    // add the first player
    addPlayer(urls[0], 0);
}
// to count ready players (to add after each other)
let readyCounter = 0;
// Is called when a Player is ready
function onPlayerReady(event) {

    // fading effect for each player
    let picker = document.getElementById('picker' + String(readyCounter));
    setTimeout(function() {

        picker.style.opacity = 0.0;
        picker.style.transition = 'opacity 0.7s';
        picker.style.opacity = 0.7;
        picker.style.pointerEvents = 'auto';

    }, 1000);

    // add next player when prev ready
    readyCounter += 1;
    if (readyCounter < numPlayers) {

        addPlayer(urls[readyCounter], readyCounter);
    }

}

// Is called when a player changes state
function onPlayerStateChange(event) {}