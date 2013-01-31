App.Router = Backbone.Router.extend({

	views: {},

	routes:
	{

		// DEFAULT
		''			: 'news',

		'news'			: 'news',
		'users'			: 'users',
		'user/*user'	: 'user',
		'addPin'		: 'addPin',
		'editLocation'	: 'routeToEditLocation',

		// EDIT SECTION
		"edit/music"		: "editMusic",
		"edit/location"		: "editLocation",
		"edit/description"	: "editDescription"
	},

	initialize: function()
	{
		_.bindAll(this, 'news', 'users', 'user', 'editMusic', 'editLocation', 'editDescription');

		this.views.app = new App.AppView({ el: $("body") });
		this.views.news = new App.NewsView();
		this.views.user = new App.UserView();
		this.views.friends = new App.FriendsView();

		// EDIT SECTION
		this.views.editNavigation 	= new App.EditNavigationView();
		this.views.editMusic 		= new App.EditMusicView();
		this.views.editLocation 	= new App.EditLocationView();
		this.views.editDescription 	= new App.EditDescriptionView();

		this.bind("route:editMusic", this.views.editNavigation.render);
		this.bind("route:editLocation", this.views.editNavigation.render);
		this.bind("route:editDescription", this.views.editNavigation.render);

		this.view = this.views.app;        
        this.view.render();
	},

	editMusic: function()
	{
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
	},

	addPin: function()
	{
		this.views.editNavigation.unrender();

		this.views.editTrack.render();
		$('#global').html(this.views.editTrack.el);
	}

});