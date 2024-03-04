import './style.css'
import * as THREE from 'three'
// import gsap from 'gsap'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// import DoorColor from 'src/assets/textures/door/color.jpg'
// import DoorAlpha from 'src/assets/textures/door/alpha.jpg'
// import DoorAmbientOcclusion from 'src/assets/textures/door/ambientOcclusion.jpg'
// import DoorHeight from 'src/assets/textures/door/height.jpg'
// import DoorMetalness from 'src/assets/textures/door/metalness.jpg'
// import DoorNormal from 'src/assets/textures/door/normal.jpg'
// import DoorRoughness from 'src/assets/textures/door/roughness.jpg'
// import CheckBoard1024 from 'src/assets/textures/checkerboard-1024x1024.png'
// import CheckBoard8x8 from 'src/assets/textures/checkerboard-8x8.png'
import matcap from 'src/assets/textures/matcaps/4.png'
// import gradient from 'src/assets/textures/gradients/3.jpg'
// import environmentMap from 'src/assets/environmentMap/2k.hdr'

const canvas = document.querySelector<HTMLCanvasElement>('canvas#three')

if (!canvas) {
  throw new Error('Canvas not found')
}

function randn_bm(min: number, max: number, skew: number) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = (url, loaded, total) => {
  console.log('loading started')
  console.log('url', url)
  console.log('loaded', loaded)
  console.log('total', total)
}
loadingManager.onLoad = () => {
  console.log('loading finished')
}
loadingManager.onProgress = (url, loaded, total) => {
  console.log('loading progress')
  console.log('url', url)
  console.log('loaded', loaded)
  console.log('total', total)
}
loadingManager.onError = (url) => {
  console.error('failed to load url: ', url)
}

const textureLoader = new THREE.TextureLoader(loadingManager)
// const doorColorTexture = textureLoader.load(DoorColor)
// const doorAlphaTexture = textureLoader.load(DoorAlpha)
// const doorAmbientOcclusionTexture = textureLoader.load(DoorAmbientOcclusion)
// const doorHeightTexture = textureLoader.load(DoorHeight)
// const doorMetalnessTexture = textureLoader.load(DoorMetalness)
// const doorNormalTexture = textureLoader.load(DoorNormal)
// const doorRoughnessTexture = textureLoader.load(DoorRoughness)
const matcapTexture = textureLoader.load(matcap)
// const gradientTexture = textureLoader.load(gradient)

// doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace
// gradientTexture.colorSpace = THREE.SRGBColorSpace

// colorTexture.repeat.set(2, 3)
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
// colorTexture.minFilter = THREE.NearestFilter
// colorTexture.magFilter = THREE.NearestFilter

const gui = new GUI({
  title: 'Debug UI'
})
const debugObject = {
  subdivision: 1,
  color: 'orange',
  spin: () => {},
}
const scene = new THREE.Scene()

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

const fontLoader = new FontLoader(loadingManager)
fontLoader.load('fonts/helvetiker_regular.typeface.json', font => {
  const textGeometry = new TextGeometry('OLGA + RUSLAN', {
    font,
    size: 1,
    height: 1,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 10,
  })
  // textGeometry.computeBoundingBox()
  // if (textGeometry.boundingBox) {
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) / 2,
  //     -(textGeometry.boundingBox.max.y - 0.02) / 2,
  //     -(textGeometry.boundingBox.max.z - 0.03) / 2,
  //   )
  // }
  textGeometry.center()

  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)
})

const heartShape = new THREE.Shape()
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0)
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35)
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95)
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35)
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0)
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25)

const heartGeometry = new THREE.ExtrudeGeometry(
  heartShape,
  {
    bevelEnabled: true,
    bevelSegments: 20,
    steps: 20,
    bevelSize: 20,
    bevelThickness: 20
  }
)


for (let i = 0; i < 1000; i++) {
  const heart = new THREE.Mesh(heartGeometry, material)

  heart.position.set(
    randn_bm(-300, 300, 1),
    randn_bm(-300, 300, 1),
    randn_bm(-300, 300, 1)
  )
 
  const scale = Math.random() / 20
  heart.scale.set(scale, scale, scale)

  heart.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  )

  scene.add(heart)
}

scene.background = new THREE.Color('#d75656')
gui
  .addColor(debugObject, 'color')
  .onChange(() => {
    scene.background = new THREE.Color(debugObject.color)
  })
// const geometry = new THREE.BufferGeometry()
// const count = 500
// const positions = new Float32Array(count * 3 * 3)
// for (let i = 0; i < count * 3 * 3; i++) {
//   positions[i] = (Math.random() - 0.5) * 4
// }

// const positionAttribute = new THREE.BufferAttribute(positions, 3)
// geometry.setAttribute('position', positionAttribute)

// function makeCube(color: string, x: number) {
//   const box = new THREE.BoxGeometry(1, 1, 1)
//   const material = new THREE.MeshPhongMaterial({ map: colorTexture })
//   const cube = new THREE.Mesh(box, material)
//   cube.position.setX(x)

//   const cubeTweaks = gui.addFolder('Awesome cube')

//   cubeTweaks
//     .add(cube.position, 'y')
//     .min(- 3)
//     .max(3)
//     .step(0.01)
//     .name('elevation')
  
//   cubeTweaks.add(cube, 'visible')
//   cubeTweaks.add(material, 'wireframe')

//   debugObject.color = color
//   cubeTweaks
//     .addColor(debugObject, 'color')
//     .onChange(() => {
//       material.color.set(debugObject.color)
//     })

//   debugObject.spin = () => {
//     gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 })
//   }
//   cubeTweaks.add(debugObject, 'spin')

//   cubeTweaks
//     .add(debugObject, 'subdivision')
//     .min(1)
//     .max(20)
//     .step(1)
//     .onFinishChange(() =>
//     {
//         cube.geometry.dispose()
//         cube.geometry = new THREE.BoxGeometry(
//             1, 1, 1,
//             debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
//         )
//     })

//   return cube
// }

// const material = new THREE.MeshBasicMaterial({
  // map: doorColorTexture,
  // color: THREE.Color.NAMES['orange'],
  // transparent: true,
  // opacity: 0.5,
  // alphaMap: doorAlphaTexture,
  // side: THREE.DoubleSide,
// })

// const material = new THREE.MeshNormalMaterial({
  // flatShading: true,
// })

// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
// })

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: new THREE.Color(0x1188ff)
// })

// const material = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture,
// })

// const material = new THREE.MeshStandardMaterial({
//   metalness: 1,
//   roughness: 1,
//   map: doorColorTexture,
//   aoMap: doorAmbientOcclusionTexture,
//   displacementMap: doorHeightTexture,
//   displacementScale: 0.05,
//   metalnessMap: doorMetalnessTexture,
//   roughnessMap: doorRoughnessTexture,
//   normalMap: doorNormalTexture,
//   alphaMap: doorAlphaTexture,
//   transparent: true,
// })

// const materialTweaks = gui.addFolder('material')
// materialTweaks.add(material, 'wireframe')
// materialTweaks.add(material, 'flatShading')
// materialTweaks.add(material, 'metalness').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'roughness').min(0).max(1).step(0.01)

// const material = new THREE.MeshPhysicalMaterial({
//   metalness: 1,
//   roughness: 1,
//   map: doorColorTexture,
//   aoMap: doorAmbientOcclusionTexture,
//   displacementMap: doorHeightTexture,
//   displacementScale: 0.05,
//   metalnessMap: doorMetalnessTexture,
//   roughnessMap: doorRoughnessTexture,
//   normalMap: doorNormalTexture,
//   alphaMap: doorAlphaTexture,
//   transparent: true,
  // clearcoat: 1,
  // clearcoatRoughness: 0,
  // sheen: 1,
  // sheenRoughness: 0.25,
  // sheenColor: new THREE.Color(1,1,1),
  // iridescence: 1,
  // iridescenceIOR: 1,
  // iridescenceThicknessRange: [ 100, 800],
  // transmission: 1,
  // ior: 1.5,
  // thickness: 0.5,
// })

// const materialTweaks = gui.addFolder('material')
// materialTweaks.add(material, 'wireframe')
// materialTweaks.add(material, 'flatShading')
// materialTweaks.add(material, 'metalness').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'roughness').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'clearcoat').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'clearcoatRoughness').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'sheen').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'sheenRoughness').min(0).max(1).step(0.01)
// materialTweaks.addColor(material, 'sheenColor')
// materialTweaks.add(material, 'iridescence').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'iridescenceIOR').min(0).max(1).step(0.01)
// materialTweaks.add(material.iridescenceThicknessRange, '0').min(0).max(1000).step(1)
// materialTweaks.add(material, 'transmission').min(0).max(1).step(0.01)
// materialTweaks.add(material, 'ior').min(0).max(10).step(0.01)
// materialTweaks.add(material, 'thickness').min(0).max(1).step(0.01)

// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   material
// )
// sphere.position.setX(-1.5)

// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(1, 1, 100, 100),
//   material
// )

// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.3, 0.2, 24, 48),
//   material
// )
// torus.position.setX(1.5)

// const group = new THREE.Group()
// group.add(sphere, plane, torus)

// cubeGroup.position.set(0, 0, 0)
// cubeGroup.scale.set(0.5, 0.5, 0.5)
// cubeGroup.rotation.set(0, Math.PI * 2, 0)
// cube.position.normalize()
// scene.add(group)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 75)
// camera.lookAt()
scene.add(camera)

// const axesHelper = new THREE.AxesHelper(2)
// scene.add(axesHelper)

// const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.set(2, 3, 3)
// scene.add(pointLight)

// const rgbeLoader = new RGBELoader(loadingManager)
// rgbeLoader.load(environmentMap, environment => {
//   environment.mapping = THREE.EquirectangularReflectionMapping
//   scene.background = environment
//   scene.environment = environment
// })

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.update()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const goFullscreen = (e: KeyboardEvent | MouseEvent) => {
  if (document.fullscreenElement) {
    return
  }

  if (e.type === 'keydown' && e.key === 'f') {
    canvas.requestFullscreen()
  }
}

window.addEventListener('keydown', goFullscreen)
window.addEventListener('dblclick', goFullscreen)

// const clock = new THREE.Clock()
let moving = true

const render = () => {
  // const elapsedTime = clock.getElapsedTime()

  if (moving) {
    camera.position.z = camera.position.z - 0.15
  }

  if (camera.position.z < 5) {
    moving = false
  }

  controls.update()
  renderer.render(scene, camera)
	requestAnimationFrame(render)
}

render()
