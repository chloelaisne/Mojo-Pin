App.NoticeWindowView = Backbone.View.extend({

	model: App.NoticeWindow,

	initialize: function(){
//		console.log('initialize NoticeWindowView');

		Backbone.View.apply(this, arguments);
        google.maps.OverlayView.apply(this, arguments);
	},

	render: function(){
//		console.log('render NoticeWindowView');
	}
	
});

_.extend(App.NoticeWindowView.prototype, Backbone.View.prototype, google.maps.OverlayView.prototype,{

	initialize: function(options){
//		console.log('initialize NoticeWindowView.prototype');

		this.setMap(this.options.map);
	},

	onAdd: function(){
//		console.log('onAdd App.NoticeWindowView.prototype');

		var div = document.createElement('div');
		div.className = "window notice";

		var music = document.createElement('div');
		music.className = "music";
		music.innerHTML = '<span class="mp-track"></span><span>' + this.options.title + '</span> by ' + this.options.artists;

		var location = document.createElement('div');
		location.className = "location";
		location.innerHTML = '<span class="mp-location"></span>' + this.options.location;

		div.appendChild(music);
		div.appendChild(location);

		this.div_ = div;
		
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);

		this.width = $(div).outerWidth();
		this.height = $(div).outerHeight();
		this.radius = 10;
		this.arrowwidth = 17;
		this.arrowheight = 7;

		var canvas = document.createElement('canvas');
		canvas.setAttribute('width', this.width + 1 + 'px');
		canvas.setAttribute('height', this.height + this.arrowheight + 1 + 'px');
		var context = canvas.getContext('2d');
		context.moveTo(this.radius + 0.5, 0.5);
		context.lineTo(this.width - this.radius + 0.5, 0.5);
		context.arc(this.width - this.radius + 0.5, this.radius + 0.5, this.radius,1.5*Math.PI, 2*Math.PI);
		context.lineTo(this.width + 0.5, this.height - this.radius + 0.5);
		context.arc(this.width - this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0*Math.PI, 0.5*Math.PI);
		context.lineTo((this.width / 2) + Math.floor(this.arrowwidth / 2) + 0.5, this.height + 0.5);
		context.lineTo((this.width / 2), this.height + this.arrowheight + 0.5);
		context.lineTo((this.width / 2) - Math.floor(this.arrowwidth / 2) + 0.5, this.height + 0.5);
		context.lineTo(this.radius + 0.5, this.height  + 0.5);
		context.arc(this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0.5*Math.PI, 1*Math.PI);
		context.lineTo(0.5, this.radius + 0.5);
		context.arc(this.radius + 0.5, this.radius + 0.5, this.radius, 1*Math.PI, 1.5*Math.PI);
		context.strokeStyle = '#212121';
		context.stroke();
		var gradient = context.createLinearGradient(0,0,0,45);
		gradient.addColorStop(0,'#363636');
		gradient.addColorStop(1,'#212121');
		context.fillStyle = gradient;
		context.fill();

		div.insertBefore(canvas, div.firstChild);

		panes.overlayLayer.removeChild(div);
		panes.overlayLayer.appendChild(div);

	},

	draw: function(){
//		console.log('draw App.NoticeWindowView.prototype');

		var position = this.getProjection().fromLatLngToDivPixel(this.options.latlng);
		this.div_.style.left = position.x - (this.width / 2) + "px";
		this.div_.style.top = position.y - this.height - 34 - (this.arrowheight * 2) + "px";
	},

	onRemove: function(){
//		console.log('onRemove App.NoticeWindowView.prototype');

		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null;
	}

});