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

			this.collection.on('sync', this.render, this)
		},
		render: function () {
			this.$el.html(this.template({ type: this.type }))
			$("#" + this.type + "Wars").html(this.el)
			wars = new App.Views.Wars({ collection: this.collection, type: this.type })
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
		},
		render: function () {
			this.collection.each(this.addOne, this)
			$("#" + this.type + "WarsTable").append(this.el)
			return this
		},
		addOne: function (war) {
			if (this.type == 'History') {
				if (war.get('is_end') == true) {
					var row = new App.Views.War({ model: war });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Current') {
				if (war.get('is_accepted') == true && war.get('is_inprogress') == true && war.get('is_end') == false) {
					var row = new App.Views.War({ model: war });
					this.$el.append(row.render().el);
				}
			}
			else if (this.type == 'Planned') {
				if (war.get('is_accepted') == true && war.get('is_inprogress') == false && war.get('is_end') == false) {
					var row = new App.Views.War({ model: war });
					this.$el.append(row.render().el);
				}
			}
		}
	});


	// -----------------------------------------
	//  VIEW OF ONE ROW
	// -----------------------------------------
	App.Views.War = Backbone.View.extend({
		template: _.template($("#WarsRowTemplate").html()),
		tagName: 'tr',
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
			return this;
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
			console.log('here')
			let war = {
				guild2: 	$(e.currentTarget).find('select[id=formGuild2Name]').val(),
				date_start: $(e.currentTarget).find('input[id=formWarDateStart]').val(),
				time_start: $(e.currentTarget).find('input[id=formWarTimeStart]').val(),
				date_end: 	$(e.currentTarget).find('input[id=formWarDateEnd]').val(),
				time_end: 	$(e.currentTarget).find('input[id=formWarTimeEnd]').val(),
				color:		$(e.currentTarget).find('input[name="radioColor"]:checked').val(),
				boost:		$('#AddonBoost').is(':checked') ? $('#AddonBoost').val() : '',
				prize: 		$(e.currentTarget).find('input[id=formPrize]').val(),
			}
			if (war.prize == '')
				war.prize = 0
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
					else
						alert('You successfully sent an invitation to a war!')
				}, this))
		},
	})

// ---------------------------------------------------------------------------------------------------------------------------
//                                            MAIN
// ---------------------------------------------------------------------------------------------------------------------------

	var col = new App.Collections.War()
	new App.Views.FormWar()
	currentTable = new App.Views.TableWars({ collection: col, type: 'Current' })
	plannedTable = new App.Views.TableWars({ collection: col, type: 'Planned' })
	historyTable = new App.Views.TableWars({ collection: col, type: 'History' })
	
	var guild_list = new App.Collections.AllGuilds()
	new App.Views.AllGuilds({ collection: guild_list });
	$("#WarsTableRefresh").on("click", function() { col.fetch(); })

}());
