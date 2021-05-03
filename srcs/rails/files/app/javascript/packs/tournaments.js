const { result } = require("underscore");

$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};


// -----------------------------------------
//  TOURNAMENTS       MODEL and COLLECTION
// -----------------------------------------
	App.Models.Tournament = Backbone.Model.extend({
		urlRoot: "/tournaments",
		initialize: function () {}
	});

	App.Collections.Tournament = Backbone.Collection.extend({
		model: App.Models.Tournament,
		url: "/tournaments",
		initialize: function () {
			this.fetch()
		}
	});

// ---------------------------------------------------------------------------------------------------------------------------
//                                             TOURNAMENTS TABLE
// ---------------------------------------------------------------------------------------------------------------------------

	// -----------------------------------------
	//  VIEW OF ONE TABLE
	// -----------------------------------------
	App.Views.TableTournaments = Backbone.View.extend({
		template: _.template($("#TournamentsTableTemplate").html()),
		initialize: function (data) {
			this.collection = data.collection
			this.type = data.type

			this.collection.on('sync', this.render, this)
		},
		render: function () {
			this.$el.html(this.template({ type: this.type }))
			$("#" + this.type + "Tournaments").html(this.el)
			tournaments = new App.Views.Tournaments({ collection: this.collection, type: this.type })
			tournaments.render()
			return this
		},
	})


	// -----------------------------------------
	//  VIEW OF INNER OF ONE TABLE
	// -----------------------------------------
	App.Views.Tournaments = Backbone.View.extend({
		tagName: 'tbody',
		initialize: function (data) {
			this.collection = data.collection
			this.type = data.type
		},
		render: function () {
			this.collection.each(this.addOne, this)
			$("#" + this.type + "TournamentsTable").append(this.el)
			return this
		},
		addOne: function (tournament) {
			if (this.type == 'History') {
				if (tournament.get('is_end') == true) {
					var row = new App.Views.Tournament({ model: tournament, type: this.type });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Current') {
				if (tournament.get('is_inprogress') == true && tournament.get('is_end') == false) {
					var row = new App.Views.Tournament({ model: tournament, type: this.type });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Planned') {
				if (tournament.get('is_inprogress') == false && tournament.get('is_end') == false) {
					var row = new App.Views.Tournament({ model: tournament, type: this.type });
					this.$el.append(row.render().el);
				}
			}
		}
	});


	// -----------------------------------------
	//  VIEW OF ONE ROW
	// -----------------------------------------
	App.Views.Tournament = Backbone.View.extend({
		template: _.template($("#TournamentsRowTemplate").html()),
		tagName: 'tr',
		initialize: function (data) {
			this.model = data.model
			this.model.attributes.type = data.type

			this.model.on('sync', this.render, this)
		},
		events: {
			'click #PlannedJoinTournament': 'join'
		},
		render: function () {
			this.model.attributes.start_date = new Date(this.model.attributes.start)
			this.model.attributes.end_date = new Date(this.model.attributes.end)
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
			if (this.model.attributes.type == 'Planned')
				this.$el[0].innerHTML = this.$el[0].innerHTML.replace('style="display: none"', '')
			return this;
		},
		join: function () {
			let tournament_user = {
				tournament_id: this.model.attributes.id
			}
			fetch("/tournaments/join", {
				method: "POST",
				headers: {
					"X-CSRF-Token": TOKEN,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(tournament_user)
			})
				.then(res => res.json())
				.then(_.bind((res) => {
					if (res.error)
						alert(res.error)
					else {
						alert('You successfully joined a tournament!')
						this.model.attributes.members.count += 1
						this.render()
					}
				}, this))
		}
	});

/*
** Выпадающий список со всеми пользователями для формы создания матча
*/
	App.Models.AllGuilds = Backbone.Model.extend({ urlRoot: "/guilds_list" })
	App.Collections.AllGuilds = Backbone.Collection.extend({
		url: "/guilds_list",
		model: App.Models.AllGuilds,
		initialize: function() { this.fetch(); },
	});

	App.Views.AllGuilds = Backbone.View.extend({
		initialize: function() {
			this.collection.on('sync', this.render, this)
		},
        render: function () {
			$('#formGuild2Name').css('color', 'rgba(0, 0, 0, 0.55)');
			$('#formGuild2Name').append(`<option value='' disabled selected>Guildname of your opponent</option>`);
            this.collection.each((it) => {
				var name = it.get("name");
				$('#formGuild2Name').append(`<option value='${name}'>${name}</option>`);
			});
            return this;
        }
    });


// ---------------------------------------------------------------------------------------------------------------------------
//                                           TOURNAMENTS CREATION FORM
// ---------------------------------------------------------------------------------------------------------------------------

	App.Views.FormTournament = Backbone.View.extend({
		template: _.template($("#TournamentCreateTemplate").html()),
		initialize: function () {
			this.$el.html(this.template())
			$("#TournamentCreationForm").html(this.el)
		},
		events: {
			'submit': 'submit'
		},
		submit: function (e) {
			e.preventDefault();
			let tournament = {
				name: 		$(e.currentTarget).find('input[id=formTournamentName]').val(),
				date_start: $(e.currentTarget).find('input[id=formTournamentDateStart]').val(),
				time_start: $(e.currentTarget).find('input[id=formTournamentTimeStart]').val(),
				date_end: 	$(e.currentTarget).find('input[id=formTournamentDateEnd]').val(),
				time_end: 	$(e.currentTarget).find('input[id=formTournamentTimeEnd]').val(),
				color:		$(e.currentTarget).find('input[name="radioColor"]:checked').val(),
				boost:		$('#AddonBoost').is(':checked') ? $('#AddonBoost').val() : '',
				prize: 		$(e.currentTarget).find('input[id=formPrize]').val(),
			}
			if (tournament.prize == '')
				tournament.prize = 0
			fetch("/tournaments", {
				method: "POST",
				headers: {
					"X-CSRF-Token": TOKEN,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(tournament)
			})
				.then(res => res.json())
				.then(_.bind((res) => {
					if (res.error)
						alert(res.error)
					else {
						alert('You successfully created a tournament!')
						this.collection.fetch()
					}
				}, this))
		},
	})

// ---------------------------------------------------------------------------------------------------------------------------
//                                            MAIN
// ---------------------------------------------------------------------------------------------------------------------------
	const TOKEN = document.querySelector("[name='csrf-token']").content;
	var col = new App.Collections.Tournament()
	new App.Views.FormTournament({ collection: col })
	window.currentTable = new App.Views.TableTournaments({ collection: col, type: 'Current' })
	window.plannedTable = new App.Views.TableTournaments({ collection: col, type: 'Planned' })
	window.historyTable = new App.Views.TableTournaments({ collection: col, type: 'History' })

	var guild_list = new App.Collections.AllGuilds()
	new App.Views.AllGuilds({ collection: guild_list });
	$("#TournamentsTableRefresh").on("click", function () { col.fetch(); })

}());
