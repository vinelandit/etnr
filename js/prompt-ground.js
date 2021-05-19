
class Prompt_ground extends Prompt {
	constructor(domID,doneCallback) {
		super('ground',domID,doneCallback);
		this.tpl = `<div class="prompt ground fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="try">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Try walking on three different surfaces.</div></div>
			      	<div class="unit"><button class="nextPage next"></button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Try walking on three different surfaces.</div></div>
			      	<div class="unit"><button class="nextPage">Done</button></div>
		      	</div>
		      </div>

		      <div class="page fullscreen hidden" data-voiceover="did">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Did any of these contain soil?</div></div>
			      	<div class="unit"><button class="halfLeft gotoPage" data-page="pick">Yes</button><button class="halfRight nextPage">No</button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="find">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Find soil nearby.</div></div>
			      	<div class="unit"><button class="nextPage">Done</button></div>
		      	</div>
		      </div>

		      <div class="page fullscreen hidden pick" data-voiceover="pick">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Pick up some soil and hold it. What does it feel like?
Slowly release the soil from your hand.</div></div>
			      	<div class="unit"><button class="nextPage next"></button></div>
		      	</div>
		      </div>



		      <div class="page fullscreen hidden" data-voiceover="wetter">
		      	<div class="center">
			      	<div class="unit">
			      		<div class="instruction">Wetter or denser soils hold heat and help stabilize changes in temperature more than drier, looser soils.

							Cooler soils also make decomposition from organic matter slower, thus slowing the release of carbon to the atmosphere.

							Soil is much more than the ground we walk on.
						</div>
					</div>
			      	<div class="unit"><button class="nextPage next"></button></div>
		      	</div>
		      </div>
		      
		  </div>`;
	}
	complete() {
		// load second batch of background audio
		audio.backgroundLoad(2);
		super.complete();
	}
	
}

