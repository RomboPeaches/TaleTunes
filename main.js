
let url = "https://www.youtube.com/playlist?list=PLniTzKxa2c_fogTSXZK1gAWtVbv7P51LI";

function loadScript() 
{
  if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined')
  {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}
loadScript();

var player;
function init_player(url)
{
  player = new YT.Player("divA", { 
    height: "100%", 
    width: "100%", 
    videoId: getYouTubeVideoId(url), 
    events: {
      onReady: onPlayerReady
    },
  });
}

function onPlayerReady(event)
{
  // Get player's playlist
  var playlist = player.getPlaylist();
  console.log(playlist);
}

// This function is called by YouTube once the the API is ready.
function onYouTubeIframeAPIReady()
{
  init_player(url);
}

// Convert videos url to videoID
function getYouTubeVideoId(url)
{
  let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // ???
  let match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}