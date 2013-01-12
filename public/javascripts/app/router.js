App.Router = Backbone.Router.extend({

	routes: {
		''				: 'news',
		'news'			: 'news',
		'users'			: 'users',
		'user/*user'	: 'user'
	},

	views:{

	},

	initialize: function(){
		console.log('initialize Router 1');

		_.bindAll(this, 'news', 'users', 'user');

		this.views.app = new App.AppView({ el: $("body") });
		this.views.news = new App.NewsView({ el: $('#global') });
		this.views.user = new App.UserView({ el: $('#global') });
		this.views.users = new App.UsersView({ el: $('#global') });

		this.view = this.views.app;        
        this.view.render();

        console.log('initialize Router 2');
	},

	news: function(){
		console.log('news Router 1');
		this.view.body = this.views.news;
		this.view.body.render();
		console.log('news Router 2');
	},

	users: function(){
		console.log('users Router');
		this.view.body = this.views.users;
		this.view.body.render();
	},

	user: function(user){
		console.log('user Router');
		this.view.body = this.views.user;
		this.view.body.render();
	}

});