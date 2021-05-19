
class Prompt_vegetation extends Prompt {
	constructor(domID,doneCallback) {
		super('vegetation',domID,doneCallback);
		this.tpl = `<div class="prompt vegetation fullscreen" id="">
		      
		      <div class="page fullscreen hidden" data-voiceover="take">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Your immediate surroundings have an average vegetation index of <span style="font-weight:bold" data-bind-value="NDVI">...</span>. This means (science here).</div></div>
			      	<div id="vegMatrix"></div>
			      	<div class="unit"><button class="timedNextPage" data-delay-when="before" data-delay="5000">OK</button></div>
		      	</div>
		      </div>
		      <div class="page fullscreen hidden" data-voiceover="blue">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Blue was the last colour named by civilisations. Before then, we distinguished shades of green.</div></div>
			      	<div class="unit"><button class="timedNextPage" data-delay-when="before" data-delay="4000">OK</button></div>
		      	</div>
		      </div>
		  </div>`;
	}
	
	show() {
		super.show();
		var lat = localStorage.getItem('lastlat');
		var lon = localStorage.getItem('lastlon');
		/* $.ajax({
            url: 'https://api.awen.earth/ndvi?lat='+lat+'&lon='+lon,
            type: "GET",
            crossDomain: true,
            success: function (response) {
                console.log(data);
            },
            error: function (xhr, status) {
                alert("error");
            }
        }); */
		var input = `-0.035789475, 0.028225806, 0.028225806, -0.025411062, -0.025411062, -0.035789475, 0.028225806, 0.028225806, -0.025411062, -0.025411062, -0.10516252, -0.053598776, -0.053598776, 0.039215688, 0.039215688, -0.10516252, -0.053598776, -0.053598776, 0.039215688, 0.039215688, -0.033932135, 0.093103446, 0.093103446, 0.2471416, 0.2471416`;
		this.data = input;
		this.data = this.data.split(',');
		this.matrix = this.interface.find('#vegMatrix');
		
		var tpl = `<div class="vegCell"><div class="vegBall"></div></div>`;
		
		var html = '';
		for(var i=0;i<this.data.length;i++) {
			html += tpl;
		}

		this.matrix.append(html);
		var _this = this;

		var avg = 0;

		window.setTimeout(function(){
			for(var i=0;i<_this.data.length;i++) {
				var val = parseFloat(_this.data[i]);
				avg += val;
				console.log(avg,val);
				_this.interface.find('.vegBall:eq('+i+')').css({
					'transform':'scale('+(parseFloat(val+.5))+')',
					'opacity':val+0.5
				});
			}
			avg /= _this.data.length;
			broadcast('NDVI',avg.toFixed(2));
		},200);
		

		
		
	}
}

