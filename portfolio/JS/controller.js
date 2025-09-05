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
roomTitle.style.visibility = "hidden"

const artExpansionButton = document.querySelector('.circle')
const artExpansionButtonStyling = 'background-color: unset; width: 30px; height: 30px;'

const artExpansionButtons = []

const overlay = document.querySelector('#overlay')
const artInfoTextContainer = document.querySelector('#art-information')
const artInfoTitle = document.querySelector('#art-information div h1')
const artInfoText = document.querySelector('#art-information div p')
const artImage = document.querySelector('#art-thumbnail img')

const artReturnButton = document.querySelector('#close-art-information button')

const loadingdiv = document.querySelector("#loading-screen")
const loadingCircle = document.querySelector('#loading-screen .circle')
const loadingText = document.querySelector('#loading-screen h1')

// misc
const artInformation = {
    "CharcoalShape": {
        imgURL: './IMG_Container/CharcoalShape.png',
        descHTML:`
        This is a test image, nothing more, nothing less. You aren't supposed to be able to see this.
        `,
        bright: false
    },
    "In For The Long Haul": {
        imgURL: './IMG_Container/CloudStudy.PNG',
        descHTML:`
        A 6-8 hour study of a cloud completed on a roadtrip. 
        The shadows were especially hard to execute, and ended up with me doing a lot of back-and-forth, but was well worth the result.
        <br><br>Digital
        `,
        bright: false
    },
    "Colors Found Underneath": {
        imgURL: './IMG_Container/FauvistMountain.PNG',
        descHTML:`
        A fauvist painting of the Matterhorn. The bright colors and reflection in the water make for quite an entrancing piece.
        <br><br>Digital
        `,
        bright: false
    },
    "Covered, Hidden": {
        imgURL: './IMG_Container/FrogFountain.PNG',
        descHTML:`
        A pointalist-impressionist painting of an overgrown fountain sporting a stack of 3 stone frogs.
        Inspired from a conversation with my mother, in which she exclaimed her desire for a real life frog fountain.
        <br><br>Digital
        `,
        bright: false
    },
    "Shape of a Frogger": {
        imgURL: './IMG_Container/FrogPhoneBackground.PNG',
        descHTML:`
        A pointalist-impressionist painting of a frog on a lilypad. 
        Fun fact: I use this as my phone background!
        <br><br>Digital
        `,
        bright: false
    },
    "Skull of the Inverse":{
        imgURL: './IMG_Container/BlackSkull.PNG',
        descHTML:`
        Getting bored of regular observational drawing, I decided to challenge myself.
        Instead of drawing black-on-white, I would do the opposite. The result is this image.
        <br><br>Digital
        `,
        bright: false
    },
    "Eye See You!":{
        imgURL: './IMG_Container/Eye.PNG',
        descHTML:`
        The classic eye, a start to every portrait unit as well as just something fun to draw. 
        This eye, however, is rather exceptional due to the detailed pupil.
        <br><br>Digital
        `,
        bright: true
    },
    "A Fresh Take":{
        imgURL: './IMG_Container/Mountain1.PNG',
        descHTML:`
        This rather Bob Ross inspired drawing is when I first started to explore landscapes in more depth. 
        Previously, I had only been doing object drawing and was getting rather fatigued, so I set my sights on something new, something grand.
        <br><br>Digital
        `,
        bright: true
    },
    "Of Barcelona":{
        imgURL: './IMG_Container/Corridor.JPG',
        descHTML:`
        On my first trip overseas, I went to Barcelona. And besides the large walkways, coastline, tapas, and history, I was deeply captivated by the thin, bustling streets.
        Once I returned home, I was displeased to find no good reference, but perservered and drew one from my imagination. 
        <br><br>Digital
        `,
        bright: false
    },
    "Scenic Creek":{
        imgURL: './IMG_Container/Mountain2.PNG',
        descHTML:`
        This drawing comes from the same roadtrip as <i>In For The Long Haul</i> does. 
        I think this embodies what made the other pieces great and expands upon them nicely. To say the least: I like this piece.
        <br><br>Digital
        `,
        bright: false
    },
    "Calm Before The Storm":{
        imgURL: './IMG_Container/CloudOverMountain.PNG',
        descHTML:`
        Clouds had vexed me to this point, as such, I decided to do a piece with a cloud as the focus. A simple mountain range and field frame the cloud quite nicely.
        <br><br>Digital
        `,
        bright: true
    },
    "Color Theory Chasm":{
        imgURL: './IMG_Container/RedCanyon.PNG',
        descHTML:`
        A pointalist-impressionist painting of a canyon. This is an experiment in <i>Color Relativity</i>, no blues or greens were used in this piece, only red.
        <br><br>Digital
        `,
        bright: false
    },
    "Lilypads":{
        imgURL: './IMG_Container/Lilypads.PNG',
        descHTML:`
        Just some lilypads. Practice-turned-finished of me trying to smooth out colors instead of doing another pointalist-impressionist piece.
        <br><br>Digital
        `,
        bright: false
    },
    "This Site":{
        imgURL: './IMG_Container/clear.png',
        descHTML:`
        I built this website from the ground up, everything you see (apart from the 3D renderer) is made by me. 
        Assets, transitions, effects, enough to call this an artpiece of its own.
        <br><br>HTML, JS, CSS
        `,
        bright: false
    },
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

async function loadImg(url, imgElement){
    return new Promise((resolve, reject) => {
        imgElement.onload = () => resolve(imgElement);
        imgElement.onerror = reject;
        imgElement.src = url;
    });
} 

function showArtInformation(artName){
    disableArtButtons()

    let artInfo = artInformation[artName]

    if (artInfo.bright){
        overlay.style.background = 'rgba(255, 255, 255, 0.5)'
        artInfoTextContainer.style.color = 'black' 
        artInfoTextContainer.style.background = 'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0))'
    }else{
        overlay.style.background = 'rgba(0,0,0,0.5)'
        artInfoTextContainer.style.color = 'white'
        artInfoTextContainer.style.background = 'linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0))'
    }

    artInfoTitle.innerHTML = artName
    artInfoText.innerHTML = artInfo.descHTML

    // artImage.src = artInfo.imgURL

    loadImg(artInfo.imgURL,artImage).then(()=>{
        animate(overlay, {
            keyframes: {
                0:{top:'100%'},
                100:{top:'0%'},
            },

            duration: 1000,
            ease:'outCubic'
        })

        overlay.style.visibility = 'visible'
    })
}

function hideArtInformation(){
    animate(overlay, {
        keyframes: {
            0:{top:'0%'},
            100:{top:'100%'},
        },

        duration: 1000,
        ease:'outCubic',

        onComplete: () => {
            enableArtButtons()
            overlay.style.visibility = 'hidden'
        }
    })
}


function disableArtButtons(){
    for (let button of artExpansionButtons){
        button.disabled = true
    }
}

function enableArtButtons(){
    for (let button of artExpansionButtons){
        button.disabled = false
    }
}

function cleanupForTransition(){
    for (let button of artExpansionButtons){
        button.remove()
        //button.removeEventListener('click')
    }
    artExpansionButtons.length = 0
}

function setupArtButtonsInCurrentScene(){
    let artWorks = scenes[sceneKeys[currentScene]].getObjectsByProperty('userData',artTag)

    for (let art in artWorks){
        art = artWorks[art]
        let pos = art.position
        let screenpos = worldToScreen(pos.x,pos.y,pos.z)

        let selectionSpaceRect = selectionSpace.getBoundingClientRect()

        let domElement = artExpansionButton.cloneNode(true)
        let style = `position:absolute; top:calc(${screenpos.y*height}px + ${selectionSpaceRect.top-15}px); left:calc(${screenpos.x*width}px - ${selectionSpaceRect.left+15}px);`

        domElement.style = style + artExpansionButtonStyling

        artExpansionButtons.push(domElement)

        domElement.addEventListener('click', () => {
            showArtInformation(art.name)
        })

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

    pos = screenToWorld(2,-1)
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
            cleanupForTransition()

            scenes[sceneKeys[currentScene]].rotation.y = Math.PI
            animate(scenes[sceneKeys[currentScene]].rotation,{
                y : Math.PI * 2,

                ease:'outCubic',
                duration: 500,

                onComplete: ()=>{setupArtButtonsInCurrentScene()}
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
            cleanupForTransition()

            scenes[sceneKeys[currentScene]].rotation.y = -Math.PI
            animate(scenes[sceneKeys[currentScene]].rotation,{
                y : -Math.PI * 2,

                ease:'outCubic',
                duration: 500,

                onComplete: ()=>{setupArtButtonsInCurrentScene()}
            })

            leftButtonText.innerHTML = sceneKeys[wrapIndex(currentScene-1,sceneKeys.length)]
            rightButtonText.innerHTML = sceneKeys[wrapIndex(currentScene+1,sceneKeys.length)]
        }
    })
}

function windowResize(){
    cleanupForTransition()
    setupArtButtonsInCurrentScene()
}

// event connections

leftHoverZone.addEventListener('mouseover',mouseoverLeft)
rightHoverZone.addEventListener('mouseover',mouseoverRight)

leftHoverZone.addEventListener('mouseleave',mouseoutLeft)
rightHoverZone.addEventListener('mouseleave',mouseoutRight)

leftButton.addEventListener('click',leftButtonClick)
rightButton.addEventListener('click',rightButtonClick)

artReturnButton.addEventListener('click',hideArtInformation)

window.addEventListener('resize',windowResize)

// rendering the scene
canvas.style.width = "100%"
canvas.style.height = "100%"

for (let i=0; i<sceneKeys.length; i++){
    if (i != currentScene){
        scenes[sceneKeys[i]].visible = false
    }
    scene.add(scenes[sceneKeys[i]])
}

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

function init(){
    roomTitle.style.visibility = "visible"
    animate('#room-title',{
        keyframes:{
            '0%': {transform: 'translateY(0%)', opacity: '0%', backgroundSize: '0% .1em', visible:true},
            '100%': {transform: 'translateY(100%)', opacity: '100%', backgroundSize: '100% .1em'}
        },

        ease:'outCubic',
    })

    setupArtButtonsInCurrentScene()

    
}

export function dropLoadingScreen(){
    renderer.setAnimationLoop(renderLoop)
    animate(loadingText, {
        transform:'translateY(-55vh)',

        duration:1000,

        ease:'inCubic',

        onComplete: ()=>{
            init()
        
            animate(loadingCircle, {
                transform:'scale(0%)',
                
                duration:1000,

                ease:'inCubic',

                onComplete: ()=>{loadingText.style.visibility = 'hidden'; loadingdiv.style.visibility = 'hidden'}
            })
        }
    })
    
}















// fin