window.onload = () => {	

	// check for passed performance parameters
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var params = {};

	/********* KEEP DEVICE AWAKE AFTER FIRST INTERACTION **********/
	var noSleep = new NoSleep();
	document.addEventListener('click', function enableNoSleep() {
	  noSleep.enable();
	  document.removeEventListener('click', enableNoSleep, false);
	  console.log('Enabling NoSleep...');
	}, false);

	var id = parseInt(localStorage.getItem('etnr_userid'));
	
	if(id>0) {
		$('#resume').show().click(function(e) {
			var app = new App(localStorage.getItem('etnr_userid'));
			$(this).hide();
			$('#restart').hide();
		});

		$('#restart').show().click(function(e) {
			localStorage.removeItem('etnr_userid');
			localStorage.removeItem('etnr_state');
			location.reload();
		});
	} else {
		// no stored state
		$("#start").show().click(function(e) {
			var app = new App();
			$(this).hide();
		});
	}
	
}

