enyo.kind({
	name:"com.tiqtech.pinterest.ItemViewer",
	kind:"Popup",
	height:"90%",
	width:"90%",
	modal:true,
	published:{
		items:"",
		index:0
	},
	create:function() {
		this.inherited(arguments);

		this.createComponent({
			name:"resultCarousel",
			kind:"VirtualCarousel",
			height:"100%",
			width:"100%",
			onSetupView:"setupResultView",
			viewControl:this.viewControl
		});
	},
	itemsChanged:function() {
		this.startCarousel();
	},
	indexChanged:function() {
		this.startCarousel();
	},
	startCarousel:function() {
		if(this.hasNode()) {
			this.$.resultCarousel.renderViews(this.index);
		}
	},
	setupResultView: function(sender, view, index) {
	    if(this.items[index]) {
	    	this.setupItem(view, this.items[index], index);
	    	return true;
	    }
	},
	setupItem:function(view, item, index) {
		// no-op
	},
	showItems:function(items, index) {
		this.items = items;
		this.index = index || 0;
		this.openAtCenter();
		this.startCarousel();
	}
});

enyo.kind({
	name:"com.tiqtech.pinterest.PinViewer",
	kind:"com.tiqtech.pinterest.ItemViewer",
	viewControl:{kind:"com.tiqtech.pinterest.PinView"},
	setupItem:function(view, item, index) {
		view.setPin(item);
	}
});