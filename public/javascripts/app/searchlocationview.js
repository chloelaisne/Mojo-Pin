App.SearchLocationView = Backbone.View.extend({
	template: Templates.SearchLocation,
	events: {
		"keyup input": "onKeyUp"
	},
	onKeyUp: function(e){
		var self = this;
		$.ajax({
			type 		: 'GET',
			dataType 	: 'json',
			url 		: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + $(e.target).val() + '&types=geocode&sensor=true&key=AIzaSyCy57ndHPnW1X3zYFFnBkdvJoJ-OW8Krsc',
			success		: function(data, textStatus, jqXHR){
				self.resultsLocationCollection.reset(data.predictions);
			}
		});
	},
	onResetCollection: function(){
		this.resultsLocationView = new App.ResultsLocationView({ collection: this.resultsLocationCollection });
		this.$("#results").html((this.resultsLocationView.render()).el);
	},
	initialize: function(){
		_.bindAll(this, 'render', 'onKeyUp', 'onResetCollection');
		this.resultsLocationCollection = new App.ResultsLocationCollection();
		this.resultsLocationCollection.on("reset", this.onResetCollection, this);
	},
	render: function(){
		this.setElement(this.template);
		return this;
	}
});