App.ActivityCollection = Backbone.Collection.extend({
	
	//model: App.Activity,

	//url: 'public/templates/users.json',
	url: 'http://localhost:3000/json/users',

	initialize: function(){
		console.log('initialize ActivityCollection');
	}
	
});