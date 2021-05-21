
class Prompt_weeds extends Prompt {
	constructor(domID,doneCallback) {
		super('weeds',domID,doneCallback);
		this.tpl = `
			<div class="prompt weeds fullscreen" id="">    
		      <div class="page fullscreen hidden" data-voiceover="follow">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Look for plants out of place.</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="plant">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">What makes a plant out of place? 
A plant growing where it is not wanted? 
Not wanted by whom?
Why are dandelions weeds, but daffodils flowers? 
What if it was the other way around?

</div></div>
			      	<div class="unit"><button class="nextPage autoNext next"></button></div>
		      	</div>
		      </div>
		  </div>`;
	}
	
	
	initSound() {
		audio.stopLoop();
		audio.playLoop('lichen');

	}
	complete() {
		// load third batch of background audio
		audio.backgroundLoad(3);
		super.complete();
	}
}

