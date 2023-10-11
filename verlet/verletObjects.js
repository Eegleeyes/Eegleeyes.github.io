function Circle(r){
    this.Radius = r
    this.x = 0
    this.y = 0
    
    this.setPosition = function(x,y){
      this.x = x
      this.y = y
    }
    
    this.add = function(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.Radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
}

function Vector2(x,y){
    this.x = x
    this.y = y
    this.mult = function(M){
        this.x = this.x * M
        this.y = this.y * M
    }
    this.div = function(D){
        this.x = this.x / D
        this.y = this.y / D
    }
    this.addPoint = function(P){
      this.x += P.x
      this.y += P.y
    }
    this.subPoint = function(P){
      this.x -= P.x
      this.y -= P.y
    }
    this.Mag = function(){
        return Math.sqrt((this.x**2)+(this.y**2))
    }
    this.clone = function(v2){
        return new Vector2(v2.x,v2.y)
    }
    
} //Vector Class

function Ball(r,pos){
    this.obj = new Circle(r);
    this.r = r; // Not really important 
    
    this.lastPos = pos; // Pos before a step is taken, initiated at the passed in pos for simplicity
    this.pos = pos; // Pos that will effect the Position on screen
    this.acceleration = new Vector2(0,0); // Velocity
    
    this.bounciness = 0.2;
    
    this.obj.setPosition(pos.x,pos.y); // Setting ball on screen
    this.obj.add(); // Adding Ball to screen
    
    this.updatePosition = function(dt){
        var cV = new Vector2(0,0); // Clone pos so it's usable in math
        
        cV = cV.clone(this.pos)
        cV.subPoint(this.lastPos)
      
        this.lastPos = this.pos.clone(this.pos); // Save last position
        
        this.acceleration.mult(dt)
        this.acceleration.mult(dt); // It gets angry if I do it all in one line
        
        this.pos.addPoint(cV)
        
        this.pos.addPoint(this.acceleration); // Apply physics step
        
        this.obj.setPosition(this.pos.x,this.pos.y); // Apply to screen
        //this.obj.add()
        
        this.acceleration.x = 0
        this.acceleration.y = 0
    }
    
    this.addForce = function(additive){
        this.acceleration.addPoint(additive); // Allows for changing of velocity
    }
    
    this.collisionDetect = function(ballB){ // detecting collisions between balls
        var c = this.pos.clone(this.pos) // clone to use in math
        c.subPoint(ballB.pos)
        var dist = c.Mag()
        
        if (dist > ballB.r - this.r){
          var n = new Vector2(c.x/dist,c.y/dist) // .div() isn't working
          var idk = ballB.r-this.r

          var nxidk = new Vector2(n.x*idk,n.y*idk) // .mult() isn't working
          
          var bbp = ballB.pos.clone(ballB.pos)
          bbp.addPoint(nxidk)
          
          this.pos = bbp
        }
    }
    
    this.objCollisions = function(balls){
        for (var i=0;i<balls.length;i++){
          if (balls[i]!=this){
            var c = this.pos.clone(this.pos)
            c.subPoint(balls[i].pos)
            var dist = c.Mag()
            
            if (dist < balls[i].r + this.r){
                var n = new Vector2(c.x/dist,c.y/dist)
                var idk = ((balls[i].r + this.r)-dist)/2
                
                var nxidk = new Vector2(n.x*idk,n.y*idk)
                
                var np = this.pos.clone(this.pos)
                np.addPoint(nxidk)
                
                var bnp = this.pos.clone(balls[i].pos)
                bnp.subPoint(nxidk)
          
                this.pos = np
                balls[i].pos = bnp
            }
          }
        }
    }
    
    this.canvasDetect = function(){ // Detecting AABB collisions with the canvas edge
        var posp = this.pos.clone(this.pos)
        if (posp.y+this.r > cY || posp.y-this.r < 0 ||
            posp.x+this.r > cW || posp.x-this.r < 0){
            this.pos(this.pos.x,this.pos.y)
        }
    }
    
} //Ball Class
