// Physics, from scratch. Verlet Integration

var canvas = document.getElementById("RenderSpace")
var ctx = canvas.getContext("2d")

import("Objects.js") // objects

function rad(a){ // convert degrees to radians
    return a * (Math.PI/180)
}

var cW = canvas.width
var cY = canvas.height

var gravity = new Vector2(0,500)

var msteps = 1000
var steps = 0

var substeps = 2

var dt = 1/60

var balls = []

function summonBalls(num){
    for (var i=0;i<num;i++){
        var n = 360/num
        ctx.strokeStyle = "blue"
        balls[i] = new Ball(Math.floor(/*Math.random()*/5),new Vector2(Math.cos(rad(i*n))*185+cW/2,Math.sin(rad(i*n))*185+cY/2))
    }
}

summonBalls(100)

var constraintBall = new Ball(200,new Vector2(cW/2,cY/2))

function update(){
    if(steps<msteps){
        steps += 1
        ctx.clearRect(0,0,cW,cY)
        constraintBall.obj.add()
        for (var i=0;i<balls.length;i++){
            for (var j=0;j<substeps;j++){
              balls[i].addForce(gravity)
              balls[i].collisionDetect(constraintBall)
              balls[i].objCollisions(balls)
              balls[i].updatePosition(1/(60*substeps))
            }
            balls[i].obj.add()
        }
    }
}

function forceUpdate(){
    ctx.clearRect(0,0,cW,cY)
    constraintBall.obj.add()
    for (var i=0;i<balls.length;i++){
        for (var j=0;j<substeps;j++){
          balls[i].addForce(gravity)
          balls[i].collisionDetect(constraintBall)
          balls[i].objCollisions(balls)
          balls[i].updatePosition(1/(60*substeps))
        }
        balls[i].obj.add()
    }
    
}

function jump(){
    for (var i=0;i<balls.length;i++){
          balls[i].addForce(new Vector2(0,-25000))
    }
}

setInterval(update,10)

document.getElementById("step").onclick = forceUpdate
document.getElementById("jump").onclick = jump

//fin
