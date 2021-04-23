import consumer from "./consumer"

document.addEventListener("turbolinks:load", () => {
	
	const KEYS = {	start_ball: 13,
					up: 87,
					down: 83,
					reset_ball: 128,
					visit_page: 129,
					leave_page: 130,
					goal: 131,
					end_game: 132,
					start_game: 133,
					update_state: 134, };
	const MAX_RATE = 7;
	const BRACKET_SPEED = 50;
	const RADIUS = 8

	const match_element = $("#MatchID");
	const MATCH_ID = (match_element != null) ? parseInt(match_element.attr("data-MatchID")) : -1;
	
	let MATCH;
	let subscribe = 0;

	if (typeof MATCH_ID !== "undefined" && MATCH_ID > 0) {

		function leave_page() {
			
			if (typeof game !== "undefined" && typeof MATCH !== "undefined" && MATCH.player != 0) {

				game.params.state = "leave";

				MATCH.model.set(`is_player${MATCH.player}_online`, false);
				MATCH.model.save();
				subscribe.perform("command", { match_id: MATCH_ID, key_code: KEYS.leave_page, player: MATCH.player });
				
				if (MATCH.model.get("is_inprogress") == true) {
					// Если оба игрока покинули страницу с игрой, завершаем игру
					if (MATCH.model.get("is_player1_online") == false && MATCH.model.get("is_player2_online") == false) {
						game.stopGame();
					}
					// Иначе засчитываем гол игроку, покинувшему страницу с игрой во время матча
					else {
						game.goal((MATCH.player == 1) ? 2 : 1);
					}
				}
			}
			consumer.subscriptions.remove(subscribe);
			return true;
		}

		$("a").on("click", leave_page);
		window.addEventListener("beforeunload", leave_page);
	

		subscribe = consumer.subscriptions.create({ channel: "MatchChannel", match_id: MATCH_ID}, {

			connected() {
				if (MATCH_ID > 0) {
					console.log(`Connected to match ${MATCH_ID}`);
	
					//При подключении к каналу создаем модель матча (фетчим данные из бд), создаем вью, в которой стартуем игру
					MATCH = new App.Views.Match({ model: new App.Models.Match() });
				}
			},
				
			disconnected() {
				if (MATCH_ID > 0)
					console.log(`Disconnected from match ${MATCH_ID}`);
			},
	
			received(data) {

				let key_code = data.key_code;
				
				if (key_code == KEYS.start_game) {
					MATCH.renderGame(true);
					MATCH.changeOnlineStatus(true, 1);
					MATCH.changeOnlineStatus(true, 2);
				}
				else if (typeof game !== "undefined") {

					if (key_code == KEYS.down || key_code == KEYS.up) {
						data.player == 1 ? game.objects.bracket1.y = parseInt(data.bracket1)
										 : game.objects.bracket2.y = parseInt(data.bracket2);
					}
					else if (key_code == KEYS.start_ball) {
						game.kickBall();
					}
					else if (key_code == KEYS.reset_ball) {
						game.resetBall(data.player);
					}
					else if (key_code == KEYS.leave_page) {
						MATCH.changeOnlineStatus(false, data.player);
					}
					else if (key_code == KEYS.visit_page) {
						MATCH.changeOnlineStatus(true, data.player);
					}
					else if (key_code == KEYS.goal) {
						this.goal(data.score, data.player);
					}
					else if (key_code == KEYS.end_game) {
						game.params.state = "stop";
						MATCH.model.fetch({ success: MATCH.renderResult })
					}
					else if (key_code == KEYS.update_state) {
						game.params.state = data.state;
						game.params.lastGoalPlayer = data.player;
					}
				}
			},

			goal(score, player) {
				MATCH.model.fetch({
					success: function() {
						game.params.lastGoalBracket = (player == 1) ? game.objects.bracket1 : game.objects.bracket2;
						MATCH.changeScore(score, player);
					}
				})
			}
		});

		//////////////////////////////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////////////////////////////

		window.App = {
			Models: {},
			Views: {}
		};
		
		//  MATCH              MODEL
		App.Models.Match = Backbone.Model.extend({ url: `/matches/match_users/${MATCH_ID}` });
		
		//  MATCH              VIEW
		App.Views.Match = Backbone.View.extend({

			start_template: _.template($("#GameStartTemplate").html()),
			profile1_template: _.template($("#MatchUser1ProfileTemplate").html()),
			profile2_template: _.template($("#MatchUser2ProfileTemplate").html()),
			result_template: _.template($("#MatchResultTemplate").html()),
		
			initialize: function () {
				this.player = 0;
		
				_.bindAll(this, "init");
				this.model.fetch({ success: this.init })
			},

			
			init: function () {
				// Если игра завершена - рисуем результаты
				if (this.model.get("is_end") == true) {
					this.renderResult();
					return;
				}
				this.renderProfile1();
				this.renderProfile2();

				// 0 - наблюдатель, 1 или 2 - игрок
				this.player = (this.model.get("player1").id == this.model.get("current_user").id) ? 1 :
								(this.model.get("player2") != null &&
								 this.model.get("player2").id == this.model.get("current_user").id) ? 2 : 0;

				var _this = this;
				if (this.player != 0) {
					this.model.set(`is_player${this.player}_online`, true);
					this.model.save().done(function () {
						_this.changeOnlineStatus(true, _this.player);
						subscribe.perform("command", { match_id: MATCH_ID, key_code: KEYS.visit_page, player: _this.player });
					})
				}
				if (this.model.get("is_inprogress") == true) {
					this.renderGame(false);
				}
				else if (this.model.get("is_player1_online") && this.model.get("is_player2_online")) {
					this.model.save({ is_inprogress: true }).done(function () {
						subscribe.perform("command", { match_id: MATCH_ID, key_code: KEYS.start_game });
					});

				}
				else {
					this.renderWaiting();
				}
			},
		
			renderGame: function (is_newgame) {
				MATCH.model.fetch({
					success: () => {
						this.renderProfile2();
						let template = this.start_template();
						$("#GameWrapper").html(template);
		
						window.game = new Game(this.player, is_newgame);
						game.startGame();
					}
				})
			},

			renderProfile1: function () {
				let template = this.profile1_template(this.model.attributes);
				$("#MatchUser1Profile").html(template);
				this.changeOnlineStatus(this.model.get("is_player1_online"), 1);
			},
			
			renderProfile2: function () {
				let template = this.profile2_template(this.model.attributes);
				$("#MatchUser2Profile").html(template);
				if (this.model.get("player2") != null)
					this.changeOnlineStatus(this.model.get("is_player2_online"), 2);
			},
			
			renderWaiting: function () {
				$("#GameWrapper").html("ОЖИДАЕМ ВТОРОГО ИГРОКА");
			},
			
			renderResult: function () {

				//Останавливаем цикл
				cancelAnimationFrame(game.requestLoop);
				//Убираем слушателей событий
				document.removeEventListener("keydown", game.keyDownEvent);

				$("#MatchUser1Profile").html("");
				$("#MatchUser2Profile").html("");
				let template = MATCH.result_template(MATCH.model.attributes);
				$("#GameWrapper").html(template);

				MATCH.model.fetch();
			},

			changeOnlineStatus: function (is_online, player) {
				if (is_online == true)
					$(`#MatchPlayer${player}Online`).html("<span style='color: green'>Online</span>");
				else
					$(`#MatchPlayer${player}Online`).html("<span style='color: red'>Offline</span>");
				this.model.fetch();
			},
			
			changeScore: function (score, player) {
				this.model.fetch({ success: () => { $(`#MatchPlayer${player}Score`).html(score); } })
				

			},
		})

		//Опишем наши игровые объекты + научим их рисовать себя на канвасе и передвигаться
		var Ball = function () {
			return {
				radius: RADIUS,
				color: "#FFCC00",
				x: 0,
				y: 0,
				yspeed: 0,
				xspeed: 0,
				bounce: 1.1, //коофицент упругости - для ускорения шарика после отскока
				render: function (ctx) {
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
					ctx.fillStyle = this.color;
					ctx.fill();
				},
				//Передвижение шара всегда происходит с определенной скоростью 
				//поэтому мы не будем передавть x y для кастомного перемещения.
				move: function () {
					this.x = this.x + this.xspeed;
					this.y = this.y + this.yspeed;
				}
			}
		};
		
		//Блоки для отбивания шарика
		var Bracket = function () {
			return {
				w: 10,
				h: 100,
				x: 0,
				y: 0,
				speed: BRACKET_SPEED,
				color: "#CCFF00",
				render: function (ctx) {
					ctx.fillStyle = this.color;
					ctx.fillRect(this.x, this.y, this.w, this.h);
				}
			}
		};
		
		//Теперь сама игра
		var Game = function (player, is_newgame) {
		
			//Сохраним ссылку на контекст
			//для дальнейшей передачи в ивенты
			var _this = this;
			
			//Параметры с которыми будет игра
			this.params = {
				width: 960,
				height: 600,
				state: "loading", //Состояние игры
				lastGoalPlayer: 0,
			};

			if (is_newgame == true) {
				this.params.state = "playerwait";
				this.params.lastGoalPlayer = 1;

				subscribe.perform("save_state", { match_id: MATCH_ID, state: this.params.state, player: this.params.lastGoalPlayer, key_code: KEYS.update_state });
			}
			else {
				subscribe.perform("get_state", { match_id: MATCH_ID, key_code: KEYS.update_state });
			}
		
			//Сохраняем ссылки на canvas и контекст для дальнейшего рисования
			this.canvasBlock = document.getElementById("gameCanvas");
			this.ctx = this.canvasBlock.getContext("2d");
			
			//Подписываемся на события кнопок, если пользователь участник игры
			if (player > 0) {
				// var keeDown = function (event) { _this.keyDownEvent.call(_this, event, player); }
				// document.addEventListener("keydown", _.throttle(keeDown, THROTTLE));
				document.addEventListener("keydown", function (event) {
					_this.keyDownEvent.call(_this, event, player);
				});
			}
			return this;
		};
		
		//Игровые методы
		Game.prototype = {
			//Старт игры
			startGame: function () {

				var _this = this;

				//Инициализируем игровые объекты
				this.objects = {
					ball: new Ball(),
					bracket1: new Bracket(),
					bracket2: new Bracket()
				};

				//Расставляем стартовые позиции ракеток
				this.objects.bracket1.x = 50;
				this.objects.bracket1.y = this.params.height / 2 - this.objects.bracket1.h / 2;
				
				this.objects.bracket2.x = this.params.width - 50;
				this.objects.bracket2.y = this.params.height / 2 - this.objects.bracket1.h / 2;
				
				//Перекрасим второго игрока
				this.objects.bracket2.color = "#00FFCC";
				
				//Запускаем игровой цикл
				this.loop();
			},
		
			//Игровой цикл
			loop: function () {
				var _this = this;
				
				//Логика игры
				this.logic();
				//Физика игры
				this.physic();
				//Рендер игры
				this.render();
		
				if (this.params.state == "stop" || this.params.state == "leave")
					return;
				//Используем замыкание для передачи контекста
				this.requestLoop = requestAnimationFrame(function() {
					_this.loop.call(_this);
				});
			},
		
			//Логика игры
			logic: function () {
		
				var ball = game.objects.ball;
		
				//Если сейчас идет игра
				if (this.params.state == "game") {
			
					//И шарик оказался за первым игроком
					if (ball.x + ball.radius/2 <= RADIUS * 3) {
						this.params.state == "palyerwait";
						//Засчтитаем гол
						this.goal(2);
					}
					
					//Шарик оказался за вторым игроком
					if (ball.x + ball.radius/2 >= game.params.width - (RADIUS * 3)) {
						this.params.state == "palyerwait";
						//Засчтитаем гол
						this.goal(1);
					}
			
				}
				//Проверяем наличие победителя
				if (MATCH.model.get("player1_score") >= MAX_RATE && MATCH.player == 1) {
					this.stopGame();
				}
		
				if (MATCH.model.get("player2_score") >= MAX_RATE && MATCH.player == 2) {
					this.stopGame();
				}
		
			},
		
			//Физика игры
			physic: function () {

				var ball = game.objects.ball,
				b1 = game.objects.bracket1,
				b2 = game.objects.bracket2;
				
				//Передвигаем шар
				game.objects.ball.move();
		
				//Отскок слева
				if (ball.x + ball.radius/2 < 0) {
					game.objects.ball.xspeed = -game.objects.ball.xspeed;
				}
				//Отскок Справа
				if (ball.x + ball.radius/2 > game.params.width) {
					game.objects.ball.xspeed = -game.objects.ball.xspeed;
				}
				//Отскок от границ canvas по высоте
				if (ball.y + ball.radius/2 > game.params.height || ball.y + ball.radius/2 < 0) {
					game.objects.ball.yspeed = -game.objects.ball.yspeed;
				}
				
				//Отскок шарика от 1 блока
				if (ball.x <= 60 && ball.y >= b1.y && ball.y <= b1.y+b1.h) {
					ball.xspeed = -ball.xspeed;
					if (MATCH.model.get("addons").addon1 == true)
						this.disco();
				//Ускоряем шарик
					ball.xspeed = ball.xspeed * ball.bounce;
				}
				//Отскок шарика от 2 блока
				if (ball.x >= this.params.width-50 && ball.y >= b2.y && ball.y <= b2.y+b2.h) {
					ball.xspeed = -ball.xspeed;
					if (MATCH.model.get("addons").addon1 == true)
						this.disco();
				//Ускоряем шарик
					ball.xspeed = ball.xspeed * ball.bounce;
				}

				//В состоянии ожидания пуска шарика от ракетки игрока, выставляем шарик рядом с ракеткой забившего игрока
				if (this.params.state == "playerwait") {
					subscribe.perform("reset_ball", { match_id: MATCH_ID, key_code: KEYS.reset_ball, player: this.params.lastGoalPlayer });
				}
		
				//Не позволяем вылезать блокам за canvas и возврщаем их на место
				if (b1.y <= 0) b1.y = 1; 
				if (b2.y <= 0) b2.y = 1; 
				if (b1.y+b1.h >= this.params.height) b1.y = this.params.height-b1.h;
				if (b2.y+b2.h >= this.params.height) b2.y = this.params.height-b2.h;
			},
		
			//Рендер игры
			render: function () {
				//Чистим канвас на каждом кадре
				game.ctx.fillStyle = "#eeeeee";
				game.ctx.fillRect(0,0, game.params.width, game.params.height);
		
				//Рендерим шарик
				game.objects.ball.render(game.ctx);
				game.objects.bracket1.render(game.ctx);
				game.objects.bracket2.render(game.ctx);
			},
		
			//Инициализация игровых событий
			keyDownEvent: function (event, player) {
			
				var kCode = event.keyCode;

				if (kCode == KEYS.start_ball && game.params.state == "playerwait" && game.params.lastGoalPlayer == player) {
					subscribe.perform("move_bracket", { match_id: MATCH_ID, key_code: kCode });
					return;
				}

				let br1 = game.objects.bracket1.y;
				let br2 = game.objects.bracket2.y;
				
				if (kCode == KEYS.down) {
					player == 1 ? (br1 += game.objects.bracket1.speed) : (br2 += game.objects.bracket2.speed);
					subscribe.perform("move_bracket", { match_id: MATCH_ID, player: player, key_code: kCode, bracket1: br1, bracket2: br2});
				}
				else if (kCode == KEYS.up) {
					player == 1 ? (br1 -= game.objects.bracket1.speed) : (br2 -= game.objects.bracket2.speed);
					subscribe.perform("move_bracket", { match_id: MATCH_ID, player: player, key_code: kCode, bracket1: br1, bracket2: br2});
				}
			},

			goal: function (lastGoalPlayer) {
				let score = MATCH.model.get(`player${lastGoalPlayer}_score`) + 1;

				if (MATCH.player > 0 && MATCH.player != lastGoalPlayer) {
					MATCH.model.set(`player${lastGoalPlayer}_score`, score);
					MATCH.model.save();
					subscribe.perform("save_state", { match_id: MATCH_ID, state: "playerwait", player: lastGoalPlayer, key_code: KEYS.update_state });
					subscribe.perform("command", { match_id: MATCH_ID, player: lastGoalPlayer, key_code: KEYS.goal, score: score });
				}
			},
			
			//Выставление шарика на ракетку после гола
			resetBall: function (player) {
				game.objects.ball.xspeed = 0;
				game.objects.ball.yspeed = 0;

				if (player == 1) {
					game.objects.ball.x = game.objects.bracket1.x + game.objects.bracket1.w + game.objects.ball.radius + 1;
					game.objects.ball.y = game.objects.bracket1.y + game.objects.bracket1.h/2;
				}
				else if (player == 2) {
					game.objects.ball.x = game.objects.bracket2.x - game.objects.ball.radius - 1;
					game.objects.ball.y = game.objects.bracket2.y + game.objects.bracket2.h/2;
				}
			},
			
			//Пуск шарика после гола
			kickBall: function () {
				this.params.state = "game";
				subscribe.perform("save_state", { match_id: MATCH_ID, state: this.params.state, player: game.params.lastGoalPlayer, key_code: KEYS.update_state });

				setTimeout(function () {
					if (game.params.lastGoalPlayer == 1) {
						game.objects.ball.xspeed = 3;
						game.objects.ball.yspeed = 3;
					}
					else {
						game.objects.ball.xspeed = -3;
						game.objects.ball.yspeed = -3;
					}
				}, 1000);
			},
		
			
			//Стоп игра
			stopGame: function () {
				game.params.state = "stop";
				
				// MATCH.model.set("is_end", true);
				// MATCH.model.set("is_inprogress", false);
				MATCH.model.save({ is_end: true, is_inprogress: false });
				
				subscribe.perform("command", { match_id: MATCH_ID, key_code: KEYS.end_game })
			},

			disco: function () {
				game.objects.bracket1.color = this.randomColor();
				game.objects.bracket2.color = this.randomColor();
				game.objects.ball.color = this.randomColor();
			},

			randomColor: function () {
				let r = Math.floor(Math.random() * (256));
				let g = Math.floor(Math.random() * (256));
				let b = Math.floor(Math.random() * (256));
				return `rgb(${r}, ${g}, ${b})`;
			}
		};
	}
})
