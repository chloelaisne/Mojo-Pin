App.Location = Backbone.Model.extend({

	initialize: function()
	{
		_.bindAll(this, 'getDetails', 'getCoordinates');

		if(typeof this.get("address") != 'undefined' && this.get("address") != null){
			// If location query exists, get location details from the Google Maps Places API
			this.getCoordinates();
		}

	},

	getCoordinates: function()
	{
		var self = this;
		$.ajax({
			type	: "GET",
			url		: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + this.get("address") + "&sensor=" + App.GOOGLE_MAPS.SENSOR + "&key=" + App.GOOGLE_MAPS.API_KEY,
			dataType: "json"
		})
		.done(function (data, textStatus, jqXHR){

			if(data.results.length != 0){
				self.set({
					reference	: data.results[0].reference,
					latitude	: data.results[0].geometry.location.lat,
					longitude	: data.results[0].geometry.location.lng
				});
			}

		});
	},

	getDetails: function()
	{
		var self = this;

		var service = new google.maps.places.PlacesService(this.get("map").map);
		service.getDetails({ reference: this.get("reference") }, function(place, status)
		{
			if (status == google.maps.places.PlacesServiceStatus.OK)
			{
				self.set
				({
					"latitude"	: place.geometry.location.lat(),
					"longitude"	: place.geometry.location.lng()
				});

				App.Events.trigger("LocationDetailsLoaded", self.toJSON());
				App.Events.trigger("changeLocation", self.get("reference"));
			}
		});
	}

})