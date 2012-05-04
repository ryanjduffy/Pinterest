enyo.kind({
	name:"com.tiqtech.pinterest.Search",
	kind:"Control",
	className:"app",
	components:[
		{className:"header", components:[
			{name:"logoWrapper", components:[
				{name:"logo", kind:"Image", src:"image/LogoRed.png"},
				{kind:"Control", className:"enyo-search-input-search", style:"float:right", onclick:"searchClicked"}
			]},
			{name:"queryWrapper", kind:"HFlexBox", style:"height:100%", showing:false, components:[
				{content:"Boards/Pins", onclick:"queryTypeClicked", showing:false},
				{name:"query", kind:"SearchInput", onblur:"queryBlurred", onCancel:"queryCancelled", onchange:"queryChanged", changeOnInput:true, flex:1, style:"padding:0px", styled:false, selectAllOnFocus:true, alwaysLooksFocused:true, hint:"Search ..."}
			]}
		]},
		{name:"results", kind:"VirtualList", height:"100%", onSetupRow:"setupRow", components:[
			{name:"result", kind:"HFlexBox", onclick:"resultClicked", className:"result", style:"border-top:1px solid #aaa;border-bottom:1px solid #444;padding:0.5em;", components:[
				{name:"img", kind:"Image"},
				{name:"desc", className:"desc", kind:"Control", flex:1}
			]}
		]},
		{name:"ws", kind:"WebService", url:"https://api.pinterest.com/v2/search/pins/", contentType:"application/json", onSuccess:"callSuccess", onFailure:"callFailure"},,
		{name:"browser", kind:"PalmService", service:"palm://com.palm.applicationManager/", method:"launch"}
	],
	items:[],
	setupRow:function(source, index) {
		this.log(index);

		var n = this.items[index];
		if(n) {
			if(n.spacer) {
				this.$.result.addClass("spacer");
			} else {
				this.$.img.setSrc(n.images.thumbnail);
				this.$.result.href = n.source
				this.$.desc.setContent(n.description);
			}

			return true;
		}
	},
	searchClicked:function() {
		this.$.logoWrapper.hide();
		this.$.queryWrapper.show();
		this.$.query.forceFocus();
	},
	queryCancelled:function() {
		this.$.logoWrapper.show();
		this.$.queryWrapper.hide();
	},
	queryBlurred:function() {
		if(this.$.query.getValue() === "") {
			enyo.job("cancelQuery", enyo.bind(this, "queryCancelled", 250));
		}
	},
	queryChanged:function() {
		enyo.job("query", enyo.bind(this, function() {

			// clear results
			this.items = [];
			this.$.results.refresh();

			this.queryComplete(__items);
			//this.call("GET", {query:this.$.query.getValue()}, "queryComplete");
		}), 500);		
	},
	queryComplete:function(results) {
		if(!results) return;

		this.items = results.pins;
		//this.items.unshift({spacer:true});	// insert spacer

		this.$.results.refresh(1);
	},
	queryTypeClicked:function() {
		// cancel hiding query if user clicks type selector with no query text
		enyo.job.stop("cancelQuery");

		// reset focus (after showing selector)
		this.$.query.forceFocus();
	},
	resultClicked:function(source) {
		source.href && window.open(source.href); //this.$.browser.call({id:"com.palm.app.browser", params:{target:source.href}});
	},
    call:function(method, data, successEvent) {
    	this.$.ws.setMethod(method);
    	var request = this.$.ws.call(data);
    	request.__callback = successEvent;
    },
    callSuccess:function(source, response, request) {
    	this[request.__callback](response);
    },
    callFailure:function(source, response, request) {
    	enyo.log("error", response);
    },
});

var __items = {pins:[{spacer:true},{"domain":"etsy.com","description":"Dachshund Card","user":{"username":"lolap","is_following":null,"full_name":"Lola Phillips","image_url":"http://graph.facebook.com/744745540/picture?type=square","id":"106679222331768855","image_large_url":"http://graph.facebook.com/744745540/picture?type=large"},"images":{"mobile":"http://media-cache.pinterest.com/upload/106679084892836313_jEpu0yuT_f.jpg","closeup":"http://media-cache.pinterest.com/upload/106679084892836313_jEpu0yuT_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/106679084892836313_jEpu0yuT_t.jpg","board":"http://media-cache.pinterest.com/upload/106679084892836313_jEpu0yuT_b.jpg"},"counts":{"repins":28,"comments":0,"likes":2},"id":"106679084892836313","sizes":{"mobile":{"width":570,"height":486},"board":{"height":163}},"created_at":"2011-06-11T15:07:14","comments":[],"is_repin":false,"source":"http://www.etsy.com/listing/65243655/dachshund-card-wiener?ref=sr_gallery_11&ga_search_submit=&ga_search_query=dachshund&ga_page=3&ga_search_type=all&ga_facet=","board":{"category":"design","user_id":"106679222331768855","description":"","url":"/lolap/conversational-novelty/","is_following":null,"id":"106679153612295189","name":"Conversational & Novelty"},"is_video":false},{"description":"Dachshund ","user":{"username":"sarahfergione","is_following":null,"full_name":"Sarah Fergione","image_url":"http://media-cache.pinterest.com/avatars/sarahfergione-33.jpg","id":"80431680753500491","image_large_url":"http://media-cache.pinterest.com/avatars/sarahfergione-33_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/80431543314582026_KSwC4ZJi_f.jpg","closeup":"http://media-cache.pinterest.com/upload/80431543314582026_KSwC4ZJi_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/80431543314582026_KSwC4ZJi_t.jpg","board":"http://media-cache.pinterest.com/upload/80431543314582026_KSwC4ZJi_b.jpg"},"counts":{"repins":35,"comments":0,"likes":6},"id":"80431543314582026","sizes":{"mobile":{"width":600,"height":600},"board":{"height":192}},"created_at":"2011-09-10T05:19:48","comments":[],"is_repin":false,"board":{"category":"People","user_id":"80431680753500491","description":"","url":"/sarahfergione/people-animals/","is_following":null,"id":"80431612034025994","name":"People & Animals"},"is_video":false},{"domain":"dailypuppy.com","description":"Baby Mini Dachshund...","user":{"username":"sarahdesiree","is_following":null,"full_name":"Sarah Desiree","image_url":"http://media-cache.pinterest.com/avatars/sarahdesiree-31.jpg","id":"252905472732957755","image_large_url":"http://media-cache.pinterest.com/avatars/sarahdesiree-31_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/252905335294603259_BCvpZVOc_f.jpg","closeup":"http://media-cache.pinterest.com/upload/252905335294603259_BCvpZVOc_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/252905335294603259_BCvpZVOc_t.jpg","board":"http://media-cache.pinterest.com/upload/252905335294603259_BCvpZVOc_b.jpg"},"counts":{"repins":2,"comments":0,"likes":0},"id":"252905335294603259","sizes":{"mobile":{"width":450,"height":441},"board":{"height":188}},"created_at":"2012-03-23T01:24:51","comments":[],"is_repin":false,"source":"http://www.dailypuppy.com/puppies/savannah-mae-the-mini-dachshund_2007-12-03","board":{"category":"pets","user_id":"252905472732957755","description":"","url":"/sarahdesiree/can-i-get-a-puppy/","is_following":null,"id":"252905404013510888","name":"Can I Get A Puppy?"},"is_video":false},{"domain":"dollmaker.nunodoll.com","description":"dachshund softie pattern","user":{"username":"wellsa","is_following":null,"full_name":"Andrea Wells","image_url":"http://media-cache.pinterest.com/avatars/wellsa-61.jpg","id":"35958634433216579","image_large_url":"http://media-cache.pinterest.com/avatars/wellsa-61_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/35958496994304646_kzeNR9kb_f.jpg","closeup":"http://media-cache.pinterest.com/upload/35958496994304646_kzeNR9kb_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/35958496994304646_kzeNR9kb_t.jpg","board":"http://media-cache.pinterest.com/upload/35958496994304646_kzeNR9kb_b.jpg"},"counts":{"repins":4,"comments":0,"likes":3},"id":"35958496994304646","sizes":{"mobile":{"width":350,"height":370},"board":{"height":202}},"created_at":"2011-09-21T13:10:13","comments":[],"is_repin":false,"source":"http://dollmaker.nunodoll.com/dog/dachshund.html","board":{"category":"diy_crafts","user_id":"35958634433216579","description":"","url":"/wellsa/kids/","is_following":null,"id":"35958565713740504","name":"kids"},"is_video":false},{"domain":"midwestdachshundfestival.com","description":"I want to go to the Midwest Dachshund Festival!","user":{"username":"loushea","is_following":null,"full_name":"LouShea","image_url":"http://media-cache.pinterest.com/avatars/loushea-55.jpg","id":"37225271828414470","image_large_url":"http://media-cache.pinterest.com/avatars/loushea-55_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/37225134389494652_0hdMHTgw_f.jpg","closeup":"http://media-cache.pinterest.com/upload/37225134389494652_0hdMHTgw_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/37225134389494652_0hdMHTgw_t.jpg","board":"http://media-cache.pinterest.com/upload/37225134389494652_0hdMHTgw_b.jpg"},"counts":{"repins":2,"comments":0,"likes":0},"id":"37225134389494652","sizes":{"mobile":{"width":600,"height":458},"board":{"height":146}},"created_at":"2011-09-11T15:51:24","comments":[],"is_repin":false,"source":"http://www.midwestdachshundfestival.com/","board":{"category":"Other","user_id":"37225271828414470","description":"","url":"/loushea/awesomeness/","is_following":null,"id":"37225203108938023","name":"Awesome"},"is_video":false},{"description":"by catherine ledner - love this dachshund!","user":{"username":"claudia_g","is_following":null,"full_name":"Claudia Grimaldi","image_url":"http://media-cache.pinterest.com/avatars/claudia_g-92.jpg","id":"94716535821566261","image_large_url":"http://media-cache.pinterest.com/avatars/claudia_g-92_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/94716398382654188_beib6Et3_f.jpg","closeup":"http://media-cache.pinterest.com/upload/94716398382654188_beib6Et3_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/94716398382654188_beib6Et3_t.jpg","board":"http://media-cache.pinterest.com/upload/94716398382654188_beib6Et3_b.jpg"},"counts":{"repins":9,"comments":0,"likes":0},"id":"94716398382654188","sizes":{"mobile":{"width":297,"height":405},"board":{"height":261}},"created_at":"2011-08-24T08:08:30","comments":[],"is_repin":false,"board":{"category":"","user_id":"94716535821566261","description":"","url":"/claudia_g/images/","is_following":null,"id":"94716467102089362","name":"Images"},"is_video":false},{"domain":"etsy.com","description":"Dachshund","user":{"username":"Adelle","is_following":null,"full_name":"Elizabeth Westerman","image_url":"http://media-cache.pinterest.com/avatars/Adelle-55.jpg","id":"220254375434518697","image_large_url":"http://media-cache.pinterest.com/avatars/Adelle-55_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/220254237995604450_gbRZsZVF_f.jpg","closeup":"http://media-cache.pinterest.com/upload/220254237995604450_gbRZsZVF_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/220254237995604450_gbRZsZVF_t.jpg","board":"http://media-cache.pinterest.com/upload/220254237995604450_gbRZsZVF_b.jpg"},"counts":{"repins":140,"comments":0,"likes":14},"id":"220254237995604450","sizes":{"mobile":{"width":400,"height":500},"board":{"height":240}},"created_at":"2011-09-19T06:59:00","comments":[],"is_repin":false,"source":"http://www.etsy.com/listing/16226850/dachshund-dog-art-signed-print-by-ron?ref=af_new_item","board":{"category":"pets","user_id":"220254375434518697","description":"a collection of photos and paintings","url":"/Adelle/it-s-raining-cats-dogs/","is_following":null,"id":"220254306715045080","name":"It's Raining Cats & Dogs"},"is_video":false},{"domain":"google.com","description":"Dachshund puppies","user":{"username":"hilhug","is_following":null,"full_name":"Hilarie Hughes","image_url":"http://media-cache.pinterest.com/avatars/hilhug-72.jpg","id":"119345596283748531","image_large_url":"http://media-cache.pinterest.com/avatars/hilhug-72_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/119345458844825309_gm02mr9A_f.jpg","closeup":"http://media-cache.pinterest.com/upload/119345458844825309_gm02mr9A_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/119345458844825309_gm02mr9A_t.jpg","board":"http://media-cache.pinterest.com/upload/119345458844825309_gm02mr9A_b.jpg"},"counts":{"repins":22,"comments":0,"likes":2},"id":"119345458844825309","sizes":{"mobile":{"width":400,"height":303},"board":{"height":145}},"created_at":"2011-08-21T23:17:17","comments":[],"is_repin":false,"source":"http://www.google.com/imgres?q=vintage+puppies&hl=en&biw=1024&bih=596&gbv=2&tbm=isch&tbnid=XOVU19p3y1YYEM:&imgrefurl=http://dachshundlove.blogspot.com/2008/06/dachshund-poetry-puppy-owners-lament.html&docid=e2440DDZ3mWsAM&w=400&h=303&ei=TfRRTtCALdHRiAKc1-CTAQ&zoom=1&iact=rc&dur=656&page=1&tbnh=140&tbnw=194&start=0&ndsp=15&ved=1t:429,r:4,s:0&tx=71&ty=92","board":{"category":"photography","user_id":"119345596283748531","description":"","url":"/hilhug/cuteness/","is_following":null,"id":"119345527564273850","name":"Cuteness"},"is_video":false},{"domain":"green-gardener.net","description":"Dachshund adopts baby pigs. ","user":{"username":"emilisa","is_following":null,"full_name":"Emily Flygare","image_url":"http://media-cache.pinterest.com/avatars/emilisa-55.jpg","id":"158752093023240258","image_large_url":"http://media-cache.pinterest.com/avatars/emilisa-55_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/158751955584295503_ToW1OyUz_f.jpg","closeup":"http://media-cache.pinterest.com/upload/158751955584295503_ToW1OyUz_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/158751955584295503_ToW1OyUz_t.jpg","board":"http://media-cache.pinterest.com/upload/158751955584295503_ToW1OyUz_b.jpg"},"counts":{"repins":21,"comments":0,"likes":0},"id":"158751955584295503","sizes":{"mobile":{"width":600,"height":582},"board":{"height":186}},"created_at":"2011-06-19T19:04:55","comments":[],"is_repin":false,"source":"http://www.green-gardener.net/2010/11/dachshund-adopted-pig.html","board":{"category":"hodgepodge","user_id":"158752093023240258","description":"","url":"/emilisa/i-am-now-dying-of-cuteness/","is_following":null,"id":"158752024303763959","name":"I am now dying of cuteness."},"is_video":false},{"domain":"rmcrayne.hubpages.com","description":"So You’re Thinking About Rescuing a Dachshund?  Some Things You Might Want to Know","user":{"username":"cookwrite","is_following":null,"full_name":"Shelly McRae","image_url":"http://media-cache.pinterest.com/avatars/cookwrite-12.jpg","id":"105764428657462980","image_large_url":"http://media-cache.pinterest.com/avatars/cookwrite-12_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/105764291219150181_vI35GbwK_f.jpg","closeup":"http://media-cache.pinterest.com/upload/105764291219150181_vI35GbwK_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/105764291219150181_vI35GbwK_t.jpg","board":"http://media-cache.pinterest.com/upload/105764291219150181_vI35GbwK_b.jpg"},"counts":{"repins":2,"comments":0,"likes":1},"id":"105764291219150181","sizes":{"mobile":{"width":600,"height":448},"board":{"height":143}},"created_at":"2012-03-27T15:57:16","comments":[],"is_repin":false,"source":"http://rmcrayne.hubpages.com/hub/Rescuing-a-Dachshund-Things-to-Know","board":{"category":"","user_id":"105764428657462980","description":"","url":"/cookwrite/kittens-puppies-and-other-cute-animals/","is_following":null,"id":"105764359938017698","name":"Kittens, puppies and other cute animals"},"is_video":false},{"domain":"rischa.typepad.com","description":"...this one's mine. Her name is Penny. #Dachshund #Dog #Doxie #Funny","user":{"username":"rischa","is_following":null,"full_name":"Rischa Heape","image_url":"http://graph.facebook.com/1238952147/picture?type=square","id":"153615174698270743","image_large_url":"http://graph.facebook.com/1238952147/picture?type=large"},"images":{"mobile":"http://media-cache.pinterest.com/upload/153615037259317683_trup2CDy_f.jpg","closeup":"http://media-cache.pinterest.com/upload/153615037259317683_trup2CDy_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/153615037259317683_trup2CDy_t.jpg","board":"http://media-cache.pinterest.com/upload/153615037259317683_trup2CDy_b.jpg"},"counts":{"repins":53,"comments":0,"likes":11},"id":"153615037259317683","sizes":{"mobile":{"width":500,"height":591},"board":{"height":226}},"created_at":"2011-03-11T12:32:26","comments":[],"is_repin":false,"source":"http://www.rischa.typepad.com/rischas_rants_raves_and_r/page/11/","board":{"category":"Dogs","user_id":"153615174698270743","description":"","url":"/rischa/dachshunds/","is_following":null,"id":"153615105978797378","name":"Dachshunds"},"is_video":false},{"domain":"amazon.com","description":"Picasso and his dachshund, Lump","user":{"username":"claudette","is_following":null,"full_name":"Claudette Garley-Rottkamp","image_url":"http://media-cache.pinterest.com/avatars/Claudette-7.jpg","id":"23784841690480656","image_large_url":"http://media-cache.pinterest.com/avatars/Claudette-7_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/23784704251527347_BOA8ZwwZ_f.jpg","closeup":"http://media-cache.pinterest.com/upload/23784704251527347_BOA8ZwwZ_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/23784704251527347_BOA8ZwwZ_t.jpg","board":"http://media-cache.pinterest.com/upload/23784704251527347_BOA8ZwwZ_b.jpg"},"counts":{"repins":22,"comments":0,"likes":2},"id":"23784704251527347","sizes":{"mobile":{"width":300,"height":300},"board":{"height":192}},"created_at":"2011-01-30T16:54:23","comments":[],"is_repin":false,"source":"http://www.amazon.com/Picasso-Lump-David-Douglas-Duncan/dp/0821258109","board":{"category":"me","user_id":"23784841690480656","description":"","url":"/claudette/dachshund/","is_following":null,"id":"23784772971004620","name":"Dachshund"},"is_video":false},{"domain":"dachshundlove.blogspot.com","description":"Wire-Haired Dachshund","user":{"username":"skmercado","is_following":null,"full_name":"Sarina Mercado","image_url":"http://media-cache.pinterest.com/avatars/skmercado_1331188652.jpg","id":"64598713313529398","image_large_url":"http://media-cache.pinterest.com/avatars/skmercado_1331188652_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/64598575875143291_HPf4mD5k_f.jpg","closeup":"http://media-cache.pinterest.com/upload/64598575875143291_HPf4mD5k_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/64598575875143291_HPf4mD5k_t.jpg","board":"http://media-cache.pinterest.com/upload/64598575875143291_HPf4mD5k_b.jpg"},"counts":{"repins":3,"comments":0,"likes":0},"id":"64598575875143291","sizes":{"mobile":{"width":200,"height":278},"board":{"height":266}},"created_at":"2012-03-18T07:54:40","comments":[],"is_repin":false,"source":"http://dachshundlove.blogspot.com/2007/11/dachshunds-in-pop-culture-andy-warhol.html","board":{"category":"other","user_id":"64598713313529398","description":"","url":"/skmercado/weinerland/","is_following":null,"id":"64598644594081508","name":"Weinerland"},"is_video":false},{"domain":"bit.ly","description":"I found my dog!!! Long hair Dachshund!! Adorable!! http://media-cache4.pinterest.com/upload/152770612329782307_Kdrf02F9_f.jpg ellebella84 cute like puppies","user":{"username":"lazytyrant24","is_following":null,"full_name":"Arlene Jensen","image_url":"http://media-cache.pinterest.com/avatars/lazytyrant24-16.jpg","id":"89016667543178082","image_large_url":"http://media-cache.pinterest.com/avatars/lazytyrant24-16_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/89016530104817054_305p06Os_f.jpg","closeup":"http://media-cache.pinterest.com/upload/89016530104817054_305p06Os_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/89016530104817054_305p06Os_t.jpg","board":"http://media-cache.pinterest.com/upload/89016530104817054_305p06Os_b.jpg"},"counts":{"repins":5,"comments":0,"likes":1},"id":"89016530104817054","sizes":{"mobile":{"width":400,"height":300},"board":{"height":144}},"created_at":"2012-03-23T04:31:36","comments":[],"is_repin":false,"source":"http://bit.ly/GMXZzw","board":{"category":"other","user_id":"89016667543178082","description":"","url":"/lazytyrant24/someecards/","is_following":null,"id":"89016598823731454","name":"someecards"},"is_video":false},{"domain":"ravelry.com","description":"dachshund","user":{"username":"sjaym","is_following":null,"full_name":"Sarah Mellor","image_url":"http://media-cache.pinterest.com/avatars/sjaym_1330381556.jpg","id":"157274349395509249","image_large_url":"http://media-cache.pinterest.com/avatars/sjaym_1330381556_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/157274211956566013_qFdEcgVE_f.jpg","closeup":"http://media-cache.pinterest.com/upload/157274211956566013_qFdEcgVE_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/157274211956566013_qFdEcgVE_t.jpg","board":"http://media-cache.pinterest.com/upload/157274211956566013_qFdEcgVE_b.jpg"},"counts":{"repins":13,"comments":0,"likes":3},"id":"157274211956566013","sizes":{"mobile":{"width":600,"height":376},"board":{"height":120}},"created_at":"2011-04-04T22:30:19","comments":[],"is_repin":false,"source":"http://www.ravelry.com/patterns/library/perfect-pups-dachshund","board":{"category":"diy_crafts","user_id":"157274349395509249","description":"","url":"/sjaym/knit/","is_following":null,"id":"157274280676032712","name":"Knit"},"is_video":false},{"domain":"hotdogblog.com","description":"cannibal #dachshund? XD","user":{"username":"rawcookies","is_following":null,"full_name":"Meg Ookami","image_url":"http://media-cache.pinterest.com/avatars/rawcookies-73.jpg","id":"270849502498259206","image_large_url":"http://media-cache.pinterest.com/avatars/rawcookies-73_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/270849365059328034_fAUBnHyP_f.jpg","closeup":"http://media-cache.pinterest.com/upload/270849365059328034_fAUBnHyP_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/270849365059328034_fAUBnHyP_t.jpg","board":"http://media-cache.pinterest.com/upload/270849365059328034_fAUBnHyP_b.jpg"},"counts":{"repins":34,"comments":0,"likes":9},"id":"270849365059328034","sizes":{"mobile":{"width":554,"height":431},"board":{"height":149}},"created_at":"2011-08-14T11:39:20","comments":[],"is_repin":false,"source":"http://hotdogblog.com/modules/xcgal/displayimage.php?pid=1833&album=topn&cat=1&pos=1","board":{"category":"photography","user_id":"270849502498259206","description":"(⌒∪⌒)\r\nThings that make you go squeeeeeee\r\n","url":"/rawcookies/death-by-cuteness/","is_following":null,"id":"270849433778782303","name":"DEATH BY CUTENESS"},"is_video":false},{"domain":"google.ie","description":"Miniture Dachshund","user":{"username":"sally_moynihan","is_following":null,"full_name":"Sally Moynihan","image_url":"http://media-cache.pinterest.com/avatars/sally_moynihan-0.jpg","id":"9148142901526543","image_large_url":"http://media-cache.pinterest.com/avatars/sally_moynihan-0_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/9148005462587615_kUraSjHG_f.jpg","closeup":"http://media-cache.pinterest.com/upload/9148005462587615_kUraSjHG_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/9148005462587615_kUraSjHG_t.jpg","board":"http://media-cache.pinterest.com/upload/9148005462587615_kUraSjHG_b.jpg"},"counts":{"repins":68,"comments":0,"likes":4},"id":"9148005462587615","sizes":{"mobile":{"width":480,"height":272},"board":{"height":108}},"created_at":"2011-06-02T14:28:03","comments":[],"is_repin":false,"source":"http://www.google.ie/imgres?imgurl=http://www.freepspwallpaper.org/wp-content/uploads/2009/09/Miniature-Dachshund-wallpaper.jpg&imgrefurl=http://www.freepspwallpaper.org/animals/miniature-dachshund-psp-wallpaper.html&usg=__kJeIPi0s5OqhGSGP1sxd0JLHSpY=&h=272&w=480&sz=33&hl=en&start=0&zoom=1&tbnid=NjNMiBVXSDom1M:&tbnh=84&tbnw=148&ei=CQDoTayeO4O1hAfmtvDHCg&prev=/search%3Fq%3Dminiature%2Bdachshund%26um%3D1%26hl%3Den%26client%3Dfirefox-a%26rls%3Dorg.mozilla:en-GB:official%26biw%3D1352%26bih%3D549%26tbm%3Disch&um=1&itbs=1&iact=hc&vpx=93&vpy=248&dur=716&hovh=169&hovw=298&tx=183&ty=102&page=1&ndsp=23&ved=1t:429,r:7,s:0&biw=1352&bih=549","board":{"category":"science","user_id":"9148142901526543","description":"","url":"/sally_moynihan/puppy-wuppy/","is_following":null,"id":"9148074182050668","name":"Puppy Wuppy"},"is_video":false},{"domain":"tappocity.com","description":"Dachshund Vs. Penguin http://media-cache7.pinterest.com/upload/85005511686646282_WWgeYrDY_f.jpg www.tappocity.com andrewgirdwood Tappocity.com weird animal videos","user":{"username":"thomarv32","is_following":null,"full_name":"Amanda Wilkes","image_url":"http://media-cache.pinterest.com/avatars/thomarv32_1332031940.jpg","id":"267612540266090275","image_large_url":"http://media-cache.pinterest.com/avatars/thomarv32_1332031940_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/267612402827800791_mROcNfNj_f.jpg","closeup":"http://media-cache.pinterest.com/upload/267612402827800791_mROcNfNj_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/267612402827800791_mROcNfNj_t.jpg","board":"http://media-cache.pinterest.com/upload/267612402827800791_mROcNfNj_b.jpg"},"counts":{"repins":1,"comments":0,"likes":0},"id":"267612402827800791","sizes":{"mobile":{"width":480,"height":360},"board":{"height":144}},"created_at":"2012-03-27T06:52:44","comments":[],"is_repin":false,"source":"http://www.tappocity.com","board":{"category":"other","user_id":"267612540266090275","description":"","url":"/thomarv32/kids-must-have-s/","is_following":null,"id":"267612471546643141","name":"kids must have s"},"is_video":false},{"domain":"google.com","description":"dachshund self portrait","user":{"username":"laura_kennedy","is_following":null,"full_name":"Laura Kennedy","image_url":"http://media-cache.pinterest.com/avatars/laura_kennedy_1328614515.jpg","id":"229402312177615069","image_large_url":"http://media-cache.pinterest.com/avatars/laura_kennedy_1328614515_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/229402174738694478_aKFfDCgo_f.jpg","closeup":"http://media-cache.pinterest.com/upload/229402174738694478_aKFfDCgo_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/229402174738694478_aKFfDCgo_t.jpg","board":"http://media-cache.pinterest.com/upload/229402174738694478_aKFfDCgo_b.jpg"},"counts":{"repins":24,"comments":0,"likes":4},"id":"229402174738694478","sizes":{"mobile":{"width":375,"height":500},"board":{"height":256}},"created_at":"2011-09-05T20:14:22","comments":[],"is_repin":false,"source":"http://www.google.com/imgres?q=dachshund+art&hl=en&client=safari&rls=en&biw=1243&bih=698&tbm=isch&tbnid=kRysf0UiLpdX1M:&imgrefurl=http://dreamdogsart.typepad.com/art/2009/02/dachshund-self-portrait-by-ken-bailey.html&docid=76Z-aCo7Zf7fCM&w=375&h=500&ei=VJBlTvXhAuPD0AGA9umOCg&zoom=1&iact=hc&vpx=615&vpy=264&dur=755&hovh=259&hovw=194&tx=92&ty=70&page=2&tbnh=171&tbnw=128&start=19&ndsp=19&ved=1t:429,r:9,s:19","board":{"category":"Animals","user_id":"229402312177615069","description":"","url":"/laura_kennedy/hot-dogs/","is_following":null,"id":"229402243458139747","name":"hot dogs..."},"is_video":false},{"description":"Hiding dachshund","user":{"username":"lisalarter","is_following":null,"full_name":"Lisa Larter","image_url":"http://media-cache.pinterest.com/avatars/lisalarter_1327860428.jpg","id":"276901214497539715","image_large_url":"http://media-cache.pinterest.com/avatars/lisalarter_1327860428_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/276901077059172949_CqNst1r6_f.jpg","closeup":"http://media-cache.pinterest.com/upload/276901077059172949_CqNst1r6_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/276901077059172949_CqNst1r6_t.jpg","board":"http://media-cache.pinterest.com/upload/276901077059172949_CqNst1r6_b.jpg"},"counts":{"repins":4,"comments":0,"likes":1},"id":"276901077059172949","sizes":{"mobile":{"width":600,"height":600},"board":{"height":192}},"created_at":"2012-03-16T02:24:49","comments":[],"is_repin":false,"board":{"category":"pets","user_id":"276901214497539715","description":"My daily dog photo can be found here. Love my Dachshunds and love to take pictures of them! ","url":"/lisalarter/pets/","is_following":null,"id":"276901145778075924","name":"Pets"},"is_video":false},{"domain":"wayfair.com","description":"Cat Dachshund Cat Scratcher lounge - $25.99 ---- fun","price":{"type":"$","value":25.99},"user":{"username":"grayceblair","is_following":null,"full_name":"Grayce Blair","image_url":"http://media-cache.pinterest.com/avatars/grayceblair_1328013347.jpg","id":"273875358497900804","image_large_url":"http://media-cache.pinterest.com/avatars/grayceblair_1328013347_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/273875221059583209_BLh54r72_f.jpg","closeup":"http://media-cache.pinterest.com/upload/273875221059583209_BLh54r72_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/273875221059583209_BLh54r72_t.jpg","board":"http://media-cache.pinterest.com/upload/273875221059583209_BLh54r72_b.jpg"},"counts":{"repins":1,"comments":0,"likes":0},"id":"273875221059583209","sizes":{"mobile":{"width":325,"height":325},"board":{"height":192}},"created_at":"2012-03-24T21:09:01","comments":[],"is_repin":false,"source":"http://www.wayfair.com/Imperial-Cat-Dachshund-Cat-Scratcher-00186B-IPC1004.html?SSAID=352603&refid=SS352603","board":{"category":"","user_id":"273875358497900804","description":"","url":"/grayceblair/i-don-t-know-where-to-pin-this/","is_following":null,"id":"273875289778456186","name":"I don't know where to pin this"},"is_video":false},{"domain":"etsy.com","description":"Wiener Dog Dachshund Pillow  Doxie and Owl by persnicketypelican, $26.50  @Debbie Facemire","price":{"type":"$","value":26.5},"user":{"username":"dariasmum87","is_following":null,"full_name":"Lindsey Russell","image_url":"http://media-cache.pinterest.com/avatars/dariasmum87-57.jpg","id":"164592698789988363","image_large_url":"http://media-cache.pinterest.com/avatars/dariasmum87-57_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/164592561351688142_G8n1Qqg0_f.jpg","closeup":"http://media-cache.pinterest.com/upload/164592561351688142_G8n1Qqg0_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/164592561351688142_G8n1Qqg0_t.jpg","board":"http://media-cache.pinterest.com/upload/164592561351688142_G8n1Qqg0_b.jpg"},"counts":{"repins":1,"comments":0,"likes":0},"id":"164592561351688142","sizes":{"mobile":{"width":570,"height":428},"board":{"height":144}},"created_at":"2012-03-19T08:01:22","comments":[],"is_repin":false,"source":"http://www.etsy.com/listing/83188187/wiener-dog-dachshund-pillow-doxie-and?utm_source=Pinterest&utm_medium=PageTools&utm_campaign=Share","board":{"category":"mylife","user_id":"164592698789988363","description":"","url":"/dariasmum87/things-i-love/","is_following":null,"id":"164592630070527749","name":"Things I Love"},"is_video":false},{"domain":"dachshund.trainingcare.net","description":"Dachshund puppy","user":{"username":"A_Biddy","is_following":null,"full_name":"Adriana Bidasio","image_url":"http://media-cache.pinterest.com/avatars/A_Biddy-54.jpg","id":"26177378992521500","image_large_url":"http://media-cache.pinterest.com/avatars/A_Biddy-54_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/26177241553601305_fiP7i4HS_f.jpg","closeup":"http://media-cache.pinterest.com/upload/26177241553601305_fiP7i4HS_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/26177241553601305_fiP7i4HS_t.jpg","board":"http://media-cache.pinterest.com/upload/26177241553601305_fiP7i4HS_b.jpg"},"counts":{"repins":172,"comments":0,"likes":19},"id":"26177241553601305","sizes":{"mobile":{"width":420,"height":518},"board":{"height":236}},"created_at":"2011-09-06T15:54:32","comments":[],"is_repin":false,"source":"http://dachshund.trainingcare.net/wp-content/blogs.dir/11/files/pics/dachshund-51.jpg","board":{"category":"me","user_id":"26177378992521500","description":"maybe some day...","url":"/A_Biddy/wish-list/","is_following":null,"id":"26177310273045564","name":"Wish List"},"is_video":false},{"domain":"flickr.com","description":"Dachshund Lipstick print","user":{"username":"loushea","is_following":null,"full_name":"LouShea","image_url":"http://media-cache.pinterest.com/avatars/loushea-55.jpg","id":"37225271828414470","image_large_url":"http://media-cache.pinterest.com/avatars/loushea-55_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/37225134389494678_Ro7kxODD_f.jpg","closeup":"http://media-cache.pinterest.com/upload/37225134389494678_Ro7kxODD_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/37225134389494678_Ro7kxODD_t.jpg","board":"http://media-cache.pinterest.com/upload/37225134389494678_Ro7kxODD_b.jpg"},"counts":{"repins":14,"comments":0,"likes":2},"id":"37225134389494678","sizes":{"mobile":{"width":500,"height":522},"board":{"height":200}},"created_at":"2011-09-11T15:25:21","comments":[],"is_repin":false,"source":"http://www.flickr.com/photos/okimi/6109142987/in/photostream","board":{"category":"pets","user_id":"37225271828414470","description":"","url":"/loushea/dachshunds/","is_following":null,"id":"37225203108962663","name":"Dachshunds!"},"is_video":false},{"description":"Bonus pic. Hope everyone had green St. Patrick’s Day! http://wp.me/p27Fw1-aF #dachshund #doxies","user":{"username":"jorteztibbels","is_following":null,"full_name":"Johnny Ortez-Tibbels","image_url":"http://media-cache.pinterest.com/avatars/jorteztibbels_1329337558.jpg","id":"169025929673182060","image_large_url":"http://media-cache.pinterest.com/avatars/jorteztibbels_1329337558_o.jpg"},"images":{"mobile":"http://media-cache.pinterest.com/upload/169025792234778987_b4G9GJkx_f.jpg","closeup":"http://media-cache.pinterest.com/upload/169025792234778987_b4G9GJkx_c.jpg","thumbnail":"http://media-cache.pinterest.com/upload/169025792234778987_b4G9GJkx_t.jpg","board":"http://media-cache.pinterest.com/upload/169025792234778987_b4G9GJkx_b.jpg"},"counts":{"repins":0,"comments":0,"likes":1},"id":"169025792234778987","sizes":{"mobile":{"width":600,"height":600},"board":{"height":192}},"created_at":"2012-03-18T18:31:29","comments":[],"is_repin":false,"board":{"category":"pets","user_id":"169025929673182060","description":"","url":"/jorteztibbels/i-love-dachshunds/","is_following":null,"id":"169025860953726760","name":"I love dachshunds."},"is_video":false}]};