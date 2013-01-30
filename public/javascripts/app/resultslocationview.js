App.ResultsLocationView = Backbone.View.extend({
	tagName: 'ul',
	initialize: function(){
		_.bindAll(this, 'render');
		var self = this;
		this.collection.forEach(function(data){
			var resultLocationView = new App.ResultLocationView({ model: data }).render();
			$(self.el).append(resultLocationView.el);
		});
	},
	render: function(){
		return this;
	}
});