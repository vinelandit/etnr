
class Prompt_leaf extends Prompt {
	constructor(domID,doneCallback) {
		super('leaf',domID,doneCallback);
		this.tpl = `<div class="prompt leaf fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="can">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Can you find a leaf?</div></div>
			      	<div class="unit"><button class="halfLeft gotoPage" data-page="yes">Yes</button><button class="halfRight gotoPage" data-page="no">No</button></div>
		      	</div>
		      </div>

		      <div class="page yes fullscreen hidden" data-voiceover="pick">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Pick it up. 
Imagine the main vein is your path.
The veins are a map. 
Let it be your guide.
</div></div>
			      	<div class="unit"><button class="next gotoPage" data-page="explanation"></button></div>
		      	</div>
		      </div>



		      <div class="page no fullscreen hidden" data-voiceover="next">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Next time you come across a leaf, try to follow its veins like a map. Let it be your guide.</div></div>
			      	<div class="unit"><button class="nextPage next"></button></div>
		      	</div>
		      </div>
		      
		      <div class="page explanation fullscreen hidden" data-voiceover="earliest">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">

			      		<p>The earliest form of navigation involved observing landmarks, like trees.</p>
						<p>The leaf in your hand can be a landmark, too. Studies suggest that as the planet warms, the leaves may be getting darker. A landmark of the passing of time and our changing climate.</p>
						<p>When's the last time you let foliage guide you?</p>


			      	</div></div>
			      	<div class="unit"><button class="nextPage next"></button></div>
		      	</div>
		      </div>
		  </div>`;
	}
	
	
}

