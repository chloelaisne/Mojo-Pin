App.Router = Backbone.Router.extend({

	views: {},

	routes:
	{
		'news': 'news',

		""					: "news",
		"offline"			: "showOffline",

		"users"				: "users",
		"user/*user"		: "user",

		"edit/music"		: "editMusic",
		"edit/music/:uri"	: "editMusic",
		"edit/location"		: "editLocation",
		"edit/description"	: "editDescription"
	},

	initialize: function()
	{
		_.bindAll(this, 'showOnline', 'showOffline', 'setBody', 'news', 'users', 'user', 'editMusic', 'editLocation', 'editDescription');

		App.Events.on("StateChanged", this.setBody);

		this.views.app 				= new App.AppView({ el: $("body") });
		this.views.offline 			= new App.OfflineView({ el: $("body") });

		this.views.news = new App.NewsView();
		this.views.user = new App.UserView();
		this.views.friends = new App.FriendsView();

		this.views.editNavigation 	= new App.EditNavigationView();
		this.views.editMusic 		= new App.EditMusicView();
		this.views.editLocation 	= new App.EditLocationView();
		this.views.editDescription 	= new App.EditDescriptionView();

		this.bind("route:editMusic", this.views.editNavigation.render);
		this.bind("route:editLocation", this.views.editNavigation.render);
		this.bind("route:editDescription", this.views.editNavigation.render);

		this.showOnline();
	},

	setBody: function(state)
	{
		if(state == App.OFFLINE)
		{
			this.views.app.model.set({ classname: 'offline' });
        	this.view = this.views.offline;
        	this.view.render();
        	this.history = { back: Backbone.history.fragment };
        	this.navigate('showOffline', true);

		}
		else if(state == App.ONLINE)
		{
			this.views.app.model.set({ classname: '' });
			this.view = this.views.app;
        	this.view.render();
        	this.navigate(this.history.back, true);
		}
	},

	showOnline: function()
	{
		this.view = this.views.app;
        this.view.render();
	},

	showOffline: function()
	{
		
	},

	editMusic: function(uri)
	{
		if(uri != undefined)
			this.views.editMusic.music.set({ uri: uri });
		this.views.editMusic.render();
		$('#global').html(this.views.editMusic.el);
	},

	editLocation: function()
	{
		this.views.editLocation.render();
		$('#global').html(this.views.editLocation.el);
	},

	editDescription: function()
	{
		this.views.editDescription.render();
		$('#global').html(this.views.editDescription.el);
	},

	news: function()
	{
		this.views.editNavigation.unrender();

		this.views.news.render();
		$('#global').html(this.views.news.el);
	},

	users: function()
	{
		this.views.editNavigation.unrender();

		$('#global').html((this.views.friends.render()).el);
	},

	user: function()
	{
		this.views.editNavigation.unrender();

		this.views.user.render();
		$('#global').html(this.views.user.el);
	}

});