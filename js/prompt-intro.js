
class Prompt_intro extends Prompt {
	constructor(domID,doneCallback) {
		super('intro',domID,doneCallback);
		this.tpl = `
		<div class="prompt intro fullscreen" id="">
		      
		      <div class="page intro fullscreen hidden">
			      	<div class="center">
				      	<img class="logo" src="images/logo.png" alt="AWEN logo" />
				      	<img class="logoText" src="images/logotext.png" alt="AWEN" />
				      	<h5>A Walk Encountering Nature</h5>
				      	<div class="unit">
				      		<div class="instruction">A research-led interactive walking experience, encountering earth, air and ocean</div>
				      	</div>
				      	 <div class="buttons">

  
						      <div class="mainButtons">

						        <button class="" id="loading">LOADING...</button>
						        <button class="next nextPage" id="start"></button>
						        <button id="resume">RESUME</button>
						        <button class="nextPage" id="restart">RESTART</button>
						      </div>
						    


						    
						  </div>
			      	</div>

		      </div>
		      <div class="page fullscreen hidden">
			      	
				      	<img class="logo small" src="images/logo.png" alt="AWEN logo" />
				      	
				      	<div class="terms">
				      		<p>AWEN is a self-guided walk that makes global events tangible, providing intimate encounters with climate.</p>
				      		<p>You can start the walk from anywhere you choose to. As you move through your location, you will receive playful and poetic prompts on your smartphone. AWEN asks you to go places, observe things and engage with events beyond human scale. At the end of the walk, a document will be made available to further explore the research inspiring each prompt. Furthermore, the journeys developed during each walk will contribute to a collective evolving digital artwork. Rather than a destination, AWEN is a journey so for now, let go, use your senses and join us on this walk.</p>
				      		<p>This walk takes approximately 25-30 minutes.</p>

<p>Please make sure to charge your phone and that your phone has internet access. Also, because this is a web-based experience, please do not switch off your phone's screen.</p>

<p>When you’re ready to begin your walk, please tap the button below.</p>
<p id="please"><i>Please grant any location or orientation permissions requested when you begin! The app needs these permissions to function properly.</i></p>
				      	</div>
				      	<button class="agree next nextPage" id="startApp"></button></div>
			      	
		      </div>
		</div>`;
	}
	
	
	init() {
		
		// check for passed performance parameters
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		
		var testGPS = urlParams.has('testgps');

		var _this = this;
		var id = parseInt(localStorage.getItem('etnr_userid'));

		if(id>0) {
			this.interface.find('#resume').show().click(function(e) {
				audio.s.nudge.play();
				var app = new App(localStorage.getItem('etnr_userid'),testGPS);
				// connect sensors to app
				sensors = new Sensors(app.gpsCallback.bind(app),app.gpsError.bind(app),app.orientationTick.bind(app),app.orientationError.bind(app),app.motionTick.bind(app),app.motionError.bind(app));
				sensors.init();
				var stageID = app.state.stageID;
				if(stageID<=5) {
					audio.backgroundLoad(1);
				} else if (stageID<=7) {
					audio.backgroundLoad(2);
				} else {
					audio.backgroundLoad(3);
				}
			});

			this.interface.find('#restart').show();
		} else {
			
			// no stored state
			this.interface.find("#start").show();
		}

		var agree = this.interface.find('.agree');
		var agreeInit = false;

		this.interface.find('.terms').scroll(function(){
			if (this.scrollHeight - $(this).scrollTop() >= ($(this).outerHeight()-5) && !agreeInit) {
				agreeInit = true;
				agree.addClass('active').click(function(){
					
					// audio.playLoop('intro');
					localStorage.removeItem('etnr_userid');
					localStorage.removeItem('etnr_state');
					var app = new App(null,testGPS);
					// connect sensors to app
					sensors = new Sensors(app.gpsCallback.bind(app),app.gpsError.bind(app),app.orientationTick.bind(app),app.orientationError.bind(app),app.motionTick.bind(app),app.motionError.bind(app));
					sensors.init();

					$(this).hide();
				});
			}
		});

		


	}

	complete() {
		// overridden
		return true;
	}

}

