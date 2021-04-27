
class Prompt_matchTree extends Prompt {
	constructor(domID,doneCallback) {
		super('matchTree',domID,doneCallback,'text/plain');
		this._bearing = null;
		this.tpl = `<div class="prompt matchTree fullscreen" id="">
		
		      
		  </div>`;
	}

	cardhtml() {
		return `<div class="treeCard center">
			<!-- <img src="images/timber.jpg" alt="Timber" id="timberLogo" /> -->
			<!-- <h4><img src="images/match.jpg" alt="Match" id="timberMatch" />
			<img src="images/tree.jpg" alt="Tree" id="tree" /></h4> -->
			<h3>{CommonName} ({LatinName})</h3>
			<h5>{Site} ({distance} km)</h5>
			<p>{AgeGroup}</p>
			<p>Height: {Height}</p>
			<p><button class="doPrompt">LEARN MORE</button></p>
		</div>`;
	}

	notreeshtml() {
		return `<h3>No trees</h3>
		<p>Unfortunately we couldn't locate any trees in our database within 10km of your current location.</p>
		<p><button class="doPrompt">PROCEED</button></p>`;
	}

	gpserrorhtml() {
		return `<h3>GPS Error</h3>
		<p>Unfortunately we couldn't determine your position.</p>
		<p><button class="doPrompt">PROCEED</button></p>`;
	}

	show() {
		super.show();
		var _this = this;
		var lat = localStorage.getItem('lastlat');
		var lon = localStorage.getItem('lastlon');
		if(lat!==null&&lon!==null&&lat!==0&&lon!==0) {
			api('matchtree',{
				'lat':localStorage.getItem('lastlat'),
				'lon':localStorage.getItem('lastlon')
			},function(data) {
				console.log('upload media callback');
				if(data['result']=='success') {
					data.distance = parseFloat(data.distance).toFixed(2);
					_this.interface.append(_this.merge(_this.cardhtml(),data));
					_this.interface.find('.doPrompt').off('click').on('click',function(e){
			            _this.complete();
			        });
				} else {
					_this.interface.append(_this.notreeshtml());
					_this.interface.find('.doPrompt').off('click').on('click',function(e){
			            _this.complete();
			        });
				}
				
			});
		} else {
			_this.interface.append(_this.gpserrorhtml());
			_this.interface.find('.doPrompt').off('click').on('click',function(e){
	            _this.complete();
	        });
		}
		

		
	}
	
}

