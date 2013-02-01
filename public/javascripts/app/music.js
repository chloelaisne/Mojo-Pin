App.Music = Backbone.Model.extend({

	uri: null,

	initialize: function()
	{
		_.bindAll(this, 'setObjectModel', 'getSpotifyModel')
	},

	getSpotifyModel: function()
	{
		this.spotifyModel = Spotify.Models.Track.fromURI(this.get("uri"), this.setObjectModel);
	},

	setObjectModel: function(data)
	{
		this.set
		({
			name	: data.name,
			artists	: data.artists.join(", "),
			image	: data.image
		});
	}
});