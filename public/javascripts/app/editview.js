App.EditView = Backbone.View.extend({

	events:
	{
		"click #save"	: "savePin"
	},

	views: {},

	initialize: function()
	{
		_.bindAll(this, 'setRoute', 'renderRoute', 'getSession', 'setSession', 'delSession', 'setMusicModel', 'setLocationModel', 'renderEditMusic', 'renderEditLocation', 'renderEditDescription', 'render', 'savePin');

		this.view 					= null;
		this.editNavigation 		= new App.EditNavigationView();

		this.model 							= new App.Pin();

		App.Events.on("setSession"			, this.setSession);
		App.Events.on("delSession"			, this.delSession);

		App.Events.on("changeMusic"			, this.setMusicModel);
		App.Events.on("changeLocation"		, this.setLocationModel);
		App.Events.on("changeDescription"	, this.setDescriptionModel);
		App.Events.on("changeRoute"			, this.setRoute);

		this.getSession();

		
	},

	setRoute: function(route)
	{
		this.model.set({ route: route });

		// Render view
		this.renderRoute();

	},

	render: function()
	{
		// If session data fetched and object initialized
		if(typeof this.views.editMusic != 'undefined' || typeof this.views.editLocation != 'undefined' || typeof this.views.editDescription != 'undefined' )
			this.renderRoute();

		return this;
	},

 /* ==================================================
	===== Description model and view
	================================================== */

	setDescriptionModel: function()
	{
		this.model.set
		({
			"description"			: this.views.editDescription.model.get("description")
		});
	},

	renderEditDescription: function()
	{
		$(this.el).html((this.views.editDescription.render()).el);
		google.maps.event.trigger(this.views.editDescription.mapModuleView.map, "resize");
	},

 /* ==================================================
	===== Location model and view
	================================================== */

	setLocationModel: function(reference)
	{
		if(typeof reference != 'undefined')
		{
			this.model.set
			({
				"location_reference"	: this.views.editLocation.model.get("reference"),
				"location_latitude"		: this.views.editLocation.model.get("latitude"),
				"location_longitude"	: this.views.editLocation.model.get("longitude"),
				"location_description"	: this.views.editLocation.model.get("description")
			});
			this.editNavigation.model.set({ location: true });
		}
		else
		{
			this.model.unset("location_reference");
			this.model.unset("location_latitude");
			this.model.unset("location_longitude");
			this.model.unset("location_description");
			this.editNavigation.model.set({ location: false });
		}
	},

	renderEditLocation: function()
	{
		$(this.el).html((this.views.editLocation.render()).el);
		google.maps.event.trigger(this.views.editLocation.mapModuleView.map, "resize");
	},

 /* ==================================================
	===== Music model and view
	================================================== */

	setMusicModel: function(uri)
	{
		if(typeof uri != 'undefined')
		{
			// If Music model set from outside the view e.g. LINKSCHANGED event
			if(Backbone.history.fragment != "edit") {
				App.router.navigate("/edit", true);
				this.renderEditMusic();
			}

			this.model.set({ "music_uri": uri });
			this.editNavigation.model.set({ music: true });
		}
		else
		{
			
			this.model.unset("music_uri");
			this.editNavigation.model.set({ music: false });
		}
	},

	renderEditMusic: function()
	{
		console.log("renderEditMusic");
		$(this.el).html((this.views.editMusic.render()).el);
	},

 /* ==================================================
	===== Get session data and initialize views
	================================================== */

	getSession: function()
	{
		var self = this;

		console.log("getSession 1");

		$.ajax({
			url 	: 'http://localhost:3000/json/session/pin',
			type 	: 'GET'
		})
		.done(function (data, textStatus, jqXHR){

			var cookie = data.cookie;

			if((typeof cookie.music == 'undefined' || cookie.music == null) && (typeof cookie.location == 'undefined' || cookie.location == null))
			{
				self.views.editMusic = new App.EditMusicView();
				self.views.editLocation = new App.EditLocationView();
				self.views.editDescription 	= new App.EditDescriptionView();
				self.model.set({ route: "music" });
				console.log("getSession music");
			}
			else if((typeof cookie.music != 'undefined' && cookie.music != null) && (typeof cookie.location == 'undefined' || cookie.location == null))
			{
				self.views.editMusic = new App.EditMusicView({ model: new App.Music({ uri: cookie.music }) });
				self.views.editLocation = new App.EditLocationView();
				self.views.editDescription 	= new App.EditDescriptionView();
				self.model.set({ route: "location" });
				console.log("getSession location");
			}
			else if((typeof cookie.music != 'undefined' && cookie.music != null) && (typeof cookie.location != 'undefined' && cookie.location != null))
			{
				self.views.editMusic = new App.EditMusicView({ model: new App.Music({ uri: cookie.music }) });
				self.views.editLocation = new App.EditLocationView({ model: new App.Location({ reference: cookie.location }) });
				self.views.editDescription 	= new App.EditDescriptionView();
				self.model.set({ route: "description" });
				console.log("getSession description");
			}

			console.log("getSession 2");
			// Render view
			self.renderRoute();

		})
		.fail(function (jqXHR, textStatus, errorThrown){ console.log("getSession fail"); });
	},

	renderRoute: function()
	{
		
		switch(this.model.get("route"))
		{
			case "description":
				this.renderEditDescription();
				this.editNavigation.setDescriptionNavigationState();
				break;
			case "location":
				this.renderEditLocation();
				this.editNavigation.setLocationNavigationState();
				break;
			case "music":
			default:
				this.renderEditMusic();
				this.editNavigation.setMusicNavigationState();
				break;
		}
	},

 /* ==================================================
	===== Update session data
	================================================== */

	setSession: function(name)
	{
		if(name == 'music')
			object = { music: this.views.editMusic.model.get("uri") };
		else if(name == 'location')
			object = { location: this.views.editLocation.model.get("reference") };

		$.ajax({
			url 	: 'http://localhost:3000/json/session/pin',
			type 	: 'POST',
			data 	: object
		});
	},

 /* ==================================================
	===== Delete session data
	================================================== */

	delSession: function(name)
	{
		var self = this;

		if(name == 'music')
		{
			this.views.editMusic.model.clear();
			object = { music: null };
		}
		else if(typeof name == 'undefined')
		{
			this.model.clear();
			object = {};
		}

		$.ajax({
			type 	: 'DELETE',
			url		: 'http://localhost:3000/json/session/pin',
			data	: object
		})
		.done(function (data, textStatus, jqXHR){
			self.editNavigation.model.set({ "music": false });
		})
		.fail(function (jqXHR, textStatus, errorThrown){ console.log("delSession fail"); });
	},

 /* ==================================================
	===== Save data to the database
	================================================== */

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
			.done(function (data, textStatus, jqXHR){ console.log("Succeeded to save pin in database"); })
			.fail(function (jqXHR, textStatus, errorThrown){ console.log("Failed to save pin in database"); });
		}
	}

});