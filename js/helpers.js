/********** GLOBAL HELPER FUNCTIONS **********/

function broadcast(identifier,value) {
	//
	// global function to update (via jQuery) any aspect of the UI that is flagged by the identifier:
	// <element data-bind-value="identifier" data-bind-map="" data-bind-map-suffix="" data-bind-only-map="false">xxxx</element>
	// Elements with a data-bind-value matching identifier are targeted.
	// If data-bind-only-map is absent or set to false, contents of the elements will be changed to value.
	// If data-bind-map is present, the css parameter it contains (e.g. width) will have value applied to it.
	// If data-bind-map-suffix is present, it will be appended to the css parameter (e.g. '%')
	// data-bind-map and data-bind-map-suffix are optional. 
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

function api(command,data,callback) {

	const endpoint = './api/';
	const key = 'testkeyp';
	
	var id = localStorage.getItem('etnr_userid');

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