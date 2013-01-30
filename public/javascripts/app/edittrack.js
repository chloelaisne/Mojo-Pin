App.EditTrackView = Backbone.View.extend({

	template: _.template(Templates.EditTrack),
	
	initialize: function(){

		_.bindAll(this, 'render', 'renderSearch', 'renderPlaying', 'renderDropzone', 'updateTrackURI', 'renderPagination');

		App.Events.on("onSearchChanged", this.updateTrackURI);

		var self = this;

		$(function(){
			Spotify.Player.observe(Spotify.Models.EVENT.CHANGE, self.renderPlaying);
			Spotify.Application.observe(Spotify.Models.EVENT.LINKSCHANGED, self.updateTrackURI);
		});

	},

	updateTrackURI: function(uri){
		if(typeof uri === 'object')
			this.trackURI = Spotify.Application.links[0];
		else 
			this.trackURI = uri;

		console.log(this.trackURI);

		this.renderDropzone();

		this.renderPagination();
	},

	renderDropzone: function(){

		if(this.$("#dropzone"))
			this.$("#dropzone").remove();

		var self = this;

		if(this.trackURI != null){

			self.trackModel = Spotify.Models.Track.fromURI(self.trackURI, function(track){

				self.trackName = track.name;
				self.trackArtists = track.artists.join(", ");
				self.trackImage = track.image;

				self.dropzoneSettings = {
					trackname 		: self.trackName,
					trackartists 	: self.trackArtists,
					trackimage 		: self.trackImage
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

	renderSearch: function(){
		this.searchView = new App.SearchView().render();

		var self = this;

		$(function(){
			$(self.searchView.el).insertAfter("h2");
		});

		return this;
	},

	renderPagination: function()
	{
		var self = this;

		if(this.paginationView === undefined)
		{
			self.paginationView = new App.PaginationView().render();
			$(self.el).append(self.paginationView.el);
		}
		else
		{
			if(self.trackURI != null)
			{
				if($(".right button").hasClass("mp-flat"))
					$(".right button").removeClass("mp-flat");
			}
			else
			{
				if(!$(".right button").hasClass("mp-flat"))
					$(".right button").addClass("mp-flat");
			}
		}
		return this;
	},


	render: function(){

		this.$el.html(this.template);

		this.renderPlaying();

		this.renderDropzone();

		this.renderSearch();

		this.renderPagination()

		return this;

	}

})