import consumer from "./consumer"

document.addEventListener("turbolinks:load", () => {
	
	const KEYS = {start_ball: 13, up: 87, down: 83, reset_ball: 128};
	const match_element = $("#MatchID");
	const MATCH_ID = (match_element != null) ? parseInt(match_element.attr("data-MatchID")) : -1;
	const BRACKET_SPEED = 50;
	const THROTTLE = 0;
	
	let MATCH;
	let subscribe = 0;

	if (typeof MATCH_ID !== "undefined" && MATCH_ID > 0) {

		$("a").on("click", function () {
			
			consumer.subscriptions.remove(subscribe);

			if (typeof game !== "undefined" && typeof MATCH !== "undefined"
				&& MATCH.model.get("is_inprogress") == true					// раскомментить после добавления функционала
				&& MATCH.role == "p")
				if (MATCH.model.get("player1").id == MATCH.model.get("current_user").id) {

					MATCH.model.set("is_player1_online", false);

					// Если оба игрока покинули страницу с игрой, завершаем игру
					if (MATCH.model.get("is_player2_online") == false) {
						MATCH.model.set("is_inprogress", false);
						MATCH.model.set("is_end", true);
					}
					else
						game.goal(2);
				}
				else {

					MATCH.model.set("is_player2_online", false);

					if (MATCH.model.get("is_player1_online") == false) {
						MATCH.model.set("is_inprogress", false);
						MATCH.model.set("is_end", true);
					}
					else
						game.goal(1);
					
				}
				
		})
		// window.addEventListener("unload", function() {
		// 	consumer.subscriptions.remove(subscribe);
		// });

		subscribe = consumer.subscriptions.create({ channel: "MatchChannel", match_id: MATCH_ID}, {

			connected() {

				if (MATCH_ID > 0)
					console.log(`Connected to match ${MATCH_ID}`);

				//При подключении к каналу создаем модель матча (фетчим данные из бд), создаем вью, в которой стартуем игру

				let match_model = new App.Models.Match();
				MATCH = new App.Views.Match({ model: match_model, consumer: this });
			},
				
			disconnected() {
				if (MATCH_ID > 0)
					console.log(`Disconnected from match ${MATCH_ID}`);
			},
	
			received(data) {
				
				if (typeof game !== "undefined") {
					let key_code = data.key_code;

					if (key_code == KEYS.down || key_code == KEYS.up) {
						data.player == 1 ? game.objects.bracket1.y = parseInt(data.bracket1)
										 : game.objects.bracket2.y = parseInt(data.bracket2);
					}
					else if (key_code == KEYS.start_ball) {
						setTimeout(game.kickBall(), 500);
					}
					else if (key_code == KEYS.reset_ball) {
						game.resetBall(data.player);
					}
				}
			},
		});

		//////////////////////////////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////////////////////////////////

		window.App = {
			Models: {},
			Views: {},
			Collections: {},
			Router: {}
		};
		
		//  MATCH              MODEL
		App.Models.Match = Backbone.Model.extend({
			urlRoot: `/matches/match_users/${MATCH_ID}`,
			initialize: function () { this.fetch(); }
		 })
		
		//  MATCH              VIEW
		App.Views.Match = Backbone.View.extend({
			template_score: _.template($("#MatchScoreTemplate").html()),
		
			initialize: function (data) {

				this.consumer = data.consumer;
				this.role = 'w';
		
				this.model.on("sync", this.start_game, this);
				// this.model.on("change", this.render_score, this);
			},
		
			start_game: function () {
				if (typeof game !== "undefined")
					return;

				if (MATCH.model.get("player1").id == MATCH.model.get("current_user").id
					|| MATCH.model.get("player2").id == MATCH.model.get("current_user").id)
					this.role = 'p';

				if (this.role == 'p') {
					MATCH.model.get("player1").id == MATCH.model.get("current_user").id
						? MATCH.model.set("is_player1_online", true)
						: MATCH.model.set("is_player2_online", true);

					MATCH.model.save();
				}
				window.game = new Game(this.model, this.consumer);
				game.startGame();
				this.renderScore();
			},
		
			renderScore: function () {
				var template = this.template_score(this.model.attributes);
				this.$el.html(template);
				$("#MatchScore").html(this.el);
			}
		})
		
		//Опишем наши игровые объекты + научим их рисовать себя на канвасе и передвигаться
		var Ball = function () {
			return {
				radius: 8,
				color: '#FFCC00',
				x: 0,
				y: 0,
				yspeed: 5,
				xspeed: 7,
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
				color: '#CCFF00',
				render: function (ctx) {
					ctx.fillStyle = this.color;
					ctx.fillRect(this.x, this.y, this.w, this.h);
				}
			}
		};
		
		//Теперь сама игра
		var Game = function (curr_match, consumer) {
		
			//Сохраним ссылку на контекст
			//для дальнейшей передачи в ивенты
			var _this = this;
			this.consumer = consumer;
			
			//Параметры с которыми будет игра
			this.params = {
				width: 960,
				height: 600,
				state: 'loading', //Состояние игры
				maxRate: 10 //до скольки будет идти матч.
			};
		
			//Сохраняем ссылки на canvas и контекст для дальнейшего рисования
			this.canvasBlock = document.getElementById('pingpong');
			this.ctx = this.canvasBlock.getContext('2d');
			
			//Подписываемся на события кнопок, если пользователь участник игры
			let player = curr_match.get("current_user").id == curr_match.get("player1").id ? 1 :
						 curr_match.get("current_user").id == curr_match.get("player2").id ? 2 : 0;
			
			//Задержка для нажатия клавиш
			if (player > 0) {
				if (THROTTLE > 0) {
					var keeDown = function (event) { _this.keyDownEvent.call(_this, event, player, consumer); }
					document.addEventListener('keydown', _.throttle(keeDown, THROTTLE));
				} else {
					document.addEventListener('keydown', function (event) {
						_this.keyDownEvent.call(_this, event, player, consumer);
					});
				}
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
				//Меняем состояние
				// this.params.state = 'game';
				console.log(this)
				console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQqq")
				this.params.state = 'playerwait';
		
				//Расставляем стартовые позиции ракеток
				this.objects.bracket1.x = 50;
				this.objects.bracket1.y = this.params.height / 2 - this.objects.bracket1.h / 2;
				
				this.objects.bracket2.x = this.params.width - 50;
				this.objects.bracket2.y = this.params.height / 2 - this.objects.bracket1.h / 2;
		
				this.params.lastGoalPlayer = 1;
		
				//Перекрасим второго игрока
				this.objects.bracket2.color = '#00FFCC';
				
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
		
				//Используем замыкание для передачи контекста
				this.requestLoop = requestAnimationFrame(function() {
					_this.loop.call(_this);
				});
			},
		
			//Логика игры
			logic: function () {
		
				var ball = game.objects.ball;
		
				//Если сейчас идет игра
				if (this.params.state == 'game') {
			
					//И шарик оказался за первым игроком
					if (ball.x + ball.radius/2 < 0) {
						//Засчтитаем гол
						this.goal(2);
					}
			
					//Шарик оказался за вторым игроком
					if (ball.x + ball.radius/2 > game.params.width) {
						//Засчтитаем гол
						this.goal(1);
					}
			
					//Проверяем наличие победителя
					if (MATCH.model.get("player1_score") === this.params.maxRate) {
						alert('1 игрок выиграл');
						this.gameRestart();
					}
			
					if (MATCH.model.get("player1_score") === this.params.maxRate) {
						alert('2 игрок выиграл');
						this.gameRestart();
					}
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
				//Ускоряем шарик
					ball.xspeed = ball.xspeed * ball.bounce;
				}
				//Отскок шарика от 2 блока
				if (ball.x >= this.params.width-50 && ball.y >= b2.y && ball.y <= b2.y+b2.h) {
					ball.xspeed = -ball.xspeed;
				//Ускоряем шарик
					ball.xspeed = ball.xspeed * ball.bounce;
				}
		
				//В состоянии ожидания пуска шарика от ракетки игрока, выставляем шарик рядом с ракеткой забившего игрока
				if (this.params.state === 'playerwait') {
					// game.resetBall(this.params.lastGoalPlayer);
					this.consumer.perform("reset_ball", { match_id: MATCH_ID, key_code: KEYS.reset_ball, player: this.params.lastGoalPlayer });
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
				game.ctx.fillStyle = '#eeeeee';
				game.ctx.fillRect(0,0, game.params.width, game.params.height);
		
				//Рендерим шарик
				game.objects.ball.render(game.ctx);
				game.objects.bracket1.render(game.ctx);
				game.objects.bracket2.render(game.ctx);
			},
		
			//Инициализация игровых событий
			keyDownEvent: function (event, player, consumer) {
			
				var kCode = event.keyCode;
				if (kCode === KEYS.start_ball)
				{
					// console.log("_________________________________________________")
					// console.log("KEYS.start_ball = " + KEYS.start_ball)
					// console.log("game.params.state = " + game.params.state)
					// console.log("game.params.lastGoalPlayer = " + game.params.state)
					// console.log("player = " + player)
					// console.log("_________________________________________________")
				}
				if (kCode === KEYS.start_ball && game.params.state === "playerwait" && game.params.lastGoalPlayer == player) {
					this.params.state = 'game';
					consumer.perform("move_bracket", { match_id: MATCH_ID, key_code: kCode });
				}

				let br1 = game.objects.bracket1.y;
				let br2 = game.objects.bracket2.y;
				
				if (kCode === KEYS.down) {
					player == 1 ? (br1 += game.objects.bracket1.speed) : (br2 += game.objects.bracket2.speed);
					consumer.perform("move_bracket", { match_id: MATCH_ID, player: player, key_code: kCode, bracket1: br1, bracket2: br2});
				}
				if (kCode === KEYS.up) {
					player == 1 ? (br1 -= game.objects.bracket1.speed) : (br2 -= game.objects.bracket2.speed);
					consumer.perform("move_bracket", { match_id: MATCH_ID, player: player, key_code: kCode, bracket1: br1, bracket2: br2});
				}
			},

			goal: function (lastGoalPlayer) {

				if (lastGoalPlayer == 1) {
					let score = MATCH.model.get("player1_score");
					MATCH.model.set("player1_score", score + 1);
					MATCH.model.save()
					this.params.lastGoalBracket = this.objects.bracket1;
				}
				else if (lastGoalPlayer == 2) {
					let score = MATCH.model.get("player2_score");
					MATCH.model.set("player2_score", score + 1);
					MATCH.model.save()
					this.params.lastGoalBracket = this.objects.bracket2;
				}
				
				this.params.state = 'playerwait';
				this.params.lastGoalPlayer = lastGoalPlayer;
			},
			
			//Выставление шарика на ракетку после гола
			// resetBall: function () {
			resetBall: function (player) {
				game.objects.ball.xspeed = 0;
				game.objects.ball.yspeed = 0;

				if (player === 1) {
					game.objects.ball.x  = game.objects.bracket1.x + game.objects.bracket1.w + game.objects.ball.radius + 1;
					game.objects.ball.y  = game.objects.bracket1.y + game.objects.bracket1.h/2;
				}
				if (player === 2) {
					game.objects.ball.x  = game.objects.bracket2.x - game.objects.ball.radius - 1;
					game.objects.ball.y  = game.objects.bracket2.y + game.objects.bracket2.h/2;
				}
			},
			
			//Пуск шарика после гола
			kickBall: function () {
				this.params.state = 'game';
				this.objects.ball.xspeed = 3;
				this.objects.ball.yspeed = 3;
			},
		
			
			//Стоп игра
			stopGame: function () {
				//Обновляем состояние
				this.params.state = 'stop';
				//Останавливаем цикл
				cancelAnimationFrame(this.requestLoop);
		
				//Убираем слушателей событий
				document.removeEventListener('keydown', this.keyDownEvent);
				
				//Чистим игровые объекты
				delete(this.objects);
			},
			
			pauseGame: function () {
				this.state = 'pause';
			},
		
				//Рестарт игры
			restartGame: function () {
				this.stopGame();
				// this.startGame();
			}
		};
	}
})
