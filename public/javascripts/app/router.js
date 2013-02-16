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
		this.bind("route:edit", this.views.edit.editNavigation.render);

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
		this.views.edit.render();
		//$('#global').html(this.views.edit.el);

		switch(action)
		{
			case 'description':
				this.views.edit.renderEditDescription();
				this.views.app.model.set({ classname: 'description' });
			break;
			case 'location':
				this.views.edit.renderEditLocation();
				this.views.app.model.set({ classname: 'location' });
			break;
			default:
				this.views.edit.renderEditMusic();
				this.views.app.model.set({ classname: 'music' });
			break;
		}

	},

	news: function()
	{
		//this.views.editNavigation.unrender();
		$('#global').html((this.views.news.render()).el);
	},

	users: function()
	{
		//this.views.editNavigation.unrender();
		$('#global').html((this.views.friends.render()).el);
	},

	user: function()
	{
		//this.views.editNavigation.unrender();
		$('#global').html((this.views.user.render()).el);
	}

});