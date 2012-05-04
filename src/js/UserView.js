enyo.kind({
	name:"com.tiqtech.pinterest.UserView",
	kind:"VFlexBox",
	height:"100%",
	published:{
		user:""
	},
	events:{
		onSelectBoard:""
	},
	components:[
		{kind:"HFlexBox", className:"user-info", components:[
			{name:"userImage", className:"photo", kind:"Image"},
			{kind:"VFlexBox", flex:1, components:[
				{name:"userName", className:"full-name"},
				{name:"userBio", className:"bio", flex:1},
				{className:"hbox social", components:[
					{name:"userFacebook", content:"f", onclick:"socialClicked", showing:false},
					{name:"userTwitter", content:"t", onclick:"socialClicked", showing:false},
					{name:"userWebsite", content:"w", onclick:"socialClicked", showing:false},
					{name:"userLocation", content:"l", showing:false}
				]}
			]},

		]},
		{kind:"BasicScroller", flex:1, horizontal:false, autoHorizontal:false, components:[
			{name:"userBoards", kind:"extras.Grid", cellWidth:217, cellHeight:148, align:"center"}
		]}
	],
	create:function() {
		this.inherited(arguments);
		this.userChanged();
	},
	userChanged:function() {
		if(!this.user) return;

		var u = this.user.user;
		this.$.userImage.setSrc(u.image_url);
		this.$.userName.setContent(u.full_name);
		this.$.userBio.setContent(u.about || "");

		this.setupSocial(this.$.userFacebook, u.facebook_link);
		this.setupSocial(this.$.userTwitter, u.twitter_link);
		this.setupSocial(this.$.userWebsite, u.website);
		this.setupSocial(this.$.userLocation, u.location);

		this.$.userBoards.destroyControls();
		var c = [];
		for(var i=0,b$=this.user.boards,b;b=b$[i];i++) {
			c.push({kind:"com.tiqtech.pinterest.BoardThumb", item:b, owner:this, index:i,  onView:"boardThumbClicked"});
		}

		this.$.userBoards.createComponents(c);
		this.$.userBoards.render();
	},
	setupSocial:function(control, url) {
		control.href = url;
		control.setShowing(!!url);
	},
	socialClicked:function(source) {
		source.href && window.open(source.href, "_blank");
	},
	boardThumbClicked:function(source) {
		source.item && this.doSelectBoard({item:source.item, index:source.index});
	},
	//resizeHandler:function() {
		//var w = enyo.fetchControlSize(this).w;
		//this.$.userBoards.setCellWidth()
	//}
})