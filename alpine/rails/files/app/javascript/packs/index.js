document.addEventListener("DOMContentLoaded", () => {
	// console.log("HISTORY START");
	// new App.Router();
	// // new NavBar.Router();
	// Backbone.history.start();
	
	// var navbar = new NavBar.Views.Header();
	// navbar.render();
	// var main_page = new MainPage.Views.Login();
	// $('#HeaderBar').html(main_page.el);
	// let coll = new AppUser.Collections.User();
	// let usersView = new AppUser.Views.Users({ collection: coll });
	// var tmp = fetchUsers(usersView);
	// var tmp = fetchGuilds();
	// createForm(usersView);
	// var navbar = new NavBar.Views.Header();
	// navbar.render();
	// $('#HeaderBar').html(navbar.el);
});

// const BASE_URL = "http://localhost:3000"

// function fetchUsers(usersView) {
// 	usersView.render();
// 	$('#userDiv').html(usersView.el);
// }

// function getUserId()
// {
// 	var tmp;
// 	jQuery.ajax({
//         url: 'http://localhost:3000/get_user_id',
// 		success: function (result) {
// 			tmp = result;
//         },
// 		async: false
// 	});
// 	return tmp;

	// $.get( "http://localhost:3000/get_user_id", user_id => {})
  	// .done(function(user_id) {
	// 	return (user_id)
  	// })
  	// .fail(function() {
   	// 	alert( "error" );
  	// })
  	// .always(function() {
    // 	;
	// });

	// fetch('http://localhost:3000/get_user_id')
	// .then(resp => resp.json())
	// .then(user_id => {
	// 	alert(user_id)
	// })
// }

// function createForm(usersView) {
// 	let userForm = document.getElementById("userForm");
// 	$(userForm).html(
// 		'<div class="class row" style="margin-left: 20px">' +
// 			'<div class="col-3">' +
// 				'<form class="row">' +
// 					'<label for="userFromIntra" class="visually-hidden">Email</label>' +
// 					'<input placeholder="Intra login" type="text" class="form-control col" id="userFromIntra" value="">' +
// 				'</form>' +
// 				'<form class="row">' +
// 					'<label for="userFromNick" class="visually-hidden">Email</label>' +
// 					'<input placeholder="Nickname" type="text" class="form-control col" id="userFromNick" value="">' +
// 				'</form>' +
// 				'<form class="row">' +
// 					'<label for="inputPassword2" class="visually-hidden">Email</label>' +
// 					'<input placeholder="Guild" type="text" class="form-control col" id="userFromGuild" value="">' +
// 				'</form>' +
// 				'<form class="row">' +
// 					'<input type="submit" class="btn btn-outline-dark mb-3 col" value="create">' +
// 				'</form>' +
// 			'</div>' +
// 		'</div>');
	
// 	userForm.addEventListener("submit", () => {
// 		var new_user_id = getUserId() + 1;
// 		event.preventDefault();
// 		let user = {
// 			user_id: new_user_id,
// 			intra: document.getElementById("userFromIntra").value,
// 			nick: document.getElementById("userFromNick").value, is_online: true, guild_id: 1, guild_join_time: '2021-01-03', wins: 0, loses: 0, score: 0
// 		}

// 		fetch("http://localhost:3000/users", {
// 			method: "POST",
// 			headers: {
// 				'Accept': 'application/json',
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify(user)
// 		})
// 			.then(res => res.ok ? res.json() : Promise.reject(res))
// 			.then(user => {
// 				new_user = new AppUser.Models.User(user);
// 				usersView.addOne(new_user);
// 			})
// 			.catch(() => {
// 				alert('Error! Unable to create user!')
// 			})
// 	})
// }

// function deleteUser(id) {
// 	$.ajax({
// 		url: 'http://localhost:3000/users/' + id,
// 		type: 'DELETE',
// 		success: function(result) {
// 			alert ("done!")
// 		}
// 	});
// }

// function fetchUsers() {
// 	fetch('http://localhost:3000/users')
// 		.then(resp => resp.json())
// 		.then(users => {
// 			let coll = new AppUser.Collections.User();
// 			// for (const user of users) {
// 			// 	let u = new AppUser.Models.User(user)//user.id, user.user_id, user.intra, user.nick, user.guild_id)
// 			// 	coll.add(u)
// 			// }
// 			// coll.fetch();
// 			console.log(coll);
// 			let usersView = new AppUser.Views.Users({ collection: coll });
// 			usersView.render();
// 			$('#userDiv').html(usersView.el);
// 		})
// }

// function checkCollection() {
// 	let coll = new AppUser.Collections.User();
// 	coll.fetch();
// 	console.log(coll);

// }

// let coll = new AppUserUser.Collections.User({});
// for (const user of users) {
// 	// console.log(user)
// 	let u = new AppUserUser.Models.User(user.id, user.user_id, user.intra, user.nick, user.guild_id)
// 	coll.add(u)
// 	// console.log("backbone", u.nick)
// 	//console.log(coll);
// 	// let userView = new AppUserUser.Views.User({ model: u })
// 	// userView.render()
// }
// console.log(coll);
// let usersView = new AppUserUser.Views.Users({ collection: coll });
// usersView.render();
// $('#userDiv').html(usersView.el);


// function fetchGuilds() {
// 	fetch('http://localhost:3000/guilds')
// 		.then(resp => resp.json())
// 		.then(guilds => { console.log(guilds) })
// }
