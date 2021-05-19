class Sensors {
	constructor(gpsCallback=null,gpsErrorCallback=null,orientationCallback=null,orientationErrorCallback=null,motionCallback=null,motionErrorCallback=null) {

		this.gpsCallback = gpsCallback;
		this.orientationCallback = orientationCallback;
		this.motionCallback = motionCallback;
		this.gpsErrorCallback = gpsErrorCallback;
		this.orientationErrorCallback = orientationErrorCallback;
		this.motionErrorCallback = motionErrorCallback;

		this.method = null;

		this.gpsTimeout = null;
		this.orientationTimeout = null;
		this.motionTimeout = null;
		this.gpsMsg = null;
		this.orientationMsg = null;
		this.motionMsg = null;

		// Fire `type` callbacks with `args`.
		this.fire = function (type, args) {
			var callbacks = self._callbacks[type];
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(window, args);
			}
		};

		this.latestPoints = [];
		this.latestBearingGPS = null;
		this.latestAlpha = null;
		this.delta = 0;

		// Calculate average value for last num `array` items;
		
		var _this = this;
	}

	orientationHandler(e) {

		var latestAlpha = 0;
		var latestAlphaAbs = 0;

		if(this.orientationTimeout!==null) {
			window.clearTimeout(this.orientationTimeout);
		}
		if(typeof this.orientationMsg !== 'undefined' && this.orientationMsg !== null) {
			this.orientationMsg.hide();
		}


		if(typeof e.webkitCompassHeading !== 'undefined') {
			latestAlpha = latestAlphaAbs = e.webkitCompassHeading;
		} else {
			latestAlpha  = -e.alpha;
			latestAlphaAbs = latestAlpha - this.delta;
		}


		document.getElementById('corrected').innerHTML = 'COR: '+latestAlphaAbs;
		if($('#vegMap').hasClass('visible')) {
			document.getElementById('map').style.transform = 'rotate('+parseFloat(-latestAlphaAbs)+'deg)';
		}
		this.orientationCallback({'bearing':latestAlpha,'bearingAbs':latestAlphaAbs});


	}

	onLocationFound(e) {
		var _this = this;
		

		if(_this.gpsTimeout!==null) {
			window.clearTimeout(_this.gpsTimeout);
			_this.gpsTimeout = null;
			console.log('clearing GPS timeout');
		}
		if(_this.gpsMsg!==null) {
			_this.gpsMsg.hide();
		}

		console.log('sending GPS object from sensor callback ');
		_this.gpsCallback(e);
		var radius = e.accuracy / 2;

		document.getElementById('acc').innerHTML = Math.round(e.accuracy);
		
		if(e.accuracy<=65) {
			_this.latestPoints.push(e.latlng);
			if(_this.latestPoints.length>2) {
				_this.latestPoints.shift();
			}
			if(_this.latestPoints.length>1) {
				var d = distance(_this.latestPoints[0].lat,_this.latestPoints[0].lng,_this.latestPoints[1].lat,_this.latestPoints[1].lng);

				document.getElementById('dist').innerHTML = d.toFixed(2);
				if(d>0.5+e.accuracy/32.5) {
					_this.latestBearingGPS = bearing(_this.latestPoints[0],_this.latestPoints[1]);
					document.getElementById('bearingGPS').innerHTML = 'GPS: '+_this.latestBearingGPS;
					_this.delta = _this.latestAlpha - _this.latestBearingGPS; // 80

					console.log('delta',_this.delta);


				}
			}

		} 
		console.log(e);
		document.getElementById('loc').innerHTML = e.latlng.lat+', '+e.latlng.lng;
		_this.map.setView(e.latlng, _this.map.getZoom(), {
			"animate":true,
			"pan":{
				"duration":2
			}
		});
	}

	onLocationError(e) {
		new Message(e,'error');
	}


	init() {

		document.getElementById('mapOuter').className='active';
		console.log(this.Compass);

		var _this = this;
		// set up timeouts
		console.log('setting timeouts');
		this.gpsTimeout = window.setTimeout(function(){
			console.log('showing gps timeout error');
			_this.gpsMsg = new Message("We have not received any location data from your device. Please confirm that your browser and OS settings allow websites to access location data, then close your and reopen AWEN, granting all permissions.",0,'error');
		},10000);
		this.orientationTimeout = window.setTimeout(function(){
			_this.orientationMsg = new Message("We have not received any orientation data from your device. Please confirm that your browser and OS settings allow websites to access orientation data, then close your and reopen AWEN, granting all permissions.",0,'error');
		},5000);   


		if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
			console.log('requesting device orientation permission');
			DeviceOrientationEvent.requestPermission().then( response => {
				

				console.log('in then block with response '+response);

				if ( response == "granted" ) {
					console.log('granted');
					
					console.log('device orientation permission granted');
					
					window.addEventListener('deviceorientation', _this.orientationHandler.bind(_this), false);
				} else {
					console.log('not granted');
					_ = new Message('Orientation sensor permissions are required. Please quit the browser, re-open this page and grant permissions to use this app.',0,'error');
									// stop the app here
								}
							});
			
			
		} else {
			console.log('permissions absent');
			if (window.DeviceOrientationEvent) {
				window.addEventListener('deviceorientation', _this.orientationHandler.bind(_this), false);
			} else {
				console.log('noorientation');
				_ = new Message('Orientation sensor permissions are required. Please quit the browser, re-open this page and grant permissions to use this app.',0,'error');

			}
			
		}

		var count = 0;
		// Sentinel Hub WMS service
		// tiles generated using EPSG:3857 projection - Leaflet takes care of that
		let baseUrl = "https://services.sentinel-hub.com/ogc/wms/472db677-de10-45f0-9e88-34ef6b4d2bef";
		let sentinelHub = L.tileLayer.wms(baseUrl, {
		    tileSize: 512,
		    attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
		    	 	 	 	urlProcessingApi:"https://services.sentinel-hub.com/ogc/wms/f9f27612-5c05-4d61-892e-78d50790da0e", 
		 	 	 	 	maxcc:47, 
		 	 	 	 	minZoom:16, 
		 	 	 	 	maxZoom:16, 
		 	 	 	 	preset:"SCI", 
		 	 	 	 	layers:"SCI", 
		 	 	 	 	time:"2020-10-01/2021-04-17", 

		});
		this.map = L.map('map', {
				center: [55.94671794791918, -3.2136887311935425], // lat/lng in EPSG:4326
				zoom: 16,
				minZoom:16,
				maxZoom:16,
				layers: [sentinelHub]
			});


		this.map.fitWorld();

		

		this.map.on('locationfound', _this.onLocationFound.bind(_this));
		this.map.on('locationerror', _this.onLocationError.bind(_this));

		this.map.locate({
			setView: true, 
			watch  : true,
			maxZoom: 16
		});

	}




}

