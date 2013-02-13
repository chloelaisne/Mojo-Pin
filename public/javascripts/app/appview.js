App.AppView = Backbone.View.extend({

	template: _.template(Templates.App),

	events:
	{
		'click li'				: 'activeState',
		'click #goto-news'		: 'showNews',
		'click #goto-profile'	: 'showProfile',
		'click #goto-friends'	: 'showFriends',
		'click #goto-pin'		: 'showEdit'
	},

	initialize: function()
	{
		_.bindAll(this, 'changeStateView', 'changeClassname', 'sessionChanged', 'linksChanged', 'activeState', 'showNews', 'showProfile', 'showFriends', 'showEdit', 'render');

		this.model = new App.App();
		this.model.bind("change:state", this.changeStateView);
		this.model.bind("change:classname", this.changeClassname);

		Spotify.Models.session.observe(Spotify.Models.EVENT.STATECHANGED, this.sessionChanged);
		Spotify.Application.observe(Spotify.Models.EVENT.LINKSCHANGED, this.linksChanged);
	},

	changeClassname: function()
	{
		$('body').removeClass().addClass(this.model.get("classname"));
	},

	changeStateView: function()
	{
		App.Events.trigger("StateChanged", this.model.get("state"));
	},

	sessionChanged: function()
	{
		this.model.set({ state: Spotify.Models.session.state });
	},

	linksChanged: function()
	{
		App.router.navigate('/edit/music/' + Spotify.Application.links[0], true);
	},

	showNews: function(e)
	{
		e.preventDefault();
		App.router.navigate('/news', true);
	},

	showProfile: function(e)
	{
		e.preventDefault();
		App.router.navigate('/user/chloelaisne', true);
	},

	showFriends: function(e)
	{
		e.preventDefault();
		App.router.navigate('/users', true);
	},

	showEdit: function(e)
	{
		e.preventDefault();
		App.router.navigate('/edit/music', true);
	},

	activeState: function(e)
	{
		$('nav li').removeClass('active');
		$('nav li .mp-icon > span').removeClass('active');

		$(e.target + '.mp-icon > span').addClass('active');
		$(e.target).addClass('active');
	},

	render: function()
	{
		$(this.el).html(this.template);
		$('#header').html(Templates.Header);
		return this;
	}

});