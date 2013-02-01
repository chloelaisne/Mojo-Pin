App.EditMusicView = Backbone.View.extend({

	template: Templates.EditTrack,
	
	initialize: function()
	{
		_.bindAll(this, 'render', 'setUri', 'renderSearchModule', 'renderPlayerModule', 'renderDragDropModule');

		App.Events.on("onSearchChanged", this.setUri);

		this.music = new App.Music();
		this.music.bind("change:uri", this.music.getSpotifyModel);
		this.music.bind("change:uri", function(){ App.Events.trigger("EditMusicComplete"); });
		this.music.bind("change:image", this.renderDragDropModule);

		this.searchView = new App.SearchView();

		Spotify.Player.observe(Spotify.Models.EVENT.CHANGE, this.renderPlayerModule);
		
	},

	setUri: function(uri)
	{
		this.music.set
		({
			uri: uri
		});
	},

	renderDragDropModule: function(){

		if(this.$("#dropzone"))
			this.$("#dropzone").remove();

		if(this.music.get("uri") != null)
		{
			this.dropzoneSettings =
			{
				trackname 		: this.music.get("name"),
				trackartists 	: this.music.get("artists"),
				trackimage 		: this.music.get("image")
			};
			this.dropzoneTemplate = _.template(Templates.DropzoneActive)(this.dropzoneSettings);
		}
		else
		{
			this.dropzoneTemplate = _.template(Templates.DropzoneInactive);

		}

		$(this.el).append(this.dropzoneTemplate);
		return this;
	},

	renderPlayerModule: function()
	{
		if(this.$(".player"))
			this.$(".player").remove();

		if(Spotify.Player.playing == true)
		{
			this.playername 	= Spotify.Player.track.name;
			this.playerartists 	= Spotify.Player.track.artists.join(", ");
		}
		else
		{
			this.playername 	= null;
			this.playerartists 	= null;
		}

		var playerTemplateSettings =
		{
			trackname 		: this.playername,
			trackartists 	: this.playerartists
		}

		if(this.playername != null && this.playerartists != null)
			$(this.el).append(_.template(Templates.Player)(playerTemplateSettings));

		return this;
	},

	renderSearchModule: function(){
		this.searchView.render();

		$(this.el).append(this.searchView.el);

		return this;
	},

	render: function()
	{
		this.setElement(this.template);

		this.renderSearchModule();

		this.renderPlayerModule();

		this.renderDragDropModule();

		return this;
	}

});