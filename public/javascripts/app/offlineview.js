App.OfflineView = Backbone.View.extend({

	template: Templates.Offline,

	initialize: function()
	{
		_.bindAll(this, 'render');
	},

	render: function()
	{
		$(this.el).html(this.template);
		return this;
	}

});