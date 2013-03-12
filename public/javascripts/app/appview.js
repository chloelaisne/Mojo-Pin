App.AppView = Backbone.View.extend({

	template: _.template(Templates.App),

	events:
	{
		'click li'				: 'activeState',
		'click #goto-news'		: 'showNews',
		'click #goto-profile'	: 'showProfile',
		'click #goto-friends'	: 'showFriends',
		'click #goto-pin'		: 'showEdit',
		'click #goto-logout'	: 'logout',
	},

	initialize: function()
	{
		_.bindAll(this, 'logout', 'unrenderNavigation', 'renderNavigation', 'facebookAuthDialog', 'facebookAuthSuccess', 'facebookAuthFailure', 'facebookAuthComplete', 'changeStateView', 'changeClassname', 'sessionChanged', 'linksChanged', 'activeState', 'showNews', 'showProfile', 'showFriends', 'showEdit', 'render');

		this.model = new App.Application({
			state 			: Spotify.Session.state,
			user 			: Spotify.Session.anonymousUserID
		});

		this.model.bind("change:state", this.changeStateView);
		this.model.bind("change:classname", this.changeClassname);
		this.model.bind("change:header", this.headerVisibility);

		Spotify.Models.session.observe(Spotify.Models.EVENT.STATECHANGED, this.sessionChanged);
		Spotify.Application.observe(Spotify.Models.EVENT.LINKSCHANGED, this.linksChanged);

		App.Events.on('FacebookAuthDialog', this.facebookAuthDialog);

		var self = this;

		// Verify if user session exists
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/json/session/user'
		})
		.done(function (data, textStatus, jqXHR){
			// If user session does not exist, redirect to Facebook Auth Dialog
			if(data.action == 'authenticateWithFacebook')
				self.facebookAuthDialog();
		});
	},

	logout: function()
	{
		var self = this;
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/json/logout'
		})
		.done(function (data, textStatus, jqXHR){
			self.unrenderNavigation();
			App.router.navigate('/login', true);
		})
	},

	renderNavigation: function()
	{
		if($("#header").length == 0)
			$(this.el).prepend(Templates.Header);
	},

	unrenderNavigation: function()
	{
		$("#header").remove();
	},

	facebookAuthDialog: function()
	{
		Spotify.Auth.authenticateWithFacebook(this.model.get("appidentifier"), this.model.get("apppermissions"), {
			onSuccess	: this.facebookAuthSuccess,
			onFailure	: this.facebookAuthFailure,
			onComplete	: this.facebookAuthComplete
		});
	},

	facebookAuthSuccess: function(token, ttl)
	{
		$.ajax({
			type 	: 'POST',
			url		: 'http://localhost:3000/json/login',
			data 	: { token: token }
		});

		// Navigate to main route
		this.renderNavigation();
		App.router.navigate('/', true);
	},

	facebookAuthFailure: function(error)
	{
		this.unrenderNavigation();
		App.router.navigate('/login', true);
	},

	facebookAuthComplete: function()
	{
		console.log('facebookAuthComplete');
	},

	changeClassname: function()
	{
		if(typeof this.model.get("classname") == 'object')
		{
			$('body').removeClass();
			for(var i = 0; i < this.model.get("classname").length; i++){
				$('body').addClass(this.model.get("classname")[i]);
			}
		}
		else
		{
			$('body').removeClass().addClass(this.model.get("classname"));
		}
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
		this.renderNavigation();
		return this;
	}

});