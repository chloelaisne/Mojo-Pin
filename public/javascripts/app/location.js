App.Location = Backbone.Model.extend({

	// Set Stockholm as a default location if Facebook friend does not share his location
	defaults: {
		"address"	: null,
		"reference"	: null,
		"latitude"	: "59.32893000000001",
		"longitude"	: "18.064910"
	},

	initialize: function()
	{
		_.bindAll(this, 'getDetails', 'setLocationDetails');
	},

	setLocationDetails: function()
	{
		// Verify that default value has been replaced
		if(this.hasChanged("address") && typeof this.get("address") != 'undefined')
		{
			var self = this;

			$.ajax({
				type	: "GET",
				url		: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + this.get("address") + "&sensor=" + App.GOOGLE_MAPS["sensor"] + "&key=" + App.GOOGLE_MAPS["key"],
				dataType: "json"
			})
			.done(function (data, textStatus, jqXHR){

				if(data.results.length != 0){

					self.set({
						"reference"	: data.results[0].reference,
						"latitude"	: data.results[0].geometry.location.lat,
						"longitude"	: data.results[0].geometry.location.lng
					});
				}
				else if(data.results.length == 0 && data.status != "OK"){
					console.log("Google Maps error: " + data.status);
				}

			});
		}
	},

	getDetails: function()
	{
		var self = this;
		var service = new google.maps.places.PlacesService(this.get("map").map);
		service.getDetails({ reference: this.get("reference") }, function(place, status)
		{
			if (status == "OK")
			{
				self.set({ latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() });

				App.Events.trigger("LocationDetailsLoaded", self.toJSON());
				App.Events.trigger("changeLocation", self.get("reference"));
			}
			else if (status == "NOT_FOUND")
			{
				self.unset("reference", { silent: true });
				App.Events.trigger("locationFail", self.get("description"));
				App.Events.trigger("changeLocation");
			}
		});
	}

})