const { Collection } = require("backbone");

$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	// --------------------------------------------
	// Leaderboard      MODEL and COLLECTION
	// --------------------------------------------
	App.Models.Leaderboard = Backbone.Model.extend({
		urlRoot: "/leaderboard"
	});

	App.Collections.Leaderboard = Backbone.Collection.extend({
		url: "/leaderboard",
		model: App.Models.Leaderboard,
		initialize: function() {
			this.fetch();
		},
		// refresh: function() { this.fetch(); }
	});

	// -----------------------------------------
    // Leaderboard          COLLECTION VIEW
    // -----------------------------------------
    App.Views.Leaderboard = Backbone.View.extend({
        // className: 'list-group',
		initialize: function() {
			this.collection.on('sync', this.render, this)
		},
        render: function () {
			$('#Leaderboard').html("")
			this.$el.html("")

			this.position = 1;
            this.collection.each(this.addOne, this);
            $('#Leaderboard').html(this.el);
            return this;
        },
		addOne: function (Leaderboard) {
            var LeaderboardView = new App.Views.LeaderboardListEl({ model: Leaderboard, position: this.position });
			this.$el.append(LeaderboardView.render().el);
			this.position += 1;
        },
		refresh: function () {
			this.collection.fetch();
		}
    });

	// -----------------------------------------
    // Leaderboard          MODEL LIST VIEW
    // -----------------------------------------
    App.Views.LeaderboardListEl = Backbone.View.extend({
        tagName: 'div',
        className: 'list-group-item list-group-item-action',
        templateList: _.template($("#LeaderboardListElTemplate").html()),
		initialize: function(data) {
			this.model = data.model;
			this.model.attributes.position = data.position;
		},
        render: function () {
            // this.$el.attr({'data-bs-toggle': "list"});
            this.$el.css({ "padding": "0px" })
            var template = this.templateList(this.model.attributes);
            this.$el.append(template);
            return this;
        },
    })
	const TOKEN = document.querySelector("[name='csrf-token']").content;

	var coll = new App.Collections.Leaderboard()
	new App.Views.Leaderboard({collection: coll})
	$("#LeaderboardRefresh").on("click", function() { coll.fetch(); })
})
