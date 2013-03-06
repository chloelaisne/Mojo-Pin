App.Router = Backbone.Router.extend({

	views: {},

	routes:
	{
		'news': 'news',

		""					: "edit",
		"offline"			: "showOffline",

		"users"				: "users",
		"user/*user"		: "user",

		"edit/*action"		: "edit"
	},

	initialize: function()
	{
		_.bindAll(this, 'showOnline', 'showOffline', 'setBody', 'news', 'users', 'user', 'edit');

		App.Events.on("StateChanged", this.setBody);

		this.views.app 				= new App.AppView({ el: $("body") });
		this.views.offline 			= new App.OfflineView({ el: $("body") });

		this.views.news = new App.NewsView();
		this.views.user = new App.UserView();
		this.views.friends = new App.FriendsView();

		this.views.edit				= new App.EditView();

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

	edit: function(action)
	{
		$('#global').html((this.views.edit.render()).el);
	},

	news: function()
	{
		$('#global').html((this.views.news.render()).el);
	},

	users: function()
	{
		$('#global').html((this.views.friends.render()).el);
	},

	user: function()
	{
		$('#global').html((this.views.user.render()).el);
	}

});