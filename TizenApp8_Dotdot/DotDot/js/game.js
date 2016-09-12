function Game(container,width,height){
	this.container = container;
    this.width = width;
    this.height = height;
    this.score = 0;
	
    this.birthTime = 25;//出球时间间隔
    this.ballLife = 1500;//每个小球的生命

    this.ticks = 0;//计时器
    this.hero = new Hero(this.width/2,this.height/2);
    this.balls = new Array();
    
    this.isEnd = 0;
    
    this.update = function(){
        if(this.hero.life <= 0)
            return this.endGame();
        this.deleteBalls();
        if(this.ticks % this.birthTime == 0)
            this.addBalls();
        this.reflect();
        this.castMagic();

        this.hero.update();
        for(var i in this.balls)
        	this.balls[i].base.update();

        this.ticks ++;
        this.score ++;
        this.display();
    }

    this.display = function(){
    	this.container.selectAll("circle").remove();
    	this.container.select("#score").text(Math.round(this.score/1000*15));
        this.hero.display(this.container);
        for(var i in this.balls)
        	this.balls[i].base.display(this.container);
    }

    this.endGame = function(){
    	d3.select("#replay").style("display","block");
    }

    this.deleteBalls = function(){
    	if(this.balls.length <= 0) 
    		return;
    	
        var first = this.balls[0];
        if(first.base.life <= 0)
        	this.balls.shift();
    }

    this.addBalls = function(){
        var x = Math.random()*this.width;
        var y = Math.random()*this.height;
        var r = Math.random();
        if(r < 0.7)
            this.balls.push(new KillBall(x,y,this.ballLife));
        else if(r < 0.8)
            this.balls.push(new ExpandBall(x,y,this.ballLife));
        else if(r < 0.9)
            this.balls.push(new ShinkBall(x,y,this.ballLife));
        else
            this.balls.push(new SuperBall(x,y,this.ballLife));
    }

    this.reflect = function(){
        for(var i in this.balls)
        	this.balls[i].base.reflect(this.width,this.height);
    }

    this.castMagic = function(){
        for(var i = 0;i < this.balls.length;i ++){
        	if(this.balls[i].base.collide(this.hero)){
        		if(this.balls[i].castMagic(this.hero)){
        			this.balls.splice(i,1);
        		    i--;
        		}
        	}
        }
    }
}