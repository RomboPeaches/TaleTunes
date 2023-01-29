
// loads yt player api
function load_iframe_api() 
{
  if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined')
  {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}
load_iframe_api();

// convert videos url to videoID
function getYouTubeVideoId(url)
{
  let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // ???
  let match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

function append_tune_group(parent)
{
  document.getElementById(String(parent)).appendChild()
}

// Weniger Knöpfe FADE STEPS MIN


