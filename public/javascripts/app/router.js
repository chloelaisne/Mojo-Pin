App.Router = Backbone.Router.extend({

	views: {},

	routes:
	{
		// Testing
		""					: "user",
		"user/*user"		: "user",

		"login"				: "login",
		"offline"			: "offline",
		"edit"				: "edit",

		"users"				: "users"
		
	},

	initialize: function()
	{
		_.bindAll(this, 'login', 'offline', 'users', 'user', 'edit');

		this.views.app 			= new App.AppView({ el: $("body") });

		this.views.login 		= new App.LoginView();
		this.views.offline 		= new App.OfflineView();
		this.views.edit			= new App.EditView();
		this.views.user 		= new App.UserView();

		this.views.friends = new App.FriendsView();
		
		this.view = this.views.app;
        this.view.render();
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