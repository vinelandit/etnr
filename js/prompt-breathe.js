
class Prompt_breathe extends Prompt {
	constructor(domID,doneCallback) {
		super('breathe',domID,doneCallback);
		this.tpl = `<div class="prompt breathe fullscreen" id="">
		      <div class="page fullscreen hidden" data-voiceover="inhale">
			      <div class="center">
			      	<div class="unit"><div class="instruction">Inhale and Exhale</div></div>
			      	
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
			      </div>
		      </div>
		     
		      <div class="page fullscreen hidden" data-voiceover="take">
			      <div class="center">
			      	<div class="unit"><div class="instruction">Take five deep breaths</div></div>
			      	<div class="timer" data-delay="15000">
			      		<canvas width="200" height="200"></canvas>
			      	</div>
			      	<div class="unit"><button class="startTimer">Start</button></div>
			      </div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="one">
			      <div class="center">
			      	<div class="unit"><div class="instruction">The oxygen in one of any five breaths comes from phytoplankton, a microscopic algae. Their abundance and ability to ingest carbon makes them the lungs of the ocean.

These wandering plants individually live only a few days, though they can bloom collectively for several weeks in colourful swirls, large enough to be seen from outer space.

Their cells store a third of the world’s carbon through a cycle of birth and death.</div></div>
			      	<div class="unit"><button class="autoNext next nextPage"></button></div>
			      </div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="this2">
			      <div class="center">
			      	<div class="unit"><div class="instruction">This is end of the walk.</div></div>
			      	
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
			      </div>
		      </div>
		  </div>`;
	}
	show() {
		super.show();
		var _this = this;

		
	}
	complete() {
		audio.playLoop('motif');
		super.complete();
	}
	
}

