// Location dynamic depening on state
// internal clock
// states
    // poked
    // wandering


    Yolk = function ( game, i, birth){
       // Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'yolky' );
         Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'yolky' );

        //console.log(i);
        id = i;
        game.add.existing(this, i);
        this.birthNumber = birth;
        //Think about probability for birth number
        //console.log("birthNumber: " + birthNumber);
        // Add internal happiness scale
        this.initialHappiness = this.birthNumber;
        this.happinessScale = this.birthNumber;

        //console.log("initialHappiness: " + initialHappiness);
        //console.log("happinessScale: " + happinessScale);
        
        // Animations for each transition
        this.animations.add('neutral', [1], 10, false);
        this.animations.add('neutral_to_sad', [2], 40, false);
        this.animations.add('neutral_to_happy', [0], 40, false);
       
        this.animations.add('sad', [2], 35, false);
        this.animations.add('sad_to_neutral', [1], 40, false);
        this.animations.add('sad_to_happy', [0], 40, false);
        
        this.animations.add('happy', [0], 10, false);
        this.animations.add('happy_to_sad', [2], 40, false);
        this.animations.add('happy_to_neutral', [1], 40, false);

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
       
        if(this.happinessScale >= 4 && this.happinessScale <= 6)
        this.sm.initialState = "neutral";
        if(this.happinessScale <= 3)
        this.sm.initialState = "sad";
        if(this.happinessScale >= 6)
        this.sm.initialState = "happy";

        this.animations.play( this.sm.initialState );
        //console.log(this.sm.initialState); 
        

        // State Machine
        this.interacted = new stateMachine( this, { debug: false } );
        //var self = this;
        
        this.interacted.state('static', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        });
        
        this.interacted.state('interacting', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        });


        game.add.existing(this);

    }	

    Yolk.prototype = Object.create(Phaser.Sprite.prototype);
    Yolk.prototype.constructor = Yolk;

    Yolk.prototype.myHappiness = function() {
        return this.happinessScale;
     }

    Yolk.prototype.update = function(){
        this.sm.update();
        this.interacted.update();
       
      }

    Yolk.prototype.myID = function(){
        return id;
    }