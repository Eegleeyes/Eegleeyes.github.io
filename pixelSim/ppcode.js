var c = document.getElementById("pixelCanvas")
var ctx = c.getContext("2d")

var cW = c.width
var cH = c.height

var snadbtn = document.getElementById("sand")
var ersrbtn = document.getElementById("erase")
var wtrbtn = document.getElementById("water")
var stmbtn = document.getElementById("steam")
var smkbtn = document.getElementById("smoke")
var firbtn = document.getElementById("fire")
var mtlbtn = document.getElementById("metal")

var clrvw = document.getElementById("color")
var htvw = document.getElementById("heat")

var mX = 0
var mY = 0

var viewType = 0

var drawing = false
var stagger = false
var cmat = "Sand"

var img = ctx.createImageData(cW,cH)

var pixelGrid = []
var pixelTypes = ["Background","Sand","Water"]
pixelTypes[undefined] = "Inpassable"


function air(){
    this.color = [0,0,0,255]
    this.density = 0
    this.heat = 70
    this.heatGain = 1
    this.passthrough = true
    this.update = function(X,Y){
        var s = getSurroundings(X,Y)
        this.heat = setHeat(s,this.heat,this.heatGain)
    }
}

function sand(){
    this.color = [255,255,0,255]
    this.density = 1
    this.heat = 60
    this.heatGain = 0.2
    this.passthrough = false
    this.update = function(X,Y){
        var s = getSurroundings(X,Y)
        this.heat = setHeat(s,this.heat,this.heatGain)
        if (s[4] && s[4].density < this.density && s[0].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y+1][X]
            Y++
            pixelGrid[Y][X] = this
        }else if(s[5] && s[5].density < this.density && s[5].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y+1][X-1]
            Y++
            X--
            pixelGrid[Y][X] = this
        }else if(s[3] && s[3].density < this.density && s[3].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y+1][X+1]
            Y++
            X++
            pixelGrid[Y][X] = this
        }
    }
}

function water(){
    this.color = [0,0,255,255]
    this.density = 0.5
    this.heat = 35
    this.heatGain = 0.1
    this.passthrough = true
    this.update = function(X,Y){
        var s = getSurroundings(X,Y)
        this.heat = setHeat(s,this.heat,this.heatGain)
        if (this.heat > 180){
            pixelGrid[Y][X] = new steam()
            return
        }
        var rdir = Math.random() > 0.5
        if (s[4] && s[4].density < this.density && s[4].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y+1][X]
            Y++
            pixelGrid[Y][X] = this
        }else if(s[5] && s[5].density < this.density && s[5].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y+1][X-1]
            Y++
            X--
            pixelGrid[Y][X] = this
        }else if(s[3] && s[3].density < this.density && s[3].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y+1][X+1]
            Y++
            X++
            pixelGrid[Y][X] = this
        }else if(s[6] && s[6].density < this.density && rdir && s[6].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X-1]
            X--
            pixelGrid[Y][X] = this
        }else if(s[2] && s[2].density < this.density && !rdir && s[2].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X+1]
            X++
            pixelGrid[Y][X] = this
        }
    }
}

function steam(){
    this.color = [240,240,255,255]
    this.density = -0.5
    this.heat = 212
    this.heatGain = 1.1
    this.passthrough = true
    this.desync = false
    this.update = function(X,Y){
        var s = getSurroundings(X,Y)
        this.heat = setHeat(s,this.heat,this.heatGain)
        if (this.heat < 80){
            pixelGrid[Y][X] = new water()
            return
        }
        if (this.desync){
            this.desync = false
            return
        }else{
            this.desync = true
        }
        var rdir = Math.random() > 0.5
        if (s[0] && s[0].density > this.density && s[0].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X]
            Y--
            pixelGrid[Y][X] = this
        }else if(s[7] && s[7].density > this.density && s[7].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X-1]
            Y--
            X--
            pixelGrid[Y][X] = this
        }else if(s[1] && s[1].density > this.density && s[1].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X+1]
            Y--
            X++
            pixelGrid[Y][X] = this
        }else if(s[6] && s[6].density > this.density && rdir && s[6].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X-1]
            X--
            pixelGrid[Y][X] = this
        }else if(s[2] && s[2].density > this.density && !rdir && s[2].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X+1]
            X++
            pixelGrid[Y][X] = this
        }
    }
}

function smoke(){
    this.color = [100,100,100,255]
    this.density = -0.4
    this.heat = 100
    this.heatGain = 1.2
    this.passthrough = true
    this.desync = false
    this.update = function(X,Y){
        var s = getSurroundings(X,Y)
        this.heat = setHeat(s,this.heat,this.heatGain)
        if (this.heat < 40){
            if (Math.random() < 0.5){
                pixelGrid[Y][X] = new air()
                return
            }
        }
        if (this.desync){
            this.desync = false
            return
        }else{
            this.desync = true
        }
        var rdir = Math.random() > 0.5
        if (s[0] && s[0].density > this.density  && s[0].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X]
            Y--
            pixelGrid[Y][X] = this
        }else if(s[7] && s[7].density > this.density && s[7].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X-1]
            Y--
            X--
            pixelGrid[Y][X] = this
        }else if(s[1] && s[1].density > this.density && s[1].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X+1]
            Y--
            X++
            pixelGrid[Y][X] = this
        }else if(s[6] && s[6].density > this.density && rdir && s[6].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X-1]
            X--
            pixelGrid[Y][X] = this
        }else if(s[2] && s[2].density > this.density && !rdir && s[2].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X+1]
            X++
            pixelGrid[Y][X] = this
        }
    }
}

function fire(){
    this.color = [255,130,0,255]
    this.density = -0.5
    this.heat = 150
    this.maxHeat = 200
    this.heatGain = 0.3
    this.passthrough = true
    this.desync = false
    this.update = function(X,Y){
        var s = getSurroundings(X,Y)
        this.heat = Math.min(setHeat(s,this.heat,this.heatGain),200)
        if (this.heat <= 65){
            pixelGrid[Y][X] = new smoke()
            return
        }
        
        if (this.desync){
            this.desync = false
            return
        }else{
            this.desync = true
        }
        var rdir = Math.random() > 0.5
        if (s[0] && s[0].density > this.density && s[0].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X]
            Y--
            pixelGrid[Y][X] = this
        }else if(s[7] && s[7].density > this.density && s[7].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X-1]
            Y--
            X--
            pixelGrid[Y][X] = this
        }else if(s[1] && s[1].density > this.density && s[1].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y-1][X+1]
            Y--
            X++
            pixelGrid[Y][X] = this
        }else if(s[6] && s[6].density > this.density && rdir && s[6].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X-1]
            X--
            pixelGrid[Y][X] = this
        }else if(s[2] && s[2].density > this.density && !rdir && s[2].passthrough){
            pixelGrid[Y][X] = pixelGrid[Y][X+1]
            X++
            pixelGrid[Y][X] = this
        }
    }
}

function metal(){
    this.color = [200,200,200,255]
    this.density = 10
    this.heat = 65
    this.heatGain = 1
    this.passthrough = false
    this.update = function(X,Y){
        var s = getSurroundings(X,Y)
        this.heat = setHeat(s,this.heat,this.heatGain)
        
    }
}



function setPixel(x,y,ct){
    var p = (y*cW+x)*4
    img.data[p] = ct[0]
    img.data[p+1] = ct[1]
    img.data[p+2] = ct[2]
    img.data[p+3] = ct[3]
}

function getSurroundings(x,y){ //pain
    var s = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined]
    
    if(y>0){
    s[0] = pixelGrid[y-1][x]; // top
    }
    if(y>0&&x<cW-1){
    s[1] = pixelGrid[y-1][x+1]; // top right
    }
    if(x<cW-1){
    s[2] = pixelGrid[y][x+1]; // right
    }
    if(y<cH-1&&x<cW-1){
    s[3] = pixelGrid[y+1][x+1]; // bottom right
    }
    if(y<cH-1){
    s[4] = pixelGrid[y+1][x]; // bottom
    }
    if(y<cH-1&&x>0){
    s[5] = pixelGrid[y+1][x-1]; // bottom left
    }
    if(x>0){
    s[6] = pixelGrid[y][x-1]; // left
    }
    if(y>0&&x>0){
    s[7] = pixelGrid[y-1][x-1]; // top left
    }
    return s
}

function setHeat(s,ch,hg){
    var heatreturn = 0
    for (var i=0;i<s.length;i++){
        if (s[i]){
            heatreturn += (s[i].heat)
        }else{
            heatreturn += ch
        }
    }
    heatreturn /= s.length
    return ch+(heatreturn-ch)*hg
}

function mouseMove(e){
    mX = e.pageX
    mY = e.pageY
}

function mouseDown(){
    drawing = true
}
function mouseUp(){
    drawing = false
}

function setMaterial(){
    if (cmat=="Sand"){
        return new sand()
    }else if (cmat=="Eraser"){
        return new air()
    }else if (cmat=="Water"){
        return new water()
    }else if (cmat=="Steam"){
        return new steam()
    }else if (cmat=="Fire"){
        return new fire()
    }else if (cmat=="Smoke"){
        return new smoke()
    }else if(cmat=="Metal"){
        return new metal()
    }
}

function AABB(x,y){
    if (x < 10 || x > cW || y < 10 || y > cH){
        return false
    }
    return true
}

for(var y=0;y<cH;y++){
    pixelGrid[y] = []
    for(var x=0;x<cW;x++){
        pixelGrid[y][x] = new air()
        if (x==50&&y==50){
            pixelGrid[y][x] = new sand()
        }
        setPixel(x,y,pixelGrid[y][x].color)
    }
}
ctx.putImageData(img,0,0)

function advance(){
    if (AABB(mX,mY) && drawing && !stagger){
        pixelGrid[mY][mX] = setMaterial()
        stagger = true
    }else{
        stagger = false
    }
    for(var y=cH-1;y>=0;y--){
        for(var x=0;x<cW;x++){
            pixelGrid[y][x].update(x,y)
        }
    }
}

function updateFrame(){
    for(var y=0;y<cH;y++){
        for(var x=0;x<cW;x++){
            if (viewType === 0){
            setPixel(x,y,pixelGrid[y][x].color)
            }else if(viewType == 1){
                setPixel(x,y,[pixelGrid[y][x].heat,pixelGrid[y][x].heat,pixelGrid[y][x].heat,255])
            }
        }
    }
    ctx.putImageData(img,0,0)
}

function wraper(){
    advance()
    updateFrame()
}

setInterval(wraper, 10)
document.getElementById("test").innerHTML = "Good"
document.onmousemove = mouseMove
document.onmousedown = mouseDown
document.onmouseup = mouseUp

snadbtn.onclick = function(){cmat="Sand"}
ersrbtn.onclick = function(){cmat="Eraser"}
wtrbtn.onclick = function(){cmat="Water"}
stmbtn.onclick = function(){cmat="Steam"}
firbtn.onclick = function(){cmat="Fire"}
smkbtn.onclick = function(){cmat="Smoke"}
mtlbtn.onclick = function(){cmat="Metal"}

clrvw.onclick = function(){viewType=0}
htvw.onclick = function(){viewType=1}
