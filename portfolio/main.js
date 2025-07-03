import * as three from 'three'

const width = window.innerWidth
const height = window.innerHeight

// loader
const imgLoader = new three.TextureLoader()
const texture = imgLoader.load('/IMG_Container/CharcoalShape.png')
texture.colorSpace = three.SRGBColorSpace

// scene
const scene = new three.Scene()
scene.background = new three.Color(0x262626)

// renderer
const renderer = new three.WebGLRenderer()
renderer.setSize(width, height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true

// camera
const wScaled = width
const hScaled = height

const camera = new three.OrthographicCamera(-wScaled, wScaled, hScaled, -hScaled, 0.1, 1000)
camera.zoom = 3

camera.position.set(10, 10, 10)
camera.lookAt(0,0,0)

// light
const ambient = new three.HemisphereLight(0xaaaaff,0xeeaaee,1)
scene.add(ambient)

const directional = new three.DirectionalLight(0xeeddaa,0.5)
directional.castShadow = true

// directional.position.set(-10,6,0)
// directional.target.position.set(10,0,0)

scene.add(directional)

// cube
const bGeom = new three.BoxGeometry(-2,-2,-2)
const bMat = new three.MeshPhongMaterial({
    color: 0xaaaaaa,
    // map: texture,
    flatShading: true,
})
const cube = new three.Mesh(bGeom, bMat)
cube.recieveShadow = true
scene.add(cube)

// sphere
const sGeom = new three.OctahedronGeometry(1,3)
const sMat = new three.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
})
const sphere = new three.Mesh(sGeom, sMat)
sphere.castShadow = true
scene.add(sphere)


// rendering the scene
const container = document.querySelector('#threejs-container')
const canvas = renderer.domElement
container.append(canvas)

canvas.style.width = "100%"
canvas.style.height = "100%"

function renderCall(){
    let width = canvas.clientWidth
    let height = canvas.clientHeight
    
    let wScaled = width / 100
    let hScaled = height / 100
    
    camera.left = -wScaled
    camera.right = wScaled
    camera.top = hScaled
    camera.bottom = -hScaled
    camera.updateProjectionMatrix()
    
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(renderCall)

















// fin