App.SearchMusicModuleView = Backbone.View.extend({

	events: {
		"keypress input"	: "onKeyPress",
		"keyup input"		: "onKeyUp",
		"click input"		: "onClick",
		"focusin input"		: "onFocusIn",
		"focusout input"	: "onFocusOut",
		"click .results"	: "onClickArea"
	},

	onKeyPress: function(e){
		if(this.query == ""){
			$(e.target).val($(e.target).val().replace(this.initialQuery, ""));
			$(e.target).attr('class', 'active');
		}
	},

	onClick: function(e){
		if(this.query == ""){
			$(e.target).prop("selectionStart", 0);
			$(e.target).prop("selectionEnd", 0);
		}
	},

	onClickArea: function(e){
		
	},

	onKeyUp: function(e){
		this.query = $(e.target).val();

		var self = this;

		if(this.query == ""){
			$(e.target).val(this.initialQuery);
			$(e.target).prop("selectionStart", 0);
			$(e.target).prop("selectionEnd", 0);
			$(e.target).attr('class', 'inactive');
		}

		this.renderResults();

		if(this.query == "" && typeof self.resultsView != 'undefined')
			$(self.resultsView.el).css('display', 'none');
	},

	onFocusIn: function(e){
		if(typeof this.resultsView != 'undefined' && this.query != "")
			$(this.resultsView.el).css('display', 'block');

	},

	onFocusOut: function(e){
		var self = this;
		if(typeof this.resultsView != 'undefined'){
			this.query = "";
			$(this.resultsView.el).delay(200).queue(function(){
				$(this).css('display','none');
				$(e.target).attr('class', 'inactive');
				$(e.target).val(self.initialQuery);
			});
		}
	},

	initialize: function(){
		_.bindAll(this, 'render', 'renderResults', 'onKeyPress', 'onKeyUp', 'onClick', 'onFocusIn', 'onFocusOut', 'onClickArea');

		this.query = "";
		this.initialQuery = "Search";
	},

	renderResults: function(){
		if(this.$("div.results"))
			this.$("div.results").remove();

		this.resultsView = new App.ResultsView({ query: this.query });

		$(this.el).append((this.resultsView.render()).el);

		return this;
	},

	render: function(){

		this.setElement(Templates.SearchMusic);

		return this;
	}

});