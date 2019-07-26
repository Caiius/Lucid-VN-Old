// characters
const j = "Joel"; // Joel Emerson, off duty investigator for the local police 
const s = "Sidney"; // jounalist for an urban exploration blog
const r = "Remus"; // Remus Hawthorn, artist and owner of mansion

const DEFAULT_SPEED = 30;

var story = [
// CHAPTER 1: 
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
    {msg: "You could recognize this churning sound.  A train?"},
    {msg: "(What am I doing on a train?)"},
    {msg: "You desperately wrack your brain, trying to remember something, anything!"},
    {msg: "The moment something seems to flicker in your mind,  a searing hot pain shoots through your "+
    "temples,  drowning out any possibility of a memory with excruciating static.  The pain disappears "+
    "almost as soon as it appeared."},
    {msg:"(…I-it’s no good.)"},
    {msg: "How cliche."},
    {msg:"Despite your convenient amnesia,  the hair on the back of your neck just would stand down,  and your body felt stiff,  as if you were long anticipating some sort of "+
    "catastrophe to happen.  Something was very obviously wrong here."},
    {choice: "(I better try to find a way to get out of here.)", ans: [
      {msg: "Call for help", next: "call"},
      {msg: "Feel your way around", next: "feel"}
    ]},
    {label: "call", msg: "Hopefully whoever tied you to this chair wouldn't mind if you politely asked for some assistance.  Surely you aren't the only living person on this " +
    "train?  You inhale,  preparing to unleash a primal scream."},
    {msg: "*Wheeze*"},
    {msg: "The saddest rasp you ever heard escapes from your lips."},
    {msg: "(Looks like some things just don't change.)"},
    {label: "feel", msg: "Crouching down,  you carefully inch forwards until you could feel a cold metal wall.  You then let your fingers guide you throughout the compartment."},
    {msg: "(Huh?  What's this?)"},
    {msg: "Soon enough,  you bump into something further back,  something hard, leathery and rectangular."},
    {msg: "(It feels like a suitcase.  Perhaps I'm stuck in a luggage compartment?)"},
    {msg: "Sure enough,  you soon could feel what could only be a handle and several tightly closed metal clasps. "},
    // {se: [lock]},
    {msg: "(Damn,  it's locked!)"},
    // {se: [headPounding]}, // distort screen again?
    {msg: "(Ugh...  The ringing...  it's getting worse...)"},
    {msg: "You fall to your knees,  the intense pain cutting through your temples unforgivingly like an ice pick."},
    {msg: "(...My head...  it's splitting!)"},
    {msg: "(uuUuuaARGHH!!)"},
    // {se: "[]"}, // Maybe some sort of sharp sound?
    // {bgImg: "white.jpg"}, // distortion continues
    {msg: "(W-what... what the hell is happening?)"},
    // {sprite: ""} // show ghostly girl kneeling in front of the open suitcase with a flashlight --> key position 
    {se: ["surprise.wav"]},
    {msg: "(Who is that?  A... woman?)"},
    {msg: "Still confused and wincing in pain, you tentatively reach out a hand."},
    {img: "passThrough.jpg"},
    {se: ["surprise.wav"]},
    {msg: "!!!"},
    {msg: "Recoiling, you jerk back instantly."},
    {msg: "(No way...  I-  I must be dreaming right now.)"},
    {msg: "But it was no dream.  And somewhere in dark recesses of your mind,  you even feel a spark of recognition."},
    {msg: "(...Do I know this person?)"},
    {msg: "You instinctively reach towards your neck, continuing to observe the ghostly figure."},
    {msg: "She's hunched over the suitcase,  a flashlight in hand.  She appears to be examining "+
    "something else within the case,  but you couldn't quite make out what it was.  Her wrists were slightly "+
    "red as well,  and you could just make out the rope markings.  So she's in the same position as you right now."},
    {msg: "Something shiny glints on the floor by the woman's foot."}, 
    // {se: ["realization"]},
    {msg: "(A key!)"},
    {msg: "So there must be a key somewhere in this compartment!  Now it's just a matter of figuring out " +
    "where she got it from."},
    {msg: "Suddenly,  the air starts to turn cold and clammy,  the strange miasma sending shivers down your spine."},
    {img: "hide"},
    {msg:" Soon enough, the whole scene dissipates, leaving you with only the slight feeling of pins and "+
    "needles as well as numerous biting questions.  Your vision clears too,  although it was still pitch black,  " +
    "so that didn't really matter."},
    {msg: "(What just happened?)"},
    {msg: "Did you just have some sort of spontaneous hallucination?  Maybe whoever " +
    "tied you up drugged you as well."},

    {label: "introKeyChoice", choice: " You shake your head.  You dodn't have time to figure out the story " +
    "behind these foreboding ghostly visions.  That's right,  you got to find that key.  Then you give "+
    "yourself permission to freak out.", ans: [
      {msg:"Search the right side", next:"introRight"},
      {msg:"Search the aisle center", next:"introCenter"},
      {msg:"Search the left side", next:"introLeft"}
    ]},

    {label:"introRight", msg: "Your eyes had adjusted to the dark,  so you could just make out the outline "+
    "of something in the right back corner of the compartment."},
    {msg: "(Now that I think about it,  I don't think this thing was here during my vision.)"},
    {msg: "(It feels like some sort of statue.  Weird.)"},
    //{se: []},
    {msg: "(Ah,  I see.)", next: "smash"},
    {label:"introCenter", msg: "(.................)"},
    {msg: "(No,  I don't think anything is here.)", next: "introKeyChoice"},
    {label:"introLeft", msg: "(...Nope.  I must be missing something from before.)", next: "introKeyChoice"},
    {label: "smash", msg: "Luckily, the statue wasn't very heavy.  You hold the statue high over your head.  You then pitch it straight downwards towards your feet."},
    //{se:[]}, // statue smashing
    {msg: "(There's the key.)"},
    //{se: ["itemGet.mp3"]},
    {msg:"(Now,  for the suitcase.)"},
    {msg: "You fumble around with the key in the dark,  but it doesn't take too long to unlock the case."},
    //{se: ["unlock"]},
    {msg: "You quickly swing open the lid.  Inside,  you find a flashlight,  several articles of clothing,  a "+
    "strange bronze medallion, and lastly,  a crumpled envelope."},
    //{se: ["itemGet"]},
    {msg: "Turning on the flashlight,  you pick up the envelope,  carefully removing the wrinkled letter inside.  Something nonsensical was hastily scribbled on the paper in smudged pencil."},
    //{img:},
    // start creepy but subtle creaking se; starts faint but gets louder until player turns around
    {msg: "('Across the parallels,  find the perpendicular'...what does this even mean?)"},
    {msg: "The pounding in your head gets slightly stronger,  then ebbs away."},
    {msg: "Next,  you pick  up the medallion.  It's heavier and denser than it looks,  and is quite banged and scratched up."},
    {msg:""},
    {msg: "(I guess I'll just hold on to these for now.)"},
    {msg: "[Obtained flashlight, medallion, and envelope]"},
    {msg: "[Press the 'i' key or the inventory button in order to access your inventory.]"},
    {se: [""]}, // sounds
    {msg: "(...)"}

    // You feel something resembling hope starting to bubble in your chest. 

  ];



