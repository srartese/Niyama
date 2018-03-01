"use strict";
var app = app || {};
var bounds;
var yolkWorld;
var fullScreen;
var allYolks = [];
var childYolk;
var highFive;
var hug;
var smile;

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

    // Add group to the game
    yolkWorld = game.add.physicsGroup(Phaser.Physics.ARCADE)
    
    var rect = new Phaser.Rectangle(50, 50, 1100, 600);

    // Create an array of the amount of yolks for the world
    for( var i = 0; i < 10; i++)
   {
     allYolks[i] = allYolks.push("yolk" + i);
    }
    // Populate the group with yolks that have own personalities
    for (var j = 0; j < allYolks.length; j++){

       childYolk = yolkWorld.add(new Yolk(game, allYolks[j], game.rnd.integerInRange(0, 10)));
       childYolk.inputEnabled = true;
       childYolk.input.useHandCursor = true;
       childYolk.events.onInputDown.add(iTapped,{happiness: childYolk.myHappiness()});  

       console.log(childYolk);
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

function iTapped(sprite, pointer) {
    console.log("current state: " + sprite.sm.currentState);
    console.log("Happiness: " + this.happiness);
    console.log(sprite.sm);

    console.log(sprite.myHappiness());
    if(sprite.sm.currentState == "sad"){
        sprite.body.velocity.set(game.rnd.integerInRange(0, 0), game.rnd.integerInRange(0, 0));   
        sprite.sm.transition('sad_to_neutral', 'sad', 'neutral', changeState ); 
        showMenu(sprite);
        //if menu item clicked increase happiness and add movement
        this.happiness = 6;  
    }
    if(sprite.sm.currentState == "neutral"){
        //sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState );
        this.happiness = 10;
    }

    if(sprite.sm.currentState == "happy"){
        //sprite.sm.transition('neutral_to_happy', 'neutral', 'happy', changeState );
         this.happiness = 10;
     }
}

function moveYolk(){

}

function showMenu(sprite){
    console.log(sprite)
    highFive =  game.add.sprite(sprite.world.x - 60, sprite.world.y - 40, 'smile');
    highFive.events.onInputDown.add(fiver,sprite);  

    hug = game.add.sprite(sprite.world.x - 0, sprite.world.y - 60, 'hug');
    hug.events.onInputDown.add(hugged,this);  

    smile = game.add.sprite(sprite.world.x + 60, sprite.world.y - 40, 'five');
    smile.events.onInputDown.add(smileKid, this);  
    //if sprite moves at stopped guy, he starts moving
    // timer to close menu
}

function fiver(sprite, pointer){
 console.log("five");
}

function hugged(sprite, pointer){
    console.log("hug");

}

function smileKid(sprite, pointer){
    console.log("smile");

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

     