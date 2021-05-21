class Prompt_quietness extends Prompt {
	constructor(domID,doneCallback) {
		super('quietness',domID,doneCallback);

		this._mimetype = 'audio/webm';
		if(isSafari()) {
			this._mimetype = 'audio/mp4';
		}

		this.tpl = `
		<div class="prompt quietness fullscreen" id="">
		     
		    <div class="page fullscreen hidden" data-voiceover="search">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Search for quietness nearby.</div></div>
			      	<div class="unit"><button class="timedNextPage next" data-delay-when="after" data-delay="1000"></button></div>
		      	</div>
		    </div>
		  	
		  	<div class="page fullscreen hidden" data-voiceover="dont">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Don't rush. Take the outside in.</div></div>
			      	<div class="unit"><button class="nextPage next beforeRecord" data-delay-when="after" data-delay="1000"></button></div>
		      	</div>
		      
		  	</div>
		  	<div class="page fullscreen hidden" data-voiceover="record">
		      	<div class="center">
		      		<div class="unit"><div class="instruction">Record 15 seconds of it.</div></div>
		      		<div class="timer" data-delay="15000">
		      			<canvas width="200" height="200"></canvas>
		      		</div>
		      		<div class="unit startUnit" style="opacity:0"><button class="halfLeft startRecordTimer">Start</button><button class="halfRight gotoPage" data-page="in">Skip</button></div>
		      	</div>
		    </div>
		    <div class="page fullscreen hidden" data-voiceover="thank">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Thank you. In our world, it can be difficult to find quietness.</div></div>
			      	<div class="unit"><button class="autoNext gotoPage next" data-page="final"></button></div>
		      	</div>
		      
		  	</div>
		  	<div class="page fullscreen hidden in" data-voiceover="in">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">In our world, it can be difficult to find quietness. Try to notice it in your everyday life.</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      
		  	</div>
		  	<div class="page fullscreen hidden final" data-voiceover="entire">
		      	<div class="center">
			      	<div class="unit"><div class="instruction">Entire generations of underwater species have never known quietness. 
The ocean's soundscape 
is now composed of ship, submarine and building noise. These intruding noises drown out the sounds needed to feed, navigate and communicate, threatening ocean life. 
</div></div>
			      	<div class="unit"><button class="autoNext nextPage next"></button></div>
		      	</div>
		      
		  	</div>
		</div>
		`;
	}
	show() {
		super.show();

		var _this = this;
		
		function handleError(err) {
			alert('error requesting audio recording');
			console.log(err);
		}
		function handleSuccess(stream) {
			
			_this.interface.find('.page:eq(2) .gotoPage').addClass('invisible');
			_this.interface.find('.page:eq(2) .nextPage').addClass('invisible');
			_this.interface.find('.page:eq(2) .startRecordTimer').addClass('invisible');
			_this.timer(_this.interface.find('.page:eq(2)'),15000);

			var track = stream.getTracks()[0];
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			var context = new AudioContext();
		    
		    // record	
		    var audioElement = document.getElementById('testAudio');   
		    var downloadLink = document.getElementById('testDL'); 

			var stopped = false;
			var shouldStop = false;
			const options = {mimeType: _this._mimetype};
		    const recordedChunks = [];
		    const mediaRecorder = new MediaRecorder(stream, options);

		    mediaRecorder.addEventListener('dataavailable', function(e) {
		      if (e.data.size > 0) {
		        recordedChunks.push(e.data);
		      }

		      if(shouldStop === true && stopped === false) {
		        mediaRecorder.stop();
		        stopped = true;
		      }
		    });

		    mediaRecorder.addEventListener('stop', function() {
				console.log('stopping recording...');
	    		var data = new Blob(recordedChunks,{ type: _this._mimetype });
	    		var reader = new window.FileReader();
				reader.readAsDataURL(data); 

				reader.onloadend = function() {
				   console.log('uploading recording...');
				   _this.uploadMedia(reader.result,_this._mimetype);
				   console.log('closing audio context');
				   context.close();
				   track.stop();
				   window.setTimeout(function(){
				   		audio.playLoop('water');
				   	},1000);
				   // _this.complete(); // handled by graphical timer
				}
		    });



		    mediaRecorder.start(1000);

		    var remaining = 15;
		   	var cd = window.setInterval(function(){
		   		_this.interface.find('h3').html('Recording ('+remaining+')');
		   		remaining--;
		   	},1000);

		    window.setTimeout(function(){
		    	window.clearTimeout(cd);
		    	console.log('stopping recording...');
		    	shouldStop = true;
		    },15000);

		}

		this.interface.find('.startRecordTimer').on('click',function(e){
			
			navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      			.then(handleSuccess).catch(handleError);
		});

		this.interface.find('.beforeRecord').on('click',function(){
			window.setTimeout(function(){
				_this.interface.find('.startUnit').animate({'opacity':1},'fast');
			},3000);
		});

		this.interface.find('.startUnit button.gotoPage').click(function(){
			audio.playLoop('water');
		});

	}
	
	

	initSound() {
		audio.stopLoop();
	}
		
}