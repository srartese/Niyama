
var game = new Phaser.Game(1200, 750, Phaser.AUTO, 'phaser-example', 
{ 
    preload: preload, 
    create: create, 
    update: update, 
    render: render 
});

function preload() {
    var graphics = game.add.graphics(0, 0);
    game.load.image('yolky', 'assets/yolk.png');   
}

function create() {

 var graphics = game.add.graphics(0, 0);

//array of yolks added to the world each with own personalities

 var baby = new Yolk(game, 200, 300);
    game.add.existing(baby);

 game.stage.backgroundColor = '#2E4057';

 // resize to fill full screen
 game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

 game.input.onDown.add(gofull, this);

}

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

     