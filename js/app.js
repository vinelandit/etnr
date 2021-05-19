// main app object
class App {

    constructor(id=null,testGPS=false) {

    	localStorage.setItem('speed',0);
        this._vegMapInit = true;


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
	                'distance': 100,
	                'prompts': [
	                	{
	                		'type':'noise'
	                	},
	                	
	                ],
                    'message':'Please continue your walk',
	                'type':'nudge'
	            },
                {
                    'distance': 100,
                    'prompts': [
                        
                        { 'type':'hum' }
                    ],
                    'type':'prompt',
                    'message':'Please continue with your walk'
                },
                {
                    'distance': 100,
                    'prompts': [
                        
                        { 'type':'ground' }
                    ],
                    'type':'prompt',
                    'message':'Please continue your journey'
                },
	            {
	                'distance': 100,
	                'prompts': [
	                	{ 
	                		'type':'matchTree'
	                	}
	                	
	                ],
	                'type':'prompt',
                    'message':'Carry on walking'
	            },
	            {
	                'distance': 100,
	                'prompts': [
	                	{ 
	                		'type':'leaf'
	                	}
	                ],
	                'type':'prompt',
                    'message':'Please continue your walk'
	            },
	            {
                    'distance': 100,
                    'prompts': [
                        { 
                            'type':'weeds'
                        }
                        
                    ],
                    'type':'nudge',
                    'message':'Please continue walking'
                },
                {
                    'distance': 100,
                    'prompts': [
                        { 
                            'type':'lichen'
                        }
                        
                    ],
                    'type':'nudge',
                    'message':'Continue your journey'
                },
                {
                    'distance': 100,
                    'prompts': [
                        { 
                            'type':'lightning'
                        }
                        
                    ],
                    'type':'nudge',
                    'message':'Please continue walking'
                },
	            
	            {
	                'distance': 100,
	                'prompts': [
	                	{ 
	                		'type':'wind'
	                	}
	                	
	                ],
	                'type':'prompt',
                    'message':'Please continue your walk'
	            },
                {
                    'distance': 100,
                    'prompts': [
                        { 
                            'type':'clouds'
                        }
                        
                    ],
                    'type':'prompt',
                    'message':'Please continue walking'
                },
                {
                    'distance': 100,
                    'prompts': [
                        { 
                            'type':'blue'
                        }
                        
                    ],
                    'type':'nudge',
                    'message':'Please continue walking'
                },
	            {
	                'distance': 100,
	                'prompts': [
	                	{ 
	                		'type':'quietness'
	                	}
	                	
	                ],
	                'type':'prompt',
                    'message':'Please continue your journey'
	            },
	            {
	                'distance': 100,
	                'prompts': [
	                	{ 
	                		'type':'ocean'
	                	}
	                	
	                ],
	                'type':'nudge',
                    'message':'Please continue facing the ocean'
	            },
	            {
	                'distance': 100,
	                'prompts': [
	                	{ 
	                		'type':'breathe'
	                	}
	                	
	                ],
	                'type':'prompt'
	            },
	            {
	                'distance': 1,
	                'prompts': [
	                	
	                	{ 'type':'beforeEnd' },
	                	
	                	{ 'type': 'complete'}
	                ],
	                'type':'nudge'
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

    }

    initState() {
    	var _this = this;
        this.state.stage = new Stage(this.state.stages[0],_this.stageDone.bind(_this),_this.saveState.bind(_this));


    }

    initProgressSVG() {
        this.psvg = $('svg#progressSVG');
        this.psvg.find('path').hide();
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

	        this.state.stage = new Stage(this.state.stages[this.state.stageID],_this.stageDone.bind(_this),_this.saveState.bind(_this));
	        if(showPrompt>=0) {
	        	this.state.stage.state.currentPrompt = showPrompt;
	        	console.log('attempting to show prompt '+showPrompt);
	        	this.state.stage.showPrompt();
	        	this.state.stepping = false;
	        } else {
                this.showKeepWalking();
            }

	        localStorage.setItem('etnr_gpxid',this.state.gpx.length-1);

	        // request media from server
	        this.getMedia();
	        // initialise path canvas with prior path
        	this.initPathCanvas();

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

    startStageAudio(stageID,fade=5000) {
        return true;
        if(this.state.stages[stageID]) {
            var audioLabel = this.state.stages[stageID].prompts[0].type;
            if(this.state.stages[stageID].audio) {
                audioLabel = this.state.stages[stageID].audio;
            }
            var a = audio.data.sprite['loop_'+audioLabel];
            console.log('audio?',a,audioLabel);
            if(a && !audio.soundIDs[audioLabel]) {
                console.log('starting audio for stage '+audioLabel);
                // turn on stage background audio
                audio.soundIDs[audioLabel] = audio.s.play('loop_'+audioLabel);
                audio.currentSoundID = audio.soundIDs[audioLabel];

                console.log('registered audio ID '+audio.soundIDs[audioLabel]+' for '+audioLabel);
            } else {

                console.log('no audio for stage '+audioLabel+' or stage audio already playing');
            }    
        }
        
    }
    stopStageAudio(stageID,fade=5000) {
        return true;
        var audioLabel = this.state.stages[stageID].prompts[0].type;
        if(this.state.stages[stageID].audio) {
            audioLabel = this.state.stages[stageID].audio;
        }
    	if(audio.soundIDs[audioLabel]) {
    		// turn off stage background audio
    		audio.s.fade(0.5,0,fade,audio.soundIDs[audioLabel]);	
    		console.log('stopping audio for stage '+audioLabel+ ' fade '+fade);
    	} else {

    		console.log('no audio for stage '+audioLabel);
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
                audio.playLoop('intro');
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

   		if(this.state.gpx.length>1) {
   			if(this.state.stepping && this.state.stage) {				
	   				
				console.log(this.delta);

				this.state.stage.state.progress += this.delta;

   				broadcast('stageProgress',.1+.9*(1-Math.min(1,1*this.state.stage.state.progress/this.state.stage.state.distance)));
   				
   				broadcast('distance',Math.round(this.state.overallProgress));

   				
   				// check to see if stage goal reached
   				if(this.state.stage.state.progress >= this.state.stage.state.distance) {
   					// pause step counter
   					this.beginPrompts();
   				}
	   			
   			}
   			
   		}
   	}

   	beginPrompts() {

        $('#vegMap').hide();

   		this.state.stepping = false;
		// stage goal reached: trigger prompt
		if(this.state.stageID!=0) {
    		if(this.state.stages[this.state.stageID].type=='prompt') {
    			audio.s.prompt.play();
    		} else {
    			audio.s.nudge.play();
    		}
    	}
        // prompt stage audio
        if(this.state.stageID>0) {
            
            this.stopStageAudio(this.state.stageID-1);  
        }
        this.startStageAudio(this.state.stageID);   

		this.state.stage.advancePrompt();
		
   	}
   	

    initGPS() {

        var _this = this;

    	if(this.testGPS) {

    		if(this.state.init) {
    			_this.state.gpx.push({
	    			'lat':0.0,
	    			'lon':0.0,
	    			'timestamp':Date.now(),
	    			'proc':false,
	    			'stage':_this.state.stageID,
                    'stageType':_this.state.stages[_this.state.stageID].prompts[0].type,
	    			'stepping':true,
                    'accuracy':0
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
		            	'timestamp':Date.now(),
		            	'proc':false,
		            	'stepping':_this.state.stepping,
	    				'stage':_this.state.stageID,
                        'stageType':_this.state.stages[_this.state.stageID].prompts[0].type,
                        'accuracy':0
		            });
		            _this.delta = 4;
		            localStorage.setItem('lastSpeed',4);

		        	broadcast('accuracy','N/A');
		        	broadcast('speed',Math.round(localStorage.getItem('lastSpeed')));

	    			_this.updatePathCanvas();
		            if(_this.state.stepping) {
		            	_this.updateProgress();
		            }

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

        // first check if permission previously denied
        if (navigator.permissions) {
            navigator.permissions.query({
                name: 'geolocation'
            }).then(function(result) {
                if (result.state == 'granted') {
                    console.log('geolocation permission granted');
                } else if (result.state == 'prompt') {
                    console.log('geolocation permission prompt');
                } else if (result.state == 'denied') {
                    console.log('geolocation permission denied, show error');
                    _this.showError('GPS permission denied. Please close your browser and reopen this page in it, granting all requested permissions.');
                    return;
                }

            })
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

        var _this = this;
        console.log('receiving event from sensors GPS',position);
        if(typeof _this._msgGPS !== 'undefined') {
            _this._msgGPS.hide();
        }


        position.coords = {
            'accuracy':position.accuracy,
            'latitude':position.latlng.lat,
            'longitude':position.latlng.lng,
            'timestamp':position.timestamp,
            'proc':false,
            'stepping':_this.state.stepping,
            'stage':_this.state.stageID,
            'stageType':_this.state.stages[_this.state.stageID].prompts[0].type
        };

        broadcast('accuracy',Math.round(position.coords.accuracy));
        
        var lastlon = parseFloat(localStorage.getItem('lastlon'));
        var lastlat = parseFloat(localStorage.getItem('lastlat'));

        if(_this.firstRunGPS) {
            _this.firstRunGPS = false;
            console.log('first run gps');
            _this.gpsInitTime = position.coords.timestamp;
            _this.geolocationDone();
            _this._msgStabilise = new Message('Awaiting GPS stabilisation...');
            
        } else {


            var rawDelta = distance(position.coords.latitude,position.coords.longitude,lastlat,lastlon);
            
            // console.log(position.coords,lastlat,lastlon);
            // console.log('rawDelta',rawDelta);
            var now = position.coords.timestamp;
            
            var timeDelta = 0;
            if(_this.gpsTick>0) {
                timeDelta = (now - _this.gpsTick)/1000;
            
                console.log('timedelta',timeDelta);

                _this.state.overallTime += timeDelta;
                broadcast('time',Math.round(_this.state.overallTime));
                

                console.log('dist',rawDelta,'time',timeDelta);
            }
            _this.gpsTick = now;
            

            _this.gpsElapsed = (now-_this.gpsInitTime)/1000;

            // console.log('gpsElapsed',_this.gpsElapsed);



            if(!_this.state.complete) {

                if(_this.gpsElapsed>5 || (_this.gpsElapsed<=5 && position.coords.accuracy<=20)) {
                    // good data point, add
                    // console.log('adding good data point');
                    _this.state.gpx.push({
                        'lat':position.coords.latitude,
                        'lon':position.coords.longitude,
                        'accuracy':position.coords.accuracy,
                        'timestamp':position.coords.timestamp,
                        'proc':false,
                        'stepping':_this.state.stepping,
                        'stage':_this.state.stageID,
                        'stageType':_this.state.stages[_this.state.stageID].prompts[0].type
                    });

                    localStorage.setItem('etnr_gpxid',_this.state.gpx.length-1);
                    // console.log('gpxid: '+localStorage.getItem('etnr_gpxid'));


                    if(_this.state.gpx.length>1) {  
                    
                        if(typeof _this._msgStabilise !=='undefined') {
                            _this._msgStabilise.hide();
                        }

                        // get delta distance
                        var p1 = _this.state.gpx[_this.state.gpx.length-1]; // new point
                        var p2 = _this.state.gpx[_this.state.gpx.length-2]; // previous point
                        _this.delta = distance(p1.lat,p1.lon,p2.lat,p2.lon);
                        
                        _this.state.overallProgress += _this.delta;

                        localStorage.setItem('lastSpeed',3.6*_this.delta/timeDelta);
                        broadcast('speed',Math.round(parseFloat(localStorage.getItem('lastSpeed')))+'km/h');

                        if(_this.state.stage && _this.state.stage.prompt)

                        if(_this.state.init) {
                            _this.state.init = false;
                            console.log('initialising path canvas');
                            _this.initPathCanvas();
                        } else {
                            // console.log('updating path canvas');
                            _this.updatePathCanvas();
                        }

                        if(_this.state.stepping) {
                            // console.log('updating progress');
                            _this.updateProgress();
                        }

                        
                    }
                    if(_this.state.stage !== null && _this.state.stage.prompt !== null) {
                        // send coords down to prompt
                        _this.state.stage.prompt.gps = position.coords;
                        _this.state.stage.prompt.speed = localStorage.getItem('lastSpeed');
                    }
                }
                
            } 
        }
        localStorage.setItem('lastlon',position.coords.longitude);
        localStorage.setItem('lastlat',position.coords.latitude);
        
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
    	api('uploadstate',{
    		'state':s
    	},function(data){
    		console.log('upload state RAW: ');
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