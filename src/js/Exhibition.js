enyo.kind({
	name:"com.tiqtech.pinterest.App",
	kind:"Control",
	className:"app",
	components:[
		{name:"loading", className:"loading", components:[
			{kind:"Image", src:"LogoRed.png"},
			{kind:"Control", content:"Loading ..."}
		]},
		{name:"s0", kind:"Slide", visible:false, onPause:"pause", onContinue:"resume"},
		{name:"s1", kind:"Slide", visible:false, onPause:"pause", onContinue:"resume"},
		{name:"s2", kind:"Slide", visible:false, onPause:"pause", onContinue:"resume"},
        {name:"ws", kind:"WebService", url:"https://api.pinterest.com/v2/popular/", contentType:"application/json", onSuccess:"callSuccess", onFailure:"callFailure"},
		{kind:"ApplicationEvents", onWindowActivated:"resume", onWindowDeactivated:"pause"}
	],
	create:function() {
		this.inherited(arguments);

		setTimeout(enyo.bind(this, "load"), 250);
	},
    call:function(method, data, successEvent) {
    	this.$.ws.setMethod(method);
    	var request = this.$.ws.call(data && enyo.json.stringify(data));
    	request.__callback = successEvent;
    },
    callSuccess:function(source, response, request) {
    	this[request.__callback](response);
    },
    callFailure:function(source, response, request) {
    	enyo.log("error", response);
    },
	load:function() {
		this.call("GET", undefined, "ready");
	},
	pause:function() {
		enyo.job.stop("nextSlide");
	},
	resume:function() {
		enyo.job._jobs["nextSlide"] || this.nextSlide();
	},
	ready:function(response) {
		if(response) {
			this.$.loading.hide();

			this.pins = response.pins;
			this.pinIndex = -1;
			this.currentSlide = -1;
			this.nextSlide();

			// refresh content every 10 minutes
			enyo.job("load", enyo.bind(this, "load"), 600000);
		} else {
			// retry in 5 seconds if failed to load
			enyo.job("load", enyo.bind(this, "load"), 10000);
		}
	},
	nextSlide:function() {

		if(this.currentSlide === -1) {
			this.$.s0.setPin(this.pins[0]);
		}

		this.pinIndex = this.wrap(this.pinIndex, this.pins.length);
		this.currentSlide = this.wrap(this.currentSlide, 3);

		var slides = this.getSlides(this.currentSlide);

		// show current slide
		slides[0].setVisible(true);

		// hide next and set pin
		slides[1].setVisible(false);
		slides[1].setPin(this.pins[this.wrap(this.pinIndex+1, this.pins.length)]);

		// hide previous (but don't set pin or it will likely render before animation finishes)
		slides[2].setVisible(false);
				    
		enyo.job("nextSlide", enyo.bind(this, "nextSlide"), 10000);
	},
	getSlides:function(a) {
		var b = (a+1+3)%3,
			c = (b+1+3)%3;

		return [this.$["s"+a], this.$["s"+b], this.$["s"+c]];
	},
	wrap:function(i, max) {
		return (i+1+max)%max;
	}
});