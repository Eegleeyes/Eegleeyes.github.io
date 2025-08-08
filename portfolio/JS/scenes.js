import * as three from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'

// storage of all scenes
export const artTag = {isArt:true}

let masterworks = new three.Group()
let draftroom = new three.Group()
let bedroom = new three.Group()

// loaders
const imgLoader = new three.TextureLoader()

let imagesLoaded = 0

const masterworks_charcoal = imgLoader.load('./IMG_Container/CharcoalShape.png',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})

const masterworks_cloud = imgLoader.load('./IMG_Container/CloudStudy.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})
const masterworks_frogFountain = imgLoader.load('./IMG_Container/FrogFountain.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})
const masterworks_frogPhone = imgLoader.load('./IMG_Container/FrogPhoneBackground.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})
const masterworks_fauvistMountain = imgLoader.load('./IMG_Container/FauvistMountain.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})

const draftroom_skull = imgLoader.load('./IMG_Container/BlackSkull.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})
const draftroom_eye = imgLoader.load('./IMG_Container/Eye.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})
const draftroom_mountain1 = imgLoader.load('./IMG_Container/Mountain1.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})
const draftroom_mountain2 = imgLoader.load('./IMG_Container/Mountain2.PNG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})
const draftroom_corridor = imgLoader.load('./IMG_Container/Corridor.JPG',(texture)=>{texture.colorSpace = three.SRGBColorSpace; imagesLoaded++})


const objloader = new OBJLoader()

//////// Masterwork room setup ////////

// lighting
const directional = new three.DirectionalLight(0xeeddaa,0.5)
directional.castShadow = true

directional.position.set(10,6,0)
directional.target.position.set(-10,0,0)

masterworks.add(directional)

// cube 
let bGeom = new three.BoxGeometry(-5,-5,-5)
let bMat = new three.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
})
let cube = new three.Mesh(bGeom, bMat)
cube.recieveShadow = true
masterworks.add(cube)

// Cloud
let pGeom = new three.PlaneGeometry(2,1.5)
let pMat  = new three.MeshBasicMaterial({
    map:masterworks_cloud,
})
let plane = new three.Mesh(pGeom,pMat)
plane.name = "In For The Long Haul"
plane.userData = artTag
plane.position.set(-0.6,1,-2.49)
masterworks.add(plane)

// Fauvist
pMat  = new three.MeshBasicMaterial({
    map:masterworks_fauvistMountain,
})
plane = new three.Mesh(pGeom,pMat)
plane.name = "Colors Found Underneath"
plane.userData = artTag
plane.position.set(0.4,-0.8,-2.49)
masterworks.add(plane)

// Fountain
pMat  = new three.MeshBasicMaterial({
    map:masterworks_frogFountain,
})
plane = new three.Mesh(pGeom,pMat)
plane.name = "Covered, Hidden"
plane.userData = artTag
plane.position.set(-2.49,0,0.9)
plane.rotateY(Math.PI*0.5)
masterworks.add(plane)

// Phone background
pGeom = new three.PlaneGeometry(1.12,2)
pMat  = new three.MeshBasicMaterial({
    map:masterworks_frogPhone,
})
plane = new three.Mesh(pGeom,pMat)
plane.name = "Shape of a Frogger"
plane.userData = artTag
plane.position.set(-2.49,0,-1.4)
plane.rotateY(Math.PI*0.5)
masterworks.add(plane)


//////// Draftroom room setup ////////

// cube 
bGeom = new three.BoxGeometry(-5,-5,-5)
bMat = new three.MeshPhongMaterial({
    color: 0xaaaaaa,
    flatShading: true,
})
cube = new three.Mesh(bGeom, bMat)
cube.recieveShadow = true
draftroom.add(cube)

// skull
pGeom = new three.PlaneGeometry(2,1.5)
pMat  = new three.MeshBasicMaterial({
    map:draftroom_skull,
})
plane = new three.Mesh(pGeom,pMat)
plane.name = "Skull of the Inverse"
plane.rotateY(Math.PI * 0.5)
plane.position.set(-2.49,1,0)
plane.userData = artTag
draftroom.add(plane)

// eye
pMat  = new three.MeshBasicMaterial({
    map:draftroom_eye,
})
plane = new three.Mesh(pGeom,pMat)
plane.name = "Eye see you!"
plane.position.set(0,1,-2.49)
plane.userData = artTag
draftroom.add(plane)

// mountain1
pMat  = new three.MeshBasicMaterial({
    map:draftroom_mountain1,
})
plane = new three.Mesh(pGeom,pMat)
plane.name = "A Fresh Take"
plane.position.set(0,3,-2.49)
plane.userData = artTag
draftroom.add(plane)


//////// Bedroom room setup ////////



////////////////////////////////////

export default {
    'The Bestworks': masterworks,
    'The Draftroom': draftroom,
    'The Bedroom': bedroom,
}