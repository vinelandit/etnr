const audio = {
  started: false,
  s: {},
  loopIDs: {},
  currentLoopLabel: null,
	  data: {
  "urls": [
    "awenaudio.ogg",
    "awenaudio.mp3"
  ],
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
  },
  "bg1": {

    "ground_did": {},
    "ground_find": {},
    "ground_pick": {},
    "ground_try": {},
    "ground_wetter": {},
    "ground_continue": {},  

    "hum_continue": {},
    "hum_hum": {}, 
    "hum_some": {},
    
    "matchTree_continue": {},
    "matchTree_explanation": {},
    "matchTree_seek": {},
    "matchTree_spend": {},


    
    "loop_matchTree": {
      loop: true
    },  
    "loop_leaf": {
      loop: true
    },
    "loop_motif": {
      loop: true,
      keep: true
    },  
    "leaf_can": {},
    "leaf_pick": {},
    "leaf_next": {},
    "leaf_when": {},
    "leaf_earliest": {},
    "leaf_continue": {}
  },
  "bg2": {
     

    "weeds_continue": {},
    "weeds_follow": {},
    "weeds_plant": {},  

    "lichen_continue": {},
    "lichen_take": {},
    "lichen_these": {},

  
    "loop_weeds": {
      loop: true
    },
    "loop_lichen": {
      loop: true
    }
   
  
  },"bg3": {
    "blue_blue": {},
    "blue_take": {},
    "blue_continue": {},


    "loop_lightning": {
      loop: true
    },

    "loop_wind": {
      loop: true
    },
    
    "lightning_continue": {},
    "lightning_flickering": {},
    "lightning_walk": {},

 
    "wind_continue": {},
    "wind_feel": {},
    "wind_increase": {},
    "wind_keep": {},
    "wind_wind": {}, 


    "clouds_are": {},
    "clouds_continue": {},
    "clouds_drifting": {},
    "clouds_explanation": {},
    "clouds_look": {},
    "clouds_follow": {},

    "quietness_continue": {},
    "quietness_dont": {},
    "quietness_entire": {},
    "quietness_record": {},
    "quietness_search": {},
    "quietness_in": {},
    "quietness_thank": {},


    "loop_blue": {
      loop: true
    },
    "loop_clouds": {
      loop: true
    }

    
  },
  "bg4": {

    "breathe_inhale": {},
    "breathe_one": {},
    "breathe_take": {},
    "breathe_this2": {},

    "ocean_by": {},
    "ocean_continue": {},
    "ocean_scotland": {},
    "ocean_in": {},
    "ocean_uk": {},
    "ocean_turn": {},

        
    "loop_water": {
      loop: true
    },
    "loop_breathe": {
      loop: true
    },

   
    

    "beforeEnd_thank": {},
    "complete_traces": {},
    "complete_journey": {},

    "loop_breathe": {
      loop: true
    },
  
    
    "loop_water": {
      loop: true
    }
    
  }
},
  loaded: 0
};

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
            _this.backgroundLoad(1);
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

audio.autoNexts = {};

audio.backgroundLoad = function(index=1,callback=null){
  var _this = this;
  console.log('Background audio load with batch index '+index);
  // unload unneeded audio from previous batch
  if(index>2) {
    var prev = index-2;
    for(var label in this.data['bg'+prev]) {
      var keep = this.data['bg'+prev][label].keep;
      if(!keep && this.s[label]) {
        console.log('unloading audio '+label);
        this.s[label].unload();
      }
    }
  }

  var numBgSounds = 0;
  for(var _ in this.data['bg'+index]) {
    numBgSounds++;
  }

  var count = 0;
  for(var label in this.data['bg'+index]) {
    var level = 0.8;
    var loop = this.data['bg'+index][label].loop;
    if(loop) {
      level = 0.4; // lower level for loops
    }
    this.s[label] = new Howl({
      src: ['./audio/'+label+'.mp3'],
      volume: level,
      loop: loop,
      onload: function() {
        console.log('loaded background audio');
        count++;
        if(callback!==null&&count>=numBgSounds) {
          callback();
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
audio.delayLoad = function(label,level,loop,delay) {
  console.log('delayload',label,level,loop,delay);
  var _this = this;
  window.setTimeout(function(){
    _this.s[label] = new Howl({
      src: ['./audio/'+label+'.mp3'],
      volume: level,
      loop: loop,
      onload: function() {
        console.log('loaded background audio');
        }
           
        ,
        onplay: function(id) {
          console.log('audio event',id);
          
        },
        onend: function(id) {
          _this.checkAutoNext(id);
        }
     });
  },delay);  
    
}
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
				audio.s[l].stop();
				console.log('stopped sound with label '+l);
        if((_this.data.bg1[l] && !_this.data.bg1[l].keep)||(_this.data.bg2[l] && !_this.data.bg2[l].keep)||(_this.data.bg3[l] && !_this.data.bg3[l].keep)||(_this.data.init[l] && !_this.data.init[l].keep)){
          audio.s[l].unload();
          console.log('Unloaded sound with ID '+l);
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

	if(audio.s[label]) {
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

				
				this.s[this.currentLoopLabel].fade(0.4,0.0,5000);
				var l = this.currentLoopLabel;
        var _this = this;
				window.setTimeout(function(){
					audio.s[l].stop();
          console.log('Stopped sound with ID '+l);
          if((_this.data.bg1[l] && !_this.data.bg1[l].keep)||(_this.data.bg2[l] && !_this.data.bg2[l].keep)||(_this.data.bg3[l] && !_this.data.bg3[l].keep)||(_this.data.init[l] && !_this.data.init[l].keep)){
            audio.s[l].unload();
            console.log('Unloaded sound with ID '+l);
          } else {
            console.log('Did not unload sound');
          }
				},6000);

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
