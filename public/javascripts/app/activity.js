App.Activity = Backbone.Model.extend({

	initialize: function()
	{
		_.bindAll(this);

		var self = this;

		var track = Spotify.Models.Track.fromURI(this.get("uri"), function(track){
			self.set({
				title		: track.name,
				artists		: track.artists.join(', '),
				location	: ''
			});
		});
	}
	
});