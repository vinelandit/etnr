
class Prompt_clouds extends Prompt {

	constructor(domID,doneCallback) {
		super('clouds',domID,doneCallback);
		
		this._bearing = null;
		this._initBearing = null;
		this._relBearing = 0;
		this.triangle = null;
		this.stageDir = 0;
		this._speed = 0;
		this.tpl = `

		<div class="prompt clouds fullscreen" id="">

			<div class="page fullscreen hidden" data-voiceover="look">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Look up at the sky.</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      </div>
		      
		      <div class="page fullscreen hidden" data-voiceover="are">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Are there any clouds?</div></div>
			      	<div class="unit"><button class="halfLeft nextPage">Yes</button><button class="halfRight nextPage">No</button></div>
		      	</div>
		      </div>

		      <div class="page fullscreen hidden" data-voiceover="drifting">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Drifting through skies, clouds are ever present. These shapeshifting giants weigh up to 500 tonnes, composed mostly of water and ice.</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      </div>
		      
		      <div class="page image fullscreen hidden" data-voiceover="follow">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Follow the trace of the cloud shown on your screen.</div></div>
			      	<div id="traceCloud">
			      		<img src="images/clouds_ph.jpg" alt="Clouds" />
				      	<svg height="600" width="600">
						  <path class="bg" stroke-dasharray="12" stroke-width="12" id="cloud1" d="m316.5,581c-13,-31 -25,-71 -71,-104c-46,-33 -88,-69 -156,-104c-68,-35 -83,-44 -77,-37" opacity="0" stroke="#fa6565" fill="none"/>
							  <path class="bg" stroke-dasharray="12" stroke-width="12" id="cloud2" d="m326.5,582c12,-127 -6,-106 38,-205c44,-99 57,-119 66,-131c9,-12 59,-30 89,-20" opacity="0" stroke="#fa6565" fill="none"/>
							  <path class="bg" stroke-dasharray="12" stroke-width="12" id="cloud3" d="m250.5,581c-8,-121 -2,-202 4,-239c6,-37 59,-150 79,-168c20,-18 53,-82 95,-109" opacity="0" stroke="#fa6565" fill="none"/>
							  <path class="bg" stroke-dasharray="12" stroke-width="12" id="cloud4" d="m294.5,574c-2,-123 -14,-127 4,-180c18,-53 47,-135 64,-163c17,-28 116,-114 144,-113" opacity="0" stroke="#fa6565" fill="none"/>
							
						    <path class="fg" stroke-width="12" id="cloud1" d="m316.5,581c-13,-31 -25,-71 -71,-104c-46,-33 -88,-69 -156,-104c-68,-35 -83,-44 -77,-37" opacity="0" stroke="#fa6565" fill="none"/>
							  <path class="fg" stroke-width="12" id="cloud2" d="m326.5,582c12,-127 -6,-106 38,-205c44,-99 57,-119 66,-131c9,-12 59,-30 89,-20" opacity="0" stroke="#fa6565" fill="none"/>
							  <path class="fg" stroke-width="12" id="cloud3" d="m250.5,581c-8,-121 -2,-202 4,-239c6,-37 59,-150 79,-168c20,-18 53,-82 95,-109" opacity="0" stroke="#fa6565" fill="none"/>
							  <path class="fg" stroke-width="12" id="cloud4" d="m294.5,574c-2,-123 -14,-127 4,-180c18,-53 47,-135 64,-163c17,-28 116,-114 144,-113" opacity="0" stroke="#fa6565" fill="none"/>
						  
						  

							    	<ellipse id="target1" cy="332" cx="12.5" ry="30" rx="30" fill="#fa6565" stroke="none" opacity="0" />
								  <ellipse id="target2" cy="227" cx="519.5" ry="30" rx="30" fill="#fa6565" stroke="none" opacity="0" />
								  <ellipse  id="target3" cy="64" cx="430.5" ry="30" rx="30" fill="#fa6565" stroke="none" opacity="0" />
								  <ellipse  id="target4" cy="117" cx="506.5" ry="30" rx="30" fill="#fa6565" stroke="none" opacity="0" />

						  Sorry, your browser does not support inline SVG.
						</svg>
					</div>
			      	<div class="unit"><button class="start">Start</button></div>
		      	</div>
		    </div>




		      <div class="page explanation fullscreen hidden" data-voiceover="explanation">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">In their journeys across the oceans, thousands of ships leave tracks in the sky as clouds shape around the pollution their exhausts leave behind. 

Just like you have left an invisible trace of your journey in the air around you.

Thin, linear tracks that become visible from space.

</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      </div>
		</div>`;


		

	}
	
	get speed() {
		return this._speed;
	}

	set speed(val) {
		this._speed = val;
	}
	
	show() {

		super.show();

		var _this = this;
		

		this.svg  = this.interface.find('svg');
		
		// choose a trail
		var n = this.svg.find('path.fg').length;
		var i = Math.floor(Math.random()*n);
		console.log(n,i);
		this.trail = this.svg.find('path.fg:eq('+i+')')[0];
		this.trail.style.opacity = 1;

		this.svg.find('path.bg:eq('+i+')')[0].style.opacity = .5;

		this.target = this.svg.find('ellipse:eq('+i+')')[0];
		this.target.style.opacity = 1;

		this.len  = this.trail.getTotalLength();
		this.trail.style.strokeDasharray = this.len;
		this.trail.style.strokeDashoffset = this.len;
		this.factor = 0;
	
		this.stop = false;


		function step(timestamp) {
			
			var speed = 0.66;
			if(_this.speed!==null) {
				speed=_this.speed;
			}

			_this.factor+=(.0008*speed);
			_this.trail.style.strokeDashoffset = _this.len*(1-_this.factor);
			if(_this.factor>=1) {
			
				// done
				_this.gotoPage('explanation',_this.interface.find('.page.image'));
				_this.stop = true;
				// _this.factor = 0;
			}
			
			

			if(!_this.stop) window.requestAnimationFrame(step);
		}

		this.interface.find('.start').off('click').on('click',function(){
			window.requestAnimationFrame(step);
			$(this).animate({'opacity':0},500);
		});

		
	}
}