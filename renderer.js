// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var Typed = require('typed.js');
var howler = require('howler');
const { dialog } = require('electron').remote;
let titlescreenBgm = "decline.mp3";
let bgm_link = "./src/music/bgm/";
let se_link = "./src/music/se/";
let curr_bgm;
let curr_bgm_src = '';
let isTyping = false;
let timestamp = 0; // stores total timestamp value
let startTime; // records start time of current session
let curr_line = 0;

window.onload = function() {
 
    // play titlescreen music
    playBgm(titlescreenBgm);
    document.getElementById("startLoadBtn").addEventListener("click",  function() {renderSaveFiles(false)}, false);

    // on button hover play sound
    $(".startMenuBtn").mouseenter(function() {
        playSe(["button.mp3"]);
    });
    document.getElementById("nextCursor").style.display = "none";

    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS.load('particles-js', './particlejs-config.json', function() {
        console.log('callback - particles.js config loaded');
    });

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
// function getResponse(str) {
//     str.toLowerCase();

    
// }

// performs a typewriter effect given an string
function typeWriter(str, spd) {
    if(!isTyping) {
        document.getElementById("textArea").innerHTML = "";
        // add pause wherever there is two spaces
        str = str.replace(/ +(?= )/g, ' ^500');
        //console.log(str);
        isTyping = true;
        if (document.getElementById("nextCursor").style.display === "block") {
            document.getElementById("nextCursor").style.display = "none";
        }
        
        var typed = new Typed("#textArea", {
            strings: [str],
            typeSpeed: spd,
            showCursor: false,
            onComplete: function(self) {
                isTyping = false;
                document.getElementById("nextCursor").style.display = "block";
            },
        });
    }
}

// -------- START MENU FUNCTIONS --------

function setNextTrigger(){
    console.log("Setting next trigger");
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

    // click is also acceptible
   document.getElementById("msgBox").addEventListener("click", _mouseListener);
}

var _mouseListener = function() {
    if(!isTyping) {
        getNext();
   } else {
       // skipping allowed?
   }
}

function disableNextTrigger() {
    console.log("disable getNext()");
    document.body.onkeyup = function(e) {
        if (e.keyCode == 32) {
            return false;
        }
    };

    document.getElementById("msgBox").removeEventListener("click", _mouseListener);
}

/*
 * Starts a brand new game 
 */
function startGame() {
    // fade out titlescreen
    startTime = new Date();
    stopBgm();
    // reset variables
    curr_line = 0;
    document.getElementById("sprite").src="";
    document.getElementById("background").src="";
    setNextTrigger();
    fadeout("#titlescreen", 5000, function() {
       // wait for fadeout to finish
        getNext();
        
    }); 
}

// goes to obj INDEX with correct label
function find_label(labelStr) {
    let index = story.findIndex(x => x.label === labelStr);
    return index;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// -------- STORY PARSING/PATHING FUNCTIONS --------
var rendering = false;
// progresses story
function getNext() {
    if(curr_line < story.length) { // if ending is not reached
      let curr_step = story[curr_line]; // get the dialogue obj
      if (undefined !== curr_step.sprite) {
        // change sprite. If none, show nothing
        let spriteRef = document.getElementById("sprite");
        if(curr_step.sprite === " ") {
            fadeout("#sprite", 300);
            spriteRef.src = "";
        } else {
            fadeout("#sprite", 300); // hide last sprite in prep
            spriteRef.src = "./src/img/sprites/" + curr_step.sprite;
            fadein("#sprite", 300);
        }
        curr_line++;
        getNext();

      } 
      if (undefined !== curr_step.bgImg) {
        // visual effects
        if(undefined !== curr_step.effect) {

        }
        // change background image
        let backgroundRef = document.getElementById("background");
        if(curr_step.bgImg === "") {
            backgroundRef.src = "";
        } else {
            backgroundRef.src = "./src/img/bgImg/" + curr_step.bgImg;
    
        }
        curr_line++;
        getNext();
      }
      if(undefined !== curr_step.img) {
          if(curr_step.img == "hide") {
            hideImage(500);
            return;
          }
          if(undefined !== curr_step.duration) {
            showImage(curr_step.img, curr_step.duration);
          } else {
            showImage(curr_step.img, 500); // default value
          }
          curr_line++;
          getNext();
      }
      if (undefined !== curr_step.bgm) {
          // change background music
        playBgm(curr_step.bgm);
        curr_line++;
        getNext();
      }
      if (undefined !== curr_step.se) {
        // play sound effect (once)
        disableNextTrigger();
        if (undefined !== curr_step.wait) {
            playSe(curr_step.se, curr_step.wait);
            return;
        } 
        playSe(curr_step.se);
        curr_line++;
        getNext();
      }
      if (undefined !== curr_step.msg) {
          let nameBox = document.getElementById("nameBox");
        // update name if necessary
        if (undefined !== curr_step.name) {
            nameBox.innerHTML = curr_step.name;
            nameBox.style.display = "";
        } else {
            // hide name box
            nameBox.style.display = "none";
        }
        if(undefined !== curr_step.color) {
            // change text color
            document.getElementById("msgBox").style.color = curr_step.color;
        } else { // default color
            document.getElementById("msgBox").style.color = "#ffe7b7";
        }
        // display text
        typeWriter(curr_step.msg, DEFAULT_SPEED);
        if (undefined !== curr_step.next) {
          curr_line = find_label(curr_step.next); // jump to next label if not undefined
        } else {
          curr_line++;
        }
      } else if (undefined !== curr_step.choice) { // if choice prompt available...
        disableNextTrigger();
        console.log("Rendering choices");
        // display the question: current_step.choice
        // disable getNext until choice is made
        
        typeWriter(curr_step.choice, DEFAULT_SPEED);
        fadein("#choiceOverlay", 200, function() {
            fadein("#choice", 200);
        });
        let possibleAns = curr_step.ans; // array of answers and labels
        // display the answers: current_step.ans
        renderChoices(possibleAns);
      }
    }
  }

  function waitSeconds(iMilliSeconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds) {
        end = new Date().getTime();
        counter = end - start;
    }
}

  function renderChoices(possibleAns) {
    console.log(possibleAns);
    if(!rendering) {
        rendering = true;
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
                    fadeout("#choiceOverlay",200, function() {
                        setNextTrigger();
                    })
                   
                }) 
            });
            if(i == possibleAns.length-1) {
                rendering = false;
            }
        }
    }
  }


// -------- PAUSE MENU FUNCTIONS --------
// Pause menu button display functions
function on() {
    setTimestamp();
    document.getElementById("saveBtn").addEventListener("click", function() {renderSaveFiles(true)}, false);
    document.getElementById("loadBtn").addEventListener("click",  function() {renderSaveFiles(false)}, false);
    fadein("#pauseOverlay", 500);
}

function off() {
    // start timer again
    startTime = new Date();
    fadeout('.overlay', 200);
    fadeout("#pauseOverlay", 1000);
}

function gotoTitle() {
    off();
    fadeout("#choiceOverlay",300);
    // switch to titlescreen music
    playBgm(titlescreenBgm);
    fadein("#titlescreen", 3000);
}

/*
 * Displays log of past dialogue
 */
function log() {
    fadein("#logOverlay", 500);
}

// -------- IMAGE FUNCTIONS --------

/* 
* Displays an image over everything. Used for displaying items, blurbs, etc... 
*
*/
function showImage(iimg, duration)  {
    let pimg = document.getElementById("imageLayer");
    if(pimg.src != "" ) { // handles sequention image displays
        hideImage(duration);
    }
    pimg.src = img_link + iimg;
    fadein("#imageLayer", duration);
    
} 

// hides displayed image
function hideImage(duration) {
   document.getElementById("imageLayer").src= "";
   fadeout(".overlay", duration);
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
    curr_bgm_src = bgm;
    if(bgm == "stop") {
        console.log("Stopping BGM");
        stopBgm();
        return;
    }
    if(curr_bgm != undefined) {
        stopBgm(function() {
            console.log("Switching bgms");
            console.log("playing bgm " + bgm_link + bgm);
            curr_bgm.unload();
            let another_bgm = new howler.Howl({
                src: [bgm_link + bgm],
                autoplay: true,
                loop: true,
                volume: 0.5,
                onload: function() {
                    // fade in new bgm
                    this.fade(0,0.5,3000);
                    curr_bgm = this;
                }
            });
      
        });
        return;
    } 

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

// pauses the current set bgm
function pauseBgm() {
    // stops the current bgm
    curr_bgm.fade(1, 0, 1000);
    curr_bgm.on('fade', function(){
        curr_bgm.pause();
    });
}

function stopBgm(callback) {
    curr_bgm.fade(1, 0, 2000);
    curr_bgm.on('fade', function(){
        curr_bgm.stop();
        if(callback) {
            callback();
        }
    });
}

// plays inputed audio file once with optional wait
function playSe(se, wait) {
    let curr_step = story[curr_line]; // get the dialogue obj
    // if multiple sound effects are to be played at the same time...
    if(se.length > 1) {
        for (let i = 0; i < se.length; i++) {
            console.log("Playing se: " + se_link + se[i]);
            let s = new howler.Howl({
                src: [se_link + se[i]],
                autoplay: true,
                volume: 0.7,
                loop: false,
                onend: function() {
                    if (undefined !== wait) {
                        waitSeconds(curr_step.wait);
                        curr_line++;
                        getNext();
                    }
                }
            });
            setNextTrigger();
        }
    } else {
        console.log("Playing se: " + se_link + se);
        let s = new howler.Howl({
            src: [se_link + se[0]],
            autoplay: true,
            volume: 0.7,
            loop: false,
            onend: function() {
                if (undefined !== wait) {
                    waitSeconds(curr_step.wait);
                    curr_line++;
                    getNext();
                }
            }
        });
        setNextTrigger();
    }
    
}


// -------- SAVE/LOAD FUNCTIONS --------

function closeSaveLoadMenu() {
    fadeout("#saveLoadMenuContainer", 500);
}

function msToHMS(duration) {
    // see: https://coderwall.com/p/wkdefg/converting-milliseconds-to-hh-mm-ss-mmm
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

// returns current total timestamp for current save file
function setTimestamp() {
    let endTime = new Date();
    var diffSeconds = endTime - startTime;
    timestamp += diffSeconds;
    return timestamp;
    //console.log(timestamp);
}


function save(slotNum) {
    console.log("Overwriting save...");
    let currSave = {
        save_slot: slotNum,
        currLine: curr_line,
        currSprite: document.getElementById("sprite").src,
        currBackground: document.getElementById("background").src,
        time: timestamp,
        currBgm: curr_bgm_src,
        screenshot: "",
        switches: [] // grab switches array
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
    if(saveOrLoad) {
        document.getElementById("sl").innerHTML = "Save Game";
    } else {
        document.getElementById("sl").innerHTML = "Load Game";
    }
    console.log("Entering Save/Load Menu");
    $("#saveLoadMenu").empty();
    // populate (5) save file slots
    let slots = getSlots();
    console.log(slots);
    for(let i = 0; i < slots.length; i++) {
        let saveSlot = document.createElement('li');
        $("#saveLoadMenu").append(saveSlot);
        saveSlot.id = "save_" + i;

        saveSlot.innerHTML = i;
        if(slots[i] != null) { 
            // save slot is occupied
            let currSlot = JSON.parse(slots[i]);
            console.log(currSlot);
            // TODO: Append previous save data (timestamp, screenshot, etc)
            if (+currSlot.time > 0) {
                saveSlot.innerHTML = msToHMS(+currSlot.time);
            } 
            
            $("#" + saveSlot.id).click(function() {
                // -------------- SAVING --------------
                if(saveOrLoad) {
                    // ask user for permission to override
                    console.log("Prompt User: Save override?");
                    fadein("#overwriteContainer", 200, function() {
                        // configure button to save
                        $("#yesOverwriteBtn").click(function() {
                            // override slot
                            save(i);
                            // update slot UI to reflect new data
                            saveSlot.innerHTML = msToHMS(timestamp);
                            // play save se
                            playSe(["chime.mp3"]);
                            console.log("Overridden save slot");

                        });
                    });
                    
                } else {
                    // -------------- LOADING --------------
                    console.log("Loading save slot " + i);
                    load(currSlot);

                }

                 // close save screen
                 closeOverwrite();
                
            });
        } else {
            saveSlot.innerHTML = "No data";
            $("#" + saveSlot.id).click(function() {
                // render free slot
                if (saveOrLoad) {
                    // Just save straight into the free spot
                    save(i);
                    // TODO: update li appearance with new save data
                    saveSlot.innerHTML = msToHMS(+currSlot.time);
                    
                    // TODO: Play sound effect
                    playSe(["chime.mp3"]);
                } else {
                    // Play error sound effect --> Cannot load no data slot
                    console.log("Cannot Load: No Data");
                }
            });

        }
        
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
            fadeout("#pauseOverlay",500, function() {
                playBgm(saveFile.currBgm);
                getNext();
                setNextTrigger();
            }) 
        });
    });
   
}

function closeOverwrite() {
    // hides save confirmation box
    fadeout("#overwriteContainer", 200);
}

