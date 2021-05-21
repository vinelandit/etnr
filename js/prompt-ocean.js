
class Prompt_ocean extends Prompt {
	constructor(domID,doneCallback) {
		super('ocean',domID,doneCallback,'image/jpeg');
		this._bearing = null;
		this.tpl = `<div class="prompt ocean fullscreen" id="" data-media-target=".photoBg">
			
		      
		  </div>`;

		this._bearing = null;
		this._pos = null;
		this.targetDistance = null;
		this._point = null;
		this._found = false;

	    if(localStorage.getItem('lastlat')!==null) {
	    	this.pos = {
	    		'lat':localStorage.getItem('lastlat'),
	    		'lon':localStorage.getItem('lastlon')
	    	};
	    }
	
	}

	initSound() {
		audio.playLoop('blue');
	}

	tplSuccess() {
		return `
			<div class="page fullscreen hidden" data-voiceover="turn">
		      	<div class="center">
			      	<div class="unit">
			      		<div class="instruction">Turn until you're facing the ocean <span data-bind-value="debug"></span></div>
			   		</div>
			      	
			        <div class="compassRose">
				      <div class="arrow"></div>
				      <div class="compass-circle"></div>
				      <div class="my-point"></div>
				      <!-- <div class="compassPointer"></div> -->
				    </div>
				    <div class="unit"><button class="byZone next"></button></div>
		      	</div>
		    </div>
			<div class="page fullscreen hidden zone-scotland" data-voiceover="scotland">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">In Scotland, you are never more than 40 miles from the sea.</div></div>
			      	
			      	<div class="unit"><button class="autoNext gotoPage next" data-page="zone-row"></button></div>
		      	</div>
		    </div>
		    <div class="page fullscreen hidden zone-uk" data-voiceover="uk">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">In the UK, you are never more than 70 miles from the sea.</div></div>
			      	
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		    </div>
		    
		    <div class="page fullscreen hidden zone-row" data-voiceover="by">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">By 2050, the vast majority of the world’s population will live within 1 mile of the sea. 
At what distance would you like to be?
</div></div>
			      	
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		    </div>
		    
		 `;
	}

	tplToofar() {
		return `
			<div class="page fullscreen hidden" data-voiceover="turn">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Turn until you’re facing the ocean.</div></div>
			      	<div class="unit"><button class="byZone next"></button></div>
		      	</div>
		    </div>
			<div class="page fullscreen hidden zone-scotland" data-voiceover="scotland">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">In Scotland, you are never more than 40 miles from the sea.</div></div>
			      	
			      	<div class="unit"><button class="autoNext gotoPage next" data-page="zone-row"></button></div>
		      	</div>
		    </div>
		    <div class="page fullscreen hidden zone-uk" data-voiceover="uk">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">In the UK, you are never more than 70 miles from the sea.</div></div>
			      	
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		    </div>
		    
		    <div class="page fullscreen hidden zone-row" data-voiceover="by">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">By 2050, the vast majority of the world’s population will live within 1 mile of the sea. 
At what distance would you like to be?
</div></div>
			      	
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		    </div>
		      `;
	}

	tooFar() {
		var _this = this;
		this.interface.append(this.tplToofar());
		this.initNav();

	}
	
	zone() {
		var bb = {
			'uk':
				{
					'lat_min':50,
					'lat_max':61,
					'lon_min':-8,
					'lon_max':2
				},
			'scotland': 
				{
					'lat_min':54.7,
					'lat_max':61,
					'lon_min':-8,
					'lon_max':-1
				}
		}

		var lat = parseFloat(localStorage.getItem('lastlat'));
		var lon = parseFloat(localStorage.getItem('lastlon'));

		if(lat >= bb.uk.lat_min && lat <= bb.uk.lat_max && lon >= bb.uk.lon_min && lon <= bb.uk.lon_max) {
			// roughly in UK
			if(lat >= bb.scotland.lat_min && lat <= bb.scotland.lat_max && lon >= bb.scotland.lon_min && lon <= bb.scotland.lon_max) {
				// roughly in Scotland
				return 'scotland';
			} else {
				return 'uk';
			}
		} else {
			return 'row';
		}

	}

	initByZone() {
		var _this = this;
		this.interface.find('.byZone').off('click').on('click',function(){
			console.log('byzone');
			_this.gotoPage('zone-'+_this.zone(),$(this).closest('.page'));
		});
	}

	show() {

		super.show();
		
		var _this = this;
		var lat = parseFloat(localStorage.getItem('lastlat'));
		var lon = parseFloat(localStorage.getItem('lastlon'));

		var minLat = 55.784173;
		var maxLat = 56.0065;
		var minLon = -3.490077;
		var maxLon = -2.948136;

		console.log('my position: ',lat,lon);
		
		
		window.setTimeout(function(){
			// give up on compass interface if no bearing signal after delay
			if(_this._bearing==null) {
				_this.tooFar();
				_this.initByZone();
			}
		},500);
		


		
	}
	set pos(value) {
		this._pos = value;

		if(this._point!==null) {
			this.pointDegree = this.angleToPoint(value.lat, value.lon);

		    if (this.pointDegree < 0) {
		        this.pointDegree += 360;
		    }			
		}

	}

	get pos() {
		return this.pos;
	}

	set bearing(value) {

		if(this._bearing==null) {
			// first value, start compass 

				
			this.interface.append(this.tplSuccess());
					
			this.compassCircle = this.interface.find(".compass-circle");
			this.compassPointer = this.interface.find(".compassPointer");
		    this.myPoint = this.interface.find(".my-point");
		    this._point = {
		        lat: 56.049636,
		        lon: -3.014278
		      }; // middle of the Firth of Forth
		    this.initNav();
			this.interface.find('.compassRose').addClass('visible');

			this.initByZone();
			
		}


		this._bearing =value;
		var _this = this;




		if(this._point!==null && !this.found) {



			var compassHeading = value;
			if(isIOS()) {
				compassHeading = -compassHeading;
			}
			if(compassHeading<0) compassHeading += 360;

			this.compassCircle.css({'transform':`translate(-50%, -50%) rotate(${compassHeading}deg)`});

			var diff = this._bearing-this.pointDegree;
			this.compassPointer.css({'transform':`rotate(${diff}deg)`});


			// broadcast('debug','bearing: '+compassHeading+', diff: '+diff);
			// broadcast('bearing',Math.round(compassHeading));
			// broadcast('target',Math.round(this.pointDegree));


			/*


		    // +/-5 degree
		    var rangeTop = (compassHeading+5)%360;
		    // rangeTop += 180;
		    rangeTop = rangeTop%360;

		    var rangeBottom = compassHeading-5;
		    // rangeBottom += 180;
		    rangeBottom = rangeBottom%360;

		    if(rangeBottom<0) {
		    	rangeBottom += 360;
		    }

		    if(rangeTop<rangeBottom) {
		    	var inRange = this.pointDegree>rangeBottom || this.pointDegree<rangeTop;
		    } else {
		    	var inRange = this.pointDegree>rangeBottom && this.pointDegree<rangeTop;
		    }

		     if (
		        inRange
		      ) {

		        // user is pointing towards the sea, more or less
		        this.myPoint.css({'opacity':1});
		        this.nextPage(_this.interface.find('.page:eq(0)'));
		        this.found = true;

		      } else if (this.pointDegree) {
		        this.myPoint.css({'opacity':0});
		      }
		      */
		}
		
	}
	get bearing() {
		return this._bearing;
		
	}
	angleToPoint(latitude, longitude) {
		if(this._point!==null) {
			var phiK = (this._point.lat * Math.PI) / 180.0;
		      var lambdaK = (this._point.lon * Math.PI) / 180.0;
		      var phi = (latitude * Math.PI) / 180.0;
		      var lambda = (longitude * Math.PI) / 180.0;
		      var psi =
		        (180.0 / Math.PI) *
		        Math.atan2(
		          Math.sin(lambdaK - lambda),
		          Math.cos(phi) * Math.tan(phiK) -
		            Math.sin(phi) * Math.cos(lambdaK - lambda)
		        );
		      return Math.round(psi);
		}
      
    }
	
}

