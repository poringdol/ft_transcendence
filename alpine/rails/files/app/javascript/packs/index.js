$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	App.Models.Guild = Backbone.Model.extend({
		urlRoot: 'http://localhost:3000/guilds',
		initialize: function (curr_guild) {
			this.id = curr_guild.id;
			this.name = curr_guild.name;
			this.anagram = curr_guild.anagram;
			this.score = curr_guild.score;
			this.owner_id = curr_guild.owner_id;
			this.created_at = curr_guild.created_at;
			this.updated_at = curr_guild.updated_at;
		}
	});

	App.Collections.Guild = Backbone.Collection.extend({
		model: App.Models.Guild,
		url: 'http://localhost:3000/guilds',
		initialize: function () {
			this.fetch();
		}
	});

	App.Views.Guild = Backbone.View.extend({
		tagName: 'span',
		className: 'GuildCard',
		template: _.template($("#GuildTemplate").html()),
		initialize: function () {
			this.model.on('destroy', this.remove, this);
		},
		events: {
			'click #delete_guild': 'delete_guild'
		},
		render: function () {
			var template = this.template(this.model);
			// this.$el.css({ 'display': "inline-block", 'margin': '10px' });
			this.$el.append(template);
			return this;
		},
		remove: function () {
			this.$el.remove();
			// form.render();
		},
		delete_guild: function () {

			var promise = this.model.destroy([], {
				dataType: "text"
			})

			$.when(promise).done(
				_.bind(function (data) {
					$('#GuildForm').css({ "display": "block" });
				}, this)
			);
		}
	})

	App.Views.Guilds = Backbone.View.extend({
		initialize: function () {
			this.collection.on('add', this.addOne, this);
			this.collection.on('change', this.addOne, this);
			this.render();
		},
		render: function () {
			this.collection.each(this.addOne, this);
			$('#GuildsTemplate').append(this.el);
			return this;
		},
		addOne: function (guild) {
			console.log(guild.name);
			var guildView = new App.Views.Guild({ model: guild });
			this.$el.append(guildView.render().el);
		}
	});

	App.Views.NewGuild = Backbone.View.extend({
		template: _.template($("#GuildFormTemplate").html()),
		alertTemplate: _.template($("#AlertTemplate").html()),
		// initialize: function () {
		// 	this.$el.html(this.template)
		// },
		events: {
			'submit': 'submit'
		},
		render: function () {
			this.$el.html(this.template) 
			$('#GuildForm').html(this.el);
		},
		submit: function (e) {
			e.preventDefault();
			let guild = {
				name: $(e.currentTarget).find('input[id=guildFormName]').val(),
				anagram: $(e.currentTarget).find('input[id=guildFormAnagram]').val()
			}
			new_guild = new App.Models.Guild(guild);

			var promise = new_guild.save([], {
				dataType: "text"
			})

			$.when(promise).done(
				_.bind(function (data) {
    				alert('success');
					this.collection.fetch()
					$('#GuildForm').css({ "display": "none" });
				}, this)
			);

			$.when(promise).fail(function (resp) {
				alert(resp.responseText);
			});


			// new_guild.save({}, {
			// 	dataType:"text",
			// 	success: function (model, response) {
			// 		alert("success");
			// 		this.collection.fetch()
			// 	},
			// 	error: function (model, response) {
			// 		alert("error");
			// 	}
			// });


			// .success(response => {
			// 	alert('success')
			// })
			// .then(res => res.ok ? alert('ok') : Promise.reject(res))
			// .then(resp => {
			// 	console.log('then')
			// 	console.log(resp)
			// })
			// .catch(response => {
			// 	console.log('catch')
			// 	// console.log(response)
			// 	this.collection.fetch()
			// })
			// new_guild.changedAttributes()
			// this.collection.fetch()
			// alert(new_guild.name + new_guild.owner_id)
			// new_guild.sync()
			// alert(new_guild.name + new_guild.owner_id)
			// fetch("http://localhost:3000/create_new_guild", {
			// 	method: "POST",
			// 	headers: {
			// 		'Accept': 'application/json',
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify(guild)
			// })
			// .then(res => res.ok ? res.json() : Promise.reject(res))
			// .then(user => {
			// 	new_guild = new App.Models.Guild(guild);
			// 	this.collection.add(new_user);
			// })
			// .catch(() => {
			// 	alert('Error! Unable to create guild!')
			// })
		},

	})

	col = new App.Collections.Guild();
	form = new App.Views.NewGuild({ collection: col });
	form.render();
	guilds_view = new App.Views.Guilds({ collection: col});
	
}());