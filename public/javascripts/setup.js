$(function(){
	Backbone.emulateJSON = true;

	// Initialize the Backbone router.
	App.router = new App.Router();
	Backbone.history.start();
});