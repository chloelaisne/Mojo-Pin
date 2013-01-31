App.AppView = Backbone.View.extend({

	template: _.template(Templates.App),

	events: {
		'click #goto-news'		: 'gotoNews',
		'click #goto-profile'	: 'gotoProfile',
		'click #goto-friends'	: 'gotoFriends',
		'click #goto-pin'		: 'gotoPin',
		'click li'				: 'onClick'
	},

	initialize: function(){
		_.bindAll(this, 'gotoNews', 'gotoProfile', 'gotoFriends', 'gotoPin', 'onClick', 'render');
	},

	gotoNews: function(e){
		e.preventDefault();
		App.router.navigate('/news', true);
	},

	gotoProfile: function(e){
		e.preventDefault();
		App.router.navigate('/user/chloelaisne', true);
	},

	gotoFriends: function(e){
		e.preventDefault();
		App.router.navigate('/users', true);
	},

	gotoPin: function(e){
		e.preventDefault();
		App.router.navigate('/edit/music', true);
	},

	onClick: function(){
		_.each(this.$('li'), function(element, index, list){
			$(element + '.mp-icon>span').removeClass('active');
			$(element).removeClass('active');
		})

		$(event.target + '.mp-icon>span').addClass('active');
		$(event.target).addClass('active');
	},

	render: function(){
		$(this.el).html(this.template);
		$('#header').html(Templates.Header);
		return this;
	}

});