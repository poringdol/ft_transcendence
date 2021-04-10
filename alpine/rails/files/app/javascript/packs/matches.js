$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};

	App.Models.Match = Backbone.Model.extend({
		urlRoot: "/matches.json",
		initialize: function () {
			
		}
	});

	App.Collections.Match = Backbone.Collection.extend({
		url: "/matches.json",
		initialize: function () {
			this.fetch()
		}
	});

	App.Views.Matches = Backbone.View.extend({
		initialize: function () {
			this.collection.on('sync', this.render, this)
		},
		render: function () {
			console.log(this.collection)
		}
	});

	console.log('aloha')
	col = new App.Collections.Match()
	view = new App.Views.Matches({ collection: col })

}());