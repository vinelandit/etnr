class Message {
	
	constructor(text,timeout=0,type='message') {
		this.text = text;
		this.timeout = timeout;
		this.target = $('.messagesOuter');
		this.tpl = `<div class="message`;
		if(type=='error') {
			this.tpl += ` error`;
		} 
		this.tpl += `" id="message{id}">{text}</div>`;
		this.id = Date.now();

		this.vars = ['id','text'];
		this.html = this.tpl;

		this.makeHTML();
		this.target.append(this.html);

		this.el = $('#message'+this.id);
		this.show();

		var _this = this;

		if(timeout>0) {
			this.timeout = window.setTimeout(function(){
				_this.el.slideUp(250);
			},timeout);
		}
	}

	makeHTML() {
		for(var i=0;i<this.vars.length;i++) {
			this.html = this.html.replace('{'+this.vars[i]+'}',this[this.vars[i]]);
		}
	}

	show() {
		this.el.slideDown(250);
	}

	hide() {
		var _this = this;
		this.el.slideUp(250,function(){
			_this.el.remove();
		});
	}

}
