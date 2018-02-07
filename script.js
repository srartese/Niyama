var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'phaser-example', 
{ 
    preload: preload, 
    create: create, 
    update: update, 
    render: render 
});

function preload() {
    var graphics = game.add.graphics(0, 0);
    
}

function create() {

 var graphics = game.add.graphics(0, 0);

 graphics.beginFill(0xF18F01, 1);

 graphics.drawCircle(300, 300, 100);
 graphics.drawCircle(500, 70, 100);

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

     