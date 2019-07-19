// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var Typed = require('typed.js');
var howler = require('howler');
var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'

let bgm_link = "./src/music/bgm/";
let se_link = "./src/music/se/"
let curr_bgm;
let se;
let isTyping = false;
let timestamp; // stores total timestamp value
let startTime; // records start time of current session
let curr_line = 0;

window.onload = function() {
    // titlescreen on start
    $("#titlescreen button").each(function(i) {
        $(this).delay(700 * i).fadeIn(1000);
    });
    // play titlescreen music
    playBgm("danse-morialta-by-kevin-macleod.mp3");

    // document.getElementById("userInput").addEventListener("keyup", function(event) {
    //     if (mode === "input") { // if not in cutscene/choice
    //         if (event.keyCode === 13) { // enter key
    //             if (isTyping == false) {
    //                 // Cancel the default action, if needed
    //                 event.preventDefault();
    //                 let str = document.getElementById("userInput").value;
    //                 document.getElementById("inputBox").innerHTML = "> " + str;
    //                 getResponse(str);
    //                 document.getElementById("userInput").value = "";
    //             }
    //         }
    //     }
    //   });
}

// retrieves story response to user input
function getResponse(str) {
    str.toLowerCase();

    
}

// performs a typewriter effect given an string
function typeWriter(str, spd) {
    document.getElementById("msgBox").innerHTML = "";
    // add pause wherever there is two spaces
    str = str.replace(/ +(?= )/g, ' ^500');
    //console.log(str);
    isTyping = true;
    var typed = new Typed("#msgBox", {
        strings: [str],
        typeSpeed: spd,
        showCursor: false,
        onComplete: function(self) {
            isTyping = false;
        },
    });
    
}

// -------- START MENU FUNCTIONS -------- 

/*
 * Starts a brand new game 
 */
function startGame() {
    // fade out titlescreen
    stopBgm();
    fadeout("#titlescreen", 3000, function() {
       // wait for fadeout to finish
        getNext();
        document.body.onkeyup = function(e){
            if(!isTyping) {
                 // wait for space to progress story
                if(e.keyCode == 32){
                    getNext();
                }
            } else {
                // skipping allowed?
            }
        }
    }); 
}

// goes to obj INDEX with correct label
function find_label(labelStr) {
    let index = story.findIndex(x => x.label === labelStr);
    return index;
}

// -------- STORY PARSING/PATHING FUNCTIONS --------

// progresses story
function getNext() {
    if(curr_line < story.length) { // if ending is not reached
      let curr_step = story[curr_line]; // get the dialogue obj
      if (undefined !== curr_step.sprite) {
        // change sprite. If none, show nothing
        let spriteRef = document.getElementById("sprite");
        if(curr_step.sprite === " ") {
            spriteRef.src = "";
        } else {
            spriteRef.src = "./src/img/sprites/" + curr_step.sprite;
        }
        curr_line++;

      } 
      if (undefined !== curr_step.bgImg) {
        // change background image
        let backgroundRef = document.getElementById("background");
        if(curr_step.bgImg === "") {
            backgroundRef.src = "";
        } else {
            backgroundRef.src = "./src/img/bgImg/" + curr_step.bgImg;
    
        }
        curr_line++;
      }
      if (undefined !== curr_step.bgm) {
          // change background music
        playBgm(curr_step.bgm);
        curr_line++;
      }
      if (undefined !== curr_step.se) {
        // play sound effect (once)
        playSe(curr_step.se);
        curr_line++;
      }
      if (undefined !== curr_step.msg) {
        // update name if necessary
        if (undefined !== curr_step.name) {

        }
        // display text
        typeWriter(curr_step.msg, DEFAULT_SPEED);
        if (undefined !== curr_step.next) {
          curr_line = find_label(curr_step.next); // jump to next label if not undefined
        } else {
          curr_line++;
        }
  
      } else if (undefined !== curr_step.choice) { // if choice prompt available...
        console.log("Rendering choices");
        // display the question: current_step.choice
        typeWriter(curr_step.choice, DEFAULT_SPEED);
        let possibleAns = curr_step.ans; // array of answers and labels
        // display the answers: current_step.ans
        renderChoices(possibleAns);

  
      }
    }
  }

  function renderChoices(possibleAns) {
for(let i = 0; i < possibleAns.length; i++) {
            let choiceBtn = document.createElement("button");
            choiceBtn.className = "choiceBtn";
            choiceBtn.innerHTML = possibleAns[i].msg;
            choiceBtn.id = i;
            $("#choice").append(choiceBtn);
            document.getElementById(i).addEventListener("click", function() {
                curr_line = find_label(possibleAns[i].next); 
                getNext(); // go on to choice results
                fadeout("#choice", 500, function() {
                    $("#choice").empty(); // clear choices after selection
                }) 
            });
        }
  }


// -------- PAUSE MENU FUNCTIONS --------
// Pause menu button display functions
function on() {
    setTimestamp();
    fadein("#pauseOverlay", 1000);
}

function off() {
    // start timer again
    currTimer = new Date();
    fadeout("#pauseOverlay", 2000);
}

function gotoTitle() {
    off();
    // switch to titlescreen music
    playBgm("danse-morialta-by-kevin-macleod.mp3");
    fadein("#titlescreen", 3000);
}

// -------- FADE FUNCTIONS --------

function fadeout(element, speed, callback) {
    if(callback){
        $(element).fadeOut(speed,callback);
    } else {
        $(element).fadeOut(speed);
    }
   
}

function fadein(element, speed, callback) {
    if(callback){
        $(element).fadeIn(speed,callback);
    } else {
        $(element).fadeIn(speed);
    }

}

// -------- AUDIO FUNCTIONS --------

function playBgm(bgm) {
    // fade out last bgm (if applicable)
    if(curr_bgm != undefined) { 
        console.log("fading out");
        curr_bgm.fade(0.5, 0, 2000); // fade out old bgm
        curr_bgm.on('fade', function(){ 
            console.log('faded bgm. Switching to next');
            console.log("playing bgm " + bgm_link + bgm);
            // switch bgm
            let another_bgm = new howler.Howl({
                src: [bgm_link + bgm],
                autoplay: true,
                loop: true,
                volume: 0.5,
                onfade: function(){
                    curr_bgm.on('fade', function(){}); 
                    curr_bgm = another_bgm;
                }
            });
            // fade in new bgm
            another_bgm.fade(0,0.5,3000);
        });
        return;
    } else {
        console.log("playing bgm " + bgm_link + bgm);
        // just create new Howl and play
        curr_bgm = new howler.Howl({
            src: [bgm_link + bgm],
            autoplay: true,
            loop: true,
            volume: 0.0
        });
        // fade in new bgm
        curr_bgm.fade(0,1.0,3000);
    }

   
}

// pauses the current set bgm
function pauseBgm() {
    // stops the current bgm
    curr_bgm.fade(1, 0, 1000);
    curr_bgm.on('fade', function(){
        curr_bgm.pause();
    });
}

function stopBgm() {
    curr_bgm.fade(1, 0, 2000);
    curr_bgm.on('fade', function(){
        curr_bgm.stop();
    });
}

// plays inputed audio file once 
function playSe(se) {
    // if multiple sound effects are to be played at the same time...
    if(se.length > 1) {
        for (let i = 0; i < se.length; i++) {
            console.log("Playing se: " + se_link + se);
            let s = new howler.Howl({
                src: [se_link + se[i]],
                autoplay: true,
                volume: 0.7,
                loop: false
            });
        }
    } else {
        console.log("Playing se: " + se_link + se);
        se = new howler.Howl({
            src: [se_link + se[0]],
            autoplay: true,
            volume: 0.7,
            loop: false
        });
    }
    
}


// -------- SAVE/LOAD FUNCTIONS --------
// see https://stackoverflow.com/questions/34847231/how-to-save-progress-in-an-html-game

function secondsToHMS(secs) {
    // ref: https://stackoverflow.com/questions/26580509/calculate-time-difference-between-two-date-in-hhmmss-javascript
    function z(n){return (n<10?'0':'') + n;}
    var sign = secs < 0? '-':'';
    secs = Math.abs(secs);
    return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + z(secs%60);
  }

// returns current total timestamp for current save file
function setTimestamp() {
    let endTime = new Date();
    var diffSeconds = endTime - startTime;
    let sessionTime = secondsToHMS(diffSeconds);
    timestamp += sessionTime;
}

// saves all current values and booleans to an array
function fillSwitches() {

}

function save(slotNum) {
    let timestmp = setTimestamp();
    let currSave = {
        save_slot: slotNum,
        currLine: curr_line,
        currSprite: document.getElementById("sprite").src,
        currBackground: document.getElementById("background").src,
        currBgm: curr_bgm,
        timestamp: "",
        screenshot: "",
        switches: []
    }
    localStorage.setItem(slotNum, JSON.stringify(currSave));

  }

  function getSlots() {
    let slots = [
        localStorage.getItem("1"),
        localStorage.getItem("2"),
        localStorage.getItem("3"),
        localStorage.getItem("4"),
        localStorage.getItem("5")
    ];
    return slots;
  }
  
  // grabs all save files from localstorage and displays them in a list for saving or loading
  // saveOrLoad == true if save, false if load
function renderSaveFiles(saveOrLoad) {
    $("#saveLoadMenu").empty();
    // populate (5) save file slots
    let slots = getSlots();

    for(let i = 0; i < slots.length; i++) {
        let saveSlot = document.createElement('li');
        saveSlot.id = "save_" + i;
        saveSlot.innerHTML = i;
        if(slots[i] != null) { 
            // save slot is occupied
            let currSlot = JSON.parse(slots[i]);

            // TODO: Append previous save data (timestamp, screenshot, etc)

            $("#" + saveSlot.id).click(function() {
                // -------------- SAVING --------------
                if(saveOrLoad) {
                    // ask user for permission to override
                    console.log("Prompt User: Save override?");
                    vex.dialog.confirm({
                        message: 'Overwrite previous save data?',
                        callback: function (value) {
                            if (value) {
                                save(i);
                                // TODO: update li appearance with new save data
                                
                                // TODO: Play sound effect
                                vex.dialog.alert('Successfully saved.');
                            } 
                        }
                    });
                } else {
                    // -------------- LOADING --------------
                    console.log("Loading save slot " + i);
                    load(currSlot);

                }
                
            });
        } else {
            $("#" + saveSlot.id).click(function() {
                // render free slot
                if (saveOrLoad) {
                    // Just save straight into the free spot
                    save(i);
                    // TODO: update li appearance with new save data
                    
                    // TODO: Play sound effect
                    vex.dialog.alert('Successfully saved.');
                } else {
                    // Play error sound effect --> Cannot load no data slot
                    console.log("Cannot Load: No Data");
                }
            });

        }
        $("#saveLoadMenu").append(saveSlot);
        
    }
    // open save page
    fadein("#saveLoadMenuContainer", 500);
}


  // loads a specific game
function load(saveFile) {
    curr_line = saveFile.currLine;
    document.getElementById("sprite").src = saveFile.currSprite;
    document.getElementById("background").src = saveFile.currBackground;
    timestamp = saveFile.timestamp;

    // start timer
    currTimer = new Date();

     // hide save/load screen
    fadeout("#saveLoadMenuContainer", 500, function() {
        fadeout("#titlescreen", 1000, function() {
            playBgm(saveFile.currBgm);
            getNext();
        });
    });
   
  
}

