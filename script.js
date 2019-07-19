// characters
const j = "Joel"; // Joel Emerson, off duty investigator for the local police 
const s = "Sidney"; // jounalist for an urban exploration blog
const r = "Remus"; // Remus Hawthorn, artist and owner of mansion

const DEFAULT_SPEED = 30;

var story = [
    // { msg: "An endless sea stretches out beyond the horizon.  There's no waves,  no ripples,  nothing."},
    // { msg: "The sky is reflected almost perfectly onto the water,  the clouds loftily floating by."},
    // { msg: "Your body feels heavy,  sleepy almost..."},
    // { msg: "Soon enough,  it all just fades away...."},
    // { msg: "(............)" },
    // { msg: "(........................H-Huh?)"},
    // { msg: "It's pitch black and silent.  You can't see or hear a thing.  Your head throbs " + 
    // "painfully, and your ears ring with an unpleasantly high pitch."},
    // {se: ["woodCreak.mp3"]},
    // { msg: "Something creaks from underneath you.  A wooden chair, perhaps?  Ropes tightly bind your " +
    // "wrists and feet to its arms and legs,  digging uncomfortably into your skin."},
    // {msg:"(.........)"},
    // {se: ["ropeCreak.mp3"]},
    // {msg:"Struggling,  you attempt to wiggle free from your bounds."},
    // {se: ["ropeCreak.mp3"]},
    // { msg: "What's this?  Your left hand seems to be coming loose!"},
    // { label: "chair_struggle", event: "space", label: "Struggle", result: [
    //     {success: "intro_success"},
    //     {fail: "intro_fail"}
    // ]},

    // {label: "intro_fail", se: ""}, // play fail sound
    // {msg: "You wince in pain, your wrist still bound tightly to the chair.  You inhale, " + 
    // "preparing for your next attempt.", next: "chair_struggle"},
    // {label: "intro_success", msg: "You manage to squeeze out your left wrist out of the rope,  " + 
    // "your skin feeling raw and red from the effort."},
    // {msg: "It doesn't take too long to untie your other limbs.  You stand up, stretching out " + 
    // "your aching back.  Just how long were you tied up here?"},
    // {se: ["train_starting.wav", "steam.mp3"]},
    // {msg: "!!!"},
    // {msg: "Suddenly, the ground under your feet lurches forwards,  hurling you face first onto the " +
    // "hard ground.  The sound of creaking metal and angry hissing fills the air,  like a sleeping " + 
    // "metallic beast was coming back to life."},
    {bgm: "train_moving.wav"},
    {msg: "This churning sound.  A train?"},
    {msg: "(What am I doing on a train?)"},
    {msg: "You desperately wrack your brain, trying to remember something, anything!"},
    {msg: "The moment something seems to flicker in your mind,  a searing hot pain shoots through your "+
    "temples,  drowning out any possibility of a memory with excruciating static.  The pain disappears "+
    "almost as soon as it appeared."},
    {msg:"(…I-it’s no good.  I just can’t remember anything without bringing on a debilitating migraine.  "+
    "How cliche.)"}

  ];

// EX.) CHOICE MENU
//   { choice: "Do you like it?", ans: [
//     { msg: "yes", next: "like_yes" },
//     { msg: "no", next: "like_no" },
//   ] },

// EX.) SPRITE/BACKGROUND IMAGE CHANGE
// { sprite: " ", bgImg: ""}, 


