App.EditTrackView = Backbone.View.extend({

	template: _.template(Templates.EditTrack),
	
	initialize: function(){

		_.bindAll(this, 'render', 'renderResults', 'renderPlaying', 'renderDropzone');

		var self = this;

		$(function(){
			Spotify.Player.observe(Spotify.Models.EVENT.CHANGE, self.renderPlaying);
			Spotify.Application.observe(Spotify.Models.EVENT.LINKSCHANGED, self.renderDropzone);
		});

	},

	renderDropzone: function(){

		if(this.$("#dropzone"))
			this.$("#dropzone").remove();

		var self = this;

		if(Spotify.Application.links.length != 0){

			self.linkTrack = Spotify.Models.Track.fromURI(Spotify.Application.links[0], function(track){

				self.linkTrackname = track.name;
				self.linkTrackartists = track.artists.join(", ");
				self.linkTrackimage = track.image;

				self.dropzoneSettings = {
					trackname 		: self.linkTrackname,
					trackartists 	: self.linkTrackartists,
					trackimage 		: self.linkTrackimage
				};

				self.dropzoneTemplate = _.template(Templates.DropzoneActive)(self.dropzoneSettings);

				$(self.el).append(self.dropzoneTemplate);

				return self;
			});
		}
		else
		{
			self.dropzoneTemplate = _.template(Templates.DropzoneInactive);

			$(self.el).append(self.dropzoneTemplate);

			return self;
		}
	},

	renderPlaying: function(){

		if(Spotify.Player.playing == true){
			this.trackName 		= Spotify.Player.track.name;
			this.trackArtists 	= Spotify.Player.track.artists.join(", ");
		}
		else{
			this.trackName 		= null;
			this.trackArtists 	= null;
		}

		var templateSettings = {
			trackname 		: this.trackName,
			trackartists 	: this.trackArtists
		}

		if(this.$(".playing"))
			this.$(".playing").remove();
		if(this.trackName != null && this.trackArtists != null)
			$(this.el).append(_.template(Templates.PlayingTrack)(templateSettings));

		return this;
	},

	renderResults: function(){
		$(this.el).append((new App.ResultsView().render()).el);
		return this;
	},

	render: function(){

		this.$el.html(this.template);

		this.renderPlaying();

		this.renderDropzone();

		this.renderResults();

		return this;

	}

})