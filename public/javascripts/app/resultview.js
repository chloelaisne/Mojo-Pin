App.ResultView = Backbone.View.extend({

	template: _.template(Templates.Result),

	events: {
	},

	initialize: function(){
		_.bindAll(this, 'render', 'onClick');

		this.uri = this.model.attributes.data.uri;
	},

	onClick: function(){
		App.Events.trigger("onSearchChanged", this.uri);
	},

	render: function(){

		var self = this;

		this.resultTrack = Spotify.Models.Track.fromURI(this.uri, function(track){

			self.templateSettings = {
				trackname 		: track.name,
				trackartists 	: track.artists.join(", "),
				trackimage 		: track.image
			};

			self.el = $(self.template(self.templateSettings));

			$(self.el).bind('click', self.onClick);

		});

		return this;
	}
});