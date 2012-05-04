enyo.kind({
	name:"com.tiqtech.pinterest.PinThumb",
	kind:"Control",
	className:"result-thumb pin-thumb",
	published:{
		item:0
	},
	events:{
		onView:""
	},
	components:[
		{name:"img", kind:"Image", onclick:"imgClicked"},
		{name:"source", kind:"Control", className:"source", onclick:"sourceClicked"}
		// {kind:"Control", className:"counts", components:[
		// 	{kind:"Control", name:"repins", className:"repins"},
		// 	{kind:"Control", name:"comments", className:"comments"},
		// 	{kind:"Control", name:"likes", className:"likes"}
		// ]}
	],
	create:function() {
		this.inherited(arguments);
		this.itemChanged();
	},
	itemChanged:function() {
		if(this.item) {
			this.$.img.setSrc(this.item.images.thumbnail);
			this.$.source.setContent(this.item.domain || "");
			//this.$.repins.setContent(this.formatNumber(this.item.counts.repins));
			//this.$.comments.setContent(this.formatNumber(this.item.counts.comments));
			//this.$.likes.setContent(this.formatNumber(this.item.counts.likes));
		}
	},
	formatNumber:function(n) {
		// for future formatting (e.g. 1000 -> 1k)
		return n;
	},
	imgClicked:function() {
		this.item && this.doView(this.item)
	},
	sourceClicked:function() {
		this.item.source && window.open(this.item.source);
	}
});

enyo.kind({
	name:"com.tiqtech.pinterest.UserThumb",
	kind:"Control",
	className:"result-thumb user-thumb",
	published:{
		item:0
	},
	events:{
		onView:""
	},
	components:[
		{name:"img", kind:"FitImage"},
		{name:"source", kind:"Control", className:"name"}
	],
	create:function() {
		this.inherited(arguments);
		this.itemChanged();
	},
	itemChanged:function() {
		if(this.item) {
			this.$.img.setSrc(this.item.image_large_url || this.item.image_url);
			this.$.source.setContent(this.item.full_name || this.item.username);
		}
	},
	clickHandler:function() {
		this.doView(this.item);
	}
});