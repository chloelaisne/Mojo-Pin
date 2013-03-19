App.Activity = Backbone.Model.extend({

	initialize: function()
	{
		// Bind this to self for functions below
		var self = this;

		// Get track information from Spotify URI
		if(typeof this.get("uri_music") != 'undefined' && this.get("uri_music") != null){
			Spotify.Models.Track.fromURI(this.get("uri_music"), function(track){
				self.set({
					title		: track.name,
					artists		: track.artists.join(', '),
					image		: track.image
				});
			});
		}
	}
	
});