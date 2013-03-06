App.Music = Backbone.Model.extend({

	defaults:
	{
		"uri" 	: null
	},

	initialize: function()
	{
		_.bindAll(this, 'getSpotifyModel')
	},

	getSpotifyModel: function()
	{
		var self = this;

		if(typeof this.get("uri") != 'undefined' || this.get("uri") != null)
		{
			this.spotifyModel = Spotify.Models.Track.fromURI(this.get("uri"), function (data)
			{
				self.set
				({
					name	: data.name,
					artists	: data.artists.join(", "),
					image	: data.image
				});
			});
		}
	}

});