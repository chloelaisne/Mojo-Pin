App.TrackResultsView = Backbone.View.extend
({

	initialize: function()
    {
		_.bindAll(this, 'render');

		this.searchSettings = {
            pageSize: 5,
            searchAlbums: false,
            searchArtists: false,
            searchPlaylists: false,
            searchType: Spotify.Models.SEARCHTYPE.SUGGESTION
        };

        this.search = new Spotify.Models.Search(this.options.query, this.searchSettings);
	},
	render: function()
    {
		this.$el.html(Templates.TrackResults);

		var self = this;

        this.search.observe(Spotify.Models.EVENT.CHANGE, function()
        {
            self.collection = new Backbone.Collection(self.search.tracks);

            self.collection.forEach(function(data)
            {
                var resultView = new App.ResultView({ tagName: "li", model: data });
                self.$("ul").append((resultView.render()).el);
            });
        });

        this.search.appendNext();
		
		return this;
	}
});