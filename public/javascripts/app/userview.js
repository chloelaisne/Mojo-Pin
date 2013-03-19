App.UserView = Backbone.View.extend({

	initialize: function()
	{
		console.log('yol4o');
		_.bindAll(this, 'renderInformation', 'renderPins', 'loadCollection', 'setMapFocus', 'userDataLoaded', 'mapDataLoaded', 'render');

		this.mapModuleView = new App.MapModuleView({ id: "map_profile" });

		// Initialize the collection of pins
		this.pins = new Backbone.Collection();
		this.pins.bind('reset', this.renderPins)

		this.user = new App.User();
		this.user.bind("change", this.userDataLoaded);

		App.Events.on("changeAccessToken", this.loadCollection);
	},

	loadCollection: function()
	{
		this.pins.url = 'http://localhost:3000/json/pins/'+ App.FACEBOOK.USER_ID;
		this.pins.fetch();
	},

	setMapFocus: function(model)
	{
		// Set map center
		this.mapModuleView.setCenter(model.get("latitude_location"), model.get("longitude_location"));
	},

	userDataLoaded: function()
	{
		// Get location details from the Google Maps Places API
		this.location = new App.Location({ address: this.user.get("location") });
		this.location.bind("change", this.mapDataLoaded);
		// Re-render view
		this.renderInformation();

		// Render profile picture
		this.$("div.picture").css({ "background-image": "url(https://graph.facebook.com/me/picture?width=130&height=130&access_token=" + App.FACEBOOK.ACCESS_TOKEN + ")" });
	},

	mapDataLoaded: function()
	{
		// Set map center
		this.mapModuleView.setCenter(this.location.get("latitude"), this.location.get("longitude"));
	},

	renderInformation: function()
	{
		if(typeof this.user.get("fullname") != undefined){
			this.informationTemplateSettings = {
				fullname	: this.user.get("fullname"),
				location	: this.user.get("location")
			};

			this.$("#top").html(_.template(Templates.ProfileHeader)(this.informationTemplateSettings));
		}
	},

	renderPins: function()
	{
		// Bind this to self for functions below
		var self = this;

		// ===== If pin collection is empty ===== //
		if(this.pins.length == 0)
		{
			this.$("#sidebar").html(Templates.EmptyActivityModule);
			this.$("#sidebar button").css({ "left": this.$("#sidebar").outerWidth() / 2 - this.$("#sidebar button").outerWidth() / 2 + "px" });
		}
		// ===== If pin collection is not empty ===== //
		else {
			var list = document.createElement("ul");

			// Reset markers array
			this.mapModuleView.markers = [];
			
			_(this.pins.models).each(function(activity)
			{
				// Append row of pin-related information to the sidebar
				var activityView = new App.ActivityView({ model: new App.Activity(activity.attributes) });
				$(list).append((activityView.render()).el);

				// Append pin marker to the map
				self.mapModuleView.addMarker(activityView.model);
			});

			this.$("#sidebar").html(list);
		}
	},

	render: function()
	{
		this.$el.html(Templates.Profile);

		this.$("#middle").append((this.mapModuleView.render()).el);

		this.renderInformation();
		this.renderPins();

		this.setElement($(this.el));
		return this;
	}

});