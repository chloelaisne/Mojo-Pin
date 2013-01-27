App.FacebookAuth = Backbone.Model.extend({

	initialize: function(){
		_.bindAll(this, 'facebookAuthSuccess', 'facebookAuthFailure');

		this.apppermissions = ['offline_access'];
		this.appidentifier = '476683619043995';

		Spotify.Auth.authenticateWithFacebook(this.appidentifier, this.apppermissions, {
			onSuccess: this.facebookAuthSuccess,
			onFailure: this.facebookAuthFailure
		});
	},

	facebookAuthSuccess: function(token, ttl){
		console.log('Authentication succeeded with token: ' + token);

		var self = this;
		this.token = token;

		var jqxhr = $.ajax({
			type 		: "GET",
			dataType	: "json",
			url			: "https://graph.facebook.com/me",
			data 		: { access_token : this.token },
			success 	: function(data, textStatus, jqXHR){
				console.log("jqXHR succeeded with data ", data);
				
				var jqxhr = $.ajax({
					type 		: "POST",
					dataType	: "json",
					url			: "http://localhost:3000/json/facebookauth",
					data 		: { user: data.id, token: self.token },
					success 	: function(data, textStatus, jqXHR){
						console.log("jqXHR succeeded with data ", data);
					},
					error 		: function(jqXHR, textStatus, errorThrown){
						console.log("jqXHR failed with error ", errorThrown);
					}
				});
			},
			error 		: function(jqXHR, textStatus, errorThrown){
				console.log("jqXHR failed with error ", errorThrown);
			}
		});
	},

	facebookAuthFailure: function(error){
		console.log('Authentication failed with error: ' + error);
	}
});