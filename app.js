// TODO

// indicate running, volume, what else?
// shortcuts?!
// drag and drop url defaultUrls !!!
// save via cookie or file (defaultUrls, set size, discription?
// OR SELECT EFFECT i.e. FADE IN FAST and then click the iframe proxy elem
// and vice versa: selct multiple iframes and choose effect BOTH
// fade speed setting
// label opt. hide labels 
// tooltip for describtion and way to add descriptions

// fade more slow for target 100 and 0 !!!


// to load yt iframe api
if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// called when the iframe api is ready
function onYouTubeIframeAPIReady() {

    tuneGroup = new TuneGroup();
    tuneGroup.addUrls(defaultUrls.slice(0, 5));
}

// called when a player is ready
function onPlayerReady(event) { tuneGroup.updateTunes(); }

// called when a player changes state
function onPlayerStateChange(event) {}


// class to manage tunes
class TuneGroup {

    constructor() {

        this.urls = [];
        this.tunes = [];

        this.worker = new Worker(setInterval(function() {
            tuneGroup.updateVolumes();
        }, 100));
    }

    // stages new urls
    addUrls(newUrls) {

        this.urls = this.urls.concat(newUrls);
        // called updateTunes once 
        this.updateTunes();
    }

    // called by addUrls() or when a player is ready
    updateTunes() {

        // make one tune for a url that has no corresponding tune 
        if (this.tunes.length < this.urls.length) {

            // instanciate tune objects
            let tune = new Tune(this.urls[this.tunes.length], this.tunes.length);

            // add onlick function the new tunes picker elem
            tune.picker.onclick = function() {

                if (tune.selected == true) {
                    tune.picker.style.opacity = 0.2;
                    tune.selected = false;
                } else {
                    tune.picker.style.opacity = 0.8;
                    tune.selected = true;
                }
            }
            // add tune object to group.tunes 
            this.tunes.push(tune);
        }
    }

    // update volume based on fadeTarget of each tune
    updateVolumes() {

        this.tunes.forEach(tune => {
            let currentVolume = tune.player.getVolume();
            if (currentVolume != tune.faidTarget) {
                if (currentVolume < tune.faidTarget) {
                    tune.player.setVolume(currentVolume + 1);
                } else {
                    tune.player.setVolume(currentVolume - 1)
                }
                console.log("active fading:", currentVolume);
            }
        });
    }

    // play selected tunes
    playSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.2;
                tune.player.playVideo();
            }
        });
    }

    // play selected tunes
    pauseSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.2;
                tune.player.pauseVideo();
            }
        });
    }

    // select all
    selectAll() {

        this.tunes.forEach(tune => {
            tune.selected = true;
            tune.picker.style.opacity = 0.8;
        });
    }

    // deselect all
    clearSelection() {

        this.tunes.forEach(tune => {
            tune.selected = false;
            tune.picker.style.opacity = 0.2;
        });
    }

    // resets selected tunes
    resetSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.2;
                tune.player.stopVideo();
            }
        });
    }

    // remove tune
    removeSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.player.pauseVideo();
                tune.container.remove();
            }
        });
    }

    // sets volume faid target to 100
    faidInSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.2;
                tune.player.playVideo();
                tune.faidTarget = 100;
            }
        });
    }

    // sets volume faid target to 0
    faidOutSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.2;
                tune.faidTarget = 0;
            }
        });
    }
}

// object to reference playerContainer-, player-, picker-elements, 
// aswell as the tune related info and functionality, ...
class Tune {

    constructor(url, id) {

        // create a container for player positioning
        let playerContainer = document.createElement('div');
        playerContainer.id = 'playerContainer' + String(id);
        playerContainer.classList.add('playerContainer');

        // create picker div to tint if selected and fade in effect
        let picker = document.createElement('div');
        picker.id = 'picker' + id;
        picker.style.opacity = 0.2;
        picker.classList.add('picker');

        picker.onclick = function(event) {}
        picker.onmouseover = function(event) {}
        picker.onmouseleave = function(event) {}

        // create a temp div to be replaced by the video-iframe
        let tempDivElement = document.createElement('div');
        tempDivElement.id = 'player' + String(id);

        // add created elems 
        playerContainer.appendChild(tempDivElement);
        document.getElementById('playerContainerSection').appendChild(playerContainer);
        document.getElementById('playerContainer' + String(id)).appendChild(picker);
        document.getElementById(tempDivElement.id).classList.add('player');

        // build YT.Player object
        let videoId = this.getVideoId(url)

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

        // class variables
        this.tuneId = id;
        this.url = url;
        this.vidId = videoId;
        this.playing = false;
        this.selected = false;
        this.faidTarget = 100;
        this.playerReady = false;
        this.describtion = "no describtion";

        this.player = player;
        this.picker = picker;
        this.container = playerContainer;
    }

    // video-url to videoId
    getVideoId(url) {

        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // ???
        let match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
    // randomRGB for viz distinction
    randomRGB() {

        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
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