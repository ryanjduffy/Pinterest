enyo.kind({
	name:"Slide",
	kind:"Control",
	className:"slide",
	published:{
		visible:true,
		pin:0
	},
	events:{
		onPause:"",
		onContinue:""
	},
	components:[
		{name:"info", className:"info", onclick:"infoClicked", expanded:false, components:[
			{name:"description", kind:"Control", className:"desc"},
			{name:"source", kind:"Control", className:"source", onclick:"view"}
		]},
		{name:"browser", kind:"PalmService", service:"palm://com.palm.applicationManager/", method:"launch"}
	],
	create:function() {
		this.inherited(arguments);

		this.visibleChanged();
	},
	visibleChanged:function() {
		this.addRemoveClass("visible", this.visible);
	},
	infoClicked:function(source) {
		source.expanded = !source.expanded;
		source.addRemoveClass("expanded", source.expanded);

		if(source.expanded) {
			this.doPause();
			enyo.job(this.id, enyo.bind(this, "doContinue"), 10000);
		}
	},
	pinChanged:function() {
		if(!this.pin) return;

		this.applyStyle("background-image", "url("+this.pin.images.board+")");
		this.$.description.setContent(this.pin.description);
		this.$.source.href = this.pin.source;

		// reset info
		this.$.info.expanded = false;
		this.$.info.removeClass("expanded");

		if(this.pin.source) {
			this.$.source.show();
			this.$.source.setContent(this.pin.domain);
		} else {
			this.$.source.hide();
		}
	},
	view:function(source, event) {
		source.href && this.$.browser.call({id:"com.palm.app.browser", params:{target:source.href}});
		event.stopPropagation();
	}
});