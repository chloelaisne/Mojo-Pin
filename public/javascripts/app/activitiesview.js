App.ActivitiesView = Backbone.View.extend({

	model: App.Activies,

	tagName: 'ul',

	initialize: function(){
//		console.log('initialize ActivitiesView');

		_.bindAll(this, 'render');

		this.collection = new App.ActivitiesCollection();
		this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.render, this);

        this.collection.fetch();
	},

	render: function(){
//		console.log('render ActivitiesView');

		this.offset = 52;
		
		var self = this;
		_(this.collection.models).each(function(activity) {
			var activityView = new App.ActivityView({ model: new App.Activity(activity.attributes) });
			activityView.render();
			$(self.el).append(activityView.el);
		});
	}
	
});