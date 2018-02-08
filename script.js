
var bounds;

var game = new Phaser.Game(1200, 650, Phaser.AUTO, 'phaser-example', 
{ 
    preload: preload, 
    create: create, 
    update: update, 
    render: render 
});

function preload() {
    var graphics = game.add.graphics(0, 0);
    game.load.image('yolky', 'assets/yolk.png');
    
    game.stage.backgroundColor = '#2E4057';
}

function create() {
    yolkWorld = game.add.group();
    rect = new Phaser.Rectangle(50, 50, 1100, 600);

    //group of yolks added to the world each with own personalities
    for( var i = 0; i < 20; i++)
    {
        yolkWorld.add(new Yolk(game));
        
    }
    yolkWorld.alignIn(rect, Phaser.RIGHT_CENTER);

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

     