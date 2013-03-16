App.User = Backbone.Model.extend({

	defaults: {
		fullname	: 'Undefined',
		location	: 'Undefined'
	},

	initialize: function()
	{
		_.bindAll(this, 'initializeData');

		App.Events.on("changeAccessToken", this.initializeData);
	},

	initializeData: function(access_token)
	{
		var self = this;

		// Get name and location of the user
		$.ajax({
			type	: "GET",
			url		: "https://graph.facebook.com/me?access_token=" + access_token,
			dataType: "json"
		})
		.done(function (data, textStatus, jqXHR){
			
			self.set({
				fullname	: data.first_name + " " + data.last_name,
				location	: data.location.name
			});

		});

		
	}

});