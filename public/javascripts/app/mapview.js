App.MapView = Backbone.View.extend({

	attributes: function(){
		return {
			id : "map_canvas"
		};
	},

	options: {
		MapTypeId			: google.maps.MapTypeId.ROADMAP,
		panControl			: false,
		mapTypeControl		: false,
		streetViewControl	: false,
		zoom				: 8

	},
	
	initialize: function(){
		_.bindAll(this, 'render');

		this.latlng = new google.maps.LatLng(-34.397, 150.644);
		this.map = new google.maps.Map(this.el, this.options);
		this.map.setCenter(this.latlng);

		/*this.marker = new google.maps.Marker({
			position	: this.latlng,
			map			: this.map
		});

		this.markerWindowView = new App.NoticeWindowView({
			map 		: this.map,
			latlng 		: this.latlng,
			title		: 'Middle Of The Bed',
			artists		: 'Lucy Rose',
			location	: 'Betahaus, Kreuzberg'
		});*/
	},

	render: function(){
		$(this.el).css({
			position: "absolute",
			width: "100%",
			height: "500px"
		});
		$("body").prepend(this.el);

		return this;
	}

});