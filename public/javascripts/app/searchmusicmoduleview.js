App.SearchMusicModuleView = Backbone.View.extend({

	events: {
		"keyup input"		: "onKeyUp",
		"click input"		: "onClick",
		"focusout input"	: "onFocusOut"
	},

	initialize: function()
	{
		_.bindAll(this, 'setValue', 'render', 'renderResults', 'onKeyUp', 'onClick', 'onFocusOut');

		this.setElement(Templates.SearchMusic);

		// Textfield's default value
		this.isEmpty 		= true;
		this.valueDefault 	= this.$("input").attr("value");
		this.isSelected 	= false;
		this.valueSelection = null;
		this.value 			= "";

		App.Events.on("onSearchChanged", this.setValue);
	},

	setValue: function(data)
	{
		this.$("input").attr("value", data.track + " by " + data.artists);
		this.$("input").removeClass("active").addClass("inactive");
		this.$(".results").css("display", "none");
		this.isSelected = true;
		this.valueSelection = this.$("input").attr("value");
	},

	onClick: function(e){
		if(this.isEmpty == true || this.isSelected == true)
		{
			// Place cursor at the beginning of the line
			this.$("input").prop("selectionStart", 0);
			this.$("input").prop("selectionEnd", 0);
			this.$(".results").css("display", "none");
		}
		else
		{
			// Display existing search results
			this.$(".results").css("display", "block");
		}
	},

	onKeyUp: function(e)
	{
		// If field is blank
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
			this.renderResults();
			this.$(".results").css("display", "block");
			this.$("input").removeClass("inactive").addClass("active");
		}
	},

	onFocusOut: function(e)
	{
		var self = this;

		// Hide results after a delay to guaranty that click event is fired and detected
		(this.$(".results")).delay(200).queue(function(){
			self.$(".results").css("display", "none");
			if(self.isEmpty == true)
			{
				// Set gray text color
				self.$(".results").attr("class", "inactive");
			}
		});
	},

	renderResults: function()
	{
		
		this.trackResultsView = new App.TrackResultsView({ query: this.$("input").attr("value") });
		this.$(".results").html((this.trackResultsView.render()).el);
	},

	render: function()
	{
		return this;
	}

});