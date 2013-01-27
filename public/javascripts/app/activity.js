App.Activity = Backbone.Model.extend({

	defaults: {
		type		: "none",
		uri			: "spotify:track:0000000000000000000000",
		title		: "No title",
		artists		: "No artists",
		location	: "No location"
	},

	initialize: function(){
//		console.log('initialize Activity');

		_.bindAll(this);

		var self = this;

		/*var track = Spotify.Models.Track.fromURI(this.get("uri"), function(track){
			self.set({
				title: track.name,
				artists: track.artists.join(', ')
			});
		});*/
	}
	
});