// main app object
class App {

    constructor(id=null,testGPS=false) {

    	localStorage.setItem('speed',0);
        this._vegMapInit = true;
        this.loadingAudio = $('#loadingAudio');


        this.audioReady = true;
        this.audioWaiting = false;

        this.testGPS = testGPS;

		// default state
		this.state = {
    		'init':true,
            'testGPS':this.testGPS,
        	'stageID':0,
            'overallProgress':0,
            'overallTime':0,
        	'stepping':false,
        	'complete':false,
        	'stage':null,
        	'gpx':[], // will store user's path
        	'stages': [
	            {
                    'distance': 0,
                    'time': 0,
	                'prompts': [
	                	{
	                		'type':'noise'
	                	},
	                	
	                ],
                    'message':'Carry on with your journey',
	                'type':'nudge'
	            },
                {
                    'distance': 20,
                    'time': 20,
                    'prompts': [
                        
                        { 'type':'hum' }
                    ],
                    'audio':{

                        "hum_continue": {},
                        "hum_hum": {}, 
                        "hum_some": {},
                        "loop_motif": {
                          loop: true,
                          keep: true
                        }
                    },
                    'type':'prompt',
                    'message':"Let&apos;s keep moving"
                },
                {
                    'distance': 45,
                    'time': 45,
                    'prompts': [
                        
                        { 'type':'ground' }
                    ],
                    'audio':{
                        "ground_did": {},
                        "ground_find": {},
                        "ground_pick": {},
                        "ground_try": {},
                        "ground_wetter": {},
                        "ground_continue": {}
                    },
                    'type':'prompt',
                    'message':"Let&apos;s keep going"
                },
	            {
                    'distance': 30,
                    'time': 30,
                    'prompts': [
                        { 
                            'type':'matchTree'
                        }
                        
                    ],
                    'audio':{
                        "matchTree_continue": {},
                        "matchTree_explanation": {},
                        "matchTree_seek": {},
                        "matchTree_spend": {},
                        
                        "loop_matchTree": {
                          loop: true
                        }
                    },
                    'type':'prompt',
                    'message':'Carry on with your journey'
                },
                {
                    'distance': 30,
                    'time': 30,
                    'prompts': [
                        { 
                            'type':'vegetation'
                        }
                        
                    ],
                    'type':'prompt',
                    'audio':{
                        
                        "leaf_can": {}
                    },
                    'message':'Carry on with your journey'
                },
	            {
	                'distance': 100,
                    'time': 30,
	                'prompts': [
	                	{ 
	                		'type':'leaf'
	                	}
	                ],
                    'audio':{
                        "loop_leaf": {
                          loop: true
                        },
                        "leaf_can": {},
                        "leaf_pick": {},
                        "leaf_next": {},
                        "leaf_when": {},
                        "leaf_earliest": {},
                        "leaf_continue": {}
                    },
	                'type':'prompt',
                    'message':'Please continue your walk'
	            },
	            {
                    'distance': 100,
                    'time': 30,
                    'prompts': [
                        { 
                            'type':'weeds'
                        }
                        
                    ],
                    'audio':{
                        "weeds_continue": {},
                        "weeds_follow": {},
                        "weeds_plant": {},  

                        "loop_weeds": {
                          loop: true
                        }
                    },
                    'type':'nudge',
                    'message':"Let&apos;s continue the walk"
                },
                {
                    'distance': 100,
                    'time': 30,
                    'prompts': [
                        { 
                            'type':'lichen'
                        }
                        
                    ],
                    'audio':{
                        "lichen_continue": {},
                        "lichen_take": {},
                        "lichen_these": {},

                        "loop_lichen": {
                          loop: true
                        }
                      
                    },
                    'type':'nudge',
                    'message':'Continue your journey'
                },
                {
                    'distance': 100,
                    'time': 45,
                    'prompts': [
                        { 
                            'type':'lightning'
                        }
                        
                    ],
                    'audio':{
                        "loop_lightning": {
                          loop: true
                        },
                        "lightning_continue": {},
                        "lightning_flickering": {},
                        "lightning_walk": {},
                    },
                    'type':'nudge',
                    'message':'Please continue walking'
                },
	            
	            {
	                'distance': 100,
                    'time': 30,
	                'prompts': [
	                	{ 
	                		'type':'wind'
	                	}
	                	
	                ],
                    'audio':{
                        "loop_wind": {
                          loop: true
                        },
                        
                        "wind_continue": {},
                        "wind_feel": {},
                        "wind_increase": {},
                        "wind_keep": {},
                        "wind_wind": {}, 
                    },
	                'type':'prompt',
                    'message':'Please continue your walk'
	            },
                {
                    'distance': 100,
                    'time': 45,
                    'prompts': [
                        { 
                            'type':'clouds'
                        }
                        
                    ],
                    'audio':{
                        "clouds_are": {},
                        "clouds_continue": {},
                        "clouds_drifting": {},
                        "clouds_explanation": {},
                        "clouds_look": {},
                        "clouds_follow": {},

                        "loop_clouds": {
                          loop: true
                        }
                    },
                    'type':'prompt',
                    'message':'Please continue walking'
                },
                {
                    'distance': 100,
                    'time': 45,
                    'prompts': [
                        { 
                            'type':'blue'
                        }
                        
                    ],
                    'audio':{
                        "blue_blue": {},
                        "blue_take": {},
                        "blue_continue": {},
                        "loop_blue": {
                          loop: true
                        },
                    },
                    'type':'nudge',
                    'message':'Please continue walking'
                },
	            {
	                'distance': 100,
                    'time': 30,
	                'prompts': [
	                	{ 
	                		'type':'quietness'
	                	}
	                	
	                ],
                    'audio':{
                        "quietness_continue": {},
                        "quietness_dont": {},
                        "quietness_entire": {},
                        "quietness_record": {},
                        "quietness_search": {},
                        "quietness_in": {},
                        "quietness_thank": {},
                    },
	                'type':'prompt',
                    'message':'Please continue your journey'
	            },
	            {
	                'distance': 100,
                    'time': 60,
	                'prompts': [
	                	{ 
	                		'type':'ocean'
	                	}
	                	
	                ],
                    'audio':{
                        "ocean_by": {},
                        "ocean_continue": {},
                        "ocean_scotland": {},
                        "ocean_in": {},
                        "ocean_uk": {},
                        "ocean_turn": {},
                        "loop_water": {
                          loop: true
                        }     
                    },
	                'type':'nudge',
                    'message':'Please continue facing the ocean'
	            },
	            {
	                'distance': 100,
                    'time': 20,
	                'prompts': [
	                	{ 
	                		'type':'breathe'
	                	},
                        { 'type':'beforeEnd' },
                        
                        { 'type': 'complete'}
	                	
	                ],
                    'audio':{
                        "breathe_inhale": {},
                        "breathe_one": {},
                        "breathe_take": {},
                        "breathe_this2": {},

                        "loop_breathe": {
                          loop: true
                        },
                        "beforeEnd_thank": {},
                        "complete_traces": {},
                        "complete_journey": {},
                    },
	                'type':'prompt'
	            }
	            
	        ]
        };

        this.initVegMapHandlers();
        this.initProgressSVG();

    	var _this = this; // portable reference to main app object

    	// id-stamp the stages
    	for(var i=0;i<this.state.stages.length;i++) {
    		this.state.stages.id=i;
    	}

    	this.delta = 0;
    	this.bearing = null;
    	this.tilt = null;

		this.pathScale = 500000;
		this.started = false;
		
 		this.id = id;

        this.gpsElapsed = 0;
        this.gpsTick = 0;

        this.timeElapsed = 0;
      	
      	localStorage.setItem('etnr_gpxid',0);

        this.capturingMotion = false;

        console.log('Requesting geolocation');
        this.firstRunGPS = true;
        this.initGPS();

        // start motion/orientation capture
        console.log('Requesting orientation');
        // this.initMotion();

        $('#skip').click(function(){
        	_this.beginPrompts();
        });

        this._orientationDone = false;
        this._geolocationDone = false;

        this.progressDaemon = window.setInterval(function(){
            _this.updateProgress();
        },1000);

    }

    initState() {
    	var _this = this;
        this.state.stage = new Stage(this.state.stages[0],_this.stageDone.bind(_this),_this.saveState.bind(_this));


    }

    initProgressSVG() {
        this.psvg = $('svg#progressSVG');
        this.psvg.find('path').addClass('notransition').hide();
        this.psbg = this.psvg.find('path.bg'+(1+(this.state.stageID%3))).show();
        this.psfg = this.psvg.find('path.fg'+(1+(this.state.stageID%3))).show();
        this.pstg = this.psvg.find('ellipse');
        this.pshd = $('#progressHolder');



        var d = this.psfg[0].getAttribute('d');


        this.plen = this.psfg[0].getTotalLength();
        var targetPoint = this.psfg[0].getPointAtLength(this.plen*.9);
        

        this.pstg[0].setAttribute('cx', targetPoint.x);
        this.pstg[0].setAttribute('cy', targetPoint.y);
        this.psfg.css({'stroke-dashoffset':1});

        var factor = $(document).width()/700;
        var newWidth = $(document).width();
        var newHeight = 100*factor;
        


        this.psvg.find('path').each(function(){
            $(this)[0].offsetHeight;
        });

        var _this = this;
        window.setTimeout(function(){
            console.log('removing no transition');
            _this.psvg.find('path').removeClass('notransition');
        },500);

        this.pshd.css({
            'transform':'scale('+factor+')'
        });

    }



    initVegMapHandlers() {
        var _this = this;
        $('#openVegMap').click(function(){    
            $('#vegMap').addClass('visible');
        });
        $('#closeVegMap').click(function(){
            $('#vegMap').removeClass('visible');
        });
    }

    sensorsReady() {
        alert('sensors ready!');
    }

    loadState() {
    	var _this = this;
    	var s = localStorage.getItem('etnr_state');
    	if(s!==null&&s!=='') {
    		
    		var showPrompt = -1;
    		this.state = JSON.parse(s);
    		console.log(JSON.parse(JSON.stringify(this.state)));
			
			showPrompt = this.state.stage.state.currentPrompt;

            this.loadingAudio.show();
            this.audioReady = false;
            this.audioWaiting = true;

            audio.backgroundLoad(this.state.stages[this.state.stageID].audio,function(){
                console.log('bg done');
                _this.audioReady = true;
                _this.audioWaiting = false;
                _this.loadingAudio.hide();
                _this.state.stage = new Stage(_this.state.stages[_this.state.stageID],_this.stageDone.bind(_this),_this.saveState.bind(_this));
                if(showPrompt>=0) {
                    _this.state.stage.state.currentPrompt = showPrompt;
                    console.log('attempting to show prompt '+showPrompt);
                    _this.state.stage.showPrompt();
                    _this.state.stepping = false;
                } else {
                    _this.showKeepWalking();
                }

                localStorage.setItem('etnr_gpxid',_this.state.gpx.length-1);

                // request media from server
                _this.getMedia();
                // initialise path canvas with prior path
                _this.initPathCanvas();
            });

	        

    	} else {
    		this.initState();
    	}
    }
    getMedia() {
    	var _this = this;
    	api('getallmedia',{},function(data){
    		console.log('get media callback');
    		console.log(data);
    		if(data.media.length>0) {
    			for(var i=0;i<data.media.length;i++) {
    				_this.restoreMedia(data.media[i]);
    			}
    		}
    	});
    }

    restoreMedia(mObj) {
    	var url = mObj.url;
    	var targetSelector = $('.'+mObj.mediaid).attr('data-media-target');
    	console.log('restoreMedia',url,targetSelector);
    	$(targetSelector).on('load',function(){
    		$(this).show();
    	}).attr('src',url);
    }

    saveState() {
    	console.log('storing state locally');
    	var s = JSON.stringify(decycle(this.state),this.replacer);
    	console.log(JSON.parse(s));
    	localStorage.setItem('etnr_state',s);

        this.uploadState();

    }

    drawStageNav() {

		var overallDistance = 0;
        var stagesListHTML = '';
        
    	var sid = this.state.stageID;
    	console.log('saved state stageID: '+sid);

    	for(var i in this.state.stages) {
        	var ii = parseInt(i)+1;
        	var cl = '';
        	var pc = 0;

        	console.log('i: '+i);

        	if(i<sid) {
        		pc = 100;
        		console.log('i<sid, so pc=100');
        		cl = 'past';
        	} else if(sid==i) {
        		if(!this.state.stepping&&!this.state.init) {
        			// viewing prompts, show complete
        			pc = 100;
        			console.log('i==sid and not stepping so pc=100');
        		} else {
        			console.log('i==sid and stepping so pc=0');
        		}

        	} else {
        		cl = 'future';

        		console.log('i>sid, so pc=0');
        	}
        	this.overallDistance += this.state.stages[i].distance;
        	stagesListHTML += '<li class="'+cl+'" id="stageNav'+i+'"><span class="number">'+ii+'</span><div class="progressOuter"><div class="progressInner" style="width:'+pc+'%; background-color:'+this.state.stages[i].color+'" data-bind-value="stages-'+i+'-progressPc" data-bind-map="width" data-bind-only-map="true" data-bind-map-suffix="%"></div></div><span class="goal">?</span></li>';

        }

        $('.stages ul').html(stagesListHTML);
    }

    gpsToPoint(point,originIndex=0) {
    	// first point maps to this.pc.center
    	var xOff = ((point.x - this.state.gpx[originIndex].lon) * this.pathScale) + this.pc.center.x;
    	var yOff = ((point.y - this.state.gpx[originIndex].lat) * this.pathScale) + this.pc.center.y;
    	return {'x':xOff,'y':yOff};
    }

    initPathCanvas() {
   	
		return true;

        // not used currently
        // initialise canvas for drawing user's path
    	this.pc = {};
    	this.pc.el = document.getElementById("pathCanvas");
    	this.pc.width = this.pc.el.width;
    	this.pc.height = this.pc.el.height;
    	$(this.pc.el).fadeIn('fast');
		this.pc.ctx = this.pc.el.getContext("2d");
		this.pc.ctx.beginPath();
		this.pc.center = {'x':200,'y':200};
		this.pc.ctx.arc(this.pc.center.x, this.pc.center.y, 5, 0, 2 * Math.PI);
		this.pc.ctx.moveTo(this.pc.center.x,this.pc.center.y);
		this.pc.ctx.fillStyle = '#ffffff';
		this.pc.ctx.fill();
		
		if(this.state.gpx.length>0) {
			// redraw reloaded path
			for(var i=1;i<this.state.gpx.length;i++) {
				this.updatePathCanvas(i);
			}
		}
    	
    }

    requestId() {
    	// request unique anonymous ID from server for later storage
    	api('requestid',{},function(data){
    		console.log('requested id callback');
    		console.log(data);
    		if(data.result=='success') {
    			localStorage.setItem('etnr_userid',data.id);
    		} else {
    			console.log('Error: '+data.message);
    		}
    	});
    }



    updatePathCanvas(pid=null) {
        return true;
        // not used currently
    	if(pid==null) {
    		pid=this.state.gpx.length-1;
    	}
    	var p = this.gpsToPoint({
    		'x':this.state.gpx[pid].lon,
    		'y':this.state.gpx[pid].lat,
    	});
    	var s = this.state.gpx[pid].stage;
    	if(pid==0) {
    		this.pc.ctx.beginPath();
	    	this.pc.ctx.moveTo(p.x,p.y);
	    } else {
	    	var p0 = this.gpsToPoint({
	    		'x':this.state.gpx[pid-1].lon,
    			'y':this.state.gpx[pid-1].lat,
	    	});
			this.pc.ctx.strokeStyle = this.state.stages[s].color;
			this.pc.ctx.lineWidth = 3;
    		this.pc.ctx.beginPath();
	    	this.pc.ctx.moveTo(p0.x,p0.y);
	    	this.pc.ctx.lineTo(p.x,p.y);
	    	this.pc.ctx.stroke();
    	}

    }

    stageDone() {
    	// is there another stage?
    	console.log('App.stageDone()');
    	var _this = this;


        this.state.stageID++;

    	

    	console.log('comparing '+this.state.stageID+' to '+this.state.stages.length);

    	if(this.state.stageID<this.state.stages.length) {
    		console.log('going to next stage');
    		this.state.stage = new Stage(this.state.stages[this.state.stageID],_this.stageDone.bind(_this),_this.saveState.bind(_this));
    		
    		this.state.stepping = true;
    		this.saveState();

    		
    		// update interface
    		var last = this.state.stageID-1;
    		$('.stages ul li#stageNav'+last).removeClass('future').addClass('past');
    		$('.stages ul li#stageNav'+this.state.stageID).removeClass('future');

    		// show walking
            this.showKeepWalking();
            this.initProgressSVG();

            // preload audio for next stage
            this.audioReady = false;
            this.audioWaiting = false;

            audio.backgroundLoad(this.state.stages[this.state.stageID].audio,function(){ 

                _this.audioReady = true; 
                _this.loadingAudio.hide(); 
                

                console.log('BACKGROUND AUDIO FULLY LOADED');
                if(_this.audioWaiting) {
                    _this.beginPrompts();
                }
            });

    	} else {
    		console.log('game done');
    		// upload final state
    		$('.stages ul li').removeClass('future').addClass('past');
    		this.state.stepping = false;
    		this.state.complete = true;
    		noSleep.disable();
    		$('#keepWalkingOuter').hide();
    		this.uploadState(true);
    	}

    }

    showKeepWalking(message='Continue walking') {

        if(this.state.stageID>0) {
            var prevStage = this.state.stages[this.state.stageID-1];
            var prevPrompt = prevStage.prompts[0].type;
            if(prevStage.message) {
                message = prevStage.message;
            }
            if(audio.s[prevPrompt+'_continue']) {
                audio.s[prevPrompt+'_continue'].play();
            }
        }

        $('#vegMap').show();
        $('#walkMessage').css({'opacity':1}).html(message);
        $('#keepWalkingOuter').show();

        window.setTimeout(function(){
        	$('#walkMessage').animate({'opacity':0},1000);
        },4000);
    }

    getUTCTime(timeStamp) {
        var cDate = new Date(timeStamp);
        var offSetMilSecs = (-1) * (cDate.getTimezoneOffset()) * (60 * 1000);
        var uDateTimeStamp = timeStamp - offSetMilSecs;
        return uDateTimeStamp;
    }

    geolocationDone() {
        console.log('Geolocation initiation complete');
        this._geolocationDone = true;

        this.startIfReady();
    }

    orientationDone() {
        console.log('Orientation initiation complete');
        this._orientationDone = true;
        this.startIfReady();
    }

    motionDone() {
        console.log('Motion initiation complete');
        this._motionDone = true;
        this.startIfReady();
    }

    startIfReady() {
        if (this._geolocationDone && this._orientationDone) {
            // start
            this.showKeepWalking('Enjoy your experience. Start walking...');
            // hide the intro content, display walking content
            $('#promptTarget .prompt').fadeOut(500,function(){
                $(this).remove();
            });

            console.log('starting');

            if(this.id==null) {
				console.log('initialising with pending user id');
				localStorage.setItem('etnr_userid','pending');
				this.requestId();
				this.initState();
                // audio.playLoop('intro');
			} else {
				console.log('initialising with stored user id '+this.id);
				this.loadState();
			}

        	this.drawStageNav();


            if(this.state.init) {
            	console.log('start was init');
            	this.state.stepping = true;
            } else {
            	console.log('start was resumed');
            }

            this.started = true;

            var _this = this;

	        // setup timeout in case of silent permissions error
	        /* window.setTimeout(function(){
	        	var missing = '';
	        	if(_this.tilt==null) {
	        		missing = 'motion';
	        	} else {
	        		console.log('tilt',_this.tilt);
	        	}
	        	if(_this.bearing==null) {
	        		if(missing!='') missing += ' or ';
	        		missing += 'orientation';
	        	} else {
	        		console.log('bearing',_this.bearing);
	        	}

	        	if(missing!='') {
	        		new Message("We are not receiving a signal from your "+missing+" sensors. For the full AWEN experience, please quit your browser and reopen this page, granting all location, orientation and motion permissions.",7000,'error');
	        	}
	        },3000); */



        }
    }

   	updateProgress() {
        var speed = 1.0;
        var gps = this.state.gpx[this.state.gpx.length-1];

        if(gps.speed!==null) {
            speed = gps.speed;
        }


        
        this.state.overallTime += 1;
        
        broadcast('time',this.state.overallTime);
		if(this.state.stepping && this.state.stage && speed>0.3) {				
				

    		this.state.stage.state.progress += 1;

			broadcast('stageProgress',.1+.9*(1-Math.min(1,1*this.state.stage.state.progress/this.state.stage.state.time)));
			
			// check to see if stage goal reached
			if(this.state.stage.state.progress >= this.state.stage.state.time) {
				// pause step counter
				this.beginPrompts();
			}
			
		}
   			
   		
   	}

   	beginPrompts() {
        $('#vegMap').hide();

        this.state.stepping = false;
        // stage goal reached: trigger prompt

        if(this.audioReady || this.state.stageID==0) {
            this.loadingAudio.hide();
            if(this.state.stageID!=0) {
                if(this.state.stages[this.state.stageID].type=='prompt') {
                    audio.s.prompt.play();
                } else {
                    audio.s.nudge.play();
                }
            }
            
            this.audioWaiting = false;
            this.state.stage.advancePrompt();
        } else {

            this.loadingAudio.show();
            this.audioWaiting = true;
        }

        
		
   	}
   	

    initGPS() {

        var _this = this;
        var now = Date.now();

    	if(this.testGPS) {

    		if(this.state.init) {
    			_this.state.gpx.push({
	    			'lat':0.0,
	    			'lon':0.0,
	    			'timestamp':now,
	    			'proc':false,
	    			'stage':_this.state.stageID,
                    'stageType':_this.state.stages[_this.state.stageID].prompts[0].type,
	    			'stepping':true,
                    'accuracy':0,
                    'heading':null,
                    'speed':3
	    		});
	    		_this.state.init = false;
	    		_this.state.stepping = true;
	    	}
	    	_this.initPathCanvas();


    		// dummy watcher for testing
    		window.setInterval(function(){
    			
    			if(!_this.state.complete) {
    				var dx = 0.0001*(0.5-Math.random());
	    			var dy = 0.0001*(0.5-Math.random());
	    			_this.state.gpx.push({
		            	'lat':_this.state.gpx[_this.state.gpx.length-1].lat+dx,
		            	'lon':_this.state.gpx[_this.state.gpx.length-1].lon+dy,
		            	'timestamp':now,
		            	'proc':false,
		            	'stepping':_this.state.stepping,
	    				'stage':_this.state.stageID,
                        'stageType':_this.state.stages[_this.state.stageID].prompts[0].type,
                        'accuracy':0,
                        'heading':null,
                        'speed':3
		            });
		            _this.delta = 3;
		            localStorage.setItem('lastSpeed',3);

		        	broadcast('accuracy','N/A');
		        	broadcast('speed',Math.round(localStorage.getItem('lastSpeed')));

	    			_this.updatePathCanvas();
		            
                    /* if(_this.state.stepping) {
		            	_this.updateProgress();
		            } */

        			localStorage.setItem('etnr_gpxid',_this.state.gpx.length-1);
        			// console.log('gpxid: '+localStorage.getItem('etnr_gpxid'));
                    if(_this.state.stage !== null && _this.state.stage.prompt !== null) {
                        // send coords down to prompt
                        _this.state.stage.prompt.speed = 4;
                        _this.state.stage.prompt.gps = {'latitude':_this.state.gpx[_this.state.gpx.length-1].lat,'longitude':_this.state.gpx[_this.state.gpx.length-1].lon,'accuracy':100};
                    }

		        	
		            localStorage.setItem('lastlon',-3.188267);
		            localStorage.setItem('lastlat',55.953251);
    			}
    			
    		},1000);

        	this.firstRunGPS = false;
       		this.geolocationDone();
            this.orientationDone();
       		return true;
    	}

        


        

        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            new Message('No geolocation','error');
            return false;
        } else {
        	console.log('requesting gps watch');
        	this._msgGPS = new Message('Requesting GPS stream...');
            
        }

    }

    gpsCallback(position) {
        if(!this.state.complete) {
            var now = Date.now();
            var _this = this;
            console.log('receiving event from sensors GPS',position);
            if(typeof _this._msgGPS !== 'undefined') {
                _this._msgGPS.hide();
            }


            position.timestamp = now;
            position.proc = false;
            position.stepping = _this.state.stepping;
            position.stage = _this.state.stageID;
            position.stageType = _this.state.stages[_this.state.stageID].prompts[0].type;
            


            broadcast('accuracy',Math.round(position.accuracy));
            
            var lastlon = parseFloat(localStorage.getItem('lastlon'));
            var lastlat = parseFloat(localStorage.getItem('lastlat'));

            if(_this.firstRunGPS) {
                _this.firstRunGPS = false;
                console.log('first run gps');
                _this.gpsInitTime = now;
                _this.geolocationDone();
                _this._msgStabilise = new Message('Awaiting GPS stabilisation...');
                
            } else {


                var rawDelta = distance(position.latitude,position.longitude,lastlat,lastlon);
                
                // console.log(position.coords,lastlat,lastlon);
                // console.log('rawDelta',rawDelta);
                
                
                var timeDelta = 0;
                if(_this.gpsTick>0) {
                    timeDelta = (now - _this.gpsTick)/1000;
                
                    console.log('timedelta',timeDelta);

                    // _this.state.overallTime += timeDelta;
                    

                    console.log('dist',rawDelta,'time',timeDelta);
                }
                _this.gpsTick = now;
                

                _this.gpsElapsed = (now-_this.gpsInitTime)/1000;

                // console.log('gpsElapsed',_this.gpsElapsed);



                if(!_this.state.complete) {

                    if(_this.gpsElapsed>5 || (_this.gpsElapsed<=5 && position.accuracy<=20)) {
                        // good data point, add
                        // console.log('adding good data point');
                        _this.state.gpx.push({
                            'lat':position.latitude,
                            'lon':position.longitude,
                            'accuracy':position.accuracy,
                            'timestamp':now,
                            'proc':false,
                            'stepping':_this.state.stepping,
                            'stage':_this.state.stageID,
                            'stageType':_this.state.stages[_this.state.stageID].prompts[0].type,
                            'heading':position.heading,
                            'speed':position.speed
                        });

                        localStorage.setItem('etnr_gpxid',_this.state.gpx.length-1);
                        // console.log('gpxid: '+localStorage.getItem('etnr_gpxid'));


                        // localStorage.setItem('lastSpeed',3.6*_this.delta/timeDelta);
                        var speed = position.speed;
                        if(speed!==null) {
                            speed = (parseFloat(speed)*3.6).toFixed(2)+'km/h';
                        } else {
                            speed = '...';
                        }
                        broadcast('speed',speed);

                        if(_this.state.gpx.length>1) {  
                        
                            if(typeof _this._msgStabilise !=='undefined') {
                                _this._msgStabilise.hide();
                            }

                            // get delta distance
                            var p1 = _this.state.gpx[_this.state.gpx.length-1]; // new point
                            var p2 = _this.state.gpx[_this.state.gpx.length-2]; // previous point
                            _this.delta = distance(p1.lat,p1.lon,p2.lat,p2.lon);
                            
                            _this.state.overallProgress += _this.delta;


                            if(_this.state.stage && _this.state.stage.prompt)

                            if(_this.state.init) {
                                _this.state.init = false;
                                console.log('initialising path canvas');
                                _this.initPathCanvas();
                            } else {
                                // console.log('updating path canvas');
                                _this.updatePathCanvas();
                            }

                            /* if(_this.state.stepping) {
                                // console.log('updating progress');
                                _this.updateProgress();
                            } */

                            
                        }
                        if(_this.state.stage !== null && _this.state.stage.prompt !== null) {
                            // send coords down to prompt
                            _this.state.stage.prompt.gps = position;
                            _this.state.stage.prompt.speed = position.speed;
                        }
                    }
                    
                } 
            }
            localStorage.setItem('lastlon',position.longitude);
            localStorage.setItem('lastlat',position.latitude);
        }
        
        
    }

    gpsError(err) {
        rerr('Unable to establish GPS watcher, error code '+err.code);
        console.log('Unable to establish GPS watcher, error code '+err.code);
        return false;
    }

    orientationTick(e) {
        if(!this._orientationDone) {
            this.orientationDone();
        }
        if(this.started) {
            this.bearing = e.bearing;
            this.bearingAbs = e.bearingAbs;
            // send sensor data to prompt if exists
            if(typeof this.state.stage.prompt !== 'undefined' && this.state.stage.prompt !== null) {
                this.state.stage.prompt.bearing = this.bearing;
                this.state.stage.prompt.bearingAbs = this.bearingAbs;
            }
        }
    }

    orientationError(e) {
        console.log('orientation error',e);
        new Message(e,0,'error');
    }

    motionTick(e) {
        console.log('motion tick',e);
    }

    motionError(e) {
        console.log('motion tick',e);
        new Message(e,0,'error');
    }

    motionTick(event) {
        if(this.started) {
            this.tilt = event.accelerationIncludingGravity.z;
            // send sensor data to prompt if exists
            if(typeof this.state.stage.prompt !== 'undefined' && this.state.stage.prompt !== null) {
                this.state.stage.prompt.gravity = event.accelerationIncludingGravity;
            }
        }
        
    }



    initMotion() {
    	/* console.log('Registering motion- and orientation-capturing event handlers...');
        if (!this.capturingMotion) {

            var _this = this;

            const OrientationPublisher = {
			  active: false
			};

			// Setup listener
			OrientationPublisher.init = function (onChange) {

				if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
	            	console.log('requesting device orientation permission');
	                DeviceMotionEvent.requestPermission().then( response => {
			            // (optional) Do something after API prompt dismissed.


                        console.log('in then block with response '+response);

			            if ( response == "granted" ) {
                            console.log('granted');
			            	window.addEventListener( "devicemotion", (event) => {
		                		_this.deviceTilting(event);
			                });
			            	console.log('device orientation permission granted');
			                if (window.DeviceOrientationEvent && !OrientationPublisher.active) {
							    
                                if(isAndroid() && (isChrome()||isOpera())) {
                                    console.log('using deviceorientationabsolute');
                                    window.addEventListener('deviceorientationabsolute', OrientationPublisher.orientationChange(onChange), false);

                                } else {
                                    window.addEventListener('deviceorientation', OrientationPublisher.orientationChange(onChange), false);
                                }

							    window.addEventListener('compassneedscalibration', function () {
							      new Message("Your compass needs to be calibrated before using the app. Please follow your device's instructions, then reload this page.");
							    }, false);
							    OrientationPublisher.active = true;
							
							}

                            _this.orientationDone();
			            } else {
                            console.log('not granted');
			            	_ = new Message('Orientation sensor permissions are required. Please quit the browser, re-open this page and grant permissions to use this app.',0,'error');
			            	// stop the app here
			            }
			        })
			        
	            } else {
                    console.log('permissions absent');
	            	if (window.DeviceOrientationEvent && !OrientationPublisher.active) {
					    window.addEventListener( "devicemotion", (event) => {
	                		_this.deviceTilting(event);
		                });
            			_this.motionDone();

                        if(isAndroid() && (isChrome()||isOpera())) {
                            console.log('using deviceorientationabsolute');
                            window.addEventListener('deviceorientationabsolute', OrientationPublisher.orientationChange(onChange), false);

                        } else {
                            window.addEventListener('deviceorientation', OrientationPublisher.orientationChange(onChange), false);
                        }

					    window.addEventListener('compassneedscalibration', function () {
					      new Message("Your compass needs to be calibrated before using the app. Please follow your device's instructions, then reload this page.");
					    }, false);
					    OrientationPublisher.active = true;
					} else {
						console.log('missing???');
					}
	            }


				  
			};

			OrientationPublisher.getMode = function () {
			  var elem = document.documentElement;
			  return elem && elem.clientWidth / elem.clientHeight < 1.1 ? 'portrait' : 'landscape';
			};

			OrientationPublisher.cloneEvent = function (e) {
			  return {
			    alpha: Number((e.alpha || 0).toFixed(3)),
			    beta: Number((e.beta || 0).toFixed(3)),
			    gamma: Number((e.gamma || 0).toFixed(3)),
			    absolute: Number((e.absolute || 0))
			  };
			};

			// Normalize starting values based on OS and browser
			OrientationPublisher.normalizers = {
			  // Firefox rotates counter clockwise
			  firefox: function (e) {
			    var normalized = OrientationPublisher.cloneEvent(e);
			    normalized.alpha = normalized.alpha * -1;
			    normalized.alpha = normalized.alpha - (window.orientation || 0);
			    return normalized;
			  },
			  // Android stock starts facing West
			  android_stock: function (e) {
			    var normalized = OrientationPublisher.cloneEvent(e);
			    normalized.alpha = (normalized.alpha + 270) % 360;
			    normalized.alpha = normalized.alpha - (window.orientation || 0);
			    return normalized;
			  },
			  // Android Chrome is good to go
			  android_chrome: function (e) {
			    var normalized = OrientationPublisher.cloneEvent(e);
			    normalized.alpha = normalized.alpha - (window.orientation || 0);

			    return normalized;
			  },
			  // Opera Mobile is good to go
			  opera: function (e) {
			    var normalized = OrientationPublisher.cloneEvent(e);
			    normalized.alpha = normalized.alpha - (window.orientation || 0);
			    return normalized;
			  },
			  // IOS uses a custom property and rotates counter clockwise
			  ios: function (e) {
			    var normalized = OrientationPublisher.cloneEvent(e);
			    if (e.webkitCompassHeading) {
			         // use the custom IOS property otherwise it will be relative
			         normalized.alpha = e.webkitCompassHeading;
                } 
			    // IOS is counter clockwise
			    normalized.alpha = normalized.alpha * -1;
			    normalized.alpha = normalized.alpha - (window.orientation || 0);

                // normalized.alpha = (360-normalized.alpha)%360;
			    return normalized;
			  },
			  // for now treat is like Chrome desktop which rotates counter clockwise
			  unknown: function (e) {
			    var normalized = OrientationPublisher.cloneEvent(e);
			    normalized.alpha = normalized.alpha * -1;
			    return normalized;
			  }
			};

			// Parse the user agent to get OS and browser so we know how to normalize values
			OrientationPublisher.getNormalizerKey = function (ua) {
			  var userAgent = ua || window.navigator.userAgent;
			  // IOS uses a special property
			  if (userAgent.match(/(iPad|iPhone|iPod)/i)) {
			    return 'ios';
			  } else if (userAgent.match(/Firefox/i)) {
			    return 'firefox';
			  } else if (userAgent.match(/Opera/i)) {
			    return 'opera';
			  } else if (userAgent.match(/Android/i)) {
			    if (window.chrome) {
			      return 'android_chrome';
			    } else {
			      return 'android_stock';
			    }
			  } else {
			    return 'unknown';
			  }
			};

			OrientationPublisher.orientationChange = function (callback) {
			  return function (e) {
                
			    var normalizerKey = OrientationPublisher.getNormalizerKey();
			    var normalizedValues = OrientationPublisher.normalizers[normalizerKey](e);

			    // If 'absolute' property is null compass will not work because alpha will be relative to orientation at page load!!
			    normalizedValues.absolute = normalizedValues.absolute || false;

			    // Broadcast custom event and normalized values for any subscribers
			    callback({
			      orientation: (window.orientation || 0),
			      normalizerKey: normalizerKey,
			      raw: OrientationPublisher.cloneEvent(e),
			      normalized: normalizedValues
			    });
			  };
			};

			function compass (onChange, onFirst = function () { }) {

			  let hasListened = false;

			  OrientationPublisher.init(trigger);

			  function trigger (...args) {
			    if (!hasListened) {
			      onFirst(...args);
			      hasListened = true;
			    }
			    onChange(...args);
			  }
			}

			compass(function(data){
				_this.bearing = data.normalized.alpha;

		        if(_this.state.stage !== null && _this.state.stage.prompt !== null) {
		        	_this.state.stage.prompt.bearing = _this.bearing;
		        }
			});

            
        }

        _this.motionDone();
        _this.orientationDone(); */
    }


    showError(errorType) {
    	new Message(errorType,0,'error');
    }

    

    replacer(key,value) {
    	// remove unnecessary info from uploaded state
    	  // Filtering out properties
		  if (key === 'prompt') {
		    return null;
		  }
		  return value;
    }

    uploadState(ending=false) {
    	var s = JSON.stringify(decycle(this.state),this.replacer);
        console.log('uploading state...');
    	api('uploadstate',{
    		'state':s
    	},function(data){
    		console.log('upload state response: ');
    		console.log(data);
    		// data = JSON.parse(data);
    		if(data.result=='success') {
    			// full state successfully uploaded to server; clear local storage
    			if(ending) {        
                    localStorage.clear();
                    console.log('Local storage cleared. Note that a stub might need to be added to guarantee repeat users minimal repetition.');
                }
    		} else {
    			console.log('Error: '+data.message);
    		}
    	});
    }

    downloadState() {
    	api(
    		'downloadstate',
    		{},
    		function(data){
    			// restore state logic here
    			// console.log(data);
    		}
    	);
    }

}