App.UserView = Backbone.View.extend({

	initialize: function()
	{
		_.bindAll(this, 'renderInformation', 'renderPins', 'loadCollection', 'setMapFocus', 'userDataLoaded', 'mapDataLoaded', 'render');

		this.mapModuleView = new App.MapModuleView({ id: "map_profile" });

		// Initialize the collection of pins
		this.pins  = new App.Pins();
		this.pins.bind('reset', this.renderPins)

		this.user = new App.User();
		this.user.bind("change", this.userDataLoaded);

		App.Events.on("ActivitySelected", this.setMapFocus);
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
		this.mapModuleView.setCenter(model.get("latitude"), model.get("longitude"));
	},

	userDataLoaded: function()
	{
		// Get location details from the Google Maps Places API
		this.location = new App.Location({ address: this.user.get("location") });
		this.location.bind("change", this.mapDataLoaded);
		// Re-render view
		this.renderInformation();

		// Render profile picture
		$("div.picture").css({ "background-image": "url(https://graph.facebook.com/me/picture?width=130&height=130&access_token=" + App.FACEBOOK.ACCESS_TOKEN + ")" });
	},

	mapDataLoaded: function()
	{
		// Set map center
		this.mapModuleView.setCenter(this.location.get("latitude"), this.location.get("longitude"));
	},

	renderInformation: function()
	{
		this.informationTemplateSettings = {
			fullname	: this.user.get("fullname"),
			location	: this.user.get("location")
		};

		$("#top").html(_.template(Templates.ProfileHeader)(this.informationTemplateSettings));
	},

	renderPins: function()
	{
		if(this.pins.length == 0)
		{
			$("#sidebar").html(Templates.EmptyActivityModule);
			//$("#sidebar button").css({ "left": $("#sidebar").outerWidth() / 2 - $("#sidebar button").outerWidth() / 2 + "px" });
		}
		else {
			var list = document.createElement("ul");

			_(this.pins.models).each(function(activity) {
				var activityView = new App.ActivityView({ model: new App.Activity(activity.attributes) });
				$(list).append((activityView.render()).el);
			});

			$("#sidebar").html(list);
		}
	},

	render: function()
	{
		this.$el.html(Templates.Profile);

		this.$("#middle").append((this.mapModuleView.render()).el);

		this.setElement($(this.el));
		return this;
	}

});