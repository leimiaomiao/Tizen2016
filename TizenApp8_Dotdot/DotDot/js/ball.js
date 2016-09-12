function Ball(x,y,life,color){
    this.x = x;
    this.y = y;
    this.life = life;
    this.vx = (Math.random()-0.5)*5;
    this.vy = (Math.random()-0.5)*5;
    this.r = 5;
    this.color = color;

    this.reflect = function(width,height){
        if(this.x - this.r <= 0 || this.x + this.r >= width)
            this.vx = -this.vx;
        if(this.y - this.r <= 0 || this.y + this.r >= height)
            this.vy = -this.vy;
    }

    this.update = function(){
        this.x += this.vx;
        this.y += this.vy;
        this.life --;
    }

    this.display = function(container){
    	container.append("circle").attr("class","ball").attr("cx", this.x).attr("cy", this.y).attr(
    			"r", this.r).attr("fill", this.color);
    }
    
    this.collide = function(hero){
    	var distance = Math.sqrt(Math.pow(hero.x - this.x,2) + Math.pow(hero.y - this.y,2));
    	return distance <= hero.r + this.r;
    }
}

function KillBall(x,y,life){
    this.base = new Ball(x,y,life,"#FF6666");

    this.castMagic = function(hero){
        if(hero.noEnemy)
            return false;
        hero.life -= 1;
        return false;
    }
}

function ExpandBall(x,y,life){
    this.base = new Ball(x,y,life,"#CCCCCC");

    this.castMagic = function(hero){
        hero.r += 1;
        return true;
    }

    this.noMagic = function(hero){
        hero.r -= 1;
    }
}

function ShinkBall(x,y,life){
    this.base = new Ball(x,y,life,"#FFFF66");
    this.cast = false;
    this.castMagic = function(hero){
    	if(hero.r > 2){
    		hero.r -= 1;
    		this.cast = true;
    	}
        return true;
    }

    this.noMagic = function(hero){
    	if(this.cast)
    		hero.r += 1;
    }
}

function SuperBall(x,y,life){
	this.SUPERTIME = 200;
    this.base = new Ball(x,y,life,"#99CC66");
    this.life = this.SUPERTIME;
    
    this.castMagic = function(hero){
        hero.noEnemy = true;
        hero.addMagic(this);
        return true;
    }

    this.noMagic = function(hero){
        hero.noEnemy = false;
    }
}