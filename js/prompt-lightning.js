
class Prompt_lightning extends Prompt {

	constructor(domID,doneCallback) {
		super('lightning',domID,doneCallback);
		
		
		this.factor = 0;
		this.tpl = `<div class="prompt lightning fullscreen" id="">
				      <div class="page fullscreen hidden" data-voiceover="walk">
				      	<div class="center">
				      		<div class="unit"><div class="instruction">Walk in a zig-zag. <!-- step <span data-bind-value="step">x</span> rel <span data-bind-value="relBearing"></span> targ <span data-bind-value="targetBearing"></span> --></div></div>
					      		
								<svg id="lsvg" width="200" height="350" xmlns="http://www.w3.org/2000/svg">
          							<path stroke-linecap="round" stroke="#fff" id="svg_1" d="m86.29906,328.31775l69.70093,-178.47663l-113,0l57.02804,-128.84112" stroke-width="7" opacity="1" fill="none"/>
								 
          							<ellipse cy="100" cx="25" ry="15" rx="15" fill="#fa6565" stroke="none" opacity="1" />
								  	
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
					      	<div class="unit"><button class="autoNext nextPage next"></button></div>
				      	</div>
				      </div>
				  </div> `;

		this._startGPS = {'latitude':localStorage.getItem('lastlat'),'longitude':localStorage.getItem('lastlon')};
		
	}

	

	show() {

		super.show();

		var _this = this;
		

		this.svg  = this.interface.find('svg#lsvg');
		this.line = this.svg.find('path')[0];
		this.len  = this.line.getTotalLength();
		this.pointer = this.svg.find('ellipse')[0];
		this.factor = 0;
		this.stop = false;

		var targetPoint = this.line.getPointAtLength(0);
        

        this.pointer.setAttribute('cx', targetPoint.x);
        this.pointer.setAttribute('cy', targetPoint.y);


		var targetPoint = _this.line.getPointAtLength(0);   
		
		function step(timestamp) {
			
			_this.factor+=.0009;
			var targetPoint = _this.line.getPointAtLength(_this.factor*_this.len);   

	        _this.pointer.setAttribute('cx', targetPoint.x);
	        _this.pointer.setAttribute('cy', targetPoint.y);

			if(_this.factor>=.999) {
			
				_this.nextPage(_this.interface.find('.page:eq(0)'));
				_this.stop = true;
				
			}

			if(!_this.stop) window.requestAnimationFrame(step);
		}

		this.interface.find('.start').off('click').on('click',function(){
			window.requestAnimationFrame(step);
			_this.interface.find('.startUnit').animate({'opacity':0},'fast');
		});

		
	}
}