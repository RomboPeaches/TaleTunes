// indicate running, volume, what else?
// shortcuts?!
// drag and drop url defaultUrls !!!
// save via cookie or file (defaultUrls, set size, discription?

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

// clipboard defaultUrls!?! i.e. coolers 

// push players into array to access functionalities

// when del player leave id empty, add by pushing new id, ignore empties when save  

// tooltip for describtion and way to add descriptions 

// fain + play!

// toggle selection onlcick

//-----------------------------------------------------------------------------


// 
class Tune {

    constructor(url, id) {

        // create a container for player positioning
        let playerContainer = document.createElement('div');
        playerContainer.id = 'playerContainer' + String(id);
        playerContainer.classList.add('playerContainer');
        document.getElementById('playerContainerSection').appendChild(playerContainer);

        // create picker div to tint if selected and fade in effect
        let picker = document.createElement('div');
        picker.id = 'picker' + id;
        picker.classList.add('picker');
        document.getElementById('playerContainer' + String(id)).appendChild(picker);

        picker.style.backgroundColor = this.randColor();

        // add onclkick functions to pickers
        picker.onclick = function(event) {

            // toggle selection (temp)
            if (infoBar.style.opacity == 1.0) {
                infoBar.style.opacity = 0.0;
                picker.style.opacity = 0.3;
            } else {
                infoBar.style.opacity = 1.0;
                picker.style.opacity = 0.9;
            }
        }

        // create a temp div to be replaced by the video-iframe
        let tempDivElement = document.createElement('div');
        tempDivElement.id = 'player' + String(id);
        document.getElementById('playerContainer' + String(id)).appendChild(tempDivElement);

        // build YT.Player object wich replaces the tempDivElement with the matching id
        let videoId = this.videoId(url)

        let player = new YT.Player(tempDivElement.id, {

            videoId: videoId,
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
        // add the iframe to player class
        document.getElementById(tempDivElement.id).classList.add('player');

        // class variables
        this.url = url;
        this.id = id;
        this.vidId = videoId;
        this.selected = false;
        this.playing = false;
        this.volumeTarget = 100;
        this.describtion = "no describtion";
        this.container = playerContainer;
        this.picker = picker;
        this.player = player;
        //...

        // add volumeBar
        let infoBar = document.createElement('div');
        infoBar.id = "volumeBar" + String(id);
        infoBar.classList.add('infoBar');
        infoBar.style.opacity = 0.0;
        infoBar.innerHTML = "| playing | volume 100 |";
        playerContainer.appendChild(infoBar);

    }

    // convert video-url to videoId
    videoId(url) {

        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // ???
        let match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    // for viz distinction (contrast)
    randColor() {
        let r = Math.floor(Math.random() * 55);
        let g = Math.floor(Math.random() * 50);
        let b = Math.floor(Math.random() * 50);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
}

// default urls
let defaultUrls = [
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

// contains tune objects
let tunes = [];

// load yt-player-api
loadScript();

function loadScript() {

    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

// called once the api is ready
function onYouTubeIframeAPIReady() {
    tuneCounter = 0;
    tunes.push(new Tune(defaultUrls[tuneCounter], tuneCounter));
}

// called when a player is ready
function onPlayerReady(event) {

    //console.log(tunes[0].player.getPlayerState());

    // to hide channel-logo and video-title
    event.target.playVideo();
    event.target.stopVideo();

    // to reveal the videoplayer viz
    tunes[tuneCounter].picker.style.opacity = 0.3;

    tuneCounter += 1;
    let num = defaultUrls.length;
    num = 16; //
    if (tuneCounter < num) {

        // add new tune object
        tunes.push(new Tune(defaultUrls[tuneCounter], tuneCounter));
    }
}

// Is called when a player changes state
function onPlayerStateChange(event) {}