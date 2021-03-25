$(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	}
	window.template = function (id) {
		return _.template($('#' + id).html());
	};

	App.Models.Task = Backbone.Model.extend({
		defaults: {
			title: "sleep",
			priority: 3
		},
	});

	App.Collections.Task = Backbone.Collection.extend({
		model: App.Models.Task
	});

	App.Views.Task = Backbone.View.extend({
		initialize: function () {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},
		tagName: 'li',
		template: _.template($("#TaskTemplate").html()),//('TaskTemplate'),
		render: function () {
			var template = this.template(this.model.toJSON());

			// this.$el.css({
			// 	'color': "#007bff",
			// 	'padding'	:"10px",
			// 	'text-align':"right",
			// });

			this.$el.html(template);

			return this;
		},
		events: {
			'click title': 'showAlert',
			'click #edit': 'editTask',
			'click #delete': 'deleteTask',
			'click #priority': 'priorityTask'
		},
		showAlert: function () {
			var param = { "name": "Polya", "country": "Russia" };
			$.get('/bar', param, data => {
				alert("Response is " + data.response);
			});
		},
		editTask: function () {
			var new_titile = prompt('New task title: ');
			if (!new_titile) return;
			this.model.set('title', new_titile);
		},
		remove: function () {
			this.$el.remove();
		},
		deleteTask: function () {
			this.model.destroy();
		},
		priorityTask: function () {
			alert("Tou tapped on priority");
		}
	});

	App.Views.Tasks = Backbone.View.extend({
		tagName: 'ul',
		initialize: function () {
			this.collection.on('add', this.addOne, this);
		},
		render: function () {
			this.collection.each(this.addOne, this);
			return this;
		},
		addOne: function (task) {
			var task_view = new App.Views.Task({ model: task });
			
			// this.$el.css({
			// 	'padding': "25px",
			// });
			this.$el.append(task_view.render().el);
		}
	});

	App.Views.AddTask = Backbone.View.extend({
		el: '#AddTask',
		events: {
			'submit': 'submit'
		},
		initialize: function () {
		},
		submit: function (e) {
			e.preventDefault();
			var new_title = $(e.currentTarget).find('input[type=text]').val();
			const param = {"intra" : new_title, "nick" : new_title}
            $.post('/create', param, function(data) {
                alert("New user has been created" + data.response)
            })
			var new_task = new App.Models.Task({ title: new_title });
			this.collection.add(new_task);
			console.log(this.collection);
		}
	});

	window.tasks = new App.Collections.Task([
		{
			title: 'Trying to understand Rails',
			priority: 4,
			time: 12
		},
		{
			title: 'Trying to understand Backbone',
			priority: 2
		},
		{
			title: 'Crying',
			priority: 1
		},
		{
			title: 'Crying2',
			priority: 1
		}
	]);

	

	App.Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			'/index': 'index',
			'read': 'read'
		},
		index: function () {
			window.tasks_view = new App.Views.Tasks({ collection: tasks });
			tasks_view.render();
			$('.tasks').html(tasks_view.el);
			var add_view = new App.Views.AddTask({ collection: tasks });
		},
		read: function () {
			alert('Hello from read router');
		}
	});
	new App.Router();
	Backbone.history.start();
}());

// (function () {
// 	window.App = {
// 		Models: {},
// 		Views: {},
// 		Collections: {},
// 		Router: {},
		
// 		initialize: function () {
// 			alert("HELLO FROM BACKBONES! YES!")
// 		},
// 	}

// 	App.Models.Person = Backbone.Model.extend({
// 		defaults: {
// 			name: 'Anna',
// 			age: 22,
// 			job: 'developer'
// 		},
// 		walk: function () {
// 			return this.get('name') + ' is walking'
// 		}
// 	});

// 	var person = new App.Models.Person({});

// 	App.Views.Person = Backbone.View.extend({
// 		tagname: 'div',
// 		template: _.template($('#person-id').html()),
// 		render: function () {
// 			this.$el.html(this.template(this.model.toJSON()));
			
// 			return this;
// 		}
// 	});

// 	App.Router = Backbone.Router.extend({
// 		routes: {
// 			''		  : 'index',
// 			'profile' : 'profile'
// 		},
// 		index: function () {
// 			alert("you are on index page!");
// 		},
// 		profile: function () {
// 			alert("you are on profile page!");
// 		}
// 	});

// 	var person_view = new App.Views.Person({ model: person, el: '#cool' });
// 	var rendered = person_view.render();
// 	// new App.Router();
// 	// Backbone.history.start();

// 	// $('#cool').html(rendered.el);
// }());

// TEST
