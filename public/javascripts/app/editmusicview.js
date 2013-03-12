App.EditMusicView = Backbone.View.extend({
	
	attributes:
	{
		id: "music"
	},

	events:
	{
		"click #dropzone"	: "removeMusic",
		"mouseover .track" 	: "setStyleOver",
		"mouseleave .track" : "setStyleLeave",
		"click .track"		: "setCurrentTrack"
	},

	addPlaying: function()
	{

	},

	setStyleOver: function()
	{
		$(".player .volume.on").css("background-position", "0 -24px");
		$(".player .volume.off").css("background-position", "0 -36px");
	},

	setStyleLeave: function()
	{
		$(".player .volume.on").css("background-position", "0 0");
		$(".player .volume.off").css("background-position", "0 -12px");
	},

	initialize: function()
	{
		_.bindAll(this, 'setStyleOver', 'setStyleLeave', 'addPlaying', 'uriChanged', 'render', 'setUri', 'renderSearchModule', 'renderPlayerModule', 'renderDragDropModule', 'renderTitle', 'removeMusic');

		App.Events.on("onSearchChanged", this.setUri);

		if(typeof this.model == "undefined" || this.model.get("uri") == null)
		{
			this.model = new App.Music();
		}
		else
		{
			App.Events.trigger("changeMusic", this.model.get("uri"));
			this.model.getSpotifyModel();
		}

		this.model.bind("change:uri"	, this.uriChanged);
		this.model.bind("change:image"	, this.renderDragDropModule);

		this.searchMusicModuleView = new App.SearchMusicModuleView();

		Spotify.Player.observe(Spotify.Models.EVENT.CHANGE, this.renderPlayerModule);
		
	},

	uriChanged: function()
	{
		App.Events.trigger("changeMusic", this.model.get("uri"));
		App.Events.trigger("UpdateNavigation", this.model.get("uri"));
		if(typeof this.model.get("uri") != undefined)
			this.model.getSpotifyModel();
	},

	removeMusic: function()
	{
		if(typeof this.model.get("uri") != 'undefined')
			App.Events.trigger('delSession', 'music');
	},

	setCurrentTrack: function()
	{
		this.model.set({ uri: Spotify.Player.track.uri });
	},

	setUri: function(uri)
	{
		this.model.set({ uri: uri });
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

			App.Events.trigger("EditMusicComplete");
		}
		else
		{
			this.dropzoneTemplate = _.template(Templates.DropzoneInactive);

		}

		$(this.el).append(this.dropzoneTemplate);
		$(".track-name").text(Utils.ShortenString($(".track-name")));
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
		//App.Events.trigger("changeRoute", "music");

		// Delegate events when view is re-rendered
		this.delegateEvents();

		this.renderTitle();
		this.renderSearchModule();
		this.renderPlayerModule();
		this.renderDragDropModule();
		return this;
	}

});