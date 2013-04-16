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
			var modeltrack = Spotify.Models.Track.fromURI(this.get("uri"), function (track)
			{
				var name 		= track.name;
				var artists 	= track.artists.join(", ");

				var modelAlbum = Spotify.Models.Album.fromURI(track.album.uri, function(album)
				{
					var cover 	= album.image;
					self.set({ track: name, artists: artists, image: cover });
					App.Events.trigger("changeMusic", self);
				});
			});
		}
	}

});