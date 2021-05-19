const audio = {
  started: false,
  loopIDs: {},
  currentLoopLabel: null,
	  data: {
  "urls": [
    "awenaudio.ogg",
    "awenaudio.mp3"
  ],
  "sprite": {
    "blue_blue": [
      0,
      6170.022675736962
    ],
    "blue_take": [
      8000,
      3015.3514739229017
    ],
    "breathe_inhale": [
      13000,
      1706.1904761904766
    ],
    "breathe_one": [
      16000,
      15439.410430839003
    ],
    "breathe_take": [
      33000,
      2710.9297052154207
    ],
    "button": [
      37000,
      8500
    ],
    "clouds_are": [
      47000,
      1389.795918367348
    ],
    "clouds_change": [
      50000,
      1342.3356009070276
    ],
    "clouds_drifting": [
      53000,
      9143.01587301587
    ],
    "clouds_look": [
      64000,
      1241.0204081632655
    ],
    "clouds_path": [
      67000,
      13195.328798185941
    ],
    "clouds_walk": [
      82000,
      1266.3492063492045
    ],
    "continue": [
      85000,
      8500
    ],
    "general_continue": [
      95000,
      1569.0249433106515
    ],
    "general_continue2": [
      98000,
      1550.294784580501
    ],
    "hum_hum": [
      101000,
      2386.530612244897
    ],
    "hum_some": [
      105000,
      3636.1678004535206
    ],
    "leaf_can": [
      110000,
      1255.8956916099787
    ],
    "leaf_follow": [
      113000,
      3518.5487528344624
    ],
    "leaf_next": [
      118000,
      6427.369614512471
    ],
    "leaf_when": [
      126000,
      2432.086167800463
    ],
    "lichen_take": [
      130000,
      6501.60997732425
    ],
    "lichen_these": [
      138000,
      16858.707482993195
    ],
    "loop_beforeEnd": [
      156000,
      103816.89342403627
    ],
    "loop_blue": [
      261000,
      125500
    ],
    "loop_breathe": [
      388000,
      22000
    ],
    "loop_clouds": [
      411000,
      88000
    ],
    "loop_intro": [
      500000,
      130000
    ],
    "loop_lichen": [
      631000,
      129282.38095238089
    ],
    "loop_noise": [
      762000,
      146000
    ],
    "loop_ocean": [
      909000,
      192000
    ],
    "loop_matchTree": [
      1102000,
      116000
    ],
    "loop_weeds": [
      1219000,
      128000
    ],
    "loop_wind": [
      1348000,
      129288.70748299322
    ],
    "matchTree_explanation": [
      1479000,
      15883.718820861759
    ],
    "matchTree_seek": [
      1496000,
      1184.2403628118063
    ],
    "matchTree_spend": [
      1499000,
      3348.3446712018576
    ],
    "motif": [
      1504000,
      24000
    ],
    "noise_can": [
      1529000,
      1569.024943310751
    ],
    "noise_dawn": [
      1532000,
      11397.732426303946
    ],
    "noise_find": [
      1545000,
      2033.922902494396
    ],
    "noise_take": [
      1549000,
      2866.848072562334
    ],
    "nudge": [
      1553000,
      8000
    ],
    "ocean_by": [
      1562000,
      5341.224489795877
    ],
    "ocean_in": [
      1569000,
      9228.956916099833
    ],
    "ocean_rotate": [
      1580000,
      2434.195011337806
    ],
    "prompt": [
      1584000,
      8000
    ],
    "quietness_dont": [
      1593000,
      2194.2857142857974
    ],
    "quietness_entire": [
      1597000,
      12898.662131519359
    ],
    "quietness_let": [
      1611000,
      1741.4965986395146
    ],
    "quietness_record": [
      1614000,
      1845.1700680273007
    ],
    "quietness_search": [
      1617000,
      1915.6462585033296
    ],
    "quietness_thank": [
      1620000,
      801.1791383219133
    ],
    "rotate_please": [
      1622000,
      2171.0657596372585
    ],
    "weeds_follow": [
      1626000,
      2647.9138321994924
    ],
    "weeds_plant": [
      1630000,
      9453.01587301583
    ],
    "well_done": [
      1641000,
      8500
    ],
    "wind_feel": [
      1651000,
      4025.9863945577763
    ],
    "wind_increase": [
      1657000,
      1728.3446712017394
    ],
    "wind_keep": [
      1660000,
      1057.3242630384811
    ],
    "wind_maintain": [
      1663000,
      2252.3356009069175
    ],
    "wind_wind": [
      1667000,
      6451.564625850324
    ]
  }
},
  loaded: 0
};

// Setup listener
audio.init = function (callback) {
	var _this = this;


	
	// callback();
	// return true;

	this.s = new Howl({
		src: ['./audio/awenaudio.mp3','./audio/awenaudio.ogg'],
		sprite: this.data.sprite,
		volume: 0.5,
		loop: false,
		onload: function() {
	        console.log('all audio loaded.')
	        callback();
	       
	      },
	      onplay: function(id) {
	      	console.log('audio event',id);
	      	
	      }
	});
}
audio.playLoop = function(label) {
	


	if(label=='stop') {
		if(this.currentLoopLabel) {
			console.log('stopping audio '+this.currentLoopLabel);
			var stopID = this.loopIDs[this.currentLoopLabel];
			this.s.fade(0.5,0.0,2000,stopID);
			window.setTimeout(function(){
				audio.s.stop(stopID);
				console.log('stopped sound with ID '+stopID);
			},2100);
		} else {
			console.log('dont need to stop audio '+this.currentLoopLabel);
		}
		return true;
	}

	label = 'loop_'+label;

	var msg = 'playLoop: ';




	if(this.data.sprite[label]) {

		var shouldPlay = true;
		// stop current loop if one is playing
		if(this.currentLoopLabel) {
			msg += this.currentLoopLabel+' currently playing; ';
			// there is a loop playing
			if(this.currentLoopLabel==label) {
				// the loop currently playing is the requested sound; restore volume maybe?
				msg += 'requested same as playing; fading in and playing. ';
				var id = this.loopIDs[label];
	
				this.s.fade(0.0,0.5,1000,id);
				this.s.play(id);
				
			} else {
				
				// the loop currently playing is not the requested sound; switch
				
				msg += 'requested different; fade out existing; ';

				var stopID = this.loopIDs[this.currentLoopLabel];
				this.s.fade(0.5,0.0,2000,stopID);
				window.setTimeout(function(){
					audio.s.stop(stopID);
					console.log('stopped sound with ID '+stopID);
				},1000);

				if(this.loopIDs[label]) {
					msg += 'requested '+label+' exists in pool, replaying; ';
					// requested loop is already in pool, use ID
					// this.s.fade(0,0.5,1000,this.loopIDs[label]);
					this.s.play(this.loopIDs[label]);
					this.currentLoopLabel = label;
					
				} else {
					msg += 'requested '+label+' new, instantiating; ';
					// requested loop is new, use sprite label
					var id = this.s.play(label);
					// this.s.fade(0,0.5,1000,id);
					this.loopIDs[label] = id;
					this.currentLoopLabel = label;
					msg += 'instantiated with id '+id;
				}
				
				
			}

		} else {
			msg += 'first time playing '+label;
			// there is no loop playing, use sprite label
			var id = this.s.play(label);
			this.s.volume(0.5,id);
			this.loopIDs[label] = id;
			this.currentLoopLabel = label;
			msg += 'instantiated with id '+id;
			
		}

	} else {
		msg += label+ ' label not recognised';
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
