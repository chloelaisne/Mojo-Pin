App.ConfirmationWindowView = Backbone.View.extend({

	initialize: function()
	{
		
	}
	
});

_.extend(App.ConfirmationWindowView.prototype, Backbone.View.prototype, google.maps.OverlayView.prototype,{

	initialize: function(options)
	{
		_.bindAll(this, 'loadMouseMove');
		this.setMap(this.options.map.map);
	},

	onAdd: function()
	{
		var div = document.createElement('div');
		div.className = "window confirmation";

		this.buttonleft = document.createElement('button');
		this.buttonleft.className = 'sp-button';
		this.buttonleft.innerHTML = 'Remove';

		div.appendChild(this.buttonleft);

		console.log('onAdd here');
		this.div_ = div;

		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);

		this.width = $(div).outerWidth();
		this.height = $(div).outerHeight();
		this.radius = 6;
		this.arrowwidth = 7;
		this.arrowheight = 17;

		var canvas = document.createElement('canvas');
		canvas.setAttribute('width', this.width + 1 + 'px');
		canvas.setAttribute('height', this.height + 1 + 'px');
		var context = canvas.getContext('2d');
		context.moveTo(this.arrowwidth + this.radius + 0.5, 0.5);
		context.lineTo(this.width - this.radius + 0.5, 0.5);
		context.arc(this.width - this.radius + 0.5, this.radius + 0.5, this.radius,1.5*Math.PI, 2*Math.PI);
		context.lineTo(this.width + 0.5, this.height - this.radius + 0.5);
		context.arc(this.width - this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0*Math.PI, 0.5*Math.PI);
		context.lineTo(this.arrowwidth + this.radius + 0.5, this.height  + 0.5);
		context.arc(this.arrowwidth + this.radius + 0.5, this.height - this.radius + 0.5, this.radius, 0.5*Math.PI, 1*Math.PI);
		context.lineTo(this.arrowwidth + 0.5, (this.height / 2) + Math.floor(this.arrowheight / 2) + 0.5);
		context.lineTo(0.5 + 0.5, (this.height / 2) + 0.5);
		context.lineTo(this.arrowwidth + 0.5, (this.height / 2) - Math.floor(this.arrowheight / 2) + 0.5);
		context.lineTo(this.arrowwidth + 0.5, this.radius + 0.5);
		context.arc(this.arrowwidth + this.radius + 0.5, this.radius + 0.5, this.radius, 1*Math.PI, 1.5*Math.PI);
		context.strokeStyle = '#212121';
		context.stroke();
		var gradient = context.createLinearGradient(0,0,0,45);
		gradient.addColorStop(0,'#363636');
		gradient.addColorStop(1,'#212121');
		context.fillStyle = gradient;
		context.fill();

		div.appendChild(canvas);

		div.insertBefore(canvas, div.firstChild);

		panes.overlayLayer.removeChild(div);
		panes.overlayLayer.appendChild(div);
	},

	draw: function()
	{
		this.position = this.getProjection().fromLatLngToDivPixel(this.options.latlng);
		this.xMargin = (this.arrowwidth * 2);
		this.yMargin = 45;

		console.log('draw here');
		this.div_.style.left = this.position.x + this.xMargin + "px";
		this.div_.style.top = this.position.y - this.yMargin + "px";

		var map = this.options.map;

		this.loadMouseMove();
		this.dragendListener = google.maps.event.addListener(this.map, 'dragend', this.loadMouseMove );
	},

	loadMouseMove: function()
	{
		this.position = this.getProjection().fromLatLngToContainerPixel(this.options.latlng);

		var trPixel = {
			x: this.position.x + this.xMargin + this.width,
			y: this.position.y - this.yMargin
		};
		var blPixel = {
			x: this.position.x + this.xMargin,
			y: this.position.y - this.yMargin + this.height
		};

		var map = this.options.map;

		this.mousemoveListener = google.maps.event.addListener(this.map, 'mousemove', function(e)
		{
        	if(e.pixel.x > blPixel.x && e.pixel.x < trPixel.x && e.pixel.y > trPixel.y && e.pixel.y < blPixel.y)
        	{
        		map.map.setOptions({ draggableCursor: 'default' });
        	}
        	else
        	{
				map.map.setOptions({ draggableCursor: 'url(http://maps.google.com/mapfiles/openhand.cur), move' });
			}
    	});

    	this.clickListener = google.maps.event.addListener(this.map, 'click', function(e)
		{
        	if(e.pixel.x > blPixel.x && e.pixel.x < trPixel.x && e.pixel.y > trPixel.y && e.pixel.y < blPixel.y)
        	{
        		App.Events.trigger("RemoveMarker");
        		App.Events.trigger("delLocation");
        	}
    	});
	},

	remove: function()
	{
		console.log('onRemove');
		google.maps.event.removeListener(this.mousemoveListener);
		google.maps.event.removeListener(this.clickListener);
		google.maps.event.removeListener(this.dragendListener);
		this.div_.parentNode.removeChild(this.div_);
	}

});