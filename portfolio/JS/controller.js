import * as three from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {animate, utils, createTimer} from 'https://cdn.jsdelivr.net/npm/animejs/+esm'
import {random} from './util.js'
import {default as scenes, artTag} from './scenes.js'

// DOM references
const leftHoverZone = document.querySelector('#move-left-hover-space')
const rightHoverZone = document.querySelector('#move-right-hover-space')

const leftButton = document.querySelector('#move-left-hover-space button')
const leftButtonText = document.querySelector('#move-left-hover-space button h3')
const rightButton = document.querySelector('#move-right-hover-space button')
const rightButtonText = document.querySelector('#move-right-hover-space button h3')

const selectionSpace = document.querySelector('.selection-space')

const roomTitle = document.querySelector('#room-title')
const roomTitleText = roomTitle //document.querySelector('#room-title u')

// misc

const scrollInAnim = [
    {transform: 'translateY(100%)', opacity: '0%'},
    {transform: 'translateY(0%)', opacity: '100%'}
]
const scrollInAnimSpecs = {
    duration: 1500,
    iterations: 1,
}

const sceneKeys = Object.keys(scenes)
let currentScene = 0

let width = window.innerWidth
let height = window.innerHeight

// scene
const scene = new three.Scene()

// renderer
const canvas = document.querySelector("#threejs-canvas")
const renderer = new three.WebGLRenderer({
    alpha:true,
    antialias:true,
    canvas
})
renderer.setSize(width, height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true

// camera
let wScaled = width / 100
let hScaled = height / 100

let mrad = Math.max(wScaled,hScaled) * 2

const camera = new three.OrthographicCamera(-wScaled, wScaled, hScaled, -hScaled, 0.1, 1000)

camera.position.set(100, 100, 100)
camera.lookAt(0,0,0)

const camLook = new three.Vector3()
camLook.copy(camera.position).negate().normalize()

const camUp = new three.Vector3()
camUp.copy(camera.up).applyMatrix4(camera.matrixWorld).normalize()

const camRight = new three.Vector3()
camRight.crossVectors(camLook,camUp).normalize()

function screenToWorld(x=0,y=0){
    let right = x * camera.right * 2
    let up = -y * camera.top * 2

    let final = new three.Vector3(-camera.right+right,camera.top+up,-2)
    
    return camera.localToWorld(final)
}

function worldToScreen(x=0,y=0,z=0){
    let v = new three.Vector3(x,y,z)
    v.project(camera)

    let sx = (v.x * 0.5 + 0.5)
    let sy = ((v.y * -0.5 + 0.5))

    return new three.Vector2(sx,sy)
}

function setupCurrentScene(){
    let artWorks = scenes[sceneKeys[currentScene]].getObjectsByProperty('userData',artTag)

    for (let art in artWorks){
        art = artWorks[art]
        let pos = art.position
        let screenpos = worldToScreen(pos.x,pos.y,pos.z)

        let selectionSpaceRect = selectionSpace.getBoundingClientRect()
        console.log(selectionSpaceRect)

        let domElement = document.createElement('p')
        domElement.innerHTML = '@'
        let style = `position:absolute; top:calc(${screenpos.y*height}px + ${selectionSpaceRect.top}px); left:calc(${screenpos.x*width}px - ${selectionSpaceRect.left}px);`
        domElement.style = style

        selectionSpace.appendChild(domElement)
    }
}

function hideAllButCurrentScene(){
    for (let i=0; i<sceneKeys.length; i++){
        if (i != currentScene){
            scenes[sceneKeys[i]].visible = false
        }else{
            scenes[sceneKeys[i]].visible = true
        }
    }
}

function wrapIndex(index, listLength) {
  return ((index % listLength) + listLength) % listLength;
}

// light
const ambient = new three.HemisphereLight(0xaaaaff,0xeeaaee,1)
scene.add(ambient)

// circles
let uniforms = {
    screenSize: {value: new three.Vector2(width,height)},

    color1: {value: new three.Vector3(0.666, 0.666, 1)},
    color2: {value: new three.Vector3(0.933, 0.666, 0.933)},
}

let vertex = `
    varying vec2 vUv;

    void main(){
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`

let fragment = `
    varying vec2 vUv;

    uniform vec2 screenSize;

    uniform vec3 color1;
    uniform vec3 color2;

    void main() {
        vec2 uv = gl_FragCoord.xy / screenSize;

        vec3 mixed = mix(color1,color2,uv.y);

        gl_FragColor = vec4(mixed,1.0);
    }`

const cMat = new three.ShaderMaterial({
    uniforms: uniforms,

    vertexShader: vertex,
    fragmentShader: fragment 
})

const circleCacheLeft  = []
const circleCacheRight = []

let circlesOnLeft = false
let circlesOnRight = false

// instance circles
for (let i=0; i<15; i++){
    let r = Math.floor(random(2,4))
    let cGeom = new three.CircleGeometry(r,40)

    let scale = Math.random() / 3

    let animSettings = {
        x: 1 + scale,
        y: 1 + scale,
        z: 1 + scale,

        loop: true,
        alternate: true,

        delay: random(0,500),

        ease:'inOutSine'
    }

    let circle1 = new three.Mesh(cGeom,cMat)
    circle1.lookAt(camera.position)

    let pos = screenToWorld(-1,-1)
    circle1.position.set(pos.x,pos.y,pos.z)

    animate(circle1.scale, animSettings)

    scene.add(circle1)
    circleCacheLeft.push(circle1)

    let circle2 = new three.Mesh(cGeom,cMat)
    circle2.lookAt(camera.position)

    pos = screenToWorld(-1,-1)
    circle2.position.set(pos.x,pos.y,pos.z)

    animate(circle2.scale, animSettings)

    scene.add(circle2)
    circleCacheRight.push(circle2)
}

function moveCirclesLeft(){
    if (circlesOnLeft){return}

    for (let i=0; i<circleCacheLeft.length; i++){
        let start = screenToWorld(random(-0.5,-0.3),i/circleCacheLeft.length)
        let goal = screenToWorld(random(0,0.05),i/circleCacheLeft.length)

        circleCacheLeft[i].position.set(start.x,start.y,start.z)

        animate(circleCacheLeft[i].position,{
            x: goal.x,
            y: goal.y,
            z: goal.z,

            ease:'outCubic'
        })
    }

    circlesOnLeft = true
}

function returnCirclesLeft(){
    for (let i=0; i<circleCacheLeft.length; i++){
        let goal = screenToWorld(-1,i/circleCacheLeft.length)

        animate(circleCacheLeft[i].position,{
            x: goal.x,
            y: goal.y,
            z: goal.z,

            ease:'inSine'
        })
    }

    circlesOnLeft = false
}

function moveCirclesRight(){
    if (circlesOnRight){return}

    for (let i=0; i<circleCacheRight.length; i++){
        let start = screenToWorld(random(1.3,1.5),i/circleCacheLeft.length)
        let goal = screenToWorld(random(0.95,1),i/circleCacheLeft.length)

        circleCacheRight[i].position.set(start.x,start.y,start.z)

        animate(circleCacheRight[i].position,{
            x: goal.x,
            y: goal.y,
            z: goal.z,

            ease:'outCubic'
        })
    }

    circlesOnRight = true
}

function returnCirclesRight(){
    for (let i=0; i<circleCacheRight.length; i++){
        let goal = screenToWorld(2,i/circleCacheRight.length)

        animate(circleCacheRight[i].position,{
            x: goal.x,
            y: goal.y,
            z: goal.z,

            ease:'inSine'
        })
    }

    circlesOnRight = false
}

let transitionCircle = new three.CircleGeometry(1,80)
let transitionMat = new three.MeshBasicMaterial({color:'#ffffff'})

transitionCircle = new three.Mesh(transitionCircle,transitionMat)
transitionCircle.lookAt(camera.position)
transitionCircle.visible = false

scene.add(transitionCircle)

// event handlers
function mouseoverLeft(){
    // console.log('in left')
    moveCirclesLeft()
}

function mouseoverRight(){
    // console.log('in right')
    moveCirclesRight()
}

function mouseoutLeft(){
    // console.log('out left')
    returnCirclesLeft()
}

function mouseoutRight(){
    // console.log('out right')
    returnCirclesRight()
}

let buttonDisabled = false
function leftButtonClick(){
    if (buttonDisabled){return}
    buttonDisabled = true

    let start = screenToWorld(-0.1,0.5)
    let goal  = screenToWorld(0.5,0.5)
    let goal2 = screenToWorld(1.1,0.5)

    transitionCircle.scale.set(0,0,0)
    transitionCircle.position.set(start.x,start.y,start.z)

    transitionCircle.visible = true

    animate(transitionCircle.position,{
        keyframes: [
            {x: goal.x, y: goal.y, z: goal.z,},
            {x: goal2.x, y: goal2.y, z: goal2.z,}
        ],

        ease:'outCubic',
        duration: 1000,
    })
    animate(transitionCircle.scale,{
        keyframes: [
            {x: mrad, y: mrad, z: mrad,},
            {x: 0, y: 0, z: 0,}
        ],

        ease:'outCubic',
        duration: 1000,

        onComplete: () => {buttonDisabled=false}
    })

    scenes[sceneKeys[currentScene]].rotation.y = 0
    animate(scenes[sceneKeys[currentScene]].rotation,{
        y : Math.PI,

        ease:'inCubic',
        duration: 500,

        onComplete: () => {
            currentScene = wrapIndex(currentScene-1,sceneKeys.length)

            roomTitleText.innerHTML = sceneKeys[currentScene]
            animate('#room-title',{
                keyframes:{
                    '0%': {transform: 'translateY(0%)', opacity: '0%', backgroundSize: '0% .1em'},
                    '100%': {transform: 'translateY(100%)', opacity: '100%', backgroundSize: '100% .1em'}
                },

                ease:'outCubic',
            })

            hideAllButCurrentScene()
            setupCurrentScene()

            scenes[sceneKeys[currentScene]].rotation.y = Math.PI
            animate(scenes[sceneKeys[currentScene]].rotation,{
                y : Math.PI * 2,

                ease:'outCubic',
                duration: 500,
            })

            leftButtonText.innerHTML = sceneKeys[wrapIndex(currentScene-1,sceneKeys.length)]
            rightButtonText.innerHTML = sceneKeys[wrapIndex(currentScene+1,sceneKeys.length)]
        }
    })

}

function rightButtonClick(){
    if (buttonDisabled){return}
    buttonDisabled = true

    let start = screenToWorld(1.1,0.5)
    let goal  = screenToWorld(0.5,0.5)
    let goal2 = screenToWorld(-0.1,0.5)

    transitionCircle.scale.set(0,0,0)
    transitionCircle.position.set(start.x,start.y,start.z)

    transitionCircle.visible = true

    animate(transitionCircle.position,{
        keyframes: [
            {x: goal.x, y: goal.y, z: goal.z,},
            {x: goal2.x, y: goal2.y, z: goal2.z,}
        ],

        ease:'outCubic',
        duration: 1000,
    })
    animate(transitionCircle.scale,{
        keyframes: [
            {x: mrad, y: mrad, z: mrad,},
            {x: 0, y: 0, z: 0,}
        ],

        ease:'outCubic',
        duration: 1000,

        onComplete: () => {buttonDisabled=false}
    })

    scenes[sceneKeys[currentScene]].rotation.y = 0
    animate(scenes[sceneKeys[currentScene]].rotation,{
        y : -Math.PI,

        ease:'inCubic',
        duration: 500,

        onComplete: () => {
            currentScene = wrapIndex(currentScene+1,sceneKeys.length)

            roomTitleText.innerHTML = sceneKeys[currentScene]
            animate('#room-title',{
                keyframes:{
                    '0%': {transform: 'translateY(0%)', opacity: '0%', backgroundSize: '0% .1em'},
                    '100%': {transform: 'translateY(100%)', opacity: '100%', backgroundSize: '100% .1em'}
                },

                ease:'outCubic',
            })

            hideAllButCurrentScene()
            setupCurrentScene()

            scenes[sceneKeys[currentScene]].rotation.y = -Math.PI
            animate(scenes[sceneKeys[currentScene]].rotation,{
                y : -Math.PI * 2,

                ease:'outCubic',
                duration: 500,
            })

            leftButtonText.innerHTML = sceneKeys[wrapIndex(currentScene-1,sceneKeys.length)]
            rightButtonText.innerHTML = sceneKeys[wrapIndex(currentScene+1,sceneKeys.length)]
        }
    })
}

console.log(scenes['The Draftroom'].getObjectsByProperty("userData",artTag))

// event connections

leftHoverZone.addEventListener('mouseover',mouseoverLeft)
rightHoverZone.addEventListener('mouseover',mouseoverRight)

leftHoverZone.addEventListener('mouseleave',mouseoutLeft)
rightHoverZone.addEventListener('mouseleave',mouseoutRight)

leftButton.addEventListener('click',leftButtonClick)
rightButton.addEventListener('click',rightButtonClick)

// rendering the scene
canvas.style.width = "100%"
canvas.style.height = "100%"

for (let i=0; i<sceneKeys.length; i++){
    if (i != currentScene){
        scenes[sceneKeys[i]].visible = false
    }
    scene.add(scenes[sceneKeys[i]])
}

animate('#room-title',{
    keyframes:{
        '0%': {transform: 'translateY(0%)', opacity: '0%', backgroundSize: '0% .1em'},
        '100%': {transform: 'translateY(100%)', opacity: '100%', backgroundSize: '100% .1em'}
    },

    ease:'outCubic',
})

function renderLoop(){
    width = canvas.clientWidth
    height = canvas.clientHeight
    
    wScaled = width / 100
    hScaled = height / 100

    mrad = Math.max(wScaled,hScaled) * 1.414
    
    camera.left = -wScaled
    camera.right = wScaled
    camera.top = hScaled
    camera.bottom = -hScaled
    camera.updateProjectionMatrix()

    uniforms.screenSize.value = new three.Vector2(width,height)

    // spin1.update()
    // spin2.update()
    
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(renderLoop)

















// fin