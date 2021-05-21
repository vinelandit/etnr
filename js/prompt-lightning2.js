
class Prompt_lightning extends Prompt {

	constructor(domID,doneCallback) {
		super('lightning',domID,doneCallback);
		
		this._bearing = null;
		this._initBearing = null;
		this._relBearing = null;

        this.steps = [
			[0.43,20],
			[0.68,-100],
			[1,100]
		];
		this.step = 0;

		this.factor = 0;
		this.tpl = `<div class="prompt lightning fullscreen" id="">
				      <div class="page fullscreen hidden" data-voiceover="walk">
				      	<div class="center">
				      		<div class="unit"><div class="instruction">Walk in a zig-zag. <!-- step <span data-bind-value="step">x</span> rel <span data-bind-value="relBearing"></span> targ <span data-bind-value="targetBearing"></span> --></div></div>
					      		
								<svg id="lsvg" width="200" height="350" xmlns="http://www.w3.org/2000/svg">
          							<path stroke-linecap="round" stroke="#fff" id="svg_1" d="m86.29906,328.31775l69.70093,-178.47663l-113,0l57.02804,-128.84112" stroke-width="7" opacity="1" fill="none"/>
								 
          							<ellipse cy="100" cx="25" ry="15" rx="15" fill="#fa6565" stroke="none" opacity="1" />
								  	<g id="arrowOuter" x="75" y="145.5"><g id="arrow"><image href="images/chevron.png" height="50" width="59"/></g></g>
								 	<polygon style="opacity:0;transform-origin:50% 50%;fill:rgba(0,0,0,0.25)" id="triangle" points="100,100 150,200 50,200" />
								</svg>
					      	
			      			<div class="unit startUnit"><button class="halfLeft start">Start</button><button class="halfRight nextPage">Skip</button></div>
				      	</div>
				      </div>
				      <div class="page fullscreen hidden" data-voiceover="flickering">
				      	<div class="center">
					      	<div class="unit"><div class="instruction">Flickering lightning strikes are illuminating the Arctic Circle and are being tracked by satellites in space.

Due to fluctuating temperatures, what used to be a once in a lifetime occurence is now frequent: lightning causing wildfires. 

The flash of lighting can make the nearby air up to four times hotter than the Sun. 
</div></div>
					      	<div class="unit"><button class="nextPage next"></button></div>
				      	</div>
				      </div>
				  </div> `;

		this._startGPS = {'latitude':localStorage.getItem('lastlat'),'longitude':localStorage.getItem('lastlon')};
		
	}

	set bearing(value) {
		this._bearing = value;
		if(this._initBearing==null) {
			this._initBearing=this._bearing;

		}
		this._relBearing = value - this._initBearing;
		if(this._relBearing<0) {
			this._relBearing += 360;
		}
		this._relBearing = this._relBearing % 360;

		if(!isIOS()) this._relBearing = -this._relBearing;
		
		if(this.triangle) {
			this.triangle.css({'transform':'rotate('+(parseFloat(-this._relBearing+(this.steps[this.step][1])))+'deg)'});
			this.arrow[0].setAttribute('transform','rotate('+(parseFloat(-this._relBearing+(this.steps[this.step][1])))+','+this.targetPoint.x+','+this.targetPoint.y+')');
		}

		broadcast('relBearing',Math.round(this._relBearing));
	}
	get bearing() {
		return this._bearing;
		
	}

	show() {

		super.show();

		var _this = this;
		

		this.svg  = this.interface.find('svg#lsvg');
		this.line = this.svg.find('path')[0];
		this.len  = this.line.getTotalLength();
		this.pointer = this.svg.find('ellipse')[0];
		this.factor = 0;
		this.triangle = this.svg.find('#triangle');
		this.arrowG = this.svg.find('g#arrowOuter');
		this.arrow = this.arrowG.find('g#arrow');
		this.stop = false;

		var targetPoint = this.line.getPointAtLength(0);
        

        this.pointer.setAttribute('cx', targetPoint.x);
        this.pointer.setAttribute('cy', targetPoint.y);


		this.targetPoint = _this.line.getPointAtLength(0);   
		
		function step(timestamp) {
				
			broadcast('step',_this.step);	
			var margin = 15;
			
			var targetBearing = _this.steps[_this.step][1];
			if(targetBearing<0) {
				targetBearing += 360;
			}
			targetBearing = targetBearing % 360;

			broadcast('targetBearing',targetBearing);

			var advance = false;

			if(targetBearing>=margin&&targetBearing<=360-margin) {
				if(Math.abs(_this._relBearing-targetBearing)<=margin) {
					advance = true;
				}
			} else {
				if(targetBearing<margin) {
					// target angle between 0 and margin
					if(_this._relBearing<targetBearing+margin||_this._relBearing>=360-margin+targetBearing) {
						advance = true;
					}
				} else {
					// target angle between 360-margin and 359.99999
					if(_this._relBearing<(targetBearing-360+margin)||_this._relBearing>targetBearing-margin) {
						advance = true;
					}
				}
			}
			if(advance) {

				_this.factor+=.0009;
				if(_this.factor>=_this.steps[_this.step][0]) {
					// next stage
					_this.step++;
					_this._initBearing=_this._bearing;
					
				}		
		        _this.targetPoint = _this.line.getPointAtLength(_this.factor*_this.len);   

		        _this.pointer.setAttribute('cx', _this.targetPoint.x);
		        _this.pointer.setAttribute('cy', _this.targetPoint.y);
		        _this.arrowG[0].setAttribute('cx', _this.targetPoint.x);
		        _this.arrowG[0].setAttribute('cy', _this.targetPoint.y);

		        /* var arrowX = targetPoint.x-75;
		        var arrowY = targetPoint.y-145.5;

		        _this.arrowG.css({
		        	transform:'translate('+arrowX+'px, '+arrowY+'px)'
		        }); */


				if(_this.factor>=.999) {
				
					_this.nextPage(_this.interface.find('.page:eq(0)'));
					_this.stop = true;
					
				}
			}
					
			
			
			

			if(!_this.stop) window.requestAnimationFrame(step);
		}

		this.interface.find('.start').off('click').on('click',function(){
			window.requestAnimationFrame(step);
			_this.triangle.animate({'opacity':1},500);
			_this.arrow.animate({'opacity':1},500);
			_this.interface.find('.startUnit').animate({'opacity':0},'fast');
		});

		
	}
}