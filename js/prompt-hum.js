
class Prompt_hum extends Prompt {
	constructor(domID,doneCallback) {
		super('hum',domID,doneCallback);
		this.tpl = `<div class="prompt hum fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="hum">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Try humming with your surroundings.</div></div>
			      	<div class="unit"><button class="timedNextPage next" data-delay-when="before" data-delay="5000"></button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="some">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Some research suggests that animals hum to let each other know they are amongst kin. Are there other ways we could connect?</div></div>
			      	<div class="unit"><button class="next autoNext nextPage"></button></div>
		      	</div>
		      </div>
		      
		  </div>`;
	}
	show() {
		super.show();
		var _this = this;

		var audioMuted = false;
		
		if(audio.currentSoundID) {
			audio.s.fade(0.5,0,1000,audio.currentSoundID);
			audioMuted = true;
			
		}
			
		
	}
	complete() {
		// play audio only after prompt dismissed
		audio.playLoop('motif');
		super.complete();
	}

	initSound() {
		audio.stopLoop();
	}
	
}

