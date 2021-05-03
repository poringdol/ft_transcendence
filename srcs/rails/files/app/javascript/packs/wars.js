const { result } = require("underscore");

$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};


// -----------------------------------------
//  WARS       MODEL and COLLECTION
// -----------------------------------------
	App.Models.War = Backbone.Model.extend({
		urlRoot: "/wars.json",
		initialize: function () {
		}
	});

	App.Collections.War = Backbone.Collection.extend({
		model: App.Models.War,
		url: "/wars.json",
		initialize: function () {
			this.fetch()
		}
	});

// ---------------------------------------------------------------------------------------------------------------------------
//                                             WARS TABLE
// ---------------------------------------------------------------------------------------------------------------------------

	// -----------------------------------------
	//  VIEW OF ONE TABLE
	// -----------------------------------------
	App.Views.TableWars = Backbone.View.extend({
		template: _.template($("#WarsTableTemplate").html()),
		initialize: function (data) {
			this.collection = data.collection
			this.type = data.type
			this.curr_user = data.curr_user

			this.collection.on('sync', this.render, this)
		},
		render: function () {
			this.$el.html(this.template({ type: this.type }))
			$("#" + this.type + "Wars").html(this.el)
			wars = new App.Views.Wars({ collection: this.collection, type: this.type, curr_user: this.curr_user })
			wars.render()
			return this
		},
	})


	// -----------------------------------------
	//  VIEW OF INNER OF ONE TABLE
	// -----------------------------------------
	App.Views.Wars = Backbone.View.extend({
		tagName: 'tbody',
		initialize: function (data) {
			this.collection = data.collection
			this.type = data.type
			this.curr_user = data.curr_user
		},
		render: function () {
			this.collection.each(this.addOne, this)
			$("#" + this.type + "WarsTable").append(this.el)

			return this
		},
		addOne: function (war) {
			if (this.type == 'History') {
				if (war.get('is_end') == true) {
					var row = new App.Views.War({ model: war, curr_user: this.curr_user });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Current') {
				if (war.get('is_accepted') == true && war.get('is_inprogress') == true && war.get('is_end') == false) {
					var row = new App.Views.War({ model: war, curr_user: this.curr_user });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Planned') {
				if (war.get('is_inprogress') == false && war.get('is_end') == false && (war.get('is_accepted') == true
					|| (this.curr_user.guild_id == war.get("guild2").id && (this.curr_user.is_officer || this.curr_user.is_owner))))
				{
					var row = new App.Views.War({ model: war, curr_user: this.curr_user });
					this.$el.append(row.render().el);
				}
			}
		},
	});


	// -----------------------------------------
	//  VIEW OF ONE ROW
	// -----------------------------------------
	App.Views.War = Backbone.View.extend({
		template: _.template($("#WarsRowTemplate").html()),
		tagName: 'tr',
		initialize: function (data) {
			this.model = data.model;
			this.curr_user = curr_user;
		},
		events: {
			'click #AcceptWarBtn':	'acceptWar',
			'click #DeclineWarBtn':	'declineWar',
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

			if (this.model.get('is_accepted') == false &&
				this.curr_user.get("guild_id") == this.model.get("guild2").id &&
				(this.curr_user.get("is_officer") || (this.curr_user.get("guild").owner_id == this.curr_user.get("id"))))
			{
				this.$el[0].innerHTML = this.$el[0].innerHTML.replace('style="display: none"', '')
				this.$el[0].innerHTML = this.$el[0].innerHTML.replace('style="display: none"', '')
			}

			return this;
		},
		declineWar: function () {
			fetch("/wars/decline/" + this.model.get("id"))
			.then(res => res.json())
			.then(_.bind((res) => {
				if (res.error)
					alert(res.error)
				else {
					alert('You successfully declined a war!')
					this.$el.remove();
				}
			}, this))
		},
		acceptWar: function () {
			fetch("/wars/accept/" + this.model.get("id"))
			.then(res => res.json())
			.then(_.bind((res) => {
				if (res.error)
					alert(res.error)
				else {
					alert('You successfully accepted a war!')
					this.model.attributes.is_accepted = true;
					this.render();
				}
			}, this))
		},
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
//                                           WARS CREATION FORM
// ---------------------------------------------------------------------------------------------------------------------------

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
				guild2: 		$(e.currentTarget).find('select[id=formGuild2Name]').val(),
				date_start: 	$(e.currentTarget).find('input[id=formWarDateStart]').val(),
				time_start: 	$(e.currentTarget).find('input[id=formWarTimeStart]').val(),
				date_end: 		$(e.currentTarget).find('input[id=formWarDateEnd]').val(),
				time_end: 		$(e.currentTarget).find('input[id=formWarTimeEnd]').val(),
				color:			$(e.currentTarget).find('input[name="radioColor"]:checked').val(),
				boost:			$('#AddonBoost').is(':checked') ? $('#AddonBoost').val() : '',
				prize: 			$(e.currentTarget).find('input[id=formPrize]').val(),
				max_unanswered: $(e.currentTarget).find('input[id=formMaxUnanswered]').val(),
			}

			if (war.prize == '')
				war.prize = 0
			if (war.max_unanswered == '')
				war.max_unanswered = 10
			fetch("/wars", {
				method: "POST",
				headers: {
					"X-CSRF-Token": TOKEN,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(war)
			})
				.then(res => res.json())
				.then(_.bind((res) => {
					if (res.error)
						alert(res.error)
					else
						alert('You successfully sent an invitation to a war!')
				}, this))
		},
	})

// ---------------------------------------------------------------------------------------------------------------------------
//                                           WARS CREATION FORM
// ---------------------------------------------------------------------------------------------------------------------------
	App.Models.CurrentUser = Backbone.Model.extend({
		url: "/get_curr_user",
		initialize: function () {
			this.fetch({
				success: () => {
					var col = new App.Collections.War()
					new App.Views.FormWar()
					currentTable = new App.Views.TableWars({ collection: col, type: 'Current', curr_user: this.attributes })
					plannedTable = new App.Views.TableWars({ collection: col, type: 'Planned', curr_user: this.attributes })
					historyTable = new App.Views.TableWars({ collection: col, type: 'History', curr_user: this.attributes })

					var guild_list = new App.Collections.AllGuilds()
					new App.Views.AllGuilds({ collection: guild_list });
					$("#WarsTableRefresh").on("click", function() { col.fetch(); })
				}
			})
		}
	})

// ---------------------------------------------------------------------------------------------------------------------------
//                                            MAIN
// ---------------------------------------------------------------------------------------------------------------------------
	const TOKEN = document.querySelector("[name='csrf-token']").content;
	curr_user = new App.Models.CurrentUser()
}());
