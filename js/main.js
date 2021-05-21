var noSleep = new NoSleep();
var sensors = null;
window.onload = () => {	

	/********* KEEP DEVICE AWAKE AFTER FIRST INTERACTION **********/
	document.addEventListener('click', function enableNoSleep() {
	  noSleep.enable();
	  console.log('Enabling NoSleep...');
	  
	}, false);

	document.addEventListener('click', function enableFullScreen() {
	  console.log('Trying fullscreen...');
	  document.removeEventListener('click', enableFullScreen, false);
	  if(isIOS()||isAndroid()) {
	  	openFullscreen();
	  }
	}, false);

	// load intro, which will bootstrap main app when user begins/resumes
	var intro = new Prompt_intro();
	intro.show();

	// preload audio
	audio.init(function(){
		console.log('audio ready callback');
		$('#loading').hide();	
		intro.init();
	});	

	
}

