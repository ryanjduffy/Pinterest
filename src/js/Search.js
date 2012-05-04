enyo.kind({
	name:"com.tiqtech.pinterest.Search",
	kind:"Control",
	published:{
		query:""
	},
	events:{
		onViewPin:"",
		onViewBoard:"",
		onViewUser:""
	},
	components:[
		{name:"spinner", kind:"SpinnerLarge", className:"centered"},
		{name:"pins", kind:"com.tiqtech.pinterest.PinGrid", onMore:"moreClicked", includeTopSpacer:true, showing:false},
		{name:"boards", kind:"com.tiqtech.pinterest.BoardGrid", onMore:"moreClicked", onView:"doViewBoard", includeTopSpacer:true, showing:false},
		{name:"ps", kind:"PinterestService"}
	],
	items:[],
	queryChanged:function() {
		this.grid && this.grid.hide();
		this.$.spinner.show();
		switch(this.query.scope) {
			// case "people":
			// 	this.$.ps.findUsers(this.query.terms, 30, enyo.bind(this, "queryComplete", "users"));
			// 	break;
			case "pins":
				this.grid = this.$.pins;
				this.$.ps.findPins(this.query.terms, 30, enyo.bind(this, "queryComplete", "pins"));
				break;
			case "boards":
				this.grid = this.$.boards;
				this.$.ps.findBoards(this.query.terms, 30, enyo.bind(this, "queryComplete", "boards"));
				break;
		}

		this.grid.show();
		this.grid.clear();
	},
	queryComplete:function(items, source, results, request) {
		if(!results) return;

		this.results = results;

		this.grid.setMore(!!(results.pagination && results.pagination.next));
		if(this.moreResults) {
			this.grid.addItems(results[items]);
			this.moreResults = false;
		} else {
			this.grid.setItems(results[items]);
		}
		this.$.spinner.hide();
	},
	moreClicked:function() {
		this.$.spinner.show();
		this.moreResults = true;
		this.results.more();
	}
});
