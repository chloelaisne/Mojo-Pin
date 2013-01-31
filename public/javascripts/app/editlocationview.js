App.EditLocationView = Backbone.View.extend({
	
	initialize: function(){
		_.bindAll(this, 'render', 'renderSearch');
		this.searchLocationView = new App.SearchLocationView();
	},

	renderSearch: function(){
	},

	render: function(){
		var self = this;

		$(this.el).append((this.searchLocationView.render()).el);

		return this;
	}

});