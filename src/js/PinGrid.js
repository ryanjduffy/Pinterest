enyo.kind({
	name:"com.tiqtech.pinterest.ItemGrid",
	kind:"Control",
	published:{
		items:"",
		more:false,
		includeTopSpacer:false
	},
	events:{
		onView:"",
		onMore:""
	},
	components:[
		{name:"resultScroller", kind:"BasicScroller", height:"100%", components:[
			{name:"spacer", className:"spacer", showing:false},
			{name:"grid", kind:"extras.Grid", cellWidth:0, cellHeight:0, margin:0, align:"center"},
		]},
	],
	create:function() {
		this.inherited(arguments);
		this.includeTopSpacerChanged();
		this.itemsChanged();
	},
	itemsChanged:function() {
		this.setupGrid();
	},
	moreChanged:function() {
		this.$.more && this.$.more.setShowing(this.more);
	},
	includeTopSpacerChanged:function() {
		this.$.spacer.setShowing(this.includeTopSpacer);
	},
	setupGrid:function() {
		this.$.resultScroller.scrollTo(0,0);
		this.$.grid.destroyControls();

		this.createThumbs(this.items, 0);
	},
	createThumbs:function(items, offset) {
		var c$ = [];
		for(var i=0;i<items.length;i++) {
			c$.push({kind:this.thumbKind, item:items[i], index:offset+i, onView:"itemClicked"});
		}

		// if owner says we have more (and we had any to start with ...)
		if(this.more && c$.length > 0) {
			c$.push({name:"more", kind:"Control", className:"result-thumb more", content:"More ...", onclick:"doMore"});
		}

		this.$.grid.createComponents(c$, {owner:this});
		this.$.grid.render();
	},
	addItems:function(items) {
		if(!items) return;

		this.$.more && this.$.more.destroy();		
		this.createThumbs(items, this.items.length);
	},
	clear:function() {
		this.setMore(false);
		this.setItems([]);
	},
	itemClicked:function(source) {
		this.doView({item:source.item, index:source.index});
	}
})

enyo.kind({
	name:"com.tiqtech.pinterest.BoardGrid",
	kind:"com.tiqtech.pinterest.ItemGrid",
	thumbKind:"com.tiqtech.pinterest.BoardThumb",
	create:function() {
		this.inherited(arguments);

		this.$.grid.cellWidth = 217;
		this.$.grid.cellHeight = 148;
	}
});

enyo.kind({
	name:"com.tiqtech.pinterest.PinGrid",
	kind:"com.tiqtech.pinterest.ItemGrid",
	thumbKind:"com.tiqtech.pinterest.PinThumb",
	create:function() {
		this.inherited(arguments);

		this.$.grid.cellWidth = 83;
		this.$.grid.cellHeight = 94;
		this.$.grid.margin = 3;
	}
});


enyo.kind({
	name:"com.tiqtech.pinterest.UserGrid",
	kind:"com.tiqtech.pinterest.PinGrid",
	thumbKind:"com.tiqtech.pinterest.UserThumb",
	create:function() {
		this.inherited(arguments);

		this.$.grid.cellWidth = 133;
		this.$.grid.cellHeight = 164;
		this.$.grid.margin = 5;
	}
});
