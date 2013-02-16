App.EditView = Backbone.View.extend({

	events:
	{
		"click #save"	: "savePin"
	},

	views: {},

	initialize: function()
	{
		_.bindAll(this, 'setMusicModel', 'setLocationModel', 'renderEditMusic', 'renderEditLocation', 'renderEditDescription', 'render', 'savePin');

		this.editNavigation 		= new App.EditNavigationView();
		this.views.editMusic 		= new App.EditMusicView();
		this.views.editLocation 	= new App.EditLocationView();
		this.views.editDescription 	= new App.EditDescriptionView();
		this.views.editMusic.model.bind("change"			, this.setMusicModel);
		this.views.editLocation.model.bind("change:latitude", this.setLocationModel);

		this.model 									= new App.Pin();
		this.model.bind("change:music_uri"			, this.editNavigation.render);
		this.model.bind("change:location_reference"	, this.editNavigation.render);
		this.model.bind("change:description"		, this.editNavigation.render);
	},

	setMusicModel: function()
	{
		this.model.set({ "music_uri"	: this.views.editMusic.model.get("uri") });
	},

	setLocationModel: function()
	{
		this.model.set({
			"location_reference"		: this.views.editLocation.model.get("reference"),
			"location_latitude"			: this.views.editLocation.model.get("latitude"),
			"location_longitude"		: this.views.editLocation.model.get("longitude"),
			"location_description"		: this.views.editLocation.model.get("description")
		});
	},

	setDescriptionModel: function()
	{
		console.log("EditView.js binds Description model change");
		this.model.set({ "description"	: this.views.editDescription.model.get("description")});
	},

	renderEditMusic: function(uri)
	{
		if(uri != undefined)
		{
			this.views.editMusic.music.set({ uri: uri });
		}

		this.views.editMusic.render();
		$(this.el).html(this.views.editMusic.el);
	},

	renderEditLocation: function()
	{
		this.views.editLocation.render();
		$(this.el).html(this.views.editLocation.el);
		google.maps.event.trigger(this.views.editLocation.mapModuleView.map, "resize");
	},

	renderEditDescription: function()
	{
		this.views.editDescription.render();
		$(this.el).html(this.views.editDescription.el);
		google.maps.event.trigger(this.views.editDescription.mapModuleView.map, "resize");
	},

	render: function()
	{
		this.setElement($("#global"));
		return this;
	},

	savePin: function()
	{
		if(this.model.get("music_uri") != null && this.model.get("music_uri") != "" && this.model.get("location_reference") != null && this.model.get("location_reference") != "")
		{
			$.ajax({
				type	: 'POST',
				url		: '/json/pin',
				data	:
				{
					music_uri				: this.model.get("music_uri"),
					location_reference		: this.model.get("location_reference"),
					location_latlng			: this.model.get("location_latlng"),
					location_description	: this.model.get("location_description"),
					description				: this.model.get("description")
				}
			})
			.done(function(data, textStatus, jqXHR){
				console.log("done");
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				console.log("fail");
			});
		}
	}

});