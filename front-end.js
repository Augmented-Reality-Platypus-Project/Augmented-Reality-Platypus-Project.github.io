// button IDs
let start_btn = document.getElementById("start_btn");
let guide_btn = document.getElementById("guide_btn");
let set_btn = document.getElementById("set_btn");

// sections to show or hide
let guideArea = document.getElementById("guideArea");
let settingsPanel = document.getElementById("settingsPanel");

// checkboxes for mute and subtitles
let muteChk = document.getElementById("muteChk");
let subsChk = document.getElementById("subsChk");

// when user clicks start, begin AR stuff
start_btn.addEventListener("click", function(){
  // NOTE: Replace this alert with the real AR trigger
  alert("insert AR experience here");
});

// when user clicks guide button, toggle guide area
guide_btn.addEventListener("click", function(){
  if(guideArea.classList.contains("hide")){
    guideArea.classList.remove("hide");
  } else {
    guideArea.classList.add("hide");
  }
});

// when user clicks settings button, toggle settings
set_btn.addEventListener("click", function(){
  if(settingsPanel.classList.contains("hide")){
    settingsPanel.classList.remove("hide");
  } else {
    settingsPanel.classList.add("hide");
  }
});

// Mute checkbox
muteChk.addEventListener("change", function(){
  if(muteChk.checked){
    console.log("Audio muted (this would pause any background sound)");
  } else {
    console.log("Audio unmuted (resume narration etc.)");
  }
});

// Subtitles checkbox
subsChk.addEventListener("change", function(){
  if(subsChk.checked){
    console.log("Subtitles on");
  } else {
    console.log("Subtitles off");
  }
});