App.ResultsView = Backbone.View.extend({
	tagName: 'div',
	className: 'results',
	initialize: function(){
		_.bindAll(this, 'render');
	},
	render: function(){

		this.trackResultsView = new App.TrackResultsView({ query: this.options.query });

        $(this.el).append((this.trackResultsView.render()).el);

		return this;
	}
});