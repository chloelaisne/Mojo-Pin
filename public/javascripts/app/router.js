App.Router = Backbone.Router.extend({

	views: {},

	routes:
	{
		//'news': 'news',

		""					: "edit",
		"offline"			: "offline",

		"users"				: "users",
		"user/*user"		: "user",

		"edit/*action"		: "edit",
		"login"				: "login"
	},

	initialize: function()
	{
		_.bindAll(this, 'login', 'offline', 'setState', 'users', 'user', 'edit');

		App.Events.on("StateChanged", this.setState);

		this.views.app 		= new App.AppView({ el: $("body") });

		this.views.offline 	= new App.OfflineView();
		this.views.login 	= new App.LoginView();
		this.views.edit		= new App.EditView();

		

		//this.views.news = new App.NewsView();
		this.views.user = new App.UserView();
		this.views.friends = new App.FriendsView();
		

		this.view = this.views.app;
        this.view.render();
	},

	setState: function(state)
	{
		if(state == App.OFFLINE)
		{
			this.views.app.model.set({
				header		: false,
				classname	: 'news'
			});
        	this.navigate('offline', true);
		}
		else
		{
			// ONLINE
		}
	},

	offline: function()
	{
		this.views.app.model.set({
			header		: false,
			classname	: ['light', 'offline']
		});
		$('#global').html((this.views.offline.render()).el);
	},

	edit: function(action)
	{
		this.views.app.model.set({
			header		: true,
			classname	: 'edit'
		});
		$('#global').html((this.views.edit.render()).el);
	},

	/*news: function()
	{
		this.views.app.model.set({
			header		: true,
			classname	: 'news'
		});
		$('#global').html((this.views.news.render()).el);
	},*/

	login: function()
	{
		this.views.app.model.set({
			header		: false,
			classname	: ['light', 'login']
		});
		$('#global').html((this.views.login.render()).el);
	},

	users: function()
	{
		this.views.app.model.set({
			header		: true,
			classname	: 'user'
		});
		$('#global').html((this.views.friends.render()).el);
	},

	user: function()
	{
		this.views.app.model.set({
			header		: true,
			classname	: 'user'
		});
		$('#global').html((this.views.user.render()).el);
	}

});