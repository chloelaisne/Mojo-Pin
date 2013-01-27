App.ActivityView = Backbone.View.extend({

	tagName: 'li',

	model: App.Activity,

	template: _.template(Templates.Activity),

	initialize: function(){
//		console.log('initialize ActivityView');
	},

	render: function(){
//		console.log('render ActivityView');
		
		this.templateSettings = {
			type		: this.model.get("type"),
			title		: this.model.get("title"),
			artists		: this.model.get("artists"),
			location	: this.model.get("location")
		};

		$(this.el).html(this.template(this.templateSettings));
	}
	
});