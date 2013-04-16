App.ApplicationView = Backbone.View.extend({

	template: _.template(Templates.App),

	events:
	{
		'click li'				: 'activeState',
		'click #goto-news'		: 'gotoNews',
		'click #goto-profile'	: 'gotoProfile',
		'click #goto-friends'	: 'gotoFriends',
		'click #goto-edit'		: 'gotoEdit',
		'click #goto-logout'	: 'gotoLogout'
	},

	initialize: function()
	{
		_.bindAll(
			this, 'gotoNews', 'gotoProfile', 'gotoFriends', 'gotoEdit', 'gotoLogout',
			'changeAplicationStateView', 'activeState',
			'renderHeader', 'render');

		this.model = new Backbone.Model({ state: Spotify.Session.state, classname: null });
		this.model.bind("change:state", this.changeAplicationStateView);

		// Listen to Spotify online/offline changes
		var self = this;
		Spotify.Models.session.observe(Spotify.Models.EVENT.STATECHANGED, function(){
			self.model.set({ state: Spotify.Models.session.state });
		});
	},

	changeAplicationStateView: function()
	{
		App.Events.trigger("ApplicationStateChanged", this.model.get("state"));
	},

	/*
	 * Route to News
	 */
	gotoNews: function(e)
	{
		e.preventDefault();
		App.router.navigate('/news', true);
	},

	/*
	 * Route to Profile
	 */
	gotoProfile: function(e)
	{
		e.preventDefault();
		App.router.navigate('/user/' + App.FACEBOOK["user_id"], true);
	},

	/*
	 * Route to Friends
	 */
	gotoFriends: function(e)
	{
		e.preventDefault();
		App.router.navigate('/friends', true);
	},

	/*
	 * Route to Edit
	 */
	gotoEdit: function(e)
	{
		e.preventDefault();
		App.router.navigate('/edit', true);
	},

	/*
	 * Route to Logout
	 */
	gotoLogout: function()
	{
		var self = this;
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/json/logout'
		})
		.done(function (data, textStatus, jqXHR){
			App.router.navigate('/login', true);
		})
	},

	activeState: function(e)
	{
		$('nav li').removeClass('active');
		$('nav li .mp-icon > span').removeClass('active');

		$(e.target + '.mp-icon > span').addClass('active');
		$(e.target).addClass('active');
	},

	renderHeader: function()
	{
		if($("#header").length == 0)
			$(this.el).prepend(Templates.Header);
	},

	render: function()
	{
		this.$el.html(this.template);
		this.renderHeader();
		return this;
	}

});