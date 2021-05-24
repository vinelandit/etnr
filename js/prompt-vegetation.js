
class Prompt_vegetation extends Prompt {
	constructor(domID,doneCallback) {
		super('vegetation',domID,doneCallback);
		this._bearing = null;
		this.tpl = `<div class="prompt vegetation fullscreen" id="">

			<div class="page fullscreen hidden" data-voiceover="understanding">
		      	<div class="center">
		      		
			      	<div class="unit"><div class="instruction">Understanding the environment at a global scale involves measuring, averaging, simplifying. 
This can be done with words, numbers and colours. 

The abundance of the data and the size of the planet, often leaves the determination of such understanding to computers.
</div></div>
			      	<button class="next nextPage"></button>
		      	</div>
		    </div>

			<div class="page fullscreen hidden" data-voiceover="vegetation">
		      	<div class="center">
			      	<div class="instruction">
			      		The square below represents the average vegetation index data of your immediate surroundings as seen from space. 
			      	</div>

		      		<div id="vegMatrix"></div>
		      		<div class="instruction small">
			      	 Your local average vegetation index is <strong><span data-bind-value="avg"></span></strong>, which means <span data-bind-value="explanation"></span></div>
			      	<button class="next nextPage" style="display:block;margin:0 auto;"></button>
		      	</div>
		    </div>

		      
			<div class="page fullscreen hidden" data-voiceover="understanding">
		      	<div class="center">
		      		
			      	<div class="unit"><div class="instruction">When mapping the environment using satellites, some light signals are interpreted as the presence or absence of green plants. 

Trees made out of light.

</div></div>
			      	<button class="next nextPage"></button>
		      	</div>
		    </div>
		      
		  </div>`;


	    if(localStorage.getItem('lastlat')!==null) {
	    	this.pos = {
	    		'lat':localStorage.getItem('lastlat'),
	    		'lon':localStorage.getItem('lastlon')
	    	};
	    }
	
	}

	

	show() {

		super.show();
		
		var _this = this;
		var lat = localStorage.getItem('lastlat');
		var lon = localStorage.getItem('lastlon');
		
		var input = `-0.035789475, 0.028225806, 0.328225806, -0.025411062, -0.025411062, -0.035789475, 0.428225806, 0.028225806, -0.025411062, -0.025411062, -0.10516252, -0.053598776, -0.053598776, 0.039215688, 0.039215688, -0.10516252, -0.053598776, -0.053598776, 0.039215688, 0.039215688, -0.033932135, 0.093103446, 0.093103446, 0.2471416, 0.2471416`;
		this.data = input;
		this.data = this.data.split(',');
		this.matrix = this.interface.find('#vegMatrix');
		
		var tpl = `<div class="vegCell"></div>`;
		
		var html = '';
		for(var i=0;i<this.data.length;i++) {
			html += tpl;
		}

		this.matrix.append(html);
		var _this = this;

		var avg = 0;
		for(var i=0;i<_this.data.length;i++) {
			var val = parseFloat(_this.data[i]);
			avg += val;
			var c = 'grey';
			console.log(avg,val);
			if(val<=.9&&val>=.2) {
				c = 'green';
			}
			_this.interface.find('.vegCell:eq('+i+')').addClass(c);
		}
		avg /= _this.data.length;
		broadcast('avg',avg.toFixed(2));
		var explanation = '';
		if(avg<0.2) {
			explanation = 'there might not be many plants in your vicinity.';
		} else if (avg>=0.2&&avg<=0.6) {
			explanation = 'there are some plants in your vicinity.';
		} else {
			explanation = 'there are many plants in your vicinity.';
		}
		broadcast('explanation',explanation);
		
	}
	
	
}

