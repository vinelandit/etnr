
class Prompt_noise extends Prompt {
	constructor(domID,doneCallback) {
		super('noise',domID,doneCallback);
		this.tpl = `<div class="prompt noise fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="find">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Find a noisy place.</div></div>
			      	<div class="unit"><button class="nextPage">Found it</button></div>
		      	</div>
		      </div>
		      
		      <div class="page fullscreen hidden" data-voiceover="take">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Take a moment and consider what you hear.</div></div>
			      	<div class="unit"><button class="autoNext next nextPage"></button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="can">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Can you hear birdsong?</div></div>
			      	<div class="unit"><button class="halfLeft nextPage">Yes</button><button class="halfRight nextPage">No</button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="dawn">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">
Birdsong is most prominent at the start of each day. To have their voices heard, birds adapt to our acoustics and listen to our movements. The dawn chorus sings earlier and earlier to avoid our noisy rush hour. Birdsong displaced.
</div></div>
			      	<div class="unit"><button class="autoNext next nextPage"></button></div>
		      	</div>
		      </div>
		      
		  </div>`;
	}
	show() {
		super.show();
		var _this = this;
		
	}
	complete() {
		// play audio only after prompt dismissed
		audio.playLoop('noise');
		super.complete();
	}

	initSound() {
		audio.stopLoop();
	}
	
}

