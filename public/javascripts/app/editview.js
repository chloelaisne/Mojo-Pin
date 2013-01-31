App.EditView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this, 'render');
		this.editNavigation = Templates.EditNavigation;
	},
	render: function(){
		$(this.el).append(this.editNavigation);
		return this;
	}
});