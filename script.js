"use strict";
var app = app || {};
var bounds;
var yolkWorld;
var fullScreen;
var allYolks = [];
var childYolk;

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

    game.stage.backgroundColor = '#2E4057';
}

function create() {
    // Add group to the game
    yolkWorld = game.add.group();
    
    var rect = new Phaser.Rectangle(50, 50, 1100, 600);

    // Create an array of the amount of yolks for the world
    for( var i = 0; i < 10; i++)
   {
     allYolks[i] = allYolks.push("yolk" + i);
    }
    // Populate the group with yolks that have own personalities
    for (var j = 0; j < allYolks.length; j++){
        //add a randomly assign birth number
       childYolk = yolkWorld.add(new Yolk(game, allYolks[j]));
       childYolk.inputEnabled = true;
       childYolk.input.useHandCursor = true;
       childYolk.events.onInputDown.add(iTapped, this);     
    }

    yolkWorld.alignIn(rect, Phaser.RIGHT_CENTER);

    // Resize to fill full screen
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
    fullScreen = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    fullScreen.onDown.add(gofull, this);
}

function iTapped(sprite, pointer) {
    console.log("current state: " + childYolk.sm.currentState);
    if(sprite.sm.currentState == "sad"){
        sprite.sm.transition('sad_to_neutral', 'sad', 'neutral', changeState );
    }
    if(sprite.sm.currentState == "neutral"){
        sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState );
    }
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
}

function render () {

}

     