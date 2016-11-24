function Hero(x,y){
	this.HREO_MIN_R = 2;
    this.x = x;
    this.y = y;
    this.life = 1;
    this.r = 5;
    this.magics = new Array();
    this.noEnemy = false;
    this.color = "#666666";
    this.touch = true;

    this.display = function(container){
    	var heroCircle = container.append("circle").attr("class","hero").attr("cx", this.x).attr("cy", this.y).attr(
    			"r", this.r).attr("fill", this.color);
    	if(this.noEnemy){
    		heroCircle.attr("stroke-width","2").attr("stroke","#99CC66");
    	}
    }

    this.addMagic = function(ball){
    	this.magics.push(ball);
    }

    this.update = function(){
    	if(this.magics.length <= 0)
    		return;
    	var hasMagic = false;
        for(var i = 0;i < this.magics.length;i ++){
            this.magics[i].life --;
            if(this.magics[i].life > 0){
            	hasMagic = true;
            }
        }
        if(!hasMagic){
	        var first = this.magics[0];
	        if(first.life <= 0){
	        	var ball = this.magics.shift();
	        	ball.noMagic(this);
	        }
        }
    }
    
    this.touchStart = function(position){
    	var distance = Math.sqrt(Math.pow(position.x - this.x,2) + Math.pow(position.y - this.y,2));
    	this.touch = distance <= 5;
    }
    
    this.touchMove = function(position){
    	if(this.touch){
    		this.x = position.x;
    		this.y = position.y;
    	}
    }

}