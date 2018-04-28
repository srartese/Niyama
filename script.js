/* 
    Main Class for Niyama 2018
    Handles user input and state changes/ rendering
    by Sara Artese
*/ 
"use strict";

//world Variables
var bounds;
var fullScreen;
var lifeTimer;


//Yolk variables
var yolkWorld;
var allYolks = [];
var childYolk;
var interactions;
var rippleEffected;
var yolkCounter;
var numYolks = 200;
//var yolkTimer;

//1620 x 1080. So the program just needs to have a 150 px bar on both sides 3840, 2560, 
var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'phaser-example', 
{ 
    preload: preload, 
    create: create, 
    update: update, 
    render: render 
});

function preload() {
    var graphics = game.add.graphics(0, 0);

    // Load sprite sheet and map to Json File   
    game.load.atlas('yolky', 'assets/Everything-v4.png', 'assets/Everything-v4.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image("background", "assets/NiyamaFinalBG.png");
}

function create() {

    //disable right click
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

    //start physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

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

    interactions = sessionStorage.getItem('interactions');
    rippleEffected = sessionStorage.getItem('rippleEffected');
    yolkCounter = 0;

    lifeTimer = game.time.create(false);
    lifeTimer.loop(6000, lifeCycle, this);

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

    var chance =  game.rnd.integerInRange(0, 10);
    var yolkNum;
    if(chance <= 3)
    {
        yolkNum = game.rnd.integerInRange(0, 3);
    }
    else if(chance > 3 && chance <= 6)
    {
        yolkNum = game.rnd.integerInRange(4, 6);
    }
    if(chance >= 7)
    {
        yolkNum = game.rnd.integerInRange(7, 10);
    }

    childYolk = yolkWorld.add(new Yolk(game, allYolks[yolkCounter], yolkNum));
    childYolk.inputEnabled = true;
    childYolk.input.useHandCursor = true;
    childYolk.events.onInputDown.add(iTapped,{happiness: childYolk.myHappiness(),id: childYolk.myID() });
    childYolk.anchor.setTo(0.5, 0.5);
    game.physics.enable(childYolk, Phaser.Physics.ARCADE);

    //random variable for colision boxes
    childYolk.body.setCircle(20,  (-35 + 0.5 * childYolk.width  / childYolk.scale.x),
    (-35 + 0.5 * childYolk.height / childYolk.scale.y)
)
    if( Math.random() < 0.2)
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
    // console.log("Happiness: " + sprite.happinessScale);
    console.log(sprite.interacted.currentState)
    console.log(sprite.sm.currentState)
    
    //SAD YOLK TAPPED
    if(sprite.sm.currentState == "sad"){
        sprite.body.velocity.set(game.rnd.integerInRange(0, 0), game.rnd.integerInRange(0, 0)); 
           if(sprite.interacted.currentState == "static"){
            sprite.inputEnabled = false;
            sprite.sm.transition('tapped', 'sad', 'major_tapped', changeState);
                sprite.interacted.transition('static_to_interacting', 'static', 'interacting', changeState);
                makeHappy(sprite, this.id, this.happiness);
           }
    }

    // NEUTRAL YOLK TAPPED
    if(sprite.sm.currentState == "neutral"){

        sprite.body.velocity.set(game.rnd.integerInRange(0, 0), game.rnd.integerInRange(0, 0)); 
        sprite.sm.transition('major_neutral', 'neutral', 'major_neutral', changeState );

        interactions++;
        sprite.happinessScale = 10;
        game.time.events.add(4000, function () {
            majorInteraction(sprite);
        });      
    }

    // HAPPY YOLK TAPPED
    if(sprite.sm.currentState == "happy"){
      
        sprite.sm.transition('major_happy', 'happy', 'major_happy', changeState );
    
        interactions++;

        if (sprite.happinessScale < 10)
            sprite.happinessScale = sprite.happinessScale + 1;
        else 
            sprite.happinessScale = 10;
     }
      
     game.time.events.add(4000, function () {
        majorInteraction(sprite);
    });

}

function majorInteraction(sprite){
    switch(sprite.sm.currentState){
        case 'major_neutral':
            sprite.sm.currentState = 'happy';
            break;
        case 'major_happy':
            sprite.sm.transition('happy', 'major_happy', 'happy', changeState );
            break;
        default:
        break;
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
    game.time.events.add(4000, function () {
        joinHappy(sprite);
    });
}

function joinHappy(sprite){
    increaseHappiness(sprite); 
    sprite.interacted.transition('interacting_to_inspired', 'interacting', 'inspired', changeState);

    game.physics.arcade.moveToXY(sprite, game.rnd.integerInRange(50, sprite.x), 50, 50);

    game.time.events.add(7000, function () {
        normalizeIt(sprite);
    });
//     var tween = game.add.tween(sprite).to({
//         x: [pointsArray[0].x, pointsArray[1].x, pointsArray[2].x, pointsArray[3].x],
//         y: [pointsArray[0].y, pointsArray[1].y, pointsArray[2].y, pointsArray[3].y],
//    }, 5000,Phaser.Easing.Quadratic.InOut, true, 0, -1).interpolation(function(v, k){
//         return Phaser.Math.bezierInterpolation(v, k);
//    }); 
}

function rippleEffect(sprite, rippled){

    var rippleNum = game.rnd.integerInRange(0, 10);


     if(sprite.interacted.currentState == "inspired"){
        if(rippleNum < 1){
            rippleEffected++;
         var state = rippled.sm.currentState;
         switch (state){
             case 'happy':
             //console.log("hhhhh");
             rippled.happinessScale++;
             rippled.sm.transition('inspireH', 'happy', 'major_happy', changeState);
             unRippled(rippled);
                break;
            case 'neutral':
           // console.log("nnnnn");
            rippled.happinessScale++;
            rippled.sm.transition('inspireN', 'neutral', 'major_neutral', changeState);
            unRippled(rippled);
                break;
            case 'sad':
               // console.log("ssssss");
                rippled.happinessScale++;
                break;
            default:
                break;
         }
        }
     }
    
     if(rippled.interacted.currentState == "inspired")
    {
        var state2 = sprite.sm.currentState;
        if(rippleNum < 4){
            rippleEffected++;
        switch (state2){
            case 'happy':
            //console.log("h2");
            sprite.happinessScale++;
            sprite.sm.transition('insired', 'happy', 'major_happy', changeState);
            unRippled(sprite);
               break;
           case 'neutral':
           //console.log("n2");
           sprite.happinessScale++;
           sprite.sm.transition('insired', 'neutral', 'major_neutral', changeState);
           unRippled(sprite);
               break;
           case 'sad':
            //console.log("s2");
            sprite.happinessScale++;
               break;
            default:
                break;
        }
    }
    }
}

//Bring inspired yolks back to normal state after rippled
function unRippled(yolk){
    //check happiness scale too
    switch(yolk.sm.transition.currentState)
    {
        case 'major_happy':
            yolk.sm.transition('happy', 'major_happy', 'happy', changeState );
        break;
        case 'major_neutral':
            yolk.sm.transition('neutral', 'major_neutral', 'neutral', changeState );
        break;
        default:
        break;
    }
}

// Brings the yolk back to normal 
function normalizeIt(yolk){
    var sprite = yolk;
    sprite.inputEnabled = true;
    //After the state is chosen, choose which animation to show inorder to prep for rising state
    switch(sprite.sm.currentState){
        case 'major_hug':            
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
    
    game.time.events.add(7000, function () {
            justHappy(sprite);
    });
}

function justHappy(sprite){
    sprite.sm.transition('normal', 'rising_to_happy', 'happy', changeState);
}

// Increase happiness from interaction states
function increaseHappiness(sprite){
    //If interacting with Sad yolk, always made happy. 
   sprite.happinessScale = 10;
    //If adding goes about max happiness 10, keep at 10
    if(sprite.happinessScale >= 10)
        sprite.happinessScale = 10;
        interactions++;
        //console.log("Happiness: " + sprite.happinessScale);
        //console.log(interactions);
}

// Predicate function used for transition
function changeState()
{
    return childYolk.sm.initialState == "sad";
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
    if(positiveInteraction == 50)
    {
        // Increase happinessScale for both yolks
        yolk1.happinessScale = yolk1.happinessScale + 2;
        yolk2.happinessScale = yolk1.happinessScale + 2;
    }
}

function checkSadness(yolk){
    var countYolk = 0;
    
    yolkWorld.forEach(function(yolk) {
        if(yolk.sm.currentState == "sad")
        {
            countYolk = countYolk +1;
            if(countYolk = (numYolks*.9)){
                console.log("stop time");
                
            }
        }
    });
}

//Check Movement
function yolkMovement(){
    //check each y location of each yolk
    //if state == sad and y location > 3/5  = (height/5) * 3
    // if state == neutral and y location < 3/5  && > 4/5
    //if state == happy and y loc < 4/5
    //[1 2 [3] [4] 5]

    var yLoc;
    
    yolkWorld.forEach(function(yolk) {
    
        if (yolk.sm.currentState == "sad" && yolk.y < (window.innerHeight/5) * 3 ) {
            yolk.body.velocity.y = 20 * 1;           
        } 
       else if (yolk.sm.currentState == "neutral" && yolk.y < (window.innerHeight/5) * 2 ) {
            yolk.body.velocity.y = 25 * 1; 
        } 
        else if (yolk.sm.currentState == "neutral" && yolk.y > (window.innerHeight/5) * 4 ) {
            yolk.body.velocity.y = -25 * 1; 
        } 
        else if (yolk.sm.currentState == "happy" && yolk.y > (window.innerHeight/5) * 2 ) {
            yolk.body.velocity.y = -30 * 1; 
        }
        else if (yolk.sm.currentState == "major_happy" && yolk.y > (window.innerHeight/5) * 2 ) {
            yolk.body.velocity.y = -30 * 1; 
        }
    });
}

function setStorage(){
    var updateStorage = game.rnd.integerInRange(0, 10);

    if(updateStorage < 5){
    if(sessionStorage.getItem('rippleEffected') === null ){
        sessionStorage.setItem('rippleEffected', 0);
    }
    else {
        sessionStorage.setItem('rippleEffected',rippleEffected);
    }
    
    if(sessionStorage.getItem('interactions') === null){
        sessionStorage.setItem('interactions', 0);
    }
    else {
        sessionStorage.setItem('interactions', interactions);
    }
}
    console.log("inter: " + sessionStorage.getItem('interactions'));
    console.log("ripple: " + sessionStorage.getItem('rippleEffected'));
    

}

// Update Function
function update() {
    //console.log(lifeTimer);
    yolkMovement();
    // Adds collisions to all Yolks
    //this.game.physics.arcade.collide(yolkWorld, yolkWorld, collisionHandler, null, this);

    this.game.physics.arcade.overlap(yolkWorld, yolkWorld, rippleEffect, null, this);
   
    setStorage();

}

// Render Function
function render () { 
   // game.debug.body(childYolk);
   // console.log(childYolk.happinessScale);
}

     