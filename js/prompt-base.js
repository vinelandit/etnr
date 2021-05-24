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

        this.mimeType = mimeType;
        this.state = {
        	'completed': false,
        	'showing': false
        }
        this.interface = null;

        return this;
    }

    initSound() {
        audio.playLoop(this.promptType);
    }

    initTimer() {

        var _this = this;

        var dim = 200;

        // initialise canvas for drawing user's path
        var canvas = this.interface.find('.timer canvas');
        canvas.each(function(){
            var ctx = $(this)[0].getContext("2d");
            var myPage = $(this).closest('.page');
            myPage.find('.startTimer').click(function(){
                var d = myPage.find('.timer').attr('data-delay');
                if(d=='') {
                    d=10000;
                }
                console.log('timer: '+d);
                
                _this.timer(myPage,d);
                $(this).off('click');
                $(this).animate({'opacity':0},500);
            });
            ctx.clearRect(0, 0, dim, dim);
            var center = [dim/2,dim/2];
            // inner circle
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.arc(center[0],center[1],(dim/2)-20,0,2*Math.PI);
            ctx.fill();

            // outer ring

            ctx.beginPath();
            ctx.fillStyle = 'none';
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.arc(center[0],center[1],(dim/2)-10,0,2*Math.PI);
            ctx.stroke();
        });
    }

    timer(page,ms=10000) {

        ms *= 1.02;
        var dim = 200;
        var _this = this;
        var ctx = page.find('.timer canvas')[0].getContext("2d");
        var factor = 0;

        var start = null;
        function step(timestamp) {
            if(start==null) {
                start = timestamp;
            }
            var elapsed = timestamp - start;
            ctx.clearRect(0, 0, dim, dim);
            var center = [dim/2,dim/2];
            // inner circle
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.arc(center[0],center[1],(dim/2)-20,0,2*Math.PI);
            ctx.fill();

            // outer ring

            ctx.beginPath();
            ctx.fillStyle = 'none';
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.arc(center[0],center[1],(dim/2)-10,0,2*Math.PI);
            ctx.stroke();

            factor = elapsed/ms;

            // ball
            var x = 100 + 90 * Math.sin(-.1-factor*2*Math.PI);
            var y = 100 + 90 * Math.cos(-.1-factor*2*Math.PI);

            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(x,y,3,0,2*Math.PI);
            ctx.fill();

            // arc
            ctx.beginPath();
            ctx.fillStyle = 'none';
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'white';
            ctx.arc(center[0],center[1],90,0.5*Math.PI,0.5*Math.PI + factor*2*Math.PI);
            ctx.stroke();


            if(elapsed>=ms/1.02) {
                _this.nextPage(page);
            } else {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    nextPage(thisPage) {
        console.log('in next page');
        console.log(thisPage);
        var el = thisPage.next();
        if((thisPage.find('.autoNext').length==0) && this.promptType!=='quietness'&&this.promptType!=='noise') {
            audio.s.button.play();
        }
        if(el.length) {
            thisPage.addClass('hidden');
            el.removeClass('hidden');
            this.pageVoiceover(el);
            el.find('.invisible').each(function(){
                var invisibleEl = $(this);
                window.setTimeout(function(){
                    invisibleEl.removeClass('invisible');
                },$(this).attr('data-delay'));
            });
        } else {
            // last page, complete prompt
            this.complete();
        }
    }
    gotoPage(c,mypage) {
        if(this.promptType!=='quietness'&&this.promptType!=='noise'&&this.promptType!=='hum') {
            audio.s.button.play();
        }
        if(c=='complete') {
            this.complete();
        } else {
            var t = this.interface.find('.page.'+c);
            if(t.length) {
                this.pageVoiceover(t);
                mypage.addClass('hidden');
                t.removeClass('hidden');
            }
        }
    }

    pageVoiceover(page) {
        var id = page.attr('data-voiceover');
        console.log('playing voiceover with id '+id);
        var _this = this;
        if(id!='' && audio.s[this.promptType+'_'+id]) {
            window.setTimeout(function(){
                if(!audio.s[_this.promptType+'_'+id].playing()) {
                    var aid = audio.s[_this.promptType+'_'+id].play();
                    console.log('VOICEOVER audio id '+aid);
                    var b = page.find('.autoNext');
                    if(b.length) {
                        console.log('registering autonext for end of voiceover '+id);
                        audio.autoNexts['vo'+aid] = {
                            'button':b,
                            'sound':audio.s[_this.promptType+'_'+id]
                        };
                    }
                }
                
            },750);
        }
    }

    show() {
        var _this = this;
    	if(this.tpl!==null) {
    		this.targetEl.append(this.tpl.replace(' id=""',' id="'+this.domID+'"'));
    	}
    	this.interface = $(this.fullTarget);
        
        this.initNav();
        this.initSound();
        this.initTimer();
    }

    initNav() {

    	// page nav handlers
        var _this = this;
        this.interface.fadeIn('fast');
        
        

        this.interface.find('.nextPage').off('click').on('click',function(){   
            _this.nextPage($(this).closest('.page'));
        });

        this.interface.find('.timedNextPage').each(function(){
            console.log('data-delay',$(this).attr('data-delay'));
            if($(this).attr('data-delay-when')=='after') {
                $(this).off('click').off('click').on('click',function(){
                    $(this).addClass('invisible');
                    var myPage = $(this).closest('.page');

                    window.setTimeout(function(){
                        _this.nextPage(myPage);
                    },$(this).attr('data-delay'));
                });
                
            } else {
                $(this).addClass('invisible');
                $(this).off('click').on('click',function(){
                    _this.nextPage($(this).closest('.page'));
                });
            }
        });

        this.interface.find('.gotoPage').each(function(){
            var c = $(this).attr('data-page');
            if(c!='') {
                $(this).off('click').on('click',function(){
                    _this.gotoPage(c,$(this).closest('.page'));
                });
            }
        });


        var firstPage = this.interface.find('.page:eq(0)');

        
        this.pageVoiceover(firstPage);
        
        firstPage.removeClass('hidden').find('.invisible').each(function(){
            var invisibleEl = $(this);
            window.setTimeout(function(){
                invisibleEl.removeClass('invisible');
            },$(this).attr('data-delay'));
        });

        // reveal hidden info panels
        this.interface.find('.showHidden').off('click').on('click',function(){
            if($(this).hasClass('shown')) {
                $(this).closest('.page').find('.hiddenInfo').slideUp('fast');
                $(this).removeClass('shown').html('i');
            } else {
                $(this).closest('.page').find('.hiddenInfo').slideDown('fast');
                $(this).addClass('shown').html('&times;');
            }
        });

        this.state.showing = true;


    }

    complete() {
    	console.log('completing prompt callback');
    	this.interface.fadeOut('fast',function(){
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
			'lon':localStorage.getItem('lastlon'),
            'gpxid':localStorage.getItem('etnr_gpxid')
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
                <p>Now tap 'GO' to begin walking the next stage.</p>
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
          
          <div class="promptBg"></div>
            <div class="center">
              <h3>This is placeholder prompt</h3>
              <p>It will ultimately be replaced with real content.</p>
              <button class="doPrompt">PROCEED</button>
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
class Prompt_beforeEnd extends Prompt {
    constructor(domID,doneCallback) {
        super('beforeEnd',domID,doneCallback);
        this.tpl = `

        <div class="prompt beforeEnd fullscreen" id="">
                <div class="page fullscreen hidden" data-voiceover="thank">
                  <div class="center">
                    <div class="unit"><div class="instruction">Thank you. You have completed AWEN.</div></div>
                    <div class="unit"><button class="nextPage">Visualise my journey</button></div>
                  </div>
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