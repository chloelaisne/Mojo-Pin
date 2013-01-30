App.TrackResultsView = Backbone.View.extend({
	template: _.template(Templates.TrackResults),
	initialize: function(){
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
	render: function(){
		$(this.el).html(this.template);

		var self = this;

        this.search.observe(Spotify.Models.EVENT.CHANGE, function(){
            self.collection = new Backbone.Collection(self.search.tracks);

            self.collection.forEach(function(data) {
                var resultView = new App.ResultView({ model: data });
                $(self.el).find("ul").append((resultView.render()).el);
            });
        });

        this.search.appendNext();
		
		return this;
	}
});