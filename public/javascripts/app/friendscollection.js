App.FriendsCollection = Backbone.Collection.extend({

	url: "https://graph.facebook.com/me/friends?access_token=AAACEdEose0cBADYYFhi8KdnPJQLd4QLZBDcludUoUqeiZC3OWMvMabjZA2t4K6HZCtDpDrbtH9ebpSsuOLkhBcU6C9B2i2TYPcmeFxlNRgZDZD",

	initialize: function(){
	},

	parse: function(response) {
        return response.data;
    },

    comparator: function(model) {
		return model.get('name');
	},

	filter: function(string){
		console.log(string);

		var pattern = new RegExp("\s*\w*" + string + "\s*\w*", "ig");
		var models = _.filter(this.models, function(model){
			if(pattern.test(model.get("name")) == true){
				model.set({ display: "block" });
			} else{
				model.set({ display: "none" });
			}
			return model;
		});

		this.models = models;
	}

});