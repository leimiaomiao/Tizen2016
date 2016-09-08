define("game",["canvas","data"],function(canvas,data){
	var Game = function(width,height,context,scoreContainer,alert){
		this.width = width;
		this.height = height;
		this.context = context;
		this.scoreContainer = scoreContainer;
		this.alert = alert;
		this.bgColor = "#BFEFFF";
		this.skColor = "#008B00";
		this.tgColor = "#CD0000";
		this.snake = [];
		this.target = {};
		this.rectR = 10;
		this.initS = 5;
		this.score = 0;
		this.runSpeed = 100;
		this.fps = 17;
		this.isRunning = 1;
		//setInterval
		this.paintTask = null;
		this.runTask = null;
	}

	Game.prototype.showOver = function(v){
		if(v == 1){
			this.alert.style.display = "block";
		}
		else{
			this.alert.style.display = "none";
		}
	}

	Game.prototype.refreshScore = function(){
		for(index in this.scoreContainer){
			this.scoreContainer[index].innerText = this.score;
		}
	}

	Game.prototype.start = function(){
		var game = this;
		this.score = 0;
		this.refreshScore();
		this.showOver(0);
		//get a random snake points and target point
		this.snake = data.genSnake(this.width,this.height,this.initS,this.rectR);
		this.target = data.genTarget(this.width,this.height,this.rectR,this.snake);
		//fps 60 paint
		this.paintTask = setInterval(function(){
			canvas.paint(game);
		},game.fps);
		//run
		this.run();
	}

	Game.prototype.turnLeft = function(){
		var point = this.snake[this.snake.length-1];
		var point_pre = this.snake[this.snake.length-2];
		if(point.d.x == 0){
			//when the first point direction was changed,the canvas have not been rendered,and the second point direction is right,and their y-axis are same,turnLeft should not be executed
			if(point.y == point_pre.y && point_pre.d.x == 1 && point_pre.d.y == 0 ){
				return;
			}
			else{
				point.d.x = -1;
				point.d.y = 0;
			}
		}
	}

	Game.prototype.turnRight = function(){
		var point = this.snake[this.snake.length-1];
		var point_pre = this.snake[this.snake.length-2];
		if(point.d.x == 0){
			if(point.y == point_pre.y && point_pre.d.x == -1 && point_pre.d.y == 0 ){
				return;
			}
			else{
				point.d.x = 1;
				point.d.y = 0;
			}
		}
	}

	Game.prototype.turnTop = function(){
		var point = this.snake[this.snake.length-1];
		var point_pre = this.snake[this.snake.length-2];
		if(point.d.y == 0){
			if(point.x == point_pre.x && point_pre.d.x == 0 && point_pre.d.y == 1 ){
				return;
			}
			else{
				point.d.y = -1;
				point.d.x = 0;
			}
		}
	}

	Game.prototype.turnDown = function(){
		var point = this.snake[this.snake.length-1];
		var point_pre = this.snake[this.snake.length-2];
		if(point.d.y == 0){
			if(point.x == point_pre.x && point_pre.d.x == 0 && point_pre.d.y == -1 ){
				return;
			}
			else{
				point.d.x = 0;
				point.d.y = 1;
			}
		}
	}

	Game.prototype.run = function(){
		var game = this;
		this.runTask = setInterval(function(){
			//snake run
			if(data.isCrash(game.width,game.height,game.snake)){
				game.over();
			}
			else{
				if(data.isEat(game.snake,game.target)){
					game.score += 100;
					game.refreshScore();
					//eat
					game.target.d = {x:game.snake[game.snake.length-1].d.x,y:game.snake[game.snake.length-1].d.y};
					game.snake[game.snake.length] = game.target;
					game.target = data.genTarget(game.width,game.height,game.rectR,game.snake);
					//if target is null, the game is over, you win
					if(game.target == null){
						game.over();
					}
				}
				//run
				data.changeSnake(game.snake);
			}
		},game.runSpeed);
	}

	Game.prototype.over = function(){
		clearInterval(this.runTask);
		clearInterval(this.paintTask);
		this.showOver(1);
	}

	return Game;
});	