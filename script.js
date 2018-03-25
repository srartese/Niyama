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
var numYolks = 50;
//var yolkTimer;


var game = new Phaser.Game(1200, 650, Phaser.AUTO, 'phaser-example', 
{ 
    preload: preload, 
    create: create, 
    update: update, 
    render: render 
});

function preload() {
    var graphics = game.add.graphics(0, 0);
    // Load sprite sheet and map to Json File
    game.load.atlas('yolky', 'assets/yolkSheet.png', 'assets/yolkSheet.json',Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('smile', 'assets/menu-smile.png');
    game.load.image('hug', 'assets/menu-hug.png');
    game.load.image('five', 'assets/menu-highFive.png');

    game.stage.backgroundColor = '#2E4057';
}

function create() {
    //Multi-touch functions... 6 touches
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();

    // Add group to the game
    yolkWorld = game.add.physicsGroup(Phaser.Physics.ARCADE)

    //this.rect = new Phaser.Rectangle(50, 50, 1100, 600);

    interactions = 0;
    yolkCounter = 0;

    lifeTimer = game.time.create(false);
    lifeTimer.loop(1000, lifeCycle, this);

    // Create a repeating delay for the creation of each yolk
    game.time.events.repeat(Phaser.Timer.SECOND * 2, numYolks, addYolk, this);


   // Create an array of the amount of yolks for the world
    for( var i = 0; i < numYolks; i++)
    {
     allYolks[i] = allYolks.push("yolk" + i);
    }

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

    // Movement speed based on birthNumber
    if(childYolk.myHappiness() <= 3){
     childYolk.body.velocity.set(game.rnd.integerInRange(-1, 1), game.rnd.integerInRange(-1, 1));  
    } 
    if(childYolk.myHappiness() >= 4 && childYolk.myHappiness() <=6 ){
      childYolk.body.velocity.set(game.rnd.integerInRange(-20, 20), game.rnd.integerInRange(-20, 20));  
    } 
    else
         childYolk.body.velocity.set(game.rnd.integerInRange(-50, 50), game.rnd.integerInRange(-50, 50)); 

    //yolkWorld.alignIn(this.rect, Phaser.RIGHT_CENTER);

    // Yolks cannot leave the square assigned as the world
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
        // sprite.sm.transition('sad_to_neutral', 'sad', 'neutral', changeState ); 
           if(sprite.interacted.currentState == "static"){
                sprite.interacted.transition('static_to_interacting', 'static', 'interacting', changeState);
                showMenu(sprite, this.id, this.happiness);
           }
           else
           console.log("its already interacting");
    }
    if(sprite.sm.currentState == "neutral"){
        //sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState );
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

// Display menu with icon items and touch events
function showMenu(sprite, menuid, happiness){
        var highFive = sprite.addChild(game.make.sprite(-40, -20, 'five'))
        highFive.inputEnabled = true;
        highFive.input.useHandCursor = true;
        highFive.events.onInputDown.add(fiver,sprite); 

        var hug = sprite.addChild(game.make.sprite(20, -40, 'hug'))
        hug.inputEnabled = true;
        hug.input.useHandCursor = true;
        hug.events.onInputDown.add(hugged,this); 

        var smile = sprite.addChild(game.make.sprite(80, -20, 'smile'))
        smile.inputEnabled = true;
        smile.input.useHandCursor = true;
        smile.events.onInputDown.add(smileKid, this);  


    //if sprite moves at stopped guy, he starts moving
    // timer to close menu
}

// Close all items in the interaction menu
function closeMenu(sprite){
    var parent = sprite.parent;
    for(var i = 2; i >= 0; i--){
        parent.children[i].destroy()
    }
}

// FUNCTIONS FOR USER INTERACTION ICONS
    // High Five Icon tapped
function fiver(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    feelGood(sprite.parent);
    increaseHappiness(sprite.parent);
    closeMenu(sprite);
}
    // Hug Icon tapped
function hugged(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    increaseHappiness(sprite.parent);
    closeMenu(sprite);
}

    // Smile Icon tapped
function smileKid(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    increaseHappiness(sprite.parent);
    closeMenu(sprite);
}

// Increase happiness from interaction states
function increaseHappiness(sprite){
    //If interacting with Sad yolk, always made happy. 
    sprite.happinessScale = sprite.happinessScale + 7;

    //If adding goes about max happiness 10, keep at 10
    if(sprite.happinessScale > 10)
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

    // Start ripple effect
}

// Brings he yolk back to normal and stops the ripple effect
function normalizeIt(){
    console.log("DONE RIPPLING");
    this.interacted.transition('inspired_to_static', 'inspired', 'static', changeState );
    this.ripple.remove();
}

// When Yolk created start happiness decay over time
function lifeCycle(){
    yolkWorld.forEach(function(yolk) {
        
        // Decay happiness based on birthNumber and rate
        if(yolk.birthNumber >= 2){
            console.log("Before: " + yolk.happinessScale);
            var equation = 11/ (yolk.birthNumber * 7);
            yolk.happinessScale = yolk.happinessScale - equation;
        }
        else if(yolk.birthNumber = 1){
            console.log(yolk.happinessScale);
            var equation = 11/12;
            yolk.happinessScale = yolk.happinessScale - equation;
        }

        else if(yolk.birthNumber = 0){
            var equation = 11/10;
            yolk.happinessScale = yolk.happinessScale - equation;   
        }

        //Check happiness to change state and animation
        if(yolk.happinessScale < 7 && yolk.happinessScale > 3)
        {
            yolk.sm.transition('happy_to_neutral', 'happy', 'neutral', changeState);
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

        console.log("After: " + yolk.happinessScale);
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

// Update Function
function update() {
    // Adds collisions to all Yolks
    this.game.physics.arcade.collide(yolkWorld);
    lifeTimer.start();
    
}

// Render Function
function render () {

}

     