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
        	'completed':false,
            'audio':null
        }

        var _this = this;

        // merge
        this.state = {
            ...defaultState,
            ...state
        };

        this.prompt = null;
        this.audioPlaying = false;
        this.audioPlayer = null;
        this.doneCallback = doneCallback;
        this.saveCallback = saveCallback;

    }

    showPrompt() {

    
        console.log('stage > showPrompt');
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
            case 'vegetation':
                this.prompt = new Prompt_vegetation(domID,_this.advancePrompt.bind(_this));
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
            case 'lichen':
                this.prompt = new Prompt_lichen(domID,_this.advancePrompt.bind(_this));
                break;
            case 'recordAudio':
                this.prompt = new Prompt_recordAudio(domID,_this.advancePrompt.bind(_this));
                break;
            case 'wind':
                this.prompt = new Prompt_wind(domID,_this.advancePrompt.bind(_this));
                break;
            case 'matchTree':
                this.prompt = new Prompt_matchTree(domID,_this.advancePrompt.bind(_this));
                break;
            case 'compass':
                this.prompt = new Prompt_compass(domID,_this.advancePrompt.bind(_this));
                break;
            case 'lightning':
                this.prompt = new Prompt_lightning(domID,_this.advancePrompt.bind(_this));
                break;
            case 'clouds':
                this.prompt = new Prompt_clouds(domID,_this.advancePrompt.bind(_this));
                break;
            case 'breathe':
                this.prompt = new Prompt_breathe(domID,_this.advancePrompt.bind(_this));
                break;
            case 'beforeEnd':
                this.prompt = new Prompt_beforeEnd(domID,_this.advancePrompt.bind(_this));
                break;
            case 'hum':
                this.prompt = new Prompt_hum(domID,_this.advancePrompt.bind(_this));
                break;
            case 'ground':
                this.prompt = new Prompt_ground(domID,_this.advancePrompt.bind(_this));
                break;
            case 'intro':
                this.prompt = new Prompt_intro(domID,_this.advancePrompt.bind(_this));
                break;
            case 'weeds':
                this.prompt = new Prompt_weeds(domID,_this.advancePrompt.bind(_this));
                break;
            case 'leaf':
                this.prompt = new Prompt_leaf(domID,_this.advancePrompt.bind(_this));
                break;
            case 'noise':
                this.prompt = new Prompt_noise(domID,_this.advancePrompt.bind(_this));
                break;
            case 'blue':
                this.prompt = new Prompt_blue(domID,_this.advancePrompt.bind(_this));
                break;
            case 'ocean':
                this.prompt = new Prompt_ocean(domID,_this.advancePrompt.bind(_this));
                break;
            case 'quietness':
                this.prompt = new Prompt_quietness(domID,_this.advancePrompt.bind(_this));
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