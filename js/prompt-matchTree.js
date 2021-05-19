
class Prompt_matchTree extends Prompt {
	constructor(domID,doneCallback) {
		super('matchTree',domID,doneCallback,'image/jpeg');
		this._bearing = null;
		this.tpl = `<div class="prompt matchTree fullscreen" id="" data-media-target=".photoBg">
			
		      
		  </div>`;

		this._bearing = null;
		this._pos = null;
		this.targetDistance = null;
		this._point = null;

	    if(localStorage.getItem('lastlat')!==null) {
	    	this.pos = {
	    		'lat':localStorage.getItem('lastlat'),
	    		'lon':localStorage.getItem('lastlon')
	    	};
	    }
	
	}

	tplSuccess() {
		return `
			<div class="page fullscreen hidden" data-voiceover="seek">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Seek your tree in {Site} (lat {lat}, lon {lon}) <span data-bind-value="bearing"></span></div></div>
			      	<h3 style="display:none" data-bind-value="bearing"></h3>
					<h4 style="display:none" data-bind-value="target"></h4>
					
				      <div class="compassRose">
					      <div class="arrow"></div>
					      <div class="compass-circle"></div>
					      <div class="my-point"></div>
					      <div class="compassPointer"></div>
					  </div>
			      	<div class="unit">Distance&nbsp;&nbsp;&nbsp;<button class="halfLeft opaque"><span data-bind-value="targetDistance">...</span></button>
			      	<button class="halfRight nextPage">Skip</button></div>
		      	</div>
		    </div>
			<div class="page fullscreen hidden" data-voiceover="spend">
		      	<div class="center">
			      	<ul>
			      		<li>Name: {CommonName}</li>
			      		<li>Age: {AgeGroup}</li>
			      		<li>Height: {Height}</li>
			      		<li>Location: {Site}</li>
			      	</ul>
			      	<div class="unit"><div class="instruction">Spend what feels like a minute resting near the tree.</div></div>
			      	<button class="nextPage">OK</button>
		      	</div>
		    </div>
		    <div class="page fullscreen hidden" data-voiceover="explanation">
		      	<div class="center">
			      	<div class="instruction">Trees use sunlight as fuel to split carbon dioxide molecules, storing carbon and producing part of the oxygen we breathe. Some would say that trees come from air, using light from the sky.</div>
			      	<div class="unit"><button class="nextPage">Okay</button></div>
		      	</div>
		      </div>
		 `;
	}

	tplToofar() {
		return `<div class="page fullscreen hidden" data-voiceover="seek">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Seek a tree.</div></div>
			      	<div class="unit"><button class="timedNextPage" data-delay-when="before" data-delay="5000">Found one</button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="spend">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Spend what feels like a minute resting beneath it.</div></div>
			      	<div class="unit"><button class="timedNextPage" data-delay-when="before" data-delay="5000">OK</button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="explanation">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">
			      		<p>Trees store carbon and produce part of the oxygen we breathe, splitting carbon dioxide molecules using sunlight.</p>
			      		<p>That is why some people say trees are made of air and channel light.</p>
			      		<p>In Tsimane culture in the Amazon, when someone dies their spirit goes into the nearest tree. They become a being of light, establishing a practice of care.</p>
			      	</div></div>
			      	<div class="unit"><button class="next timedNextPage" data-delay-when="before" data-delay="5000"></button></div>
		      	</div>
		      </div>
		      
		      `;
	}

	tooFar() {
		var _this = this;
		this.interface.append(this.tplToofar());
		/* this.interface.find('.photoFile')[0].addEventListener('change',function(){
			$(this).hide();
			var myPage = $(this).closest('.page');
			var i = $(_this.interface.attr('data-media-target'));
			var img = i[0];
			img.file = this.files[0];
			const reader = new FileReader();
			reader.onload = (function(aImg) { 
				return function(e) { 
					aImg.src = e.target.result; $(aImg).fadeIn(500); 
					// save image to server
					_this.uploadMedia(e.target.result,'image/jpeg');
					_this.nextPage(myPage);
				}; 
			})(img);
			reader.readAsDataURL(this.files[0]);
		},false); */

		this.initNav();

	}
	

	show() {

		super.show();
		
		var _this = this;
		var lat = localStorage.getItem('lastlat');
		var lon = localStorage.getItem('lastlon');
		if(1==0&&lat!==null&&lon!==null&&lat!==0&&lon!==0) {
			api('matchtree',{
				'lat':localStorage.getItem('lastlat'),
				'lon':localStorage.getItem('lastlon')
			},function(data) {
				console.log('upload media callback');
				if(data['result']=='success') {
					data.distance = parseFloat(data.distance).toFixed(2);
					_this.interface.append(merge(_this.tplSuccess(),data));
					
					_this.compassCircle = _this.interface.find(".compass-circle");
					_this.compassPointer = _this.interface.find(".compassPointer");
				    _this.myPoint = _this.interface.find(".my-point");
				    _this._point = {
				        lat: data.lat,
				        lon: data.lon
				      };
				    _this.initNav();

				} else {

					_this.tooFar();
				}

			});
		} else {
			this.tooFar();
		}
		
		// super.show();

		
	}
	set pos(value) {
		this._pos = value;

		if(this._point!==null) {
			this.pointDegree = this.angleToPoint(value.lat, value.lon);

			this.targetDistance = distance(value.lat,value.lon,this._point.lat,this._point.lon);
			broadcast('targetDistance',Math.round(this.targetDistance)+'m');

			if(this.targetDistance<7) {
				// consider tree found
				this.nextPage(this.interface.find('.compassRose').closest('.page'));
			}

		    if (this.pointDegree < 0) {
		        this.pointDegree += 360;
		    }			
		}

	}

	get pos() {
		return this.pos;
	}

	set bearing(value) {
		this._bearing =value;
		
		if(this._point!==null) {
			var compassHeading = value;
			if(compassHeading<0) compassHeading += 360;



			this.compassCircle.css({'transform':`translate(-50%, -50%) rotate(${compassHeading}deg)`});

			var diff = this._bearing-this.pointDegree;
			this.compassPointer.css({'transform':`rotate(${diff}deg)`});

			broadcast('bearing',Math.round(compassHeading));
			broadcast('target',Math.round(this.pointDegree));


		    // +/-10 degree
		    var rangeTop = (compassHeading+10)%360;
		    // rangeTop += 180;
		    rangeTop = rangeTop%360;

		    var rangeBottom = compassHeading-10;
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

		        this.myPoint.css({'opacity':1});
		      } else if (this.pointDegree) {

		        this.myPoint.css({'opacity':0});
		      }
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

