App.Location = Backbone.Model.extend({

	initialize: function()
	{
		_.bindAll(this, 'getDetails');
	},

	getDetails: function()
	{
		console.log("getDetails");
		
		var self = this;

		var service = new google.maps.places.PlacesService(this.get("map").map);
		service.getDetails({ reference: this.get("reference") }, function(place, status)
		{
			if (status == google.maps.places.PlacesServiceStatus.OK)
			{
				console.log(place.geometry.location);
				self.set
				({
					"latitude"	: place.geometry.location.lat(),
					"longitude"	: place.geometry.location.lng()
				});

				App.Events.trigger("LocationDetailsLoaded", self.toJSON());
			}
		});
	}

})