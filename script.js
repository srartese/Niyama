"use strict";
//world Variables
var app = app || {};
var bounds;
var fullScreen;

//Yolk variables
var yolkWorld;
var allYolks = [];
var childYolk;
var interactions;

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
    //yolkWorld = game.add.group(Phaser.Physics.ARCADE)
    
    var rect = new Phaser.Rectangle(50, 50, 1100, 600);

    interactions = 0;
    // Create an array of the amount of yolks for the world
    for( var i = 0; i < 50; i++)
   {
     allYolks[i] = allYolks.push("yolk" + i);
    }
    // Populate the group with yolks that have own personalities
    for (var j = 0; j < allYolks.length; j++){

       childYolk = yolkWorld.add(new Yolk(game, allYolks[j], game.rnd.integerInRange(0, 10)));
       childYolk.inputEnabled = true;
       childYolk.input.useHandCursor = true;
       childYolk.events.onInputDown.add(iTapped,{happiness: childYolk.myHappiness(),id: childYolk.myID() });  

       //console.log(childYolk);
       //Movement speed based on birthNumber
       if(childYolk.myHappiness() <= 3){
        childYolk.body.velocity.set(game.rnd.integerInRange(-1, 1), game.rnd.integerInRange(-1, 1));  
       } 
       if(childYolk.myHappiness() >= 4 && childYolk.myHappiness() <=6 ){
         childYolk.body.velocity.set(game.rnd.integerInRange(-20, 20), game.rnd.integerInRange(-20, 20));  
       } 
       else
            childYolk.body.velocity.set(game.rnd.integerInRange(-50, 50), game.rnd.integerInRange(-50, 50));  
    }
    yolkWorld.alignIn(rect, Phaser.RIGHT_CENTER);

    yolkWorld.setAll('body.collideWorldBounds', true);
    yolkWorld.setAll('body.bounce.x', 1);
    yolkWorld.setAll('body.bounce.y', 1);

    // Resize to fill full screen
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
    fullScreen = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    fullScreen.onDown.add(gofull, this);
}

function iTapped(sprite, pointer, happiness) {
    //console.log("current state: " + sprite.sm.currentState);
    console.log("Happiness: " + sprite.happinessScale);
   // console.log("ID: " + this.id);

    if(sprite.sm.currentState == "sad"){
        sprite.body.velocity.set(game.rnd.integerInRange(0, 0), game.rnd.integerInRange(0, 0));   
        // sprite.sm.transition('sad_to_neutral', 'sad', 'neutral', changeState ); 
           if(sprite.interacted.currentState == "static"){
                sprite.interacted.transition('static_to_interacting', 'static', 'interacting', changeState );
                showMenu(sprite, this.id, this.happiness);
           }
           else
           console.log("its already interacting");
    }
    if(sprite.sm.currentState == "neutral"){
        //sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState );
        console.log("burst");
        interactions++;
        sprite.happinessScale = sprite.happinessScale + 1;
        checkState(sprite);
    }

    if(sprite.sm.currentState == "happy"){
        console.log("happy"); 
     }
}

function moveYolk(){

}

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

function closeMenu(sprite){
    sprite.parent.interacted.transition('interacting_to_static', 'interacting', 'static', changeState );
    var parent = sprite.parent;
    //close all items in the menu
    for(var i = 2; i >= 0; i--){
        parent.children[i].destroy()
    }
}

function fiver(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    increaseHappiness(sprite.parent);
    closeMenu(sprite);
}

function hugged(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    increaseHappiness(sprite.parent);
    closeMenu(sprite);
}

function smileKid(sprite, pointer){
    sprite.parent.sm.transition('sad_to_happy', 'sad', 'happy', changeState);
    increaseHappiness(sprite.parent);
    closeMenu(sprite);
}

function increaseHappiness(sprite){
    //increase happiness from interaction states
    sprite.happinessScale = sprite.happinessScale + 6;
    

    if(sprite.happinessScale > 10)
        sprite.happinessScale = 10;
        interactions++;
        console.log("Happiness: " + sprite.happinessScale);
        console.log(interactions);
}

function checkState(sprite){
    if(sprite.happinessScale > 6)
        sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState);
}

// Predicate function used for transition
function changeState()
{
    return childYolk.sm.initialState == "sad";
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

function update() {
    this.game.physics.arcade.collide(yolkWorld);
}

function render () {

}

     