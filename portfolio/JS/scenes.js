import * as three from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { dropLoadingScreen } from './controller.js'

// storage of all scenes
export const artTag = {isArt:true}

let masterworks = new three.Group()
let draftroom = new three.Group()
let bedroom = new three.Group()

// loaders
const imgLoader = new three.TextureLoader()

let scenesLoaded = 0

function sceneLoaded(){
    scenesLoaded++

    console.log(scenesLoaded)
    if (scenesLoaded >= 3){
        dropLoadingScreen()
    }
}

const masterworks_charcoal = imgLoader.load('./IMG_Container/CharcoalShape.png',(texture)=>{texture.colorSpace = three.SRGBColorSpace})

const objloader = new OBJLoader()
const gltfloader = new GLTFLoader()

gltfloader.load('./OBJ_Container/Bestworks.glb', (res) => {
    for (let child of res.scene.children){
        child.castShadow = true
        child.recieveShadow = true

        let splitName = child.name.split("_",1)
        if (splitName[0] == "art"){
            child.userData = artTag
            child.name = child.name.substring(4).replaceAll("_"," ")
        }
    }

    masterworks.add(res.scene)
    sceneLoaded()
}, undefined, (err) => {
    console.log(err)
})

gltfloader.load('./OBJ_Container/Draftroom.glb', (res) => {
    for (let child of res.scene.children){
        child.castShadow = true
        child.recieveShadow = true

        let splitName = child.name.split("_",1)
        if (splitName[0] == "art"){
            child.userData = artTag
            child.name = child.name.substring(4).replaceAll("_"," ")
        }
    }

    draftroom.add(res.scene)
    sceneLoaded()
}, undefined, (err) => {
    console.log(err)
})

gltfloader.load('./OBJ_Container/Bedroom.glb', (res) => {
    for (let child of res.scene.children){
        child.castShadow = true
        child.recieveShadow = true

        let splitName = child.name.split("_",1)
        if (splitName[0] == "art"){
            child.userData = artTag
            let newName = child.name.substring(4).replaceAll("_"," ")
            switch(newName){
                case "canyon":
                    child.name = "Color Theory Chasm"
                    break

                case "lilypads":
                    child.name = "Lilypads"
                    break

                case "portfolio":
                    child.name = "This Site"
                    break

                default:
                    child.name = newName
                    break
            }
            
        }
    }

    bedroom.add(res.scene)
    sceneLoaded()
}, undefined, (err) => {
    console.log(err)
})

//////// Masterwork room setup ////////

let directional = new three.DirectionalLight(null,3)
directional.target.position.set(-2,-10,-5)

masterworks.add(directional.target)
masterworks.add(directional)

let spot = new three.SpotLight(null,10,4,Math.PI/8)
spot.position.set(-1.77,1.86,0.85)
spot.target.position.set(-2.43,0,0.85)

masterworks.add(spot.target)
masterworks.add(spot)

spot = new three.SpotLight(null,10,4,Math.PI/8)
spot.position.set(-1.77,1.86,-1.4)
spot.target.position.set(-2.43,0,-1.4)

masterworks.add(spot.target)
masterworks.add(spot)

spot = new three.SpotLight(null,2,4,Math.PI/4)
spot.position.set(-0.97,1.86,-1.84)
spot.target.position.set(-0.97,1.8,-1.9)

masterworks.add(spot.target)
masterworks.add(spot)

spot = new three.SpotLight(null,10,4,Math.PI/8)
spot.position.set(1,1.86,-1.84)
spot.target.position.set(1,-1,-1.87)

masterworks.add(spot.target)
masterworks.add(spot)

//////// Draftroom room setup ////////

let point = new three.PointLight(0xeeddaa, 10)
point.castShadow = true

point.position.set(0,2.3,0)

draftroom.add(point)

//////// Bedroom room setup ////////

directional = new three.DirectionalLight(0xFFC79C,5)
directional.target.position.set(5,-5,0)

bedroom.add(directional.target)
bedroom.add(directional)

point = new three.PointLight(0xeeeeff, 10)
point.castShadow = true

point.position.set(1.5,-2.3,1.5)

bedroom.add(point)

////////////////////////////////////

export default {
    'The Bestworks': masterworks,
    'The Draftroom': draftroom,
    'The Bedroom': bedroom,
}
