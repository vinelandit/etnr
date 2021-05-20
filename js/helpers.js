/********** GLOBAL HELPER FUNCTIONS **********/

function broadcast(identifier,value) {
	//
	// global function to update (via jQuery) any aspect of the UI that is flagged by the identifier:
	// <element data-bind-value="identifier" data-bind-map="" data-bind-map-suffix="" data-bind-only-map="false">xxxx</element>
	// Elements with a data-bind-value matching identifier are targeted.
	// If data-bind-only-map is absent or set to false, contents of the elements will be changed to value.
	// If data-bind-map is present, the css parameter it contains (e.g. width) will have value applied to it.
	// If data-bind-map-suffix is present, it will be appended to the css parameter (e.g. '%')
	// data-bind-only-map and data-bind-map-suffix are optional. 
	// 

	$('[data-bind-value="'+identifier+'"]').each(function(){
		var m = $(this).attr('data-bind-map');
		
		if(typeof m !== 'undefined' && m!='') {
			var v = value;
			var s = $(this).attr('data-bind-map-suffix');
			if(typeof s !== 'undefined') {
				v += s;
			}
			var c = {};
			c[m] = v;
			$(this).css(c);
		}

		var o = $(this).attr('data-bind-only-map');
		if((typeof o === 'undefined') || (typeof o !== 'undefined' && o.toLowerCase()!='true')) {
			var v = value;
			var s = $(this).attr('data-bind-suffix');
			if(typeof s !== 'undefined') {
				v += s;
			}
			$(this).html(v);
		}
	});
}

function openFullscreen() {
	var elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) { /* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE11 */
		elem.msRequestFullscreen();
	}
	if(screen.orientation) {
		screen.orientation.lock('portrait');
	}
}
function merge(tpl,data) {
    // merge data object into {placeholders} in tpl HTML
    for(var key in data) {
    	var value = data[key];
    	var regex = new RegExp("\{"+key+"\}","g");
        //regex = "{"+key+"}";
        tpl = tpl.replace(regex,value);
    }
    return tpl;
}


function bearing(a,b) {
	console.log('in bearing with ',a,b);
	var x = Math.cos(b.lat) * Math.sin(b.lng-a.lng);
	var y = Math.cos(a.lat) * Math.sin(b.lat) - Math.sin(a.lat)*Math.cos(b.lat)*Math.cos(b.lng-a.lng);
	var result = Math.atan2(x,y) * 180 / Math.PI;
	if(result<0) {
		result += 360;
	}
	return result;
}
function gpsToPoint(point,origin,center,scale=10) {
	// first point maps to this.pc.center
	var xOff = ((point.lon - origin.lon) * scale) + center.x;
	var yOff = ((point.lat - origin.lat) * scale) + center.y;
	return {'x':xOff,'y':yOff};
}

// Processing-style map function
function mapr(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// Distance between two points
function distance(lat1, lon1, lat2, lon2) {
	
	const R = 6371e3; // metres
	const toRads = 0.0174533293;
    var phi1 = lat1 * Math.PI / 180; // phi1, lambda in radians
    var phi2 = lat2 * Math.PI / 180;
    var deltaPhi = (lat2 - lat1) * Math.PI / 180;
    var deltaLambda = (lon2 - lon1) * Math.PI / 180;

    var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres

}

function api(command,data,callback,overrideEndpoint=null,overrideID=null) {

	var endpoint = './api/';

	if(overrideEndpoint!==null) {
		endpoint = overrideEndpoint;
	}

	const key = 'testkeyp';
	
	var id = localStorage.getItem('etnr_userid');

	if(overrideID!==null) {
		id = overrideID;
	}

	$.ajax({
		type: "POST",
		url: endpoint,
		data: {
			'key':key,
			'id':id,
			'command':command,
			'payload':data
		},
		success: function(data) {
			// console.log(data);
			data = JSON.parse(data);
			if(id!=data.id) {
				console.log('updating unique id from '+id+' to '+data.id);
				id = data.id;
				localStorage.setItem('etnr_userid',id);
			}
			callback(data);
		}
	});
	
}


function decycle(obj, stack = []) {
	if (!obj || typeof obj !== 'object')
		return obj;

	if (stack.includes(obj))
		return null;

	let s = stack.concat([obj]);

	return Array.isArray(obj)
	? obj.map(x => decycle(x, s))
	: Object.fromEntries(
		Object.entries(obj)
		.map(([k, v]) => [k, decycle(v, s)]));
}

/******** REMOTE ERROR LOGGING ********/
function rerr(data) {
	api('error',{
		'data':JSON.stringify(data),
		'ua':navigator.userAgent
	},function(data){
		console.log(data);
	});
}

function isSafari() {
	var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
	var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
	var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
	var is_safari = navigator.userAgent.indexOf("Safari") > -1;
	var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
	if ((is_chrome)&&(is_safari)) { is_safari = false; }
	if ((is_chrome)&&(is_opera)) { is_chrome = false; }
	return is_safari;
}

function isChrome() {
	return /Google Inc/.test(navigator.vendor);
}

function isAndroid() {
	return /Android/.test(navigator.userAgent);
}

function isOpera() {
	return /OPR/.test(navigator.userAgent);
}

function isIOS() {

	return [
	'iPad Simulator',
	'iPhone Simulator',
	'iPod Simulator',
	'iPad',
	'iPhone',
	'iPod'
	].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}