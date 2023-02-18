// TODO

// urls string id part to color to genrate always same color code for tunes!?,  

// drag and drop url saved urls and settings?! !!! json files !!!

// forbid selection until a player ready

// save via json file

// slowed or stopped setInterval function fix?

// add tunes (urls)

// tooltip for describtion and way to add descriptions

// are the tune elem's ids i.e. picker, container, player obsolete?

// visualize volume


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
    //tuneGroup.addUrls(defaultUrls);
    tuneGroup.addUrls(defaultUrls.slice(0, 3));
}

// called when a player is ready
function onPlayerReady(event) {

    tuneGroup.updateTunes();
}

// called when a player changes state
function onPlayerStateChange(event) {}


// class to manage tunes
class TuneGroup {

    constructor() {

        this.urls = [];
        this.tunes = [];

        setInterval(function() {
            tuneGroup.updateVolumes();
        }, 100);
    }

    // adds new urls to create tunes from
    addUrls(newUrls) {

        this.urls = this.urls.concat(newUrls);
        this.updateTunes();
    }

    // called once by addUrls and when a player is ready
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

            try {

                let volumeNow = tune.player.getVolume();
                // if not done fading
                if (volumeNow != tune.faidTarget) {

                    tune.stepSize = 1;

                    let close = false; // when close to target
                    if (Math.abs(volumeNow - tune.faidTarget) < 10) {

                        // slow fading 
                        if (tune.delayCounter > 4) {
                            tune.stepSize = 1;
                            tune.delayCounter = 0;
                        } else {
                            tune.delayCounter += 1;
                            tune.stepSize = 0;
                        }
                    }

                    // increase or ...
                    if (volumeNow < tune.faidTarget) {
                        tune.player.setVolume(volumeNow + tune.stepSize);
                    } else {
                        // ... decrease Volume
                        tune.player.setVolume(volumeNow - tune.stepSize)
                    }
                    console.log("vol:", volumeNow);

                }


            } catch { /* in case a player has not been ready */ }
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

    // pause selected tunes
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

                // if not playing
                if (tune.player.getPlayerState() != 1) {
                    tune.player.setVolume(0);
                    tune.player.playVideo();
                }
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

    // increase volume step
    volumeStepIncrease() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {

                let newTarget = tune.player.getVolume() + 25;
                if (newTarget > 100) { newTarget = 100; }

                tune.faidTarget = newTarget;
                console.log("newTarget: ", newTarget);
            }
        });
    }

    // decrease volume step
    volumeStepDecrease() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {

                let newTarget = tune.player.getVolume() - 25;
                if (newTarget < 0) { newTarget = 0; }

                tune.faidTarget = newTarget;
                console.log("newTarget: ", newTarget);
            }
        });
    }

    // mute by setting volume to 0 immediately
    muteSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.2;
                tune.faidTarget = 0;
                tune.player.setVolume(0);
            }
        });
    }

    // unmute by setting volume to 100 immediately
    unMuteSelected() {

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.2;
                tune.faidTarget = 0;
                tune.player.setVolume(100);
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
        this.delayCounter = 0;
        this.stepSize = 1;
        //this.playerReady = false;
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