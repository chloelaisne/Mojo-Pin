App.EditMusicView = Backbone.View.extend({

	attributes:
	{
		id 		: "music",
		class	: "edit"
	},

	events:
	{
		"click #dropzone"		: "removeMusic",
		"click .track"		: "setCurrentTrack"
	},

	initialize: function()
	{
		_.bindAll(this, 'uriChanged', 'render', 'setUri', 'renderPlayer', 'renderDragDropModule', 'removeMusic');

		App.Events.on("onSearchChanged", this.setUri);

		if(typeof this.model == "undefined" || this.model.get("uri") == null)
		{
			this.model = new App.Music();
		}
		else
		{
			this.model.getSpotifyModel();
		}

		this.model.bind("change:uri"	, this.uriChanged);
		this.model.bind("change:image"	, this.renderDragDropModule);

		this.searchMusicModuleView = new App.SearchMusicModuleView();

		Spotify.Player.observe(Spotify.Models.EVENT.CHANGE, this.renderPlayer);
		
		// Set the model URI when track dropped onto the Application tab
		var self = this;
		Spotify.Application.observe(Spotify.Models.EVENT.LINKSCHANGED, function(){
			self.model.set({ uri: Spotify.Application.links[0] });
		});
	},

	uriChanged: function()
	{
		App.Events.trigger("UpdateNavigation", this.model.get("uri"));

		if(typeof this.model.get("uri") != undefined)
			this.model.getSpotifyModel();
	},

	removeMusic: function(e)
	{
		e.preventDefault();

		if(typeof this.model.get("uri") != "undefined" && this.model.get("uri") != null)
		{
			this.model.clear("uri");
		}
	},

	setCurrentTrack: function(e)
	{
		e.preventDefault();

		this.model.set({ uri: Spotify.Player.track.uri });
	},

	setUri: function(data)
	{
		this.model.set({ uri: data.uri });
	},

	renderDragDropModule: function()
	{
		if(this.model.get("uri") != null)
		{
			this.dropzoneSettings =
			{
				trackname 		: this.model.get("track"),
				trackartists 	: this.model.get("artists"),
				trackimage 		: this.model.get("image")
			};
			this.dropzoneTemplate = _.template(Templates.DropzoneActive)(this.dropzoneSettings);
			this.$("#dropzone").removeClass("blank");

			App.Events.trigger("EditMusicComplete");
		}
		else
		{
			this.dropzoneTemplate = _.template(Templates.DropzoneInactive);
			this.$("#dropzone").addClass("blank");

		}

		this.$("#dropzone").html(this.dropzoneTemplate)

		// Shorten trackname if length is over a line
		$(".track-name").text(Utils.ShortenString($(".track-name")));
	},

	renderPlayer: function()
	{
		if(Spotify.Player.playing == true)
		{
			this.$(".player .track").html(Spotify.Player.track.name + " by " + Spotify.Player.track.artists.join(", "));
			this.$(".player").css("display", "block");
		}
		else
		{
			this.$(".player").css("display", "none");
		}
	},

	render: function()
	{
		$(this.el).html(Templates.Music);
		this.$("#search").html((this.searchMusicModuleView.render()).el);

		this.renderPlayer();
		this.renderDragDropModule();

		return this;
	}

});