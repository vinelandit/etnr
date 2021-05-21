
class Prompt_wind extends Prompt {
	constructor(domID,doneCallback) {
		super('wind',domID,doneCallback);
		this.tpl = `<div class="prompt wind fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="increase">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Increase your walking speed.
Maintain this pace for a little while.
</div></div>
			      	<div class="unit"><button class="next nextPage" data-delay-when="after" data-delay="3000"></button></div>
		      	</div>
		      </div>

		      <div class="page fullscreen hidden" data-voiceover="feel">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Feel the wind in your face. Feel it moving through your fingertips.

</div></div>
			      	<div class="unit"><button class="autoNext next nextPage" data-delay-when="after" data-delay="3000"></button></div>
		      	</div>
		      </div>
		      
		      <div class="page fullscreen hidden" data-voiceover="keep">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Keep it up...</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="wind">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">As sea and air temperatures oscillate, wind speeds are accelerating and like a dance gone extinct, cool, gentle breezes could soon be forgotten. 
</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      </div>
		      
		  </div>`;
	}
	
	
	show() {
		super.show();
		// load fourth batch of background audio
		audio.backgroundLoad(4);
	}
}

