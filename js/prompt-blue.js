
class Prompt_blue extends Prompt {
	constructor(domID,doneCallback) {
		super('blue',domID,doneCallback);
		this.tpl = `<div class="prompt blue fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="take">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Take note of the blue colours that accompany you.</div></div>
			      	<div class="unit"><button class="timedNextPage next" data-delay-when="before" data-delay="5000"></button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="blue">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Not all we consider blue is actually blue. The blue of the ocean is a reflection of the sky. 

Blue is sometimes thought of as a shade of green. In many languages it was the last colour to be named. 

Words create perspectives.</div></div>
			      	<div class="unit"><button class="timedNextPage next" data-delay-when="before" data-delay="4000"></button></div>
		      	</div>
		      </div>
		  </div>`;
	}
	
	
}

