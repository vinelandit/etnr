// main app object
class App {

    constructor(id=null) {

    	var _this = this; // portable reference to main app object

    	this.delta = 0;
    	this.testGPS = false;
		this.R = 6371e3; // metres
		this.toRads = 0.0174533293;
		this.pathScale = 500000;

		if(id==null) {
			console.log('initialising with pending user id');
			localStorage.setItem('etnr_userid','pending');
			this.requestId();
			this.initState();
		} else {
			console.log('initialising with stored user id '+id);
			this.loadState();
		}
 

        this.gpsElapsed = 0;
      
        this.drawStageNav();

        this.capturingMotion = false;

        console.log('Requesting geolocation');
        this.firstRunGPS = true;
        this.initGPS();

        // start motion/orientation capture
        console.log('Requesting orientation');
        this.initMotion();

    }



    /********* UTILITY FUNCTIONS **********/

    mapr(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    distance(lat1, lon1, lat2, lon2) {

        const phi1 = lat1 * Math.PI / 180; // phi1, lambda in radians
        const phi2 = lat2 * Math.PI / 180;
        const deltaPhi = (lat2 - lat1) * Math.PI / 180;
        const deltaLambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return this.R * c; // in metres

    }

    initState() {
    	var _this = this;
    	this.state = {
    		'init':true,
        	'stageID':0,
        	'overallProgress':0,
        	'stepping':false,
        	'complete':false,
        	'gpx':[], // will store user's path
        	'stages': [
	            {
	            	'id':0,
	                'distance': 3,
	                'prompts': [
	                	{
	                		'type':'zigzag'
	                	},
	                	{	'type':'confirm' } 
	                ],
	                'color':'#009900'
	            },
	            {
	            	'id':1,
	                'distance': 3,
	                'prompts': [
	                	{ 
	                		'type':'matchTree'
	                	},
	                	{ 'type':'confirm' }
	                	
	                ],
	                'color':'#009999'
	            },
	            {
	            	'id':2,
	                'distance': 3,
	                'prompts': [
	                	{ 
	                		'type':'takePhoto',
	                		'domID':'redBig'
	                	},
	                	{ 'type':'confirm' },
	                	
	                	{ 'type': 'complete'}
	                ],
	                'color':'#009999'
	            }
	        ]
        };
        this.state.stage = new Stage(this.state.stages[0],_this.stageDone.bind(_this),_this.saveState.bind(_this));       

    }

    loadState() {
    	var _this = this;
    	var s = localStorage.getItem('etnr_state');
    	if(s!==null&&s!=='') {
    		
    		var showPrompt = -1;
    		this.state = JSON.parse(s);
    		console.log(JSON.parse(JSON.stringify(this.state)));
			
			if(this.state.stage.prompt!==null && !this.state.stepping && typeof this.state.stage.prompt !== 'undefined' && this.state.stage.prompt.state.showing) {	
	        	showPrompt = this.state.stage.state.currentPrompt;
	        }

	        this.state.stage = new Stage(this.state.stages[this.state.stageID],_this.stageDone.bind(_this),_this.saveState.bind(_this));
	        if(showPrompt>=0) {
	        	this.state.stage.state.currentPrompt = showPrompt;
	        	console.log('attempting to show prompt '+showPrompt);
	        	this.state.stage.showPrompt();
	        	console.log('STOP FUCKING STEPPING');
	        	this.state.stepping = false;
	        }
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
    	var s = JSON.stringify(this.state,this.replacer);
    	console.log(JSON.parse(s));
    	localStorage.setItem('etnr_state',s);
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
    	} else {
    		console.log('game done');
    		// upload final state
    		$('.stages ul li').removeClass('future').addClass('past');
    		this.state.stepping = false;
    		this.state.complete = true;
    		this.uploadState();
    	}

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

    startIfReady() {
        if (this._geolocationDone && this._orientationDone) {
            // start audio
            console.log('starting');
            if(this.state.init) {
            	console.log('start was init');
            	this.state.stepping = true;
            } else {
            	console.log('start was resumed');
            }
        }
    }

   	updateProgress() {

   		if(this.state.gpx.length>1) {
   			if(this.state.stepping) {				
	   				
				console.log(this.delta);

				this.state.stage.state.progress += this.delta;

   				broadcast('stages-'+this.state.stage.state.id+'-progressPc',Math.min(100,100*this.state.stage.state.progress/this.state.stage.state.distance));
   				this.state.overallProgress += this.delta;
   				broadcast('overallProgress',Math.round(this.state.overallProgress));
   				
   				// check to see if stage goal reached
   				if(this.state.stage.state.progress >= this.state.stage.state.distance) {
   					// pause step counter
   					this.state.stepping = false;
   					// stage goal reached: trigger prompt
   					this.state.stage.advancePrompt();
   				}
	   			
   			}
   			
   		}
   	}

    initGPS() {

        var _this = this;

    	if(this.testGPS) {

    		if(this.state.init) {
    			_this.state.gpx.push({
	    			'lat':0.0,
	    			'lon':0.0,
	    			'time':Date.now(),
	    			'proc':false,
	    			'stage':_this.state.stageID,
	    			'stepping':true
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
		            	'time':Date.now(),
		            	'proc':false,
		            	'stepping':_this.state.stepping,
	    				'stage':_this.state.stageID
		            });
		            _this.delta = 4;

	    			_this.updatePathCanvas();
		            if(_this.state.stepping) {
	    				console.log('bark',_this.state.stepping);
		            	_this.updateProgress();
		            }
    			}
    			
    		},1000);

        	this.firstRunGPS = false;
       		this.geolocationDone();
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
                    _this.showError('GPS permission denied');
                    return;
                }

            })
        } else {

            // _this.showError('GPS');
        }


        function success(position) {
        	
        	var lastlon = parseFloat(localStorage.getItem('lastlon'));
    		var lastlat = parseFloat(localStorage.getItem('lastlat'));

        	if(_this.firstRunGPS) {
	            _this.firstRunGPS = false;
	            console.log('first run gps');
        		_this.gpsInitTime = Date.now();
           		_this.geolocationDone();
           		_this.gpsMsg = new Message('Awaiting GPS stabilisation');
           		
        	} else {

	    		var rawDelta = _this.distance(position.coords.latitude,position.coords.longitude,lastlat,lastlon);
	    		console.log(position.coords,lastlat,lastlon);
	    		console.log('rawDelta',rawDelta);

				_this.gpsElapsed = (Date.now()-_this.gpsInitTime)/1000;
				console.log('gpsElapsed',_this.gpsElapsed);

        		if(!_this.state.complete) {

        			if(_this.gpsElapsed>4 || (_this.gpsElapsed<=4 && _this.rawDelta<5)) {
        				// good data point, add
        				console.log('adding good data point');
        				_this.state.gpx.push({
			            	'lat':position.coords.latitude,
			            	'lon':position.coords.longitude,
			            	'time':Date.now(),
			            	'proc':false,
			            	'stepping':_this.state.stepping,
			    			'stage':_this.state.stageID
			            });
			            if(_this.state.gpx.length>1) {	
		            	
			            	if(typeof _this.gpsMsg !=='undefined') {
			            		_this.gpsMsg.hide();
			            	}

				            // get delta distance
				   			var p1 = _this.state.gpx[_this.state.gpx.length-1]; // new point
				   			var p2 = _this.state.gpx[_this.state.gpx.length-2]; // previous point
				   			_this.delta = _this.distance(p1.lat,p1.lon,p2.lat,p2.lon);


			   				if(_this.state.init) {
			            		_this.state.init = false;
			            		console.log('initialising path canvas');
	        					_this.initPathCanvas();
			            	} else {
			            		console.log('updating path canvas');
				            	_this.updatePathCanvas();
			            	}

				            if(_this.state.stepping) {
			   					console.log('updating progress');
				            	_this.updateProgress();
				            }

				            
				        }
        			}
	        		
        		} 
        	}
            localStorage.setItem('lastlon',position.coords.longitude);
			localStorage.setItem('lastlat',position.coords.latitude);
            
        }

        function error(err) {
            console.log('Unable to establish GPS watcher, error code '+err.code);
            _this.showError('Unable to establish GPS watcher, error code '+err.message);
            return false;
        }

        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            _this.showError('noGPS');
            return false;
        } else {
        	console.log('requesting gps watch');
            navigator.geolocation.watchPosition(success, error, {enableHighAccuracy:true,timeout:10000,maximumAge:0});
        }

    }




    initMotion() {
    	console.log('Registering motion- and orientation-capturing event handlers...');
        if (!this.capturingMotion) {

            var _this = this;

            if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
            	console.log('requesting device motion permission')
                DeviceMotionEvent.requestPermission().then( response => {
		            // (optional) Do something after API prompt dismissed.
		            console.log(response);
		            if ( response == "granted" ) {
		            	console.log('device motion permission granted');
		                window.addEventListener( "devicemotion", (event) => {
	                		_this.deviceTilting(event);
		                })
		            } else {
		            	_ = new Message('Orientation and motion sensor permissions are required. Please quit the browser, re-open this page and grant permissions to use this app.');
		            	// stop the app here
		            }
		        })
		        .catch( console.error ); // request permission on iOS devices
            } else {
            	window.addEventListener("devicemotion", function(event) {
	                _this.deviceTilting(event);
	            });

            }


            if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
            	console.log('requesting device orientation permission')
                DeviceOrientationEvent.requestPermission().then( response => {
		            // (optional) Do something after API prompt dismissed.
		            console.log(response);
		            if ( response == "granted" ) {
		            	console.log('device orientation permission granted');
		                window.addEventListener( "deviceorientation", (event) => {
		                    
			                _this.deviceSwivelling(event);
		                })
		            } else {
		            	_ = new Message('Orientation and motion sensor permissions are required. Please quit the browser, re-open this page and grant permissions to use this app.');
		            	// stop the app here
		            }
		        })
		        .catch( console.error ); // request permission on iOS devices
            } else {
            	if(this.testGPS) {
            		_this.bearing = 0;
            		window.setInterval(function(){
            			_this.bearing += 25;
            			_this.bearing = _this.bearing % 360; 
            			if(_this.state.stage.prompt !== null) {
		                	_this.state.stage.prompt.bearing = _this.bearing;
		                }
            		},200);
            	} else {
	            	window.addEventListener("deviceorientation", function(event) {
		                
		                _this.deviceSwivelling(event);
		            });
		        }
            }

            
         
            this.capturingMotion = true;
            this.orientationDone();
        }
    }

    showError(errorType) {
    	alert(errorType);
    }

    deviceTilting(event) {
		this.tilt = event.accelerationIncludingGravity.z;

		// send sensor data to prompt if exists
		if(typeof this.state.stage.prompt !== 'undefined' && this.state.stage.prompt !== null) {
			this.state.stage.prompt.gravity = event.accelerationIncludingGravity;
		}
    }

    deviceSwivelling(event) {

    	this.bearing = event.alpha;
        if(this.state.stage.prompt !== null) {
        	this.state.stage.prompt.bearing = this.bearing;
        }
    }

    replacer(key,value) {
    	// remove unnecessary info from uploaded state
    	if(key=='interface'||key=='world') {
    		return undefined;
    	}
    	return value;
    }

    uploadState() {
    	var s = JSON.stringify(this.state,this.replacer);
    	api('uploadstate',{
    		'state':s
    	},function(data){
    		console.log('upload state RAW: ');
    		console.log(data);
    		// data = JSON.parse(data);
    		if(data.result=='success') {
    			// full state successfully uploaded to server; clear local storage
    			localStorage.clear();
    			console.log('Local storage cleared. Note that a stub might need to be added to guarantee repeat users minimal repetition.')
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



    logPerformance() {
        // send the log to the server
        var n = new Date();
        var isoDT = n.toISOString();
        if (typeof this.gps.lat !== 'undefined' && typeof this.gps.lon !== 'undefined') {
            var params = {
                'lat': this.gps.lat,
                'lon': this.gps.lon,
                'port': this.port.name,
                'id': this.port.id,
                'time': isoDT
            };
            var paramsURL = '';

            for (var i in params) {
                paramsURL += i + '=' + params[i] + '&';
            };

            console.log(paramsURL);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', './log.php?' + paramsURL);
            xhr.send(null);
        }


    }

}