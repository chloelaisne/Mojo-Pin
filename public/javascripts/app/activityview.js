App.ActivityView = Backbone.View.extend({

	tagName: 'ul',

	initialize: function(){
		console.log('initialize ActivityView');
		console.log('1');
		//_.bindAll(this, 'render');
		console.log('2');
		this.collection = new App.ActivityCollection();
		console.log('3');
		//this.collection.bind('reset', this.render, this);
        //this.collection.bind('add', this.render, this);
        console.log('4');
        this.collection.fetch({
        	success: function(response){
        		console.log('success', response);
        	},
        	error: function(response){
        		console.log('error', response);
        	}
        });
	},

	render: function(){
		console.log('initialize ActivityView');
	}
	
});