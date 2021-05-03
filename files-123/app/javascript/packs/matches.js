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
	App.Models.Match = Backbone.Model.extend({ urlRoot: "/matches.json" });

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
				player2: $('#formPlayer2Nickname').val(),
				color: $('input[name="radioColor"]:checked').val(),
				boost: $('#AddonBoost').is(':checked') ? $('#AddonBoost').val() : '',
			}
			fetch("/matches/new_match", {
				method: "POST",
				headers: {
					"X-CSRF-Token": TOKEN,
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
			this.model.attributes.addon_type = ''
			if (this.model.attributes.addons.addon3 == true)
				this.model.attributes.addon_type = 'boost '
			if (this.model.attributes.addons.addon1 == true)
				this.model.attributes.addon_type += 'disco'
			else if (this.model.attributes.addons.addon2 == true)
				this.model.attributes.addon_type += 'epilepsy'
			if (this.model.attributes.addon_type == '')
				this.model.attributes.addon_type = 'none'
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

/*
** Выпадающий список со всеми пользователями для формы создания матча
*/
	App.Models.AllUsers = Backbone.Model.extend({ urlRoot: "/users_list" })
	App.Collections.AllUsers = Backbone.Collection.extend({
		url: "/users_list",
		model: App.Models.AllUsers,
		initialize: function() { this.fetch(); },
	});

	App.Views.AllUsers = Backbone.View.extend({

		initialize: function() {
			this.collection.on('sync', this.render, this)
		},
        render: function () {
			$('#formPlayer2Nickname').css('color', 'rgba(0, 0, 0, 0.55)');
			$('#formPlayer2Nickname').append(`<option value='' disabled selected>Select an opponent</option>`);
            this.collection.each((it) => {
				var nickname = it.get("nickname");
				$('#formPlayer2Nickname').append(`<option value='${nickname}'>${nickname}</option>`);
			});
            return this;
        }
    });

/*
** MAIN
*/
	const TOKEN = document.querySelector("[name='csrf-token']").content;

	var col = new App.Collections.Match()
	new App.Views.FormMatches
	new App.Views.RandomMatches
	currentTable = new App.Views.TableMatches({ collection: col, type: 'Current' })
	plannedTable = new App.Views.TableMatches({ collection: col, type: 'Planned' })
	historyTable = new App.Views.TableMatches({ collection: col, type: 'History' })

	var user_list = new App.Collections.AllUsers()
	new App.Views.AllUsers({ collection: user_list });
	$("#MatchesTableRefresh").on("click", function() { col.fetch(); })

}());
