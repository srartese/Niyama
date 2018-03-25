    /* 
        Yolk Class for Niyama 2018
        Tracks all internal unique pieces for each Yolk's characteristics and making
        by Sara Artese
    */ 

    Yolk = function ( game, i, birth){
        // Assign birthnumber randomly
            //Think about probability for birth number
        this.birthNumber = birth;

        //  Set a TimerEvent to occur for 2 seconds for ripple effect
        this.ripple = game.time.create(false);
        this.ripple.add(3000, normalizeIt, this);

        // Spawn all yolks in the proper Y location
        var yLoc;
        if( this.birthNumber <= 3)
        {
            yLoc = game.rnd.integerInRange(350,600);
        }
        else if (this.birthNumber > 3 && this.birthNumber < 6)
        {
            yLoc = game.rnd.integerInRange(200, 400);
        }
        else
            yLoc = game.rnd.integerInRange(0, 250);

        
        // Create a decayTime for each yolk based on the birthNumber
        if(this.birthNumber == 0)
            this.birthTime = 10000
        else if(this.birthNumber == 1)
            this.birthTime = 12000
        else
            this.birthTime = this.birthNumber * 7000;

        // Add yolk sprite to the world
        Phaser.Sprite.call(this, game,  game.world.randomX, yLoc, 'yolky' );

        // Give each yolk a unique ID
        id = i;
        game.add.existing(this, i);

        // Add internal happiness scale
        this.initialHappiness = this.birthNumber;
        this.happinessScale = this.birthNumber;

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

        // State Machine for Happiness States
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

        // State Machine for Interacting States
        this.interacted = new stateMachine( this, { debug: false } );
  
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

        
        this.interacted.state('inspired', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        });

        game.add.existing(this);
    }	

    Yolk.prototype = Object.create(Phaser.Sprite.prototype);
    Yolk.prototype.constructor = Yolk;

    // Get method for happinessScale
    Yolk.prototype.myHappiness = function() {
        return this.happinessScale;
     }

    //Get method for Yolk ID
    Yolk.prototype.myID = function(){
        return id;
    }

    //Update function
    Yolk.prototype.update = function(){
        this.sm.update();
        this.interacted.update();
       
      }