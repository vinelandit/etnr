
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
		         <p>AWEN is a research project developed as part of The New Real programme at the Edinburgh Futures Institute in partnership with the Edinburgh Science Festival.</p>
		         <p>Rather than a destination, AWEN is a journey and one which you can take multiple times. You can start the walk from anywhere and in any direction. As you move through your surroundings, you will intermittently receive playful and poetic prompts through your device.</p>
		         <p>AWEN asks you to go places, observe things and engage with events beyond human scale.</p>
		         <p>At the end of the walk, more information will be made available to further explore the research inspiring each prompt. The journeys developed during each walk will contribute to a collective and evolving digital artwork. </p>
		         <button class="next nextPage"></button>
		      </div>
		   </div>
		   <div class="page fullscreen hidden">
		      <img class="logo small" src="images/logo.png" alt="AWEN logo" /> 	
		      <div class="terms">
		         <p>You are one of the first people to experience AWEN. With your help, we will continue to evolve and refine it.</p>
		         <p>Some data is collected as part of this experience. This includes a short sound recording and GPS tracking data used to make a collective digital artwork.</p>
		         <p>Please confirm that you have read and agreed to our Data Protection Policy (INSERT LINK).
		         </p>
		         <button class="nextPage">I AGREE</button>
		      </div>
		   </div>
		   <div class="page fullscreen hidden">
		      <img class="logo small" src="images/logo.png" alt="AWEN logo" /> 	
		      <div class="terms">
		         <p>Please make sure your device is charged and that you have internet access. As this is a web-based experience, please do not switch off your device.</p>
		         <p>
		            AWEN is best experienced with headphones, but be careful when near traffic and in busy areas. If you choose to use your speakers instead, please be mindful of others. Be aware of your surroundings, especially when crossing roads.
		         </p>
		         <p>Be sensitive when you are in close proximity to wildlife.
		         </p>
		         <button class="next nextPage"></button>
		      </div>
		   </div>
		   <div class="page fullscreen hidden" data-voiceover="we">
		      <img class="logo small" src="images/logo.png" alt="AWEN logo" />
		      <div class="terms">
		         <p>
		            We invite you to explore AWEN using all your senses and be present, interacting with your environment beyond your device.
		            When you’re ready to begin this experience, please press 'BEGIN'.
		         </p>
		         <div class="agreeHolder">
		            <p id="please"><i>Please grant any location or orientation permissions the app requests! These permissions are required to function properly.</i></p>
		            <button class="agree nextPage" id="startApp">BEGIN</button>
		         </div>
		      </div>
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
				

		    	var s = localStorage.getItem('etnr_state');
		    	var state = JSON.parse(s);
				$(this).text('LOADING...');
				var stageID = state.stageID;

				var app = new App(localStorage.getItem('etnr_userid'),testGPS);
				// connect sensors to app
				sensors = new Sensors(app.gpsCallback.bind(app),app.gpsError.bind(app),app.orientationTick.bind(app),app.orientationError.bind(app),app.motionTick.bind(app),app.motionError.bind(app));
				sensors.init();				
				
				
			});


			this.interface.find('#restart').show().click(function(){
				audio.playLoop('intro');
			});
		} else {
			
			// no stored state
			this.interface.find("#start").show().click(function(){
				audio.playLoop('intro');
			});
		}



		var agree = this.interface.find('.agree');
		var agreeInit = false;
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

		/* this.interface.find('.terms').scroll(function(){
			if (this.scrollHeight - $(this).scrollTop() >= ($(this).outerHeight()-5) && !agreeInit) {
				
			}
		}); */

		


	}

	complete() {
		// overridden
		return true;
	}

}

