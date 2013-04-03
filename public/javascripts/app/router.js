App.Router = Backbone.Router.extend({

	views: {},

	routes:
	{
		"login"				: "showLogin",
		"offline"			: "showOffline",
		"edit"				: "showEdit",
		"user/*id"			: "showUser",
		"friends"			: "showFriends"
		
	},

	initialize: function()
	{
		_.bindAll(this, 'loadViews', 'showLogin', 'showOffline', 'showApplication', 'showEdit', 'showUser', 'showFriends');

		this.views.master 		= new App.MasterView({ el: $("body") });
		this.view = this.views.master;
    	this.view.render();

    	this.views.login 		= new App.LoginView({ el: $("body") });
		this.views.application 	= new App.ApplicationView({ el: $("body") });
		this.views.offline 		= new App.OfflineView({ el: $("body") });

		// Create all views related to the application
		this.views.edit			= new App.EditView();
		this.views.friends 		= new App.FriendsView();

		App.Events.on("FacebookCredentialsSet", this.loadViews);
	},

	loadViews: function()
	{
		//this.views.login 		= new App.LoginView({ el: $("body") });
		//this.views.application 	= new App.ApplicationView({ el: $("body") });
		//this.views.offline 		= new App.OfflineView({ el: $("body") });

		// Create all views related to the application
		//this.views.edit			= new App.EditView();
		//this.views.friends 		= new App.FriendsView();
	},

	showLogin: function()
	{
		// Set the body CSS class
		this.views.master.model.set({ classname: ['light', 'login'] });

		this.view = this.views.login;
    	this.view.render();
	},

	showOffline: function()
	{
		// Set the body CSS class
		this.views.master.model.set({ classname: ['light', 'offline'] });

		this.view = this.views.offline;
    	this.view.render();
	},

	showApplication: function()
	{
		if(typeof this.views.application != 'undefined') {
			this.view = this.views.application;
    		this.view.render();
		}
		else {

		}
		
	},

	showEdit: function(action)
	{
		// Set the view wrapper
		if(this.view != this.views.application)
			this.showApplication();

		// Set the body CSS class
		this.views.master.model.set({ classname: 'edit' });

		$('#global').html((this.views.edit.render()).el);
	},

	showUser: function(id)
	{
		// Set the view wrapper
		if(this.view != this.views.application)
			this.showApplication();

		// Set the body CSS class
		this.views.master.model.set({ classname: 'user' });

		// Create instance of user view and set user model
		this.views.user = new App.UserView({ model: new App.User({ "facebook_id": id }) });
		// Attach view to the DOM
		$('#global').html((this.views.user.render()).el);
	},

	showFriends: function()
	{
		// Set the view wrapper
		if(this.view != this.views.application)
			this.showApplication();

		// Set the body CSS class
		this.views.master.model.set({ classname: 'friends' });

		$('#global').html((this.views.friends.render()).el);
	}

});