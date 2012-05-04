enyo.kind({
	name:"FitImage",
	kind:"Control",
	className:"extras-fitimage",
	published:{
		src:"",
		fit:"horizontal"
	},
	create:function() {
		this.inherited(arguments);

		this.srcChanged();
		this.fitChanged();
	},
	srcChanged:function() {
		this.applyStyle("background-image", "url(" + this.src + ")");
	},
	fitChanged:function() {
		this.applyStyle("-webkit-background-size", this.fit === "horizontal" ? "100% auto" : "auto 100%");
	}
});

enyo.kind({
	name:"com.tiqtech.pinterest.BoardThumb",
	kind:"Control",
	className:"board-thumb",
	published:{
		item:0
	},
	events:{
		onView:""
	},
	components:[
		{name:"name", kind:"Control", className:"name"},
		{kind:"HFlexBox", components:[
			{name:"img0", kind:"FitImage", className:"cover"},
			{className:"thumbs", components:[
				{name:"img1", kind:"FitImage"},
				{name:"img2", kind:"FitImage"},
				{name:"img3", kind:"FitImage"},
			]},
			// {className:"details", flex:1, components:[
				
			// 	{name:"desc", kind:"Control", className:"desc"}
			// ]}
		]}
	],
	create:function() {
		this.inherited(arguments);
		this.boardChanged();
	},
	boardChanged:function() {
		if(this.item) {
			this.$.name.setContent(this.item.name || "");
			// this.$.desc.setContent(this.item.description || "");

			// thumbnails
			if(this.item.thumbnails) {
				for(var i=0;i<4;i++) {
					if(this.item.thumbnails[i]) {
						this.$["img"+i].setSrc("http://media-cache"+(i+1)+".pinterest.com/"+this.item.thumbnails[i]);
					}
				}
			}
		}
	},
	formatNumber:function(n) {
		// for future formatting (e.g. 1000 -> 1k)
		return n;
	},
	clickHandler:function() {
		this.item && this.doView(this.item)
	}
});