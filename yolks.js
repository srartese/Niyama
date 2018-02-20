// Each yolk needs birth number (range)
// Location dynamic depening on state
// movement speed depending on state
// states
    //happy, neutral, sad
// internal clock
// states
    // poked
    // wandering

    Yolk = function ( game,i){
        Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'yolky');
        console.log(i);
        game.add.existing(this, i);

        
        // Animations

        this.animations.add('neutral', [1], 30, false);
       // this.animations.add('neutral_to_sad', [2], 40, false);
        
        this.animations.add('sad', [2], 35, false);
       // this.animations.add('sad_to_neutral', [3], 40, false);
       // this.animations.add('sad_to_happy', [3], 40, false);
        
        this.animations.add('happy', [0], 10, false);
        //this.animations.add('happy_to_sad', [1], 40, false);
       // this.animations.add('happy_to_neutral', [1], 40, false);

        // State Machine
        
        this.sm = new stateMachine( this, { debug: false } );
        var self = this;
        
        this.sm.state('sad', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        });
        
        this.sm.state('neutral', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        });
        
        this.sm.state('happy', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        }); 

            // happy
            // this.sm.transition('neutral_to_sad', 'neutral', 'sad', function(){
            //     return ( !game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
            // });
            
            // this.sm.transition('sad_to_neutral', 'sad', 'neutral', function(){
            //     return ( game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
            // });

            // // Neutral
            // this.sm.transition('sad_to_happy', 'sad', 'happy', function(){
            //     return ( game.input.keyboard.isDown(Phaser.Keyboard.RIGHT));
            // });

            // // happy
            // this.sm.transition('happy_to_sad', 'happy', 'sad', function(){
            //     return ( game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
            // });
            
            // this.sm.transition('happy_to_neutral', 'happy', 'neutral', function(){
            //     return ( game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) );
            // });

            this.animations.play( this.sm.initialState );
                            
            game.add.existing(this);

            console.log("current state: " +  this.sm.initialState);

            this.game.time.events.loop(3000, function() {  
                this.game.add.tween(this).to({x: this.game.world.randomX, y: this.game.world.randomY},3000, Phaser.Easing.Quadratic.InOut, true);}, this)

    }	

    Yolk.prototype = Object.create(Phaser.Sprite.prototype);
    Yolk.prototype.constructor = Yolk;

    Yolk.prototype.update = function(){
        this.sm.update();
      }