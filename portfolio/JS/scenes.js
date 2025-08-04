import * as three from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'

// storage of all scenes
export const artTag = {isArt:true}

let masterworks = new three.Group()
let draftroom = new three.Group()
let bedroom = new three.Group()

// loaders
const imgLoader = new three.TextureLoader()

const masterworks_charcoal = imgLoader.load('./IMG_Container/CharcoalShape.png')
masterworks_charcoal.colorSpace = three.SRGBColorSpace

const masterworks_cloud = imgLoader.load('./IMG_Container/CloudStudy.png')
masterworks_cloud.colorSpace = three.SRGBColorSpace

const masterworks_frogFountain = imgLoader.load('./IMG_Container/FrogFountain.png')
masterworks_frogFountain.colorSpace = three.SRGBColorSpace

const masterworks_frogPhone = imgLoader.load('./IMG_Container/FrogPhoneBackground.png')
masterworks_frogPhone.colorSpace = three.SRGBColorSpace

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
    color: 0xaaaaaa,
    flatShading: true,
})
let cube = new three.Mesh(bGeom, bMat)
cube.recieveShadow = true
masterworks.add(cube)

// plane
let pGeom = new three.PlaneGeometry(2,1.5)
let pMat  = new three.MeshPhongMaterial({
    map:masterworks_cloud,
    flatShading:true
})
let plane = new three.Mesh(pGeom,pMat)
plane.receiveShadow = true
plane.castShadow = true

plane.name = "CharcoalShape"

plane.userData = artTag

plane.position.set(0,1,-2.49)
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

// plane
pGeom = new three.PlaneGeometry(2,2)
pMat  = new three.MeshPhongMaterial({
    map:masterworks_charcoal,
    flatShading:true
})
plane = new three.Mesh(pGeom,pMat)
plane.receiveShadow = true
plane.castShadow = true

plane.name = "CharcoalShape"

plane.rotateY(Math.PI * 0.5)
plane.position.set(-2.49,1,0)

plane.userData = artTag
draftroom.add(plane)

//////// Bedroom room setup ////////



////////////////////////////////////

export default {
    'The Bestworks': masterworks,
    'The Draftroom': draftroom,
    'The Bedroom': bedroom,
}