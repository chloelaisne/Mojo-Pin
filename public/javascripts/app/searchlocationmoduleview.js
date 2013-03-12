App.SearchLocationModuleView = Backbone.View.extend({

	template: Templates.SearchLocation,

	events:
	{
		"keyup input": "searching",
		"mouseover #results li"		: "setStyleOver",
		"mouseleave #results li"	: "setStyleLeave"
	},

	setStyleOver: function(e)
	{
		$(e.currentTarget).addClass("active");
	},

	setStyleLeave: function(e)
	{
		$(e.currentTarget).removeClass();
	},

	initialize: function()
	{
		_.bindAll(this, 'setLocation', 'searching', 'renderCollection', 'render');
		this.locationsView = new App.LocationsView();
		this.locationsCollection = new App.LocationsCollection();
		this.locationsCollection.on("reset", this.renderCollection, this);

		App.Events.on("setLocation", this.setLocation);
	},

	setLocation: function(location)
	{
		this.$("#results").hide();
		this.$("input").attr("value", location.description);
	},

	searching: function(e)
	{
		var key 			= e.which;
		var KEY_ARROWTOP 	= 38;
		var KEY_ARROWBOTTOM = 40;
		var KEY_ENTER 		= 13;
		if(key == KEY_ARROWTOP || key == KEY_ARROWBOTTOM || key == KEY_ENTER)
		{
			console.log("KEY_ARROWTOP || KEY_ARROWTOP || KEY_ENTER");
			if(this.locationsCollection.length != 0)
			{
				console.log("Collection exists");
				if($("#results li.active").length == 0)
				{
					this.eq = 0;
				}
				else
				{
					if(key == KEY_ARROWTOP){
						if(this.eq == 0){
							this.eq = this.locationsCollection.length - 1;
						}
						else{
							this.eq = this.eq - 1;
						}
					}
					else if(key == KEY_ARROWBOTTOM){
						if(this.eq == this.locationsCollection.length - 1){
							this.eq = 0;
						}
						else{
							this.eq = this.eq + 1;
						}
					}
					else if(key == KEY_ENTER){
						App.Events.trigger("locationEnter");
					}
				}
				$("#results li").removeClass();
				$("#results li:eq("+ this.eq + ")").addClass("active");
			}
		}
		else
		{
			var self = this;
			$.ajax
			({
				type 		: 'GET',
				dataType 	: 'json',
				url 		: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + $(e.target).val() + '&types=geocode&sensor=true&key=AIzaSyD9YAvbWKUsUhJfMZeZqKjROLrcM9kgCcQ',
			})
			.done(function(data, textStatus, jqXHR){ self.locationsCollection.reset(data.predictions); })
			.fail(function(jqXHR, textStatus, errorThrown){ console.log("fail searching") });
		}
		
	},

	renderCollection: function()
	{
		this.locationsView.collection = this.locationsCollection;

		this.$("#results").children().remove();

		if(this.locationsCollection.length > 0)
		{
			this.$("#results").html((this.locationsView.render()).el);
			this.$("#results").show();
		}
		else
		{
			this.$("#results").hide();
		}
	},

	render: function()
	{
		this.setElement(this.template);
		this.$("#results").hide();
		return this;
	}
});