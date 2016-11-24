var game;

$(function() {
	var deviceWidth =  document.body.clientWidth;
	var deviceHeight = document.body.clientHeight-3;
	
	var container = d3.select("svg#container").attr("width", deviceWidth).attr(
			"height", deviceHeight);

    d3.select("#replay").attr("x",deviceWidth/2).attr("y",deviceHeight/2).attr("text-anchor","middle").style("display","none");
	d3.select("#play").attr("x",deviceWidth/2).attr("y",deviceHeight/2).attr("text-anchor","middle").style("display","block");
	d3.select("#target").attr("x",deviceWidth/2).attr("y",30).attr("text-anchor","middle").style("display","block");

    game = new Game(container, deviceWidth, deviceHeight);
    var isRunning = 0;

	var game_start = function(){
        clearInterval(game.isEnd);
        game = new Game(container, deviceWidth, deviceHeight);
        game.isEnd = setInterval(function(){
            game.update();
        },15);
        isRunning = 1;
	}

	var game_pause = function(){
        clearInterval(game.isEnd);
        console.debug(game);
    }

    var game_resume = function(){
        game.isEnd = setInterval(function(){
            game.update();
        },15);
    }

    $('.close').on('tap',function(){
        $('.tips_container').slideUp();
        $('.show').slideDown();
        if(isRunning === 1){
            game_resume();
		}
    });

	$('.show').on('tap',function(){
		$('.tips_container').slideDown();
        $('.show').slideUp();
		if(isRunning === 1){
            game_pause();
		}
	});

    $("#play").on("tap",function(){
        d3.select("#play").style("display","none");
        game_start();
    });
	
	$("#replay").on("tap",function(){
		d3.select("#replay").style("display","none");
		game_start();
	});
	
});

window.addEventListener("touchstart", function(event) {
	//event.preventDefault();
}, false);

window.addEventListener("touchmove", function(event) {
	if (event.targetTouches.length > 1 || (event.scale && event.scale !== 1)){
		return;
	}
	var touch = event.targetTouches[0];
	var pos = {
		x : touch.pageX,
		y : touch.pageY
	};
	
	if(pos.x <= 0) pos.x = 0;
	if(pos.x >= window.innerWidth) pos.x = window.innerWidth;
	if(pos.y <= 0) pos.y = 0;
	if(pos.y >= window.innerHeight) pos.y = window.innerHeight;
	
	game.hero.touchMove(pos);
}, false);

window.addEventListener("mousemove", function(event){
	var pos = {
			x:event.screenX,
			y:event.screenY
	};
	if(pos.x <= 0) pos.x = 0;
	if(pos.x >= window.innerWidth) pos.x = window.innerWidth;
	if(pos.y <= 0) pos.y = 0;
	if(pos.y >= window.innerHeight) pos.y = window.innerHeight;
	game.hero.touchMove(pos);
}, false);


window.addEventListener('tizenhwkey', function(e) {
	if(e.keyName == "back") {
		try {
			tizen.application.getCurrentApplication().exit();
		} catch (error) {
			console.error("getCurrentApplication(): " + error.message);
		}
	}
},false);

