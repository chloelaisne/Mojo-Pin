App.MapView = Backbone.View.extend({

	options: {
		MapTypeId			: google.maps.MapTypeId.ROADMAP,
		panControl			: false,
		mapTypeControl		: false,
		streetViewControl	: false,
		zoom				: 8

	},
	
	initialize: function(){
		console.log('initialize MapView');

		_.bindAll(this, 'render');

		this.latlng = new google.maps.LatLng(-34.397, 150.644);

		this.map = new google.maps.Map(this.el, this.options);
		this.map.setCenter(this.latlng);

		this.marker = new google.maps.Marker({
			position	: this.latlng,
			map			: this.map
		});

		this.markerWindowView = new App.NoticeWindowView({
			map 		: this.map,
			latlng 		: this.latlng,
			title		: 'Middle Of The Bed',
			artists		: 'Lucy Rose',
			location	: 'Betahaus, Kreuzberg'
		});
	},

	render: function(){
		console.log('render MapView');

		

		return this;
	}

});