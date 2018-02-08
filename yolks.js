// Each yolk needs birth number (range)
// Location dynamic depening on state
// movement speed depending on state
// states
    //happy, neutral, sad
// internal clock
// states
    // poked
    // wandering

    Yolk = function (game){
        Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'yolky');
        
        game.add.existing(this);
    }	

    Yolk.prototype = Object.create(Phaser.Sprite.prototype);
    Yolk.prototype.constructor = Yolk;

    Yolk.prototype.update = function() {


    };