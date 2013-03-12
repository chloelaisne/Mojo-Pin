App.FacebookAuth = Backbone.Model.extend({

	initialize: function(){
		_.bindAll(this, 'facebookAuthSuccess', 'facebookAuthFailure');

		this.apppermissions = ['user_location','friends_location'];
		this.appidentifier = '476683619043995';

		Spotify.Auth.authenticateWithFacebook(this.appidentifier, this.apppermissions, {
			onSuccess: this.facebookAuthSuccess,
			onFailure: this.facebookAuthFailure
		});
	},

	facebookAuthSuccess: function(token, ttl)
	{
		var jqxhr = $.ajax({
			type 		: "GET",
			dataType	: "json",
			url			: "https://graph.facebook.com/me",
			data 		: { access_token : token },
			success 	: 	function(data, textStatus, jqXHR)
							{
								var jqxhr = $.ajax({
									type 		: "POST",
									dataType	: "json",
									url			: "http://localhost:3000/json/facebookauth",
									data 		: { user: data.id, token: token },
									success 	: function(data, textStatus, jqXHR){
										console.log("jqXHR succeeded with data ", data);
									},
									error 		: function(jqXHR, textStatus, errorThrown){
										console.log("jqXHR failed with error ", errorThrown);
									}
								});
							},
			error 		: 	function(jqXHR, textStatus, errorThrown){ console.log("jqXHR failed with error ", errorThrown); }
		});
	},

	facebookAuthFailure: function(error)
	{
		console.log('Authentication failed with error: ' + error);
	}
});