class Prompt {

    constructor(promptType,domID,doneCallback,mimeType=null,targetElID='#promptTarget') {

    	this.tpl = null;

    	this.targetEl = $(targetElID);

    	this.promptType = promptType;
    	this.domID = '';
    	this.fullTarget = '.prompt.'+this.promptType;
    	if(domID!='') {
    		this.domID = domID;
    		this.fullTarget += '#'+domID;
    	};

    	this.doneCallback = doneCallback;
        /* var validPromptTypes = ['spin', 'confirm', 'complete', 'takePhoto', 'recordAudio','text','zigzag'];
        if (!validPromptTypes.includes(promptType)) {
            throw 'Supplied prompt type not in list of valid prompt types.';
            return false;
        } */

        this.mimeType = mimeType;
        this.state = {
        	'completed': false,
        	'showing': false
        }
        this.interface = null;
    }

    show() {
    	if(this.tpl!==null) {
    		this.targetEl.append(this.tpl.replace(' id=""',' id="'+this.domID+'"'));
    	}
    	this.interface = $(this.fullTarget);
    	this.interface.slideDown('fast');
    	this.state.showing = true;
    }

    begin() {
    	// 
    }

    merge(tpl,data) {
        // merge data object into {placeholders} in tpl HTML
        for(var key in data) {
            var value = data[key];
            console.log(key,value);
            var regex = new RegExp("\{"+key+"\}","g");
            //regex = "{"+key+"}";
            tpl = tpl.replace(regex,value);
        }
        return tpl;
    }

    complete() {
    	console.log('completing prompt callback');
    	this.interface.slideUp('fast',function(){
    		$(this).remove(); // remove from DOM
    	});
    	this.doneCallback();
    }
    uploadMedia(data,mimetype=this.mimeType,mediaid=(this.promptType+this.domID).replace('#','-')) {
		api('uploadmedia',{
			'mimetype':mimetype,
			'data':data,
			'mediaid':mediaid,
			'lat':localStorage.getItem('lastlat'),
			'lon':localStorage.getItem('lastlon')
		},function(data) {
			console.log('upload media callback');
            console.log(data);
		});
    }

    mediaURL(mimetype=this.mimeType,mediaid=this.fullTarget) {
    	api('downloadmedia',{
    		'mimetype':mimetype,
    		'mediaid':mediaid
    	});
    }

}

class Prompt_confirm extends Prompt {
    constructor(domID,doneCallback) {
        super('confirm',domID,doneCallback);
        this.tpl = `<div class="prompt confirm fullscreen" id="">
              <div class="promptBg"></div>
              
              <div class="center">
                
                <h3>WELL DONE!</h3>
                <p>Now tap 'GO' and keep walking.</p>
                <button class="doPrompt">GO</button>
                
              </div>
          </div>`;
    }
    show() {
        super.show();
        var _this = this;
        this.interface.find('.doPrompt').off('click').on('click',function(e){
            _this.complete();
        });
    }
}

class Prompt_text extends Prompt {
    constructor(domID,doneCallback) {
        super('text',domID,doneCallback);
        this.tpl = `<div class="prompt text fullscreen" id="">
          
          
            <div class="center">
              <h3>This is generic text</h3>
              <p>Now go on with you...</p>
              <button class="doPrompt">GO</button>
            </div>
        </div>`;
    }
    show() {
        super.show();
        var _this = this;
        this.interface.find('.doPrompt').off('click').on('click',function(e){
            _this.complete();
        });
    }
}

class Prompt_complete extends Prompt {
    constructor(domID,doneCallback) {
        super('complete',domID,doneCallback);
        this.tpl = `
          <div class="prompt complete fullscreen" id="">
              <div class="promptBg"></div>
              
              <div class="center">
                <h3>YOU MADE IT!</h3>
                <p>Now you are wise and lovely.</p>
              </div>
          </div>`;
    }
    
    show() {
        super.show();
        // stop stuff
        this.doneCallback();
    }
    
}