App.SearchLocationModuleView = Backbone.View.extend
({
	events:
	{
		"keyup input"				: "onKeyUp",
		"click input"				: "onClick",
		"focusout input"			: "onFocusOut",
		"mouseover #results li"		: "onMouseOver",
		"mouseleave #results li"	: "onMouseLeave"
	},

	initialize: function()
	{
		_.bindAll(this, 'setTextfieldValue', 'setLocation', 'unsetLocation', 'delLocation', 'onKeyUp', 'renderCollection', 'render');

		this.setElement(Templates.SearchLocation);

		this.locationsView = new App.LocationsView();
		this.locations = new Backbone.Collection();
		this.locations.on("reset", this.renderCollection, this);

		this.model = new Backbone.Model();
		this.model.bind("change:description", this.setTextfieldValue);

		// Textfield's default value
		this.isEmpty 		= true;
		this.valueDefault 	= this.$("input").attr("value");
		this.isSelected 	= false;
		this.valueSelection = null;

		// Triggers when pin location is set
		App.Events.on("setLocation", this.setLocation);
		App.Events.on("delLocation", this.delLocation);
		App.Events.on("locationFail", this.unsetLocation);
	},

	onMouseOver: function(e)
	{
		$(e.currentTarget).addClass("active");
	},

	onMouseLeave: function(e)
	{
		$(e.currentTarget).removeClass();
	},

	onClick: function(e){
		if(this.isEmpty == true || this.isSelected == true)
		{
			// Place cursor at the beginning of the line
			this.$("input").prop("selectionStart", 0);
			this.$("input").prop("selectionEnd", 0);
		}
	},

	onFocusOut: function(e)
	{
		// Hide results
		this.$(".results").css("display", "none");
		if(this.isEmpty == true)
		{
			// Set gray text color
			this.$(".results").attr("class", "inactive");
		}
	},

	/*
	 * Change value of the textfield when location is reset
	 */
	setTextfieldValue: function()
	{
		this.$("#results").hide();
		this.$("label").hide();
		this.$(".search").removeClass("error");
		this.$("input").attr("value", this.model.get("description"));
		this.valueSelection = this.model.get("description");
		this.isSelected 	= true;
	},

	/*
	 * Set textfield value with pin location selected
	 * @param location: string
	 */
	setLocation: function(location)
	{
		this.model.set({ description: location.description})
		this.$("input").removeClass("active").addClass("inactive");
	},

	delLocation: function()
	{
		this.model.unset("description");
	},

	unsetLocation: function(description)
	{
		this.model.set({ description: description})
		this.$("label").show();
		this.$(".search").addClass("error");
	},

	onKeyUp: function(e)
	{
		// Control keys: arrow top, arrow bottom, and enter
		var key 			= e.which;
		var KEY_ARROWTOP 	= 38;
		var KEY_ARROWBOTTOM = 40;
		var KEY_ENTER 		= 13;

		// If one of the control keys is hit
		if(key == KEY_ARROWTOP || key == KEY_ARROWBOTTOM || key == KEY_ENTER)
		{
			// If the collection exists
			if(this.locations.length != 0)
			{
				// If no row is highlighted
				if($("#results li.active").length == 0)
				{
					// Highlight the top row
					this.eq = 0;
				}
				else
				{
					// Top arrow hit
					if(key == KEY_ARROWTOP)
					{
						// if current highlight is top row, highlight last row of the collection
						if(this.eq == 0)
							this.eq = this.locations.length - 1;
						// Highlight previous row
						else
							this.eq = this.eq - 1;
					}
					// Bottom arrow hit
					else if(key == KEY_ARROWBOTTOM)
					{
						// if current highlight is bottom row, highlight first row of the collection
						if(this.eq == this.locations.length - 1)
							this.eq = 0;
						// Highlight next row
						else
							this.eq = this.eq + 1;
					}
					// Enter key hit
					else if(key == KEY_ENTER)
					{
						App.Events.trigger("locationEnter");
					}
				}

				// Remove previously highlighted row
				$("#results li").removeClass();
				// Set newly highlighted row
				$("#results li:eq("+ this.eq + ")").addClass("active");
			}
		}
		// If any other keys is hit
		else
		{
			if(this.$("input").attr("value") == "")
			{
				this.isEmpty = true;
				// Hide results
				this.$(".results").css("display", "none");
				// Set value to default and gray text color
				this.$("input").attr("value", this.valueDefault);
				this.$("input").removeClass("active").addClass("inactive");
				this.onClick();
			}
			// If the field contains the default value or selection already exists
			else if(this.isEmpty == true)
			{
				this.$("input").attr("value", this.$("input").attr("value").replace(this.valueDefault, ""));
				this.isEmpty = false;
				
			}
			else if(this.isSelected == true)
			{
				this.$("input").attr("value", this.$("input").attr("value").replace(this.valueSelection, ""));
				this.isSelected = false;
			}
			// Any other keyboard interactions
			else
			{
				this.isEmpty = false;
				this.valueSelection = false;
			}
			// Show results
			if(this.isEmpty == false)
			{
				this.$("input").removeClass("inactive").addClass("active");
			}

			// Bind this to self for function bellow
			var self = this;

			$.ajax
			({
				type 		: 'GET',
				dataType 	: 'json',
				url 		: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + $(e.target).val() + '&types=geocode&sensor=true&key=AIzaSyD9YAvbWKUsUhJfMZeZqKjROLrcM9kgCcQ',
			})
			.done(function(data, textStatus, jqXHR){
				// Reset location collection
				self.locations.reset(data.predictions);
			});
		}
		
	},

	renderCollection: function()
	{
		this.locationsView.collection = this.locations;

		this.$("#results").children().remove();

		if(this.locations.length > 0)
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
		this.$("label").hide();
		this.$("#results").hide();

		// Set textfield with location model is exists
		this.setTextfieldValue();

		return this;
	}
});