class Prompt_compass extends Prompt {
	constructor(domID,doneCallback) {
		super('compass',domID,doneCallback,'text/plain');
		this._bearing = null;
		this._pos = null;
		this.targetDistance = null;
		this._point = {
	        lat: 56.072893,
	        lon: -3.192608
	      };
	    if(localStorage.getItem('lastlat')!==null) {
	    	this.pos = {
	    		'lat':localStorage.getItem('lastlat'),
	    		'lon':localStorage.getItem('lastlon')
	    	};
	    }
		this.tpl = `<div class="prompt compass fullscreen" id="">
		<h3 data-bind-value="bearing"></h3>
		<h4 data-bind-value="target"></h4>
		<h5>dist: <span data-bind-value="targetDistance"></span></h5>
		      <div class="compassRose">
			      <div class="arrow"></div>
			      <div class="compass-circle"></div>
			      <div class="my-point"></div>
			      <div class="compassPointer"></div>
			    </div>
		  </div>`;
	}

	show() {
		super.show();
		this.compassCircle = this.interface.find(".compass-circle");
		this.compassPointer = this.interface.find(".compassPointer");
	    this.myPoint = this.interface.find(".my-point");

	}

	set pos(value) {
		this._pos = value;
		this.pointDegree = this.angleToPoint(value.lat, value.lon);

		this.targetDistance = distance(value.lat,value.lon,this._point.lat,this._point.lon);
		broadcast('targetDistance',this.targetDistance);

	    if (this.pointDegree < 0) {
	        this.pointDegree += 360;
	    }
	}

	get pos() {
		return this.pos;
	}

	set bearing(value) {
		this._bearing =value;
		
		var compassHeading = value;
		if(compassHeading<0) compassHeading += 360;

		this.compassCircle.css({'transform':`translate(-50%, -50%) rotate(${compassHeading}deg)`});

		var diff = this._bearing-this.pointDegree;
		this.compassPointer.css({'transform':`rotate(${diff}deg)`});

		broadcast('bearing',Math.round(compassHeading));
		broadcast('target',Math.round(this.pointDegree));


	    // +/-10 degree
	    var rangeTop = (compassHeading+10)%360;
	    var rangeBottom = compassHeading-10;
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
	        this.complete();
	      } else if (this.pointDegree) {

	        this.myPoint.css({'opacity':0});
	      }

		
	}
	get bearing() {
		return this._bearing;
		
	}
	angleToPoint(latitude, longitude) {

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

