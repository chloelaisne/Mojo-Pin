App.Router = Backbone.Router.extend({

	routes: {
		''				: 'user',
		'news'			: 'news',
		'users'			: 'users',
		'user/*user'	: 'user',
		'addPin'		: 'addPin'
	},

	views:{},

	initialize: function(){
//		console.log('initialize Router');

		_.bindAll(this, 'news', 'users', 'user');

		this.views.app = new App.AppView({ el: $("body") });
		this.views.news = new App.NewsView();
		this.views.user = new App.UserView();
		this.views.friends = new App.FriendsView();
		this.views.friends = new App.FriendsView();
		this.views.editTrack = new App.EditTrackView();
		this.views.editLocation = new App.EditLocationView();
		this.views.editDescription = new App.EditDescriptionView();

		this.view = this.views.app;        
        this.view.render();
	},

	news: function(){
//		console.log('news Router');
		this.views.news.render();
		$('#global').html(this.views.news.el);
	},

	users: function(){
//		console.log('users Router');
		$('#global').html((this.views.friends.render()).el);
	},

	user: function(){
//		console.log('user Router');
		this.views.user.render();
		$('#global').html(this.views.user.el);
	},

	addPin: function(){
		this.views.editTrack.render();
		$('#global').html(this.views.editTrack.el);
	}

});