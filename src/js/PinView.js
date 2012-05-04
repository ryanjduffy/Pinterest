enyo.kind({
	name:"com.tiqtech.pinterest.PinView",
	kind:"Control",
	className:"pin-view",
	published:{
		pin:0
	},
	components:[
		{kind:"BasicScroller", height:"100%", autoHorizontal:false, horizontal:false, components:[
			{name:"img", kind:"Image", style:"float:left", onclick:"imgClicked"},
			{kind:"Control", className:"counts", components:[
				{kind:"Control", className:"hbox repins", components:[
					{content:"Re-pins"},
					{name:"repins"}
				]},
				{kind:"Control", className:"hbox comments", components:[
					{content:"Comments"},
					{name:"comments"}
				]},
				{kind:"Control", className:"hbox likes", components:[
					{content:"Likes"},
					{name:"likes"}
				]}
			]},
			{kind:"Control", name:"desc"}
		]}
	],
	create:function() {
		this.inherited(arguments);

		this.pinChanged();
	},
	pinChanged:function() {
		if(this.pin) {
			this.$.img.setSrc(this.pin.images.board);
			this.$.repins.setContent(this.formatNumber(this.pin.counts.repins));
			this.$.comments.setContent(this.formatNumber(this.pin.counts.comments));
			this.$.likes.setContent(this.formatNumber(this.pin.counts.likes));
			this.$.desc.setContent(this.pin.description)
		}
	},
	formatNumber:function(n) {
		// for future formatting (e.g. 1000 -> 1k)
		return n;
	},
	imgClicked:function() {
		this.pin.source && window.open(this.pin.source);
	}
})