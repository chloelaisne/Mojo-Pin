App.ResultLocationView = Backbone.View.extend({
	tagName: 'li',
	events: {
		"click": "onClick"
	},
	onClick: function(){
		this.resultLocation = new App.ResultLocation({
			description	: this.model.get('description'),
			reference	: this.model.get('reference')
		});
		var self = this;
		App.Events.on("hasDetails", function(){
			console.log('hasDetails');
			var myLatlng = new google.maps.LatLng(self.resultLocation.get("latitude"),self.resultLocation.get("longitude"));
			self.markerOptions = {
				position: myLatlng,
				map: App.mapView.map
			};
			self.marker = new google.maps.Marker(self.markerOptions);
			App.mapView.map.setCenter(myLatlng);
		});
	},
	initialize: function(){
		_.bindAll(this, 'render', 'onClick');
	},
	render: function(){
		$(this.el).html(this.model.get('description'));

		return this;
	}
})