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
        this.ripple.add(6000, normalizeIt,this);

        // Spawn all yolks in the proper Y location
        var yLoc;
        if( this.birthNumber <= 3)
        {
            yLoc = game.rnd.integerInRange(648,1070);
        }
        else if (this.birthNumber > 3 && this.birthNumber < 6)
        {
            yLoc = game.rnd.integerInRange(432, 648);
        }
        else
            yLoc = game.rnd.integerInRange(20, 432);

        
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
        this.animations.add('neutral', Phaser.ArrayUtils.numberArray(240,479), 60, true); // 240-479
        this.animations.add('neutral_to_sad', Phaser.ArrayUtils.numberArray(830,918), 60, false); // 830-918
        this.animations.add('neutral_to_happy', Phaser.ArrayUtils.numberArray(1832,2011), 60, false); // 1832-2011
       
        this.animations.add('sad', Phaser.ArrayUtils.numberArray(480,719), 60, true); // 480-719
        this.animations.add('sad_to_neutral', Phaser.ArrayUtils.numberArray(2012,2191), 60, false); // 2012-2191
        
        this.animations.add('happy', Phaser.ArrayUtils.numberArray(0,239), 60, true); // 000-239
        this.animations.add('happy_to_neutral', Phaser.ArrayUtils.numberArray(720,829), 60, false); // 720-829

        // Interactions
        this.animations.add('major_tapped', Phaser.ArrayUtils.numberArray(1804,1831), 60, false) // 1804-1831
        this.animations.add('major_hug', Phaser.ArrayUtils.numberArray(1244,1417), 60, false); // 1244-1417
        this.animations.add('major_smile', Phaser.ArrayUtils.numberArray(1630,1803), 60, false); // 1630-1803
        this.animations.add('major_highFive', Phaser.ArrayUtils.numberArray(1070,1243), 60, false); // 1070-1243
        this.animations.add('major_happy', Phaser.ArrayUtils.numberArray(979,1069), 60, false); // 979-1069
        this.animations.add('major_neutral', Phaser.ArrayUtils.numberArray(1418,1629), 60, false); // 1418-1629

        this.animations.add('rising_to_happy', Phaser.ArrayUtils.numberArray(919,978), 60, false); // 919-978
      

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

        this.sm.state('major_hug', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        }); 
       
        this.sm.state('major_smile', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        }); 

        this.sm.state('major_highFive', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        }); 

        this.sm.state('major_tapped', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        }); 

        this.sm.state('rising_to_happy', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        }); 

        this.sm.state('major_happy', {
            enter:  function(){ },
            update: function(){ },
            exit:   function(){ }
        }); 

        this.sm.state('major_neutral', {
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