// Each yolk needs birth number (range)
// size (same)
// Location dynamic depening on state
// states
    //happy, neutral, sad
// internal clock
// states
    // poked
    // wandering

    Yolk = function (game, x, y){
        
        Phaser.Sprite.call(this, game, x, y, 'yolky');
    }	

    Yolk.prototype = Object.create(Phaser.Sprite.prototype);
    Yolk.prototype.constructor = Yolk;

    Yolk.prototype.update = function() {

       // this.angle += this.rotateSpeed;
    
    };