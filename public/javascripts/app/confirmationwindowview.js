App.ConfirmationWindowView = Backbone.View.extend({

	model: App.ConfirmationWindow,

	initialize: function(){
//		console.log('initialize ConfirmationWindowView');

		Backbone.View.apply(this, arguments);
        google.maps.OverlayView.apply(this, arguments);
	},

	render: function(){
//		console.log('render ConfirmationWindowView');
	}
	
});

_.extend(App.ConfirmationWindowView.prototype, Backbone.View.prototype, google.maps.OverlayView.prototype,{

	initialize: function(options){
//		console.log('initialize ConfirmationWindowView.prototype');

		this.setMap(this.options.map);
	},

	onAdd: function(){
//		console.log('onAdd App.ConfirmationWindowView.prototype');

		var div = document.createElement('div');
		div.style.position = 'relative';

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.moveTo(11,0);
		context.lineTo(159,0);
		context.arc(159,5,5,1.5*Math.PI,2*Math.PI);
		context.lineTo(164,40);
		context.arc(159,40,5,0*Math.PI,0.5*Math.PI);
		context.lineTo(11,45);
		context.arc(11,40,5,0.5*Math.PI,1*Math.PI);
		context.lineTo(6,30);
		context.lineTo(0,23);
		context.lineTo(6,15);
		context.lineTo(6,5);
		context.arc(11,5,5,1*Math.PI,1.5*Math.PI);
		context.strokeStyle = '#212121';
		context.stroke();
		var gradient = context.createLinearGradient(0,0,0,45);
		gradient.addColorStop(0,'#363636');
		gradient.addColorStop(1,'#212121');
		context.fillStyle = gradient;
		context.fill();

		div.appendChild(canvas);

		this.div_ = div;
		
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);
	},

	draw: function(){
//		console.log('draw App.ConfirmationWindowView.prototype');

		var position = this.getProjection().fromLatLngToDivPixel(this.options.latlng);
		this.div_.style.left = (position.x + 17) + "px";
		this.div_.style.top = (position.y + -47) + "px";
	},

	onRemove: function(){
//		console.log('onRemove App.ConfirmationWindowView.prototype');

		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null;
	}

});