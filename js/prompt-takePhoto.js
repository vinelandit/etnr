
class Prompt_takePhoto extends Prompt {
	constructor(domID,doneCallback) {
		super('takePhoto',domID,doneCallback,'image/jpeg');
		this._bearing = null;
		this.tpl = `<div class="prompt takePhoto fullscreen" id="" data-media-target="#showPhoto">
		      <div class="promptBg"></div>
		      <div class="progressRotateOuter">
		        <div class="progressRotateInner"><span class="distance" data-bind-value="rotateProgress" data-bind-map-value="width" data-bind-suffix="%"></span></div>
		      </div>
		      <div class="progressRotate" data-bind-value="rotateProgress" data-bind-map-suffix="%"></div>
		      <div class="center">
		        <h3>TAKE PHOTO</h3>
		        <p>Photograph something green and small.</p>
		        <form>
		        <input type="file"
		       class="photoFile" name="photoFile" capture="environment"
		       accept="image/jpeg" />
		        </form>
		      </div>
		  </div>`;
	}
	show() {
		super.show();
		var _this = this;

		this.interface.find('.photoFile')[0].addEventListener('change',function(){
			$(this).hide();
			var i = $(_this.interface.attr('data-media-target'));
			var img = i[0];
			img.file = this.files[0];
			const reader = new FileReader();
			reader.onload = (function(aImg) { 
				return function(e) { 
					aImg.src = e.target.result; $(aImg).show(); _this.complete(); 
					// save image to server
					_this.uploadMedia(e.target.result,'image/jpeg');
				}; 
			})(img);
    		reader.readAsDataURL(this.files[0]);
		},false);
	}
	
}

