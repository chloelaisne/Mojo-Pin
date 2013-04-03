App.User = Backbone.Model.extend({

	initialize: function()
	{
		var self = this;

		// Get name and location of the user
		$.ajax({
			type	: "GET",
			url		: "https://graph.facebook.com/" + this.get("facebook_id") + "?access_token=" + App.FACEBOOK["access_token"],
			dataType: "json"
		})
		.done(function (data, textStatus, jqXHR){

			// Verify if Facebook friend gave read access to Current City
			if(typeof data.location != 'undefined')
				self.set({ location: data.location.name });

			self.set({ first_name: data.first_name, last_name: data.last_name });

		});
	},

	initializeData: function(model)
	{


		
	}

});