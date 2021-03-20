/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packs/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/index.js":
/*!***************************************!*\
  !*** ./app/javascript/packs/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

document.addEventListener("DOMContentLoaded", function () {
  new App.Router(); // new NavBar.Router();

  Backbone.history.start(); // var navbar = new NavBar.Views.Header();
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
}); // const BASE_URL = "http://localhost:3000"
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

/***/ })

/******/ });
//# sourceMappingURL=index-657ce978272c88bd139a.js.map