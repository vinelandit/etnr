const audio = {
  started: false,
  s: {},
  loopIDs: {},
  currentLoopLabel: null,
	  data: {
  
  "init": {
    "loop_intro": {
      loop: true
    },   
    "prompt": {'keep':true},
    "nudge": {'keep':true},
    "button": {'keep':true},
    "noise_can": {},
    "noise_dawn": {},
    "noise_find": {},
    "noise_take": {},
    "noise_continue": {},
    "loop_noise": {
      loop: true
    },
    "intro_please": {},
    "intro_we": {}
  }
},
  loaded: 0
};

audio.autoNexts = {};
audio.currentlyLoaded = {};

// Setup listener
audio.init = function (callback) {
	var _this = this;

	var numSounds = 0;
	for(var _ in this.data.init) {
		numSounds++;
	}


	var i = 0;

	for(var label in this.data.init) {
		
    var level = 0.8;
    var loop = this.data.init[label].loop;
    if(loop) {
      level = 0.4; // lower level for loops
    }
    this.currentlyLoaded[label] = this.data.init[label];

    this.s[label] = new Howl({
		src: ['./audio/'+label+'.mp3'],
		volume: level,
		loop: loop,
		onload: function() {
			i++;
			console.log('loaded '+i+' of '+numSounds+' sounds');
			$('#loading').html('LOADING ('+i+'/'+numSounds+')')
			if(i>=numSounds) {

		        console.log('all audio loaded.');
		        callback();
			}
	       
	      },
	      onplay: function(id) {
	      	console.log('audio event',id);
	      	
	      },
        onend: function(id) {
          _this.checkAutoNext(id);
        }

	   });
	}
	
}

audio.backgroundLoad = function(sounds,callback=null){
  var _this = this;
  console.log('Loading background audio for next stage: ');
  console.log(sounds);
  // unload unneeded audio from previous batch
  for(var i in this.currentlyLoaded) {
    if(this.s[i] && !this.currentlyLoaded[i].keep && !this.s[i].playing()) {
      this.s[i].unload();
      delete this.currentlyLoaded[i];
    }
  }

  var numSounds = 0;
  for(var _ in sounds) {
    numSounds++;
  }

  var count = 0;
  for(var label in sounds) {
    var level = 0.8;
    var loop = sounds[label].loop;
    if(loop) {
      level = 0.4; // lower level for loops
    }
    audio.currentlyLoaded[label] = sounds[label];
    this.s[label] = new Howl({
      src: ['./audio/'+label+'.mp3'],
      volume: level,
      loop: loop,
      onload: function() {
        console.log('loaded '+count+' of '+numSounds+' sounds');
        count++;
        if(callback!==null&&count>=numSounds) {
          callback();
          console.log(_this.currentlyLoaded,_this.s);
        }
      }
           
        ,
        onplay: function(id) {
          console.log('audio event',id);
          
        },
        onend: function(id) {
          _this.checkAutoNext(id);
        }
     });
    
    
  }
};

audio.checkAutoNext = function(id) {
  if(this.autoNexts['vo'+id]) {
    console.log('Auto nexting');
    var _this = this;
    window.setTimeout(function(){
      _this.autoNexts['vo'+id].button.click();
      _this.autoNexts['vo'+id].sound.unload();
      delete _this.autoNexts['vo'+id];
    },2500);
  }
}

audio.playLoop = function(label) {
	
	if(label=='stop') {
		if(this.currentLoopLabel) {
			console.log('stopping audio '+this.currentLoopLabel);
			this.s[this.currentLoopLabel].fade(0.4,0.0,5000);
			var l = this.currentLoopLabel;
      var _this = this;
			window.setTimeout(function(){
				_this.s[l].stop();
				console.log('stopped sound with label '+l);
        if(_this.currentlyLoaded[l] && !_this.currentlyLoaded[l].keep){
          _this.s[l].unload();
          delete audio.s[l];
          console.log('Unloaded sound with ID '+l);
          delete _this.currentlyLoaded[l];
        } else {
          console.log('Did not unload sound');
        }
			},5500);
		} else {
			console.log('no sound playing no stop necessary');
		}
		return true;
	}

	label = 'loop_'+label;

	var msg = 'playLoop: ';

	if(this.s[label]) {
		if(this.currentLoopLabel) {
			msg += this.currentLoopLabel+' currently playing; ';
			// there is a loop playing
			if(this.currentLoopLabel==label) {
				
				msg += 'requested same; ';
				// this.s[label].fade(0.0,0.5,1000);
				this.s[label].play();
				
			} else {
				
				// the loop currently playing is not the requested sound; switch
				
				msg += 'requested different; fade out existing; ';

				
				if(this.s[this.currentLoopLabel]) {
          this.s[this.currentLoopLabel].fade(0.4,0.0,5000);
  				var l = this.currentLoopLabel;
          var _this = this;
  				window.setTimeout(function(){
  					_this.s[l].stop();
            console.log('Stopped sound with ID '+l);
            if(_this.currentlyLoaded[l] && !_this.currentlyLoaded[l].keep){
              _this.s[l].unload();
              delete audio.s[l];
              delete _this.currentlyLoaded[l];
              console.log('Unloaded sound with ID '+l);
            } else {
              console.log('Did not unload sound '+l);
            }
  				},6000);
        }

        this.s[label].fade(0,0.4,5000);
				this.s[label].play();
				this.currentLoopLabel = label;
				
				
			}

			
		} else {
			msg += ' playing for first time: '+label+'; ';
			this.s[label].play();
			this.currentLoopLabel = label;
		}
	} else {
		msg += ' label not recognised: '+label;
	}

	
	console.log(msg);
}
audio.stopLoop = function() {
	this.playLoop('stop');
}
/* audio.s = {
	'continue':{
		'play':function(){}
	}
}; */
