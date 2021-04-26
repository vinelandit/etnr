class Prompt_recordAudio extends Prompt {
	constructor(domID,doneCallback) {
		super('recordAudio',domID,doneCallback);

		this._mimetype = 'audio/webm';
		if(isSafari()) {
			this._mimetype = 'audio/mp4';
		}

		this.tpl = `<div class="prompt recordAudio fullscreen" id="">
		      <div class="promptBg"></div>
		      
		      <div class="center">
		        
		        <h3>RECORD AUDIO</h3>
		        <p>Gain: <span data-bind-value="gain"></span></p>
		        <p>Now tap 'GO' to record 10 seconds of audio.</p>
		        <button class="doPrompt">GO</button>
		        
		      </div>
		  </div>`;
	}
	show() {
		super.show();
		var _this = this;

		function draw() {
			_this.analyser.getByteTimeDomainData(_this.dataArray);
			broadcast('gain',Math.round(_this.getAverageVolume(_this.dataArray)));
			requestAnimationFrame(draw);
		}
		function handleError(err) {
			alert('error requesting audio recording');
			console.log(err);
		}
		function handleSuccess(stream) {
			
			_this.interface.find('.doPrompt').hide();

			var track = stream.getTracks()[0];
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			var context = new AudioContext();


			// connect to analyser
		    var source = context.createMediaStreamSource(stream);
			_this.analyser = context.createAnalyser();
			_this.analyser.fftSize = 32;
			_this.analyser.maxDecibels = -3;
			_this.analyser.minDecibels = -100;

			var bufferLength = _this.analyser.frequencyBinCount;
			_this.dataArray = new Uint8Array(bufferLength);
			_this.analyser.getByteFrequencyData(_this.dataArray);

		    source.connect(_this.analyser);

		    draw(); 
		    
		    // record	
		    var audioElement = document.getElementById('testAudio');   
		    var downloadLink = document.getElementById('testDL'); 

		    
		    /* var webAudioRecorder = new WebAudioRecorder(source, {
			    workerDir: 'js/libs/',
			    encoding: 'wav',
			    options: {
			        encodeAfterRecord: true
			    } 
			});

		    webAudioRecorder.onComplete = (webAudioRecorder, blob) => {
			    let audioElementSource = window.URL.createObjectURL(blob);
			    audioElement.src = audioElementSource;
			    audioElement.controls = true;
			}
			webAudioRecorder.onError = (webAudioRecorder, err) => {
			    console.error(err);
			}

			console.log('starting recording...');
			webAudioRecorder.startRecording();
			window.setTimeout(function(){
				console.log('stopping recording...');
				webAudioRecorder.finishRecording();
			},5000); */


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
				   _this.complete();
				}
		    });



		    mediaRecorder.start(1000);

		    var remaining = 10;
		   	var cd = window.setInterval(function(){
		   		_this.interface.find('h3').html('Recording ('+remaining+')');
		   		remaining--;
		   	},1000);

		    window.setTimeout(function(){
		    	window.clearTimeout(cd);
		    	console.log('stopping recording...');
		    	shouldStop = true;
		    },10000);

		}

		this.interface.find('.doPrompt').off('click').on('click',function(e){
			navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      			.then(handleSuccess).catch(handleError);
		});
	}
	getAverageVolume(array) {
        var values = 0;
        var average;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;
        return average;
 	}
	
}