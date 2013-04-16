App.MasterView = Backbone.View.extend({

	initialize: function()
	{
		_.bindAll(this, 'gotoApplication', 'facebookAuthDialog', 'facebookAuthSuccess', 'facebookAuthFailure', 'facebookAuthComplete', 'setBodyClass', 'render');

		this.model = new Backbone.Model({"appidentifier": "476683619043995", "apppermissions": ['user_location','friends_location', 'publish_actions']});
		this.model.bind("change:classname", this.setBodyClass);

		App.Events.on('FacebookAuthDialog'		, this.facebookAuthDialog);
		App.Events.on('FacebookCredentialsGet'	, this.gotoApplication);
	},

	gotoApplication: function(model)
	{
		this.setGlobals(model);
	},

	facebookAuthDialog: function()
	{
		Spotify.Auth.authenticateWithFacebook(App.FACEBOOK['app_identifier'], App.FACEBOOK['app_permissions'], {
			onSuccess	: this.facebookAuthSuccess,
			onFailure	: this.facebookAuthFailure,
			onComplete	: this.facebookAuthComplete
		});
	},

	facebookAuthSuccess: function(token, ttl)
	{
		// Bind this to self for below functions
		var self = this;

		$.ajax({
			type 	: 'POST',
			url		: 'http://localhost:3000/json/login',
			data 	: { token: token }
		})
		.done(function (data, textStatus, jqXHR){ self.setGlobals(data); });
	},

	setGlobals: function(data)
	{
		// Get user session
		App.FACEBOOK['access_token'] 				= data.access_token;
		App.FACEBOOK['expires_at'] 					= data.expires_at;
		App.FACEBOOK['user_id'] 					= data.user_id;
		App.FACEBOOK['user_location'] 				= [];
		App.FACEBOOK['user_location']['location'] 	= data.user_location;

		Utils.GetCoordinatesFromLocation(data.user_location, function (reference, latitude, longitude){
			App.FACEBOOK['user_location']['reference'] 	= reference;
			App.FACEBOOK['user_location']['latitude'] 	= latitude;
			App.FACEBOOK['user_location']['longitude'] 	= longitude;

			// Trigger all Facebook dependencies
			App.Events.trigger("FacebookCredentialsSet");
		});
	},

	facebookAuthFailure: function(error)
	{
		App.router.navigate('/login', true);
	},

	facebookAuthComplete: function()
	{
	},

	setBodyClass: function()
	{
		// Array of strings
		if(typeof this.model.get("classname") == 'object')
		{
			// Remove current classname
			$('body').removeClass();

			for(var i = 0; i < this.model.get("classname").length; i++)
			{
				$('body').addClass(this.model.get("classname")[i]);
			}
		}
		// String
		else
		{
			$('body').removeClass().addClass(this.model.get("classname"));
		}
	},

	render: function()
	{
		this.$el.html = $("body");
		this.setElement($(this.el));

		return this;
	}

})