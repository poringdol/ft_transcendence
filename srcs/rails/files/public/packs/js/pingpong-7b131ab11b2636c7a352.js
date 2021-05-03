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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/pingpong.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/pingpong.js":
/*!******************************************!*\
  !*** ./app/javascript/packs/pingpong.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// $(function(){
//  'use strict';
// 	const KEYS = {start: 13, up: 87, down: 83};
// 	const MATCH_ID = $("#MatchID").attr("data-MatchID");
// 	window.App = {
// 		Models: {},
// 		Views: {},
// 		Collections: {},
// 		Router: {}
// 	};
//  //  MATCH              MODEL
// 	App.Models.Match = Backbone.Model.extend({
// 		urlRoot: `/matches/match_users/${MATCH_ID}.json`,
// 		initialize: function () { this.fetch(); }
//  	})
//  //  MATCH              VIEW
//  	App.Views.Match = Backbone.View.extend({
// 		template_score: _.template($("#MatchScoreTemplate").html()),
// 	initialize: function () {
// 		this.model.on("sync", this.start_game, this);
// 		this.model.on("change", this.render_score, this);
// 	},
// 	start_game: function () {
// 		window.game = new Game(this.model);
// 		game.startGame();
// 		console.log(this.model);
// 		this.render_score();
// 	},
// 	render_score: function () {
// 		var template = this.template_score(this.model.attributes);
// 		this.$el.html(template);
// 		$("#MatchScore").html(this.el);
// 	}
//  })
//  // SCORE        VIEW
//  //Опишем наши игровые объекты + научим их рисовать себя на канвасе и передвигаться
// 	var Ball = function () {
// 		return {
// 			radius: 8,
// 			color: '#FFCC00',
// 			x: 0,
// 			y: 0,
// 			yspeed: 5,
// 			xspeed: 7,
// 			bounce: 1.1, //коофицент упругости - для ускорения шарика после отскока
// 			render: function (ctx) {
// 			ctx.beginPath();
// 			ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
// 			ctx.fillStyle = this.color;
// 			ctx.fill();
// 			},
// 			//Передвижение шара всегда происходит с определенной скоростью 
// 			//поэтому мы не будем передавть x y для кастомного перемещения.
// 			move: function () {
// 			this.x = this.x + this.xspeed;
// 			this.y = this.y + this.yspeed;
// 			}
// 		}
// 	};
// 	//Блоки для отбивания шарика
// 	var Bracket = function () {
// 		return {
// 			w: 10,
// 			h: 100,
// 			x: 0,
// 			y: 0,
// 			speed: 50,
// 			color: '#CCFF00',
// 			render: function (ctx) {
// 			ctx.fillStyle = this.color;
// 			ctx.fillRect(this.x, this.y, this.w, this.h);
// 			}
// 		}
// 	};
//  //Собственно сам игрок с его свойствами
// 	var Player = function () {
// 		return {
// 			rate: 0
// 		};
// 	};
//  //Теперь сама игра
// 	var Game = function (curr_match) {
// 		//Сохраним ссылку на контекст
// 		//для дальнейшей передачи в ивенты
// 		var _this = this;
// 		//Параметры с которыми будет игра
// 		this.params = {
// 			width: 960,
// 			height: 600,
// 			state: 'loading', //Состояние игры
// 			maxRate: 10 //до скольки будет идти матч.
// 	};
// 	//Сохраняем ссылки на canvas и контекст для дальнейшего рисования
// 	this.canvasBlock = document.getElementById('pingpong');
// 	this.ctx = this.canvasBlock.getContext('2d');
// 	//Подписываемся на события кнопок, если пользователь участник игры
// 	let player = curr_match.get("current_user").id == curr_match.get("player1").id ? 1 :
// 							 curr_match.get("current_user").id == curr_match.get("player2").id ? 2 : 0;
// 	if (player > 0) {
// 		document.addEventListener('keydown', function (event) {
// 			_this.keyDownEvent.call(_this, event, curr_match, player);
// 		});
// 		// var keeDown = function (event) { _this.keyDownEvent.call(_this, event, curr_match, player); }
// 		// document.addEventListener('keydown', _.throttle(keeDown, 100));
// 	}
// 	return this;
//  };
//  //В прототип будем писать методы всякие игровые
//  	Game.prototype = {
// 		//Старт игры
// 		startGame: function () {
// 			var _this = this;
// 			//Инициализируем игровые объекты
// 			this.objects = {
// 			ball: new Ball(),
// 			player1: new Player(),
// 			player2: new Player(),
// 			bracket1: new Bracket(),
// 			bracket2: new Bracket()
// 			};
// 			//Меняем состояние
// 			this.params.state = 'game';
// 			//Расставляем стартовые позиции ракеток
// 			this.objects.bracket1.x = 50;
// 			this.objects.bracket1.y = this.params.height / 2 - this.objects.bracket1.h / 2;
// 			this.objects.bracket2.x = this.params.width - 50;
// 			this.objects.bracket2.y = this.params.height / 2 - this.objects.bracket1.h / 2;
// 			this.params.lastGoalPlayer = 1;
// 			//Перекрасим второго игрока
// 			this.objects.bracket2.color = '#00FFCC';
// 			//Запускаем игровой цикл
// 			this.loop();
// 		},
// 		//Игровой цикл
// 		loop: function () {
// 			var _this = this;
// 			//Логика игры
// 			this.logic();
// 			//Физика игры
// 			this.physic();
// 			//Рендер игры
// 			this.render();
// 			//Используем замыкание для передачи контекста
// 			this.requestLoop = requestAnimationFrame(function(){
// 				_this.loop.call(_this);
// 			});
// 		},
// 		//Логика игры
// 		logic: function () {
// 			//Для краткости записи
// 			var ball = game.objects.ball;
// 			//Если сейчас идет игра
// 			if(this.params.state == 'game') {
// 			//И шарик оказался за первым игроком
// 			if (ball.x + ball.radius/2 < 0) {
// 				//Засчтитаем гол
// 				this.objects.player2.rate++;
// 				let score = match_model.get("player1_score");
// 				match_model.set("player1_score", score + 1);
// 				match_model.save()
// 				//Сменим состояние игры
// 				this.params.state = 'playerwait';
// 				//Сохарним информацию о забившем
// 				this.params.lastGoalBracket = this.objects.bracket2;
// 				this.params.lastGoalPlayer = 2;
// 			}
// 			//Шарик оказался за выторым игроком
// 			if (ball.x + ball.radius/2 > game.params.width) {
// 				//Засчтитаем гол
// 				this.objects.player1.rate++;
// 				let score = match_model.get("player2_score");
// 				match_model.set("player2_score", score + 1);
// 				match_model.save()
// 				//Сменим состояние игры
// 				this.params.state = 'playerwait';
// 				//Сохарним информацию о забившем
// 				this.params.lastGoalBracket = this.objects.bracket1;
// 				this.params.lastGoalPlayer = 1;
// 			}
// 			//Проверяем наличие победителя
// 			//Если кто-то из игроков набрал необходимое количество очков
// 			//Он выиграл
// 			if(this.objects.player1.rate === this.params.maxRate) {
// 				alert('1 игрок выиграл');
// 				this.gameRestart();
// 			}
// 			if(this.objects.player2.rate === this.params.maxRate) {
// 				alert('2 игрок выиграл');
// 				this.gameRestart();
// 			}
// 			}
// 		},
// 		//Физика игры
// 		physic: function () {
// 			//Для краткости записи
// 			var ball = game.objects.ball,
// 			b1 = game.objects.bracket1,
// 			b2 = game.objects.bracket2;
// 			//Передвигаем шар
// 			game.objects.ball.move();
// 			//Отскок слева
// 			if (ball.x + ball.radius/2 < 0) {
// 				game.objects.ball.xspeed = -game.objects.ball.xspeed;
// 			}
// 			//Отскок Справа
// 			if (ball.x + ball.radius/2 > game.params.width) {
// 				game.objects.ball.xspeed = -game.objects.ball.xspeed;
// 			}
// 			//Отскок от границ canvas по высоте
// 			if (ball.y + ball.radius/2 > game.params.height || ball.y + ball.radius/2 < 0) {
// 				game.objects.ball.yspeed = -game.objects.ball.yspeed;
// 			}
// 			//Отскок шарика от 1 блока
// 			if(ball.x <= 60 && ball.y >= b1.y && ball.y <= b1.y+b1.h) {
// 				ball.xspeed = -ball.xspeed;
// 			//Ускоряем шарик
// 				ball.xspeed = ball.xspeed * ball.bounce;
// 			}
// 			//Отскок шарика от 2 блока
// 			if(ball.x >= this.params.width-50 && ball.y >= b2.y && ball.y <= b2.y+b2.h) {
// 				ball.xspeed = -ball.xspeed;
// 			//Ускоряем шарик
// 				ball.xspeed = ball.xspeed * ball.bounce;
// 			}
// 			//В состоянии ожидания пуска шарика от ракетки игрока, выставляем шарик рядом с ракеткой забившего игрока.
// 			if(this.params.state === 'playerwait') {
// 			ball.xspeed = 0;
// 			ball.yspeed = 0;
// 			if(this.params.lastGoalPlayer === 1) {
// 				ball.x  = this.params.lastGoalBracket.x + this.params.lastGoalBracket.w + ball.radius + 1;
// 				ball.y  = this.params.lastGoalBracket.y + this.params.lastGoalBracket.h/2;
// 			}
// 			if(this.params.lastGoalPlayer === 2) {
// 				ball.x  = this.params.lastGoalBracket.x - ball.radius - 1;
// 				ball.y  = this.params.lastGoalBracket.y + this.params.lastGoalBracket.h/2;
// 			}
// 			}
// 			//Не позволяем вылезать блокам за canvas и возврщаем их на место
// 			if(b1.y <= 0) b1.y = 1; 
// 			if(b2.y <= 0) b2.y = 1; 
// 			if(b1.y+b1.h >= this.params.height) b1.y = this.params.height-b1.h;
// 			if(b2.y+b2.h >= this.params.height) b2.y = this.params.height-b2.h;
// 		},
// 		//Рендер игры
// 		render: function () {
// 			//Чистим канвас на каждом кадре
// 			game.ctx.fillStyle = '#eeeeee';
// 			game.ctx.fillRect(0,0, game.params.width, game.params.height);
// 			//Рендерим шарик
// 			game.objects.ball.render(game.ctx);
// 			game.objects.bracket1.render(game.ctx);
// 			game.objects.bracket2.render(game.ctx);
// 			game.renderRate(game.ctx);
// 		},
// 		//Показываем счет игры
// 		renderRate: function (ctx) {
// 			var rateText = game.objects.player1.rate + ' : ' + game.objects.player2.rate;
// 			ctx.fillStyle = '#000000';
// 			ctx.font = "20px Arial";
// 			ctx.fillText(rateText,game.params.width/2,50);
// 		},
// 		//Инициализация игровых событий
// 		keyDownEvent: function (event, curr_match, player) {
// 			var kCode = event.keyCode;
// 			if (kCode === KEYS.start && game.params.state === "playerwait"
// 				&& game.params.lastGoalPlayer == player) {
// 			$.post("/matches/move_bracket/" + MATCH_ID, { match_id: MATCH_ID,
// 															key_code: kCode,
// 															player: player });
// 			}
// 			if (kCode === KEYS.down) {
// 					let bracket = (player == 1)
// 									? game.objects.bracket1.y + game.objects.bracket1.speed
// 									: game.objects.bracket2.y + game.objects.bracket2.speed;
// 					$.post("/matches/move_bracket/" + MATCH_ID, { match_id: MATCH_ID,
// 																											key_code: kCode,
// 																											player: player,
// 																											bracket: bracket });
// 					}
// 					if (kCode === KEYS.up) {
// 							let bracket = (player == 1)
// 											? game.objects.bracket1.y - game.objects.bracket1.speed
// 											: game.objects.bracket2.y - game.objects.bracket2.speed;
// 							$.post("/matches/move_bracket/" + MATCH_ID, { match_id: MATCH_ID,
// 											key_code: kCode,
// 											player: player,
// 											bracket: bracket });
// 					}
// 				},
// 		//Пуск шарика после гола
// 		kickBall: function () {
// 			this.objects.ball.xspeed = 3;
// 			this.objects.ball.yspeed = 3;
// 			this.params.state = 'game';
// 		},
// 		//Стоп игра
// 		stopGame: function () {
// 			//Обновляем состояние
// 			this.params.state = 'stop';
// 			//Останавливаем цикл
// 			cancelAnimationFrame(this.requestLoop);
// 			//Убираем слушателей событий
// 			document.removeEventListener('keydown', this.keyDownEvent);
// 			//Чистим игровые объекты
// 			delete(this.objects);
// 		},
// 		pauseGame: function () {
// 			this.state = 'pause';
// 		},
// 			//Рестарт игры
// 		restartGame: function () {
// 			this.stopGame();
// 			this.startGame();
// 		}
// 	};
//  // //При загрузке window, стартуем нашу игру
// 	let match_model = new App.Models.Match();
// 	let match_view = new App.Views.Match({ model: match_model });
// }());

/***/ })

/******/ });
//# sourceMappingURL=pingpong-7b131ab11b2636c7a352.js.map