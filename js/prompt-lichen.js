
class Prompt_lichen extends Prompt {
	constructor(domID,doneCallback) {
		super('lichen',domID,doneCallback);
		this.tpl = `<div class="prompt lichen fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="take">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">
			      		<div class="hiddenInfo">
			      			<div class="imageCaption">Examples of lichen</div>
			      			<img src="images/lichen.png" alt="lichen" />
			      		</div>
			      		Take a moment and explore the surfaces near you. Try finding lichen.
			      		<div class="showHidden">i</div>
			      	</div>
			      </div>
			      <div class="unit"><button class="halfLeft nextPage">Found it</button><button class="halfRight nextPage">Skip</button></div>
		      	</div>
		      </div>
		      <div class="page yes fullscreen hidden" data-voiceover="these">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">
<p>Gentle micro forests of lichen are sensitive to nitrogen and sulphur and cannot grow in areas of high air pollution.</p>

<p>They arose millions of years ago as a mutual becoming of algae and fungi that live and thrive together. An idea so foreign, that we only created a word for it in 1879: symbiosis.</p>

</div></div> 
			      	<div class="unit"><button class="nextPage next"></button></div>
		      	</div>
		      </div>
		      
		      
		  </div>`;
	}
	
	show() {
		super.show();
		// load third batch of background audio
		audio.backgroundLoad(3);
	}
}

