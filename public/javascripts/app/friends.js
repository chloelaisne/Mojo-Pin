App.FriendsCollection = Backbone.Collection.extend({

	parse: function(response)
	{
        return response.data;
    },

    comparator: function(model)
    {
		return model.get('name');
	},

	filter: function(string)
	{
		var pattern = new RegExp("\s*\w*" + string + "\s*\w*", "ig");

		var models = _.filter(this.models, function(model)
		{
			// Hide friends not matching the input from the filtering
			if(pattern.test(model.get("name")) == true)
				model.set({ display: "block" });
			else
				model.set({ display: "none" });
			
			return model;
		});

		this.models = models;
	}

});