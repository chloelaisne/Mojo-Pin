App.ResultLocation = Backbone.Model.extend({
	initialize: function(){
		_.bindAll(this);
		var self = this;
		var service = new google.maps.places.PlacesService(App.mapView.map);
		service.getDetails({ reference: this.get("reference") }, function(place, status){
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				self.set({
					latitude	: place.geometry.location.lat(),
					longitude	: place.geometry.location.lng()
				});
				App.Events.trigger("hasDetails");
			}
		});
	}
})