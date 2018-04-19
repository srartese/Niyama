/* 
    Main Class for Niyama 2018
    Handles user input and state changes/ rendering
    by Sara Artese
*/ 
"use strict";

//world Variables
var app = app || {};
var bounds;
var fullScreen;
var lifeTimer;


//Yolk variables
var yolkWorld;
var allYolks = [];
var childYolk;
var interactions;
var yolkCounter;
var numYolks = 5;
//var yolkTimer;

//1620 x 1080. So the program just needs to have a 150 px bar on both sides 3840, 2560, 
var game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'phaser-example', 
{ 
    preload: preload, 
    create: create, 
    update: update, 
    render: render 
});

function preload() {
    var graphics = game.add.graphics(0, 0);

    // Load sprite sheet and map to Json File   
    game.load.atlas('yolky', 'assets/Everything.png', 'assets/Everything.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('smile', 'assets/menu-smile.png');
    game.load.image('hug', 'assets/menu-hug.png');
    game.load.image('five', 'assets/menu-highFive.png');
    game.load.image("background", "assets/NiyamaFinalBG.png");
}

function create() {

    //disable right click
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

    //Multi-touch functions... up to 10 touches
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();

    game.add.sprite(0, 0, "background");

    // Add group to the game
    yolkWorld = game.add.physicsGroup(Phaser.Physics.ARCADE)

    //this.rect = new Phaser.Rectangle(50, 50, 1100, 600);

    interactions = 0;
    yolkCounter = 0;

    lifeTimer = game.time.create(false);
    lifeTimer.loop(3000, lifeCycle, this);

    // Create a repeating delay for the creation of each yolk
    //game.time.events.repeat(Phaser.Timer.SECOND * 2, numYolks, addYolk, this);


   // Create an array of the amount of yolks for the world
    for( var i = 0; i < numYolks; i++)
    {
     allYolks[i] = allYolks.push("yolk" + i);
    }

    for (var j = 0; j < allYolks.length; j++){
        addYolk();
    }

     // Start Life Cycle Delay
     lifeTimer.start();

    // Resize to fill full screen
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
    fullScreen = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    fullScreen.onDown.add(gofull, this);
}




//Adds the yolk into the world at start delay
function addYolk(){

    childYolk = yolkWorld.add(new Yolk(game, allYolks[yolkCounter], game.rnd.integerInRange(0, 10)));
    childYolk.inputEnabled = true;
    childYolk.input.useHandCursor = true;
    childYolk.events.onInputDown.add(iTapped,{happiness: childYolk.myHappiness(),id: childYolk.myID() });
    childYolk.anchor.setTo(0.5, 0.5);

    //random variable for colision boxes
    childYolk.body.setCircle(30,  (-35 + 0.5 * childYolk.width  / childYolk.scale.x),
    (-35 + 0.5 * childYolk.height / childYolk.scale.y)
)
    if( Math.random() < 0.1)
    {
       childYolk.body.checkCollision.none  = true;
    }

    // Movement speed based on birthNumber
    if(childYolk.myHappiness() <= 3){
     childYolk.body.velocity.set(game.rnd.integerInRange(-1, 1), game.rnd.integerInRange(-1, 1));  
    } 
    if(childYolk.myHappiness() >= 4 && childYolk.myHappiness() <=6 ){
      childYolk.body.velocity.set(game.rnd.integerInRange(-20, 20), game.rnd.integerInRange(-20, 20));  
    } 
    else
         childYolk.body.velocity.set(game.rnd.integerInRange(-50, 50), game.rnd.integerInRange(-50, 50)); 

    yolkWorld.setAll('body.collideWorldBounds', true);
    yolkWorld.setAll('body.bounce.x', 1);
    yolkWorld.setAll('body.bounce.y', 1);

    // Give each yolk the proper number from what would be in a loop     
    yolkCounter++
}


// When Yolk is interacted with
function iTapped(sprite, pointer, happiness) {
    //console.log("current state: " + sprite.sm.currentState);
    console.log("Happiness: " + sprite.happinessScale);
    // console.log("ID: " + this.id);
    console.log(sprite.interacted.currentState)


    if(sprite.sm.currentState == "sad"){
        sprite.body.velocity.set(game.rnd.integerInRange(0, 0), game.rnd.integerInRange(0, 0)); 
        if (sprite.body.checkCollision.none  == false){
            sprite.body.checkCollision.none  = true
        }
       // sprite.bringToTop();
           if(sprite.interacted.currentState == "static"){
            sprite.sm.transition('tapped', 'sad', 'major_tapped', changeState);
                sprite.interacted.transition('static_to_interacting', 'static', 'interacting', changeState);
                makeHappy(sprite, this.id, this.happiness);
           }
           else
            console.log("its already interacting");
    }
    if(sprite.sm.currentState == "neutral"){
        sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState );
        console.log("BURST");
        interactions++;
        sprite.happinessScale = sprite.happinessScale + 3;
        console.log(sprite.happinessScale);
        checkState(sprite);
    }

    if(sprite.sm.currentState == "happy"){
        console.log("BURST");
        interactions++;
        if (sprite.happinessScale < 10)
            sprite.happinessScale = sprite.happinessScale + 1;
        else 
            sprite.happinessScale = sprite.happinessScale;

        console.log(sprite.happinessScale);
        checkState(sprite);
     }
}


function makeHappy(sprite, id, happiness){

    //chose random action of the 3 and continue forwards
    var chance = game.rnd.integerInRange(0, 2);
    switch(chance){
        case 0:            
           sprite.sm.transition('hugged', 'major_tapped', 'major_hug', changeState);
            break;
        case 1:
            sprite.sm.transition('smiled', 'major_tapped', 'major_smile', changeState);
            break;
        case 2:
            sprite.sm.transition('highFived', 'major_tapped', 'major_highFive', changeState);
            break;
        default:
            break;
    }
    game.time.events.add(2000, function () {
        joinHappy(sprite);
    });
}


function joinHappy(sprite){
    //move to happy 
    //increase happiness
    increaseHappiness(sprite); 
    //inspire state
    console.log("normal")
    sprite.interacted.transition('interacting_to_inspired', 'interacting', 'inspired', changeState);
   
}

// Brings he yolk back to normal and stops the ripple effect
function normalizeIt(sprite){
    console.log("animation ");
    //After the state is chosen, choose which animation to show inorder to prep for rising state
    switch(sprite.sm.currentState){
        case 'major_hugged':            
            sprite.sm.transition('rising_happy', 'major_hug', 'rising_to_happy', changeState);
            break;
        case 'major_smile':
            sprite.sm.transition('rising_happy', 'major_smile', 'rising_to_happy', changeState);
            break;
        case 'major_highFive':
           sprite.sm.transition('rising_happy', 'major_highFive', 'rising_to_happy', changeState);
            break;
        default:
            break;
    }
    sprite.interacted.transition('inspired_to_static', 'inspired', 'static', changeState );
    sprite.sm.transition('normal', 'rising_to_happy', 'happy', changeState);
    
    sprite.ripple.remove();
}


// FUNCTIONS FOR USER INTERACTION ICONS
    // High Five Icon tapped
function fiver(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    feelGood(sprite.parent);
    increaseHappiness(sprite.parent);
    this.timer.running = false;
    closeMenu(sprite);
}
    // Hug Icon tapped
function hugged(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    increaseHappiness(sprite.parent);
    this.timer.running = false;
    closeMenu(sprite);
}

    // Smile Icon tapped
function smileKid(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    increaseHappiness(sprite.parent);
    this.timer.running = false;
    closeMenu(sprite);
}


//decay rate to up 6 


// Increase happiness from interaction states
function increaseHappiness(sprite){
    //If interacting with Sad yolk, always made happy. 
   // sprite.happinessScale = sprite.happinessScale + 7;
   console.log(sprite)
   sprite.happinessScale = 10;
    //If adding goes about max happiness 10, keep at 10
    if(sprite.happinessScale >= 10)
        sprite.happinessScale = 10;
        interactions++;
        console.log("Happiness: " + sprite.happinessScale);
        console.log(interactions);
}


// If happiness is more than 6, the animation and state should change to match
function checkState(sprite){
    if(sprite.happinessScale > 6)
        sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState);

}

// Predicate function used for transition
function changeState()
{
    return childYolk.sm.initialState == "sad";
}



function feelGood(sprite){ // Deals with the change when interacted with
    sprite.interacted.transition('interacting_to_inspired', 'interacting', 'inspired', changeState );
    console.log("inspired " + sprite.interacted.currentState)
    console.log(sprite)
    
    // Start timer
    sprite.ripple.start();
   // sprite.moveToXY(sprite, 100, 100); 
    //sprite.moveTo(sprite, 100, 200);
    // Start ripple effect interaction - once movement programed in
}

// When Yolk created start happiness decay over time
function lifeCycle(){
    yolkWorld.forEach(function(yolk) {
        
        // Decay happiness based on birthNumber and rate
        if(yolk.birthNumber >= 2){
           // console.log("Before: " + yolk.happinessScale);
            var equation = 11/ (yolk.birthNumber * 7);
            yolk.happinessScale = yolk.happinessScale - equation;
        }
        else if(yolk.birthNumber == 1){
           // console.log(yolk.happinessScale);
            var equation = 11/12;
            yolk.happinessScale = yolk.happinessScale - equation;
        }

        else if(yolk.birthNumber == 0){
            var equation = 11/10;
            yolk.happinessScale = yolk.happinessScale - equation;   
        }

        //Check happiness to change state and animation
        if(yolk.happinessScale < 6 && yolk.happinessScale > 3)
        {
           // if(yolk.happinessScale > 3){
                yolk.sm.transition('happy_to_neutral', 'happy', 'neutral', changeState);
            //}
        }
        else if(yolk.happinessScale < 3)
        {
            yolk.sm.transition('neutral_to_sad', 'neutral', 'sad', changeState);
        }

        // When happiness = 0 stop decay
        if(yolk.happinessScale < 0)
        {
            yolk.happinessScale = 0;
        }
       // console.log("After: " + yolk.happinessScale);
    });
}

// Function to change to full screen view
function gofull() {
    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }
}

// For every collision there is a chance of a random  interaction
function collisionHandler(yolk1, yolk2){
    var positiveInteraction = game.rnd.integerInRange(0, 100);
    // 1/100 chance its positive
    if(positiveInteraction == 50)
    {
        // Increase happinessScale for both yolks
        yolk1.happinessScale = yolk1.happinessScale + 1;
        yolk2.happinessScale = yolk1.happinessScale + 1;
    }
}

//Check Movement
function yolkMovement(){
    //check each y location of each yolk
    //if state == sad and y location > 3/5
    // if state == neutral and y location < 3/5  && > 4/5
    //if state == happy and y loc < 4/5
    //[1 2 [3] [4] 5]
    // 0
    // 216 
    // 432
    // 648
    // 1020
    yolkWorld.forEach(function(yolk) {
        if (yolk.sm.currentState == "sad" && yolk.y < 648 ) {
            yLoc = game.rnd.integerInRange(648,1070);
            console.log("yolk.y");
        }  
        else 
        yLoc = game.rnd.integerInRange(0,648);
        
    });

}

// Update Function
function update() {
    // Adds collisions to all Yolks
    this.game.physics.arcade.collide(yolkWorld, yolkWorld, collisionHandler, null, this);
   // yolkMovement();
}

// Render Function
function render () { 
    //game.debug.body(childYolk);
    console.log(childYolk.happinessScale);
}

     