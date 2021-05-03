const { result } = require("underscore");

$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};


// -----------------------------------------
//  TOURNAMENTS       MODEL
// -----------------------------------------
	App.Models.Tournament = Backbone.Model.extend({
		url: "/tournaments/",
		initialize: function () {
			this.url += tournament_id + '.json'
			this.fetch()
		}
	});

// ---------------------------------------------------------------------------------------------------------------------------
//                                                TOURNAMENT   INFO
// ---------------------------------------------------------------------------------------------------------------------------
	App.Views.TournamentTitle = Backbone.View.extend({
		template: _.template($("#TournamentTitleTemplate").html()),
		initialize: function () {
			$("#TournamentTitle").html(this.template())
		}
	})

	App.Views.TournamentCard = Backbone.View.extend({
		template: _.template($("#TournamentCardTemplate").html()),
		initialize: function (data) {
			this.model = data.model
			this.members = data.members

			this.model.on('sync', this.render, this)
		},
		events: {
			'click #LeaveTournamentBtn': 'leave',
			'click #JoinTournamentBtn':	 'join',
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
			if (this.model.attributes.is_end == true)
				this.model.attributes.status = 'finished'
			else if (this.model.attributes.is_inprogress == true)
				this.model.attributes.status = 'in progress'
			else
				this.model.attributes.status = 'not started'
			this.$el.html(this.template(this.model.attributes))
			$("#TournamentCard").html(this.el)
			if (this.model.attributes.status == 'not started') {
				fetch('/tournaments/curr_user_is_in_tournament/' + tournament_id)
					.then(res => res.json())
					.then(res => {
						if (res == 1)
							$("#LeaveTournamentLi").css({ 'display': 'block' })
						else
							$("#JoinTournamentLi").css({ 'display': 'block' })
				})
			}
		},
		join: function () {
			let tournament_user = {
				tournament_id: tournament_id
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
						this.members.fetch()
						this.model.attributes.members.count += 1
						this.render()
					}
				}, this))
		},
		leave: function () {
			fetch("/tournaments/leave/" + tournament_id)
				.then(res => res.json())
				.then(_.bind((res) => {
					if (res.error)
						alert(res.error)
					else {
						this.members.fetch()
						this.model.attributes.members.count -= 1
						this.render()
					}
				}, this))
		}
	})




// ---------------------------------------------------------------------------------------------------------------------------
//                                             TOURNAMENT    MEMBERS
// ---------------------------------------------------------------------------------------------------------------------------

	App.Models.Members = Backbone.Model.extend({
		urlRoot: "/tournaments/members/",
		initialize: function () {
		}
	});

	App.Collections.Members = Backbone.Collection.extend({
		model: App.Models.Members,
		url: "/tournaments/members/",
		initialize: function () {
			this.url += tournament_id
			this.fetch()
		}
	});

	App.Views.MembersTable = Backbone.View.extend({
		template: _.template($("#TournamentsMembersTableTemplate").html()),
		initialize: function () {
			this.collection.on('sync', this.render, this)
		},
		render: function () {
			this.$el.html(this.template())
			$("#TournamentMembers").html(this.el)
			members = new App.Views.Members({ collection: this.collection })
			members.render()
		}
	});

	App.Views.Members = Backbone.View.extend({
		tagName: 'tbody',
		render: function () {
			this.collection.each(this.addOne, this)
			$("#TournamentMembersTable").append(this.el)
			return this
		},
		addOne: function (member) {
			var row = new App.Views.Member({ model: member });
			this.$el.append(row.render().el);
		}
	});

	App.Views.Member = Backbone.View.extend({
		template: _.template($("#MembersRowTemplate").html()),
		tagName: 'tr',
		render: function () {
			this.$el.html(this.template(this.model.attributes))
			return this
		}
	});




// ---------------------------------------------------------------------------------------------------------------------------
//                                             TOURNAMENT  MATCHES
// ---------------------------------------------------------------------------------------------------------------------------

	App.Models.Matches = Backbone.Model.extend({
		urlRoot: "/tournaments/matches/",
		initialize: function () {
		}
	});

	App.Collections.Matches = Backbone.Collection.extend({
		model: App.Models.Matches,
		url: "/tournaments/matches/",
		initialize: function () {
			this.url += tournament_id
			this.fetch()
		}
	});

	App.Views.CardMatches = Backbone.View.extend({
		template: _.template($("#MatchesCardTemplate").html()),
		initialize: function () {
			$("#TournamentMatches").html(this.template())
		}
	})

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
			match = match.attributes.match
			if (this.type == 'History') {
				if (match.is_end == true) {
					var row = new App.Views.Match({ model: match });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Current') {
				if (match.is_inprogress == true && match.is_end  == false) {
					var row = new App.Views.Match({ model: match });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Planned') {
				if (match.is_inprogress == false && match.is_end  == false) {
					var row = new App.Views.Match({ model: match });
					this.$el.append(row.render().el);
				}
			}
		}
	});

	App.Views.Match = Backbone.View.extend({
		template: _.template($("#MatchesRowTemplate").html()),
		tagName: 'tr',
		render: function () {
			this.model.addon_type = ''
			if (this.model.addons.addon3 == true)
				this.model.addon_type = 'boost '
			if (this.model.addons.addon1 == true)
				this.model.addon_type += 'disco'
			else if (this.model.addons.addon2 == true)
				this.model.addon_type += 'epilepsy'
			if (this.model.addon_type == '')
				this.model.addon_type = 'none'
			this.$el.html(this.template(this.model))
			return this;
		}
	});

// ---------------------------------------------------------------------------------------------------------------------------
//                                             TOURNAMENT  WINNER
// ---------------------------------------------------------------------------------------------------------------------------

	App.Views.TournamentWinner = Backbone.View.extend({
		template: _.template($("#TournamentWinnerTemplate").html()),
		initialize: function (data) {
			this.collection = data.collection
			this.tournament = data.tournament
			this.collection.on('sync', this.render, this)
		},
		render: function () {
			if (this.tournament.attributes.is_end == true)
				$("#TournamentWinner").html(this.template(this.collection.models[0].attributes))
		}
	})


// ---------------------------------------------------------------------------------------------------------------------------
//                                            MAIN
// ---------------------------------------------------------------------------------------------------------------------------
	const TOKEN = document.querySelector("[name='csrf-token']").content;

	const urlArray 		 = window.jQuery.ajaxSettings.url.split('/')
	window.tournament_id = urlArray[urlArray.length - 1]

	var tournament		 = new App.Models.Tournament()
	var members			 = new App.Collections.Members()
	var matches			 = new App.Collections.Matches()

	tournamentWinner	 = new App.Views.TournamentWinner({ collection: members, tournament: tournament})
	tournamentTitle 	 = new App.Views.TournamentTitle()
	tournamentCard		 = new App.Views.TournamentCard({ model: tournament, members: members })
	tournamentMembers 	 = new App.Views.MembersTable({ collection: members })

	MatchesCard			 = new App.Views.CardMatches({})
	currentMatchesTable	 = new App.Views.TableMatches({ collection: matches, type: 'Current' })
	plannedMatchesTable  = new App.Views.TableMatches({ collection: matches, type: 'Planned' })
	historyMatchesTable	 = new App.Views.TableMatches({ collection: matches, type: 'History' })

}());
