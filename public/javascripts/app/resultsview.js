App.ResultsView = Backbone.View.extend({
	tagName: 'div',
	className: 'output',
	initialize: function(){
		var searchSettings = {
            pageSize: 5,
            searchAlbums: false,
            searchArtists: false,
            searchPlaylists: false,
            searchType: Spotify.Models.SEARCHTYPE.SUGGESTION
        };
        var search = new Spotify.Models.Search("pink", searchSettings);

        search.observe(Spotify.Models.EVENT.CHANGE, function() {

            var collection = new Backbone.Collection(search.tracks);
            console.log(JSON.stringify(collection));
            collection.forEach(function(data) {
                console.log(data);
            });
        });

        search.appendNext();
	},
	render: function(){
		return this;
	}
});