$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	App.Models.WarMatch = Backbone.Model.extend({
		urlRoot: "/matches/war_matches/",
		initialize: function () {
			this.urlRoot += war_id + ".json"
			console.log(this)
		}
	});

	App.Collections.WarMatch = Backbone.Collection.extend({
		model: App.Models.WarMatch,
		url: "/matches/war_matches/",
		initialize: function () {
			this.url += war_id + ".json"
			console.log(this.url)
			this.fetch()
		}
	});

/*
** VIEW OF TABLE
*/
	App.Views.TableMatches = Backbone.View.extend({
		template: _.template($("#MatchesTableTemplate").html()),
		initialize: function () {
			this.collection.on('sync', this.render, this)
		},
		render: function () {
			this.$el.html(this.template())
			$("#WarMatches").html(this.el)
			matches = new App.Views.Matches({ collection: this.collection })
			matches.render()
			return this
		},
	})


/*
** VIEW OF TABLE INNER (ALL ROWS)
*/
	App.Views.Matches = Backbone.View.extend({
		tagName: 'tbody',
		render: function () {
			this.collection.each(this.addOne, this)
			$("#MatchesTable").append(this.el)
			return this
		},
		addOne: function (match) {
			var row = new App.Views.Match({ model: match });
			this.$el.append(row.render().el);
		}
	});

/*
** VIEW OF ONE MATCH (ONE ROW)
*/
	App.Views.Match = Backbone.View.extend({
		template: _.template($("#MatchesRowTemplate").html()),
		tagName: 'tr',
		events: {
			'click #DeleteMatch': 'deleteMatch'
		},
		render: function () {
			this.$el.html(this.template(this.model.attributes.match))
			return this;
		},
		deleteMatch: function () {
			if (confirm("Are you sure?")) {
				fetch('/matches/' + this.model.get('id'), {
					method: 'DELETE',
				})
					.then(res => res.ok ? res : Promise.reject(res))
					.then(_.bind(() => {
						alert('Success! Match was removed!')
						this.$el.remove();
					}, this))
					.catch(() => {
						alert('Error!')
					})
			}
		}
	});

	const urlArray = window.jQuery.ajaxSettings.url.split('/')
	const war_id = urlArray[urlArray.length - 1]
	window.war_id = war_id

	col = new App.Collections.WarMatch()
	new App.Views.TableMatches({ collection: col })

}());