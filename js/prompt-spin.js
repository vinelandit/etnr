class Prompt_spin extends Prompt {
	
	constructor(domID,doneCallback) {
		super('spin',domID,doneCallback);
		this._bearing = null;
		this.tpl = `<div class="prompt spin fullscreen" id="">
	      <div class="promptBg"></div>
	      <div class="progressRotateOuter">
	        <div class="progressRotateInner"><span class="distance" data-bind-value="rotateProgress" data-bind-map-value="width" data-bind-suffix="%"></span></div>
	      </div>
	      <div class="progressRotate" data-bind-value="rotateProgress" data-bind-map-suffix="%"></div>
	      <div class="center">
	        <canvas id="spinCanvas" width="300" height="300"></canvas>
	        <h3>SPIN AROUND</h3>
	        <p>Spin around counter-clockwise.</p>
	        <!-- <button class="doPrompt">GO</button> -->
	        
	      </div>
	  </div>`;
	}
	show() {
		super.show();
		var _this = this;
		this.c = document.getElementById("spinCanvas");
		this.ctx = this.c.getContext("2d");
		this.ctx.beginPath();
		this.ctx.arc(150, 150, 140, 0, 2 * Math.PI);
		this.ctx.lineWidth = 10;
		this.ctx.strokeStyle = '#ffff00';
		this.ctx.stroke();
		this.interface.find('.doPrompt').off('click').on('click',function(e){
			// debug
			_this.complete();
		});
		this._initBearing = null;
		this._maxRelBearing = 0;
		this._hemisphere = 0;
	}
	set bearing(value) {
		this._bearing = value;
		if(this._initBearing==null) {
			this._initBearing = value;
		}
		var relBearing = value - this._initBearing;
		if(relBearing<0) {
			relBearing = 360 + relBearing;
		}
		broadcast('bearing',Math.round(relBearing) +' (init: '+this._initBearing+')');

		if(
			(this._hemisphere == 0 && relBearing>=this._maxRelBearing && relBearing < 250) ||
			(this._hemisphere == 1 && relBearing>=this._maxRelBearing)

		) {
			var rads = this.deg2rad(relBearing);

			
			this.ctx.beginPath();
			this.ctx.arc(150, 150, 120, 0, rads);
			this.ctx.lineWidth = 20;
			this.ctx.strokeStyle = '#00ffff';
			this.ctx.stroke();

			if(relBearing>=180) {
				this._hemisphere = 1;
			}

			this._maxRelBearing = relBearing;
		}
		if(this._hemisphere == 1 && relBearing<45) {
			// overshoot: from left hemisphere to top right quadrant
			this.complete();
		}

		
	}
	get bearing() {
		return this._bearing;
		
	}
	deg2rad(degrees)
	{
	  var pi = Math.PI;
	  return degrees * (pi/180);
	}
}
