App.ResultView = Backbone.View.extend
({
	template: _.template(Templates.Result),

	events:
	{
		"click":  "onClick"
	},

	initialize: function()
	{
		_.bindAll(this, 'render', 'onClick');

		this.uri = this.model.attributes.data.uri;
	},

	onClick: function(e)
	{
		e.preventDefault();
		App.Events.trigger("onSearchChanged", { uri: this.uri, track: this.track, artists: this.artists, image: this.image });
	},

	render: function()
	{
		var self = this;

		this.resultTrack = Spotify.Models.Track.fromURI(this.uri, function(track)
		{
			self.track 		= track.name;
			self.artists 	= track.artists.join(", ");
			self.image 		= track.image;
			self.templateSettings = { trackname: self.track, trackartists: self.artists, trackimage: self.image };
			self.$el.html($(self.template(self.templateSettings)));
		});

		return this;
	}
});