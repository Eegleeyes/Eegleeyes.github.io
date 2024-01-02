var vertexShaderSource //= '#version 300 es \n void main(){gl_Position = vec4(0.0,0.0,0.0,1.0);gl_PointSize = 150.0;}' 
/*= '#version 300 es

void main(){
    gl_Position = vec4(0.0,0.0,0.0,1.0);
    gl_PointSize = 150.0;
}
'*/

var fragShaderSource // = '#version 300 es \n precision mediump float;out vec4 fragColor;void main(){fragColor = vec4(1.0,0.0,0.0,1.0);}'
/*= '#version 300 es

precision mediump float;

out vec4 fragColor;

void main(){
    fragColor = vec4(1.0,0.0,0.0,1.0);
}
'*/

fetch("vertex.txt")
  .then((res) => res.text())
  .then((text) => {
    vertexShaderSource = text
   })

fetch("frag.txt")
  .then((res) => res.text())
  .then((text) => {
      fragShaderSource = text
   })

const canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl2")

const glProgram = gl.createProgram()

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader,vertexShaderSource)
gl.compileShader(vertexShader)
gl.attachShader(glProgram,vertexShader)

const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragShader,fragShaderSource)
gl.compileShader(fragShader)
gl.attachShader(glProgram,fragShader)

gl.linkProgram(glProgram)

if(!gl.getProgramParameter(glprogram,gl.LINKSTATUS)){
    alert(gl.getShaderInfoLog(vertexShader))
    alert(gl.getShaderInfoLog(fragShader))
}

gl.useProgram(glProgram)

gl.drawArrays(gl.POINTS,0,1)













//fin
