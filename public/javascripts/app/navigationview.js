App.NavigationView = Backbone.View.extend({

	events: {
		'click li'	: 'onClick'
	},

	onClick: function(event){
		_.each(this.$('li'), function(element, index, list){
			if($(element).hasClass('mp-icon'))
				$(element+'.mp-icon>span').removeClass('active');
			$(element).removeClass('active');
		})

		if($(event.target).hasClass('mp-icon'))
			$(event.target+'.mp-icon>span').addClass('active');
		$(event.target).addClass('active');
	},

	initialize: function(){
		_.bindAll(this, 'onClick', 'render');
	},

	render: function(){
		var template = _.template($(".template-header").html(), {});
        this.$el.html(template);
	}

});