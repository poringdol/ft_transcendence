const { result } = require("underscore");

$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};

/*
** MODEL AND COLLECTION OF MATCHES
*/
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


	App.Views.RandomMatches = Backbone.View.extend({
		el: $('#RandomMatchCreationForm'),
		initialize: function () {},
		events: {
			'click #RandomMatchCreationButton': 'create'
		},
		create: function () {
			fetch("/create_random_match.json")
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(_.bind((res) => {
				if (res.error)
					alert(res.error)
				else
					Turbolinks.visit("/matches/" + res.id);
			}, this))
		},
	})

	App.Views.FormMatches = Backbone.View.extend({
		el: $('#MatchCreationForm'),
		initialize: function () {},
		events: {
			'submit': 'submit'
		},
		submit: function (e) {
			e.preventDefault();
			let match = {
				player2: $('input[id=formPlayer2Nickname]').val(),
				color: $('input[name="radioColor"]:checked').val(),
				boost: $('input[id=AddonBoost]').val(),
			}
			fetch("/matches/new_match", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(match)
			})
			.then(res => res.json())
			.then(_.bind((res) => {
				if (res.error)
					alert(res.error)
				else
					Turbolinks.visit("/matches/" + res.id);
			}, this))
		},
	})

/*
** VIEW OF TABLE INNER (ALL ROWS)
*/
	App.Views.Matches = Backbone.View.extend({
		tagName: 'tbody',
		initialize: function (data) {
			this.collection = data.collection
			this.type = data.type
		},
		render: function () {
			this.collection.each(this.addOne, this)
			$("#" + this.type + "MatchesTable").append(this.el)
			return this
		},
		addOne: function (match) {
			if (this.type == 'History') {
				if (match.get('is_end') == true) {
					var row = new App.Views.Match({ model: match });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Current') {
				if (match.get('is_inprogress') == true && match.get('is_end') == false) {
					var row = new App.Views.Match({ model: match });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Planned') {
				if (match.get('is_inprogress') == false && match.get('is_end') == false) {
					var row = new App.Views.Match({ model: match });
					this.$el.append(row.render().el);
				}
			}
		}
	});


	
/*
** VIEW OF TABLE
*/
	App.Views.TableMatches = Backbone.View.extend({
		template: _.template($("#MatchesTableTemplate").html()),
		initialize: function (data) {
			this.collection = data.collection
			this.type = data.type

			this.collection.on('sync', this.render, this)
		},
		render: function () {
			this.$el.html(this.template({ type: this.type }))
			$("#" + this.type + "Matches").html(this.el)
			matches = new App.Views.Matches({ collection: this.collection, type: this.type })
			matches.render()
			return this
		},
	})

/*
** VIEW OF ONE MATCH (ONE ROW)
*/
	App.Views.Match = Backbone.View.extend({
		template: _.template($("#MatchesRowTemplate").html()),
		tagName: 'tr',
		events: {
			'click #DeleteMatch' : 'deleteMatch'
		},
		render: function () {
			this.$el.html(this.template(this.model.attributes))
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


	App.Views.FormWar = Backbone.View.extend({
		template: _.template($("#WarCreateTemplate").html()),
		initialize: function () {
			this.$el.html(this.template())
			$("#WarCreationForm").html(this.el)
		},
		events: {
			'submit': 'submit'
		},
		submit: function (e) {
			e.preventDefault();
			let war = {
				guild_2: 	$(e.currentTarget).find('input[id=formGuild2Name]').val(),
				date_start: $(e.currentTarget).find('input[id=formWarDateStart]').val(),
				time_start: $(e.currentTarget).find('input[id=formWarTimeStart]').val(),
				date_end: 	$(e.currentTarget).find('input[id=formWarDateEnd]').val(),
				time_end: 	$(e.currentTarget).find('input[id=formWarTimeEnd]').val(),
				addons:		$(e.currentTarget).find('input[id=formAddons]').val(),
				prize: 		$(e.currentTarget).find('input[id=formPrize]').val(),
			}
			fetch("/wars", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(war)
			})
				.then(res => res.json())
				.then(_.bind((res) => {
					if (res.error)
						alert(res.error)
				}, this))
		},
	})


/*
** MAIN
*/
	col = new App.Collections.Match()
	new App.Views.FormMatches
	new App.Views.RandomMatches
	currentTable = new App.Views.TableMatches({ collection: col, type: 'Current' })
	plannedTable = new App.Views.TableMatches({ collection: col, type: 'Planned' })
	historyTable = new App.Views.TableMatches({ collection: col, type: 'History' })
	new App.Views.FormWar()

}());
