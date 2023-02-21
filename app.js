// webpage to share TuneGroup Safefiles (legal issues? hosting?)

// show | hide thumbnails | settings

// remove obsolete ids picker0, ... 

// fix slowed or stopped setInterval when tab not "activ" ???

// viz buffering

// shortcuts?!

// add tunes (urls), import, export tune groups



// randomRGB
function randomRGB() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}

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

    //tuneGroup.createTune(defaultUrls);
    tuneGroup.createTune(defaultUrls.slice(0, 7));
}

// called when a player is ready
function onPlayerReady(event) {

    let currentIndex = event.target.id - 1;

    // current tune referencing the player, ...
    let tune = tuneGroup.tunes[currentIndex];

    // ready anim, set bg image
    tune.picker.style.fontSize = '1rem';
    tune.picker.style = 'background-image: url("images/tuneImages/img' + currentIndex + '.jpeg")';
    tune.picker.style.opacity = '0.4';

    // set video's describtion text to video's title
    tune.videoDesribtion.innerHTML = event.target.getVideoData().title;

    // set tuneInfo opacitiy
    tune.tuneInfo.style.opacity = "1.0";

    // update next tune
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
    createTune(newUrls) {

        this.urls = this.urls.concat(newUrls);
        this.updateTunes();
    }

    // called once by createTune and when a player is ready
    updateTunes() {

        // make one tune for a url that has no corresponding tune 
        if (this.tunes.length < this.urls.length) {

            // instanciate tune objects
            let tune = new Tune(this.urls[this.tunes.length], this.tunes.length);

            // add onlick function the new tunes picker elem
            tune.picker.onclick = function() {

                document.getElementById('infoText').innerHTML = "Press i.e. play, to play the selected Tunes."

                if (tune.selected == false) {
                    tune.selected = true;
                    tune.picker.style.opacity = 1.0; // if selected
                } else {
                    tune.selected = false;
                    tune.picker.style.opacity = 0.4; // if not selected
                }
            }
            // add tune object to group.tunes 
            this.tunes.push(tune);
        }
    }

    // update volume based on fadeTarget of each tune
    // and the visualisation elems positions
    updateVolumes() {

        this.tunes.forEach(tune => {
            try { /* in case a player has not been ready */
                // position faid target elem
                let newFadeTargetTranslateValue = '182px ' + (172 - ((172 / 100) * tune.faidTarget) + 7) + 'px';
                tune.volumeBarTarget.style.translate = newFadeTargetTranslateValue;

                // change volumeBarTargets color based on playing state
                let updatedColor = 'hotpink';
                if (tune.player.getPlayerState() == 1) {
                    updatedColor = 'var(--signal-color)';
                } else { updatedColor = 'cornsilk' }
                tune.volumeBarTarget.style.backgroundColor = updatedColor;
            } catch { /* in case a player has not been ready */ }

            try { /* in case a player has not been ready */
                let volumeNow = tune.player.getVolume();
                // update volumeBarVolume height
                tune.volumeBarVolume.style.height = ((176 / 100) * tune.player.getVolume()) + 'px';

                // if not done fading
                if (volumeNow != tune.faidTarget) {

                    tune.stepSize = 1;
                    let close = false; // when close to target

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

    noSelectionInfo(info = "selection is empty") {
        // inform user no tune selected
        let noneSelected = true;
        this.tunes.forEach(tune => {
            if (tune.selected) { noneSelected = false; }
        });
        let infoTextElem = document.getElementById('infoText');
        if (noneSelected == true) {
            infoTextElem.style.opacity = '1.0'
            infoTextElem.innerHTML = info;
            setTimeout(function() {
                infoTextElem.style.opacity = '0.0';
            }, 3000);
        } else {
            // hide infoTextMessage
            infoTextElem.style.opacity = '0.0';
        }
    }

    // play selected tunes
    playSelected() {

        this.noSelectionInfo();

        let numSelected = 0;
        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.4;
                tune.player.playVideo();
            }
        });
    }

    // pause selected tunes
    pauseSelected() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.4;
                tune.player.pauseVideo();
            }
        });
    }

    // select all
    selectAll() {

        this.tunes.forEach(tune => {
            tune.selected = true;
            tune.picker.style.opacity = 1.0;
        });
    }

    // deselect all
    clearSelection() {

        this.tunes.forEach(tune => {
            tune.selected = false;
            tune.picker.style.opacity = 0.4;
        });
    }

    // resets selected tunes
    resetSelected() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.4;
                tune.player.stopVideo();
            }
        });
    }

    // remove tune
    removeSelected() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.player.pauseVideo();
                tune.container.remove();
            }
        });
    }

    // sets volume faid target to 100
    faidInSelected() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {

                // if not playing
                if (tune.player.getPlayerState() != 1) {
                    tune.player.setVolume(0);
                    tune.player.playVideo();
                }
                tune.selected = false;
                tune.picker.style.opacity = 0.4;
                tune.player.playVideo();
                tune.faidTarget = 100;
            }
        });
    }

    // sets volume faid target to 0
    faidOutSelected() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.4;
                tune.faidTarget = 0;
            }
        });
    }

    // increase volume step
    volumeStepIncrease() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                let target = Math.round((tune.faidTarget + 20) / 10) * 10;
                if (target > 100) { traget = 100; }
                tune.faidTarget = target;
            }

        });
    }

    // decrease volume step
    volumeStepDecrease() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                let target = Math.round((tune.faidTarget - 20) / 10) * 10;
                if (target < 0) { traget = 0; }
                tune.faidTarget = target;
            }

        });
    }

    // mute by setting volume to 0 immediately
    muteSelected() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.4;
                tune.faidTarget = 0;
                tune.player.setVolume(0);
            }
        });
    }

    // unmute by setting volume to 100 immediately
    unMuteSelected() {

        this.noSelectionInfo();

        this.tunes.forEach(tune => {
            if (tune.selected == true) {
                tune.selected = false;
                tune.picker.style.opacity = 0.4;
                tune.player.setVolume(100);
                tune.faidTarget = 100;
            }
        });
    }

}

// object to reference playerContainer-, player-, picker-elements, 
// aswell as the tune related info and functionality, ...
class Tune {

    constructor(url, id, describtion = "default") {

        // create a container for player positioning
        let playerContainer = document.createElement('div');
        playerContainer.id = 'playerContainer' + String(id);
        playerContainer.classList.add('playerContainer');

        // create picker div to tint if selected and fade in effect
        let picker = document.createElement('div');
        picker.id = 'picker' + id;
        picker.classList.add('picker');
        picker.style.backgroundPosition = '-156px -156px';
        picker.style.color = 'white';

        picker.onclick = function(event) {}
        picker.onmouseover = function(event) {}
        picker.onmouseleave = function(event) {}

        // create a temp div to be replaced by the video-iframe
        let swapDiv = document.createElement('div');
        swapDiv.id = 'player' + id;

        // volume fade visualisation divs
        let tuneInfo = document.createElement('div');
        tuneInfo.classList.add('tuneInfo');

        let volumeBarBackground = document.createElement('div');
        volumeBarBackground.classList.add('volumeBarBackground');

        let volumeBarVolume = document.createElement('div');
        volumeBarVolume.classList.add('volumeBarVolume');

        let volumeBarTarget = document.createElement('div');
        volumeBarTarget.classList.add('volumeBarTarget');

        let videoDescribtionDiv = document.createElement('div');
        videoDescribtionDiv.classList.add('videoDescribtionDiv');

        tuneInfo.appendChild(volumeBarBackground);
        tuneInfo.appendChild(volumeBarVolume);
        tuneInfo.appendChild(volumeBarTarget);
        tuneInfo.appendChild(videoDescribtionDiv);

        // add created elems 
        playerContainer.appendChild(swapDiv);
        playerContainer.appendChild(tuneInfo);
        document.getElementById('playerContainerSection').appendChild(playerContainer);
        document.getElementById('playerContainer' + String(id)).appendChild(picker);
        document.getElementById(swapDiv.id).classList.add('player');

        // build YT.Player object
        let videoId = this.getVideoId(url)

        let player = new YT.Player(swapDiv.id, {

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

        this.tuneInfo = tuneInfo;
        this.volumeBarBackground = volumeBarBackground;
        this.volumeBarVolume = volumeBarVolume;
        this.volumeBarTarget = volumeBarTarget;
        this.videoDesribtion = videoDescribtionDiv;


        this.player = player;
        this.describtion = describtion;
        this.picker = picker;
        this.container = playerContainer;

    }

    // video-url to videoId
    getVideoId(url) {

        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // ???
        let match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
}