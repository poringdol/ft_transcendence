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
			console.log(this)
		}
	});

	App.Collections.War = Backbone.Collection.extend({
		model: App.Models.War,
		url: "/wars.json",
		initialize: function () {
			this.fetch()
			console.log(this)
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
			this.$el.html(this.template(this.model.attributes))
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
				guild2: 	$(e.currentTarget).find('input[id=formGuild2Name]').val(),
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

// ---------------------------------------------------------------------------------------------------------------------------
//                                            MAIN
// ---------------------------------------------------------------------------------------------------------------------------

	var col = new App.Collections.War()
	new App.Views.FormWar()
	currentTable = new App.Views.TableWars({ collection: col, type: 'Current' })
	plannedTable = new App.Views.TableWars({ collection: col, type: 'Planned' })
	historyTable = new App.Views.TableWars({ collection: col, type: 'History' })
	
	$("#WarsTableRefresh").on("click", function() { col.fetch(); })

}());
