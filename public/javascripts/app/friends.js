App.Friends = Backbone.Collection.extend({

	initialize: function()
	{
		_.bindAll(this, 'filter', 'getIDs', 'sortByAlphabeticalOrder');
	},

	parse: function(response)
	{
        return response.data;
    },

    comparator: function(model)
    {
		return model.get('name');
	},

	sortByAlphabeticalOrder: function()
	{

	},

	getIDs: function()
	{
		var ids = "";

		_.filter(this.models, function(model){
			ids += model.get("id") + ",";
		});

		// Remove last coma from string
		ids = ids.slice(0, -1)

		return ids;
	}

});