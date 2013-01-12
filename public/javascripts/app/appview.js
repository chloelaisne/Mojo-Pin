App.AppView = Backbone.View.extend({

	el: $('body'),

	events: {
		'click #goto-news'		: 'gotoNews',
		'click #goto-profile'	: 'gotoProfile',
		'click #goto-friends'	: 'gotoFriends',
		'click #goto-pin'		: 'gotoPin',
	},

	initialize: function(){
		new App.NavigationView({ el: $('#header') }).render();
	},

	gotoNews: function(){
		App.router.navigate('/news', true);
	},

	gotoProfile: function(){
		App.router.navigate('/user/chloelaisne', true);
	},

	gotoFriends: function(){
		App.router.navigate('/users', true);
	},

	gotoPin: function(){

	},

	render: function(){

	}

});