// an experience consists of multiple stages, each of which contains one or more prompts
class Stage {

    constructor(state = {}, doneCallback, saveCallback) {

        // defaults
        const defaultState = {
            'distance': '100',
            'prompts': ['spin'],
            'color':'#999900',
            'currentPrompt':-1,
            'current':false,
        	'progress':0,
        	'completed':false
        }

        // merge
        this.state = {
            ...defaultState,
            ...state
        };

        this.prompt = null;
        this.doneCallback = doneCallback;
        this.saveCallback = saveCallback;

    }

    showPrompt() {
    	var _this = this;
    	var type = this.state.prompts[ this.state.currentPrompt ].type;
    	var domID = '';
    	if(typeof this.state.prompts[ this.state.currentPrompt ].domID !== 'undefined') {
    		domID = this.state.prompts[ this.state.currentPrompt ].domID;
    	}

    	console.log('showing prompt: '+type+' '+domID);
    	switch (type) {
    		case 'spin':
    			this.prompt = new Prompt_spin(domID,_this.advancePrompt.bind(_this));
    			break;
    		case 'zigzag':
    			this.prompt = new Prompt_zigzag(domID,_this.advancePrompt.bind(_this));
    			break;
    		case 'text':
    			this.prompt = new Prompt_text(domID,_this.advancePrompt.bind(_this));
    			break;
    		case 'complete':
    			this.prompt = new Prompt_complete(domID,_this.advancePrompt.bind(_this));
    			break;
    		case 'confirm':
    			this.prompt = new Prompt_confirm(domID,_this.advancePrompt.bind(_this));
    			break;
    		case 'takePhoto':
    			this.prompt = new Prompt_takePhoto(domID,_this.advancePrompt.bind(_this));
    			break;
    		case 'recordAudio':
    			this.prompt = new Prompt_recordAudio(domID,_this.advancePrompt.bind(_this));
                break;
            case 'matchTree':
                this.prompt = new Prompt_matchTree(domID,_this.advancePrompt.bind(_this));
    			break;
            default:
                console.error('Unrecognised class!');
    	}
    	this.prompt.show();
    	
    }

    advancePrompt() {

    	this.state.currentPrompt++;
    	console.log('advance prompt');
    	if(this.state.currentPrompt<this.state.prompts.length) {
    		console.log('showing next prompt '+this.state.currentPrompt);
    		this.showPrompt();
    		this.saveCallback();
    	} else {
    		// end of prompts, advance
    		console.log('bubbling callback to App');
    		this.doneCallback();
    	}
    }

}