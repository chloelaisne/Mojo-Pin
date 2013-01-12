$(function(){

	Backbone.emulateJSON = true;

	console.log('Router 1');
	// Initialize the Backbone router.
	App.router = new App.Router;
	console.log('Router 2');
	Backbone.history.start();
	console.log('Router 3');
});