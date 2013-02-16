App.EditMusicView = Backbone.View.extend({
	
	initialize: function()
	{
		_.bindAll(this, 'render', 'setUri', 'renderSearchModule', 'renderPlayerModule', 'renderDragDropModule', 'renderTitle');

		App.Events.on("onSearchChanged", this.setUri);

		this.model = new App.Music();
		this.model.bind("change:uri", this.model.getSpotifyModel);
		this.model.bind("change:uri", function(){ App.Events.trigger("EditMusicComplete"); });
		this.model.bind("change:image", this.renderDragDropModule);

		this.searchMusicModuleView = new App.SearchMusicModuleView();

		Spotify.Player.observe(Spotify.Models.EVENT.CHANGE, this.renderPlayerModule);
		
	},

	setUri: function(uri)
	{
		this.model.set
		({
			uri: uri
		});
	},

	renderDragDropModule: function()
	{
		if(this.$("#dropzone"))
			this.$("#dropzone").remove();

		if(this.model.get("uri") != null)
		{
			this.dropzoneSettings =
			{
				trackname 		: this.model.get("name"),
				trackartists 	: this.model.get("artists"),
				trackimage 		: this.model.get("image")
			};
			this.dropzoneTemplate = _.template(Templates.DropzoneActive)(this.dropzoneSettings);
		}
		else
		{
			this.dropzoneTemplate = _.template(Templates.DropzoneInactive);

		}

		$(this.el).append(this.dropzoneTemplate);
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
	},

	renderSearchModule: function()
	{
		if(this.$("#search"))
			this.$("#search").remove();

		$(this.el).append((this.searchMusicModuleView.render()).el);
	},

	renderTitle: function()
	{
		if(this.$("h2"))
			this.$("h2").remove();

		$(this.el).prepend(Templates.EditMusicTitle);
	},

	render: function()
	{
		this.renderTitle();
		this.renderSearchModule();
		this.renderPlayerModule();
		this.renderDragDropModule();
		return this;
	}

});