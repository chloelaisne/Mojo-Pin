App.EditRouter = Backbone.Router.extend({

	views: {},

	routes: {
		"music"			: "gotoMusic",
		"location"		: "gotoLocation",
		"description"	: "gotoDescription"
	},

	initialize: function(){
		_.bindAll(this, 'gotoMusic', 'gotoLocation', 'gotoDescription');

		this.views.edit 			= new App.EditView();
		this.views.editMusic 		= new App.EditMusicView();
		this.views.editLocation 	= new App.EditLocationView();
		this.views.editDescription 	= new App.EditDescriptionView();

		this.view = this.views.edit;        
        this.view.render();

		$('#global').append(this.view.el);
		$('#global').addClass("edit");
	},

	gotoMusic: function(){
		console.log("music");
	},

	gotoLocation: function(){

	},

	gotoDescription: function(){

	}
	
});