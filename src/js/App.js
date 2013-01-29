enyo.kind({
	name:"com.tiqtech.pinterest.App",
	kind:"Control",
	className:"app",
	components:[
		{className:"header floating", onclick:"headerClicked", ondblclick:"headerFlicked", components:[
			{name:"logoWrapper", components:[
				{name:"logo", kind:"Image", src:"image/LogoRed.png"},
				{kind:"Control", className:"enyo-search-input-search search-button", onclick:"searchClicked"}
			]},
			{name:"queryWrapper", kind:"HFlexBox", className:"query-wrapper enyo-input enyo-tool-input", showing:false, components:[
				{name:"query", kind:"SearchInput", onblur:"queryBlurred", onCancel:"queryBlurred", onchange:"queryChanged", onkeypress:"queryKeyPressed", changeOnInput:true, keypressInputDelay:500, flex:1, style:"padding:0px", styled:false, selectAllOnFocus:true, alwaysLooksFocused:true, hint:"Search ..."},
				{name:"searchScope", kind: "ListSelector", value: "pins", onclick:"searchScopeClicked", onChange: "searchScopeChanged", className:"search-scope", items: [
			        {caption: "Pins", value: "pins"},
			        {caption: "Boards", value: "boards"},
			        {caption: "People", value: "people"},
			    ]}
			]}
		]},
		{name:"pane", kind:"Pane", className:"enyo-fit", components:[
			{name:"home", kind:"VFlexBox", components:[
				{className:"spacer"},
				{name:"userView", kind:"com.tiqtech.pinterest.UserView", onSelectBoard:"boardThumbClicked"}
			]},
			{name:"pinGrid", kind:"com.tiqtech.pinterest.PinGrid", onMore:"moreClicked", onView:"pinThumbClicked", includeTopSpacer:true, lazy:false},
			{name:"boardGrid", kind:"com.tiqtech.pinterest.BoardGrid", onMore:"moreClicked", onView:"boardThumbClicked", includeTopSpacer:true, lazy:false},
			{name:"userGrid", kind:"com.tiqtech.pinterest.UserGrid", onMore:"moreClicked", onView:"userThumbClicked", includeTopSpacer:true, lazy:false},
		]},
		{name:"pinViewer", kind:"com.tiqtech.pinterest.PinViewer"},
		{name:"spinner", kind:"SpinnerLarge", className:"centered"},
		{kind:"ApplicationEvents", onBack:"back"},
		{name:"ps", kind:"PinterestService"}
	],
	create:function() {
		this.inherited(arguments);

		this.userRetryCount = 0;
		enyo.asyncMethod(this, "getUser", "<Pinterest User Name ...>");
		this.history = [];
	},
	navigate:function(view, param) {
		var d;
		if(view) {
			d = {
				v:view,
				p:param
			};
			this.history.push(d);
		} else if(this.history.length > 0) {
			d = this.history[this.history.length-1];
		} else {
			d = {v:"home"}
		}
		
		switch(d.v) {
			case "home":
				this.$.pane.selectView(this.$.home);
				break;
			case "boards":
				this.showGrid(this.$.boardGrid, d);
				break;
			case "pins":
				this.showGrid(this.$.pinGrid, d);
				break;
			case "users":
				this.showGrid(this.$.userGrid, d);
				break;
			case "user":
				this.$.userView.setUser(param);
				this.$.pane.selectView(this.$.home);
				break;
		}
	},
	showGrid:function(grid, d) {
		grid.setMore(d.p.hasMore);
		grid[d.p.isMore ? "addItems" : "setItems"](d.p.items);
		this.$.pane.selectView(grid);
	},
	getUser:function(user) {
		this.spin(true);
		this.$.ps.getUser(user, 10, enyo.bind(this, "buildUser"));
	},
	buildUser:function(source, results, request) {
		if(results) {
			this.spin(false);
			this.navigate("user", results);
		} else if(this.userRetryCount++ < 3) {
			enyo.job("getUser", enyo.bind(this, "getUser"), 5000);
			enyo.windows.addBannerMessage("Unable to get user.  Trying again ...");
		} else {
			this.spin(false);
			enyo.windows.addBannerMessage("Unable to get user.  Try later.");
		}
	},
	headerFlicked:function(source, event) {
		this.history.pop();
		this.navigate();
	},
	back:function(source, event) {
		// hide pinViewer
		if(this.$.pinViewer.getShowing()) {
			this.$.pinViewer.hide();
			event.handled();
			return true;
		}

		// if we have any history (1 is from home), pop it and navigation
		if(this.history.length > 1) {
			this.history.pop();
			this.navigate();

			// only stop prop to OS if event is handled here
			event.handled();
		}
	},
	keypressHandler:function(source, event) {
		if(!this.$.queryWrapper.getShowing() && !this.$.query.hasFocus()) {
			this.searchClicked();
			this.$.query.setValue(String.fromCharCode(event.keyCode));
		}
	},
	searchClicked:function() {
		this.$.logoWrapper.hide();
		this.$.queryWrapper.show();
		this.$.query.forceFocus();
	},
	queryTypeClicked:function() {
		// cancel hiding query if user clicks type selector with no query text
		enyo.job.stop("cancelQuery");

		// reset focus (after showing selector)
		//this.$.query.forceFocus();
	},
	queryCancelled:function() {
		console.log("cancelled");
		this.$.logoWrapper.show();
		this.$.queryWrapper.hide();
	},
	queryBlurred:function() {
		if(this.$.query.getValue() === "") {
			enyo.job("cancelQuery", enyo.bind(this, "queryCancelled"), 250);
		}
	},
	queryKeyPressed:function(source, event) {
		if(event.keyCode === 13) {
			this.queryChanged();
		}
	},
	searchScopeChanged:function() {
		if(this.$.query.getValue() !== "") {
			this.newSearch();
		}

		this.$.query.forceFocus();
	},
	searchScopeClicked:function() {
		enyo.job.stop("cancelQuery");
	},
	queryChanged:function() {
		this.newSearch();
	},
	newSearch:function() {
		var scope = this.$.searchScope.getValue(),
			terms = this.$.query.getValue();
	
		this.spin(true);
		switch(scope) {
			case "people":
				this.$.ps.findUsers(terms, 30, enyo.bind(this, "queryComplete", "users"));
				break;
			case "pins":
				this.$.ps.findPins(terms, 30, enyo.bind(this, "queryComplete", "pins"));
				break;
			case "boards":
				this.$.ps.findBoards(terms, 30, enyo.bind(this, "queryComplete", "boards"));
				break;
		}
	},
	queryComplete:function(items, source, results, request) {
		if(!results) return;

		this.results = results;
		this.spin(false);
		this.navigate(items, {isMore:this.moreResults, hasMore:!!(results.pagination && results.pagination.next), items:results[items]});
	},
	moreClicked:function() {
		this.spin(true);
		this.moreResults = true;
		this.results.more();
	},
	pinThumbClicked:function(source, p) {
		this.$.pinViewer.showItems(this.$.pinGrid.getItems(), p.index);
	},
	boardThumbClicked:function(source, b) {
		// cancel previous retries on click
		this.showBoardRetryCount = 0;
		enyo.job.stop("boardThumbClicked");

		this.spin(true);
		this.$.ps.getBoard(b.item.url, 25, enyo.bind(this, "showBoardPins"));
	},
	userThumbClicked:function(source, u) {
		this.getUser(u.item.username);
	},
	showBoardPins:function(source, results, request) {
		if(results && results.pins) {
			this.spin(false);
			this.navigate("pins", {items:results.pins});
		} else if(this.showBoardRetryCount++ > 3) {
			enyo.windows.addBannerMessage("Unable to retrieve board.  Trying again ...");
			enyo.job("boardThumbClicked", enyo.bind(this, "boardThumbClicked"))
		} else {
			this.spin(false)
			enyo.windows.addBannerMessage("Unable to retrieve board.");
		}
	},
	spin:function(start) {
		var a = start ? "show" : "hide";
		this.$.spinner[a]();
		enyo.scrim[a]();
	}
})


/*
getPopularPins:function() {
		this.$.ps.getPopular(20, enyo.bind(this, "buildPopularPins"));
	},
	buildPopularPins:function(source, results, request) {
		if(results && results.pins) {
			this.popularResults = results.pins;

			var c$ = [];
			for(var i=0,n;n=results.pins[i];i++) {
				c$.push({kind:"com.tiqtech.pinterest.PinThumb", owner:this, index:i, pin:n, onclick:"popularPinClicked"});
			}

			this.$.popularScroller.createComponents(c$);
			this.$.popularScroller.render();
			this.popularAutoScroll();
		}
	},
	popularAutoScroll:function(duration) {
		duration = duration || 2000;
		//enyo.job("popularAutoScroll", enyo.bind(this, "scrollPopularPins"), duration);
	},
	scrollPopularPins:function() {
		this.$.popularScroller.next();
		this.popularAutoScroll();
	},
	popularPinsDown:function() {
		enyo.job.stop("popularAutoScroll");
	},
	popularPinsUp:function() {
		this.popularAutoScroll(5000);
	},
	popularPinClicked:function(source) {
		this.$.pinViewer.showItems(this.popularResults, source.index);
	},
	popularScrolled:function() {
		//if(!this.popularIndex)
	},
*/
