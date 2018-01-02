import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'

export default class Renderer {
  constructor(color) {
    // create the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    console.log(window.devicePixelRatio)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setClearColor(color)
    this.renderer.precision = 'highp'

    // set default camera position for later retrieval
    this.cameraDefaultPosition = {x:0, y:2, z:130}
    this.cameraDefaultRotation = {x:0, y:0, z:0}

    // create the camera
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20000)
    this.camera.position.x = this.cameraDefaultPosition.x
    this.camera.position.y = this.cameraDefaultPosition.y
    this.camera.position.z = this.cameraDefaultPosition.z
    this.camera.rotation.x = this.cameraDefaultRotation.x
    this.camera.rotation.y = this.cameraDefaultRotation.y
    this.camera.rotation.z = this.cameraDefaultRotation.z

    // create the scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(color, 1, 5000)

    // create some lights
    this.ambientLight = new THREE.AmbientLight(0xfafafa, 0.2)
  	this.scene.add(this.ambientLight)

    this.spotLightOne = new THREE.SpotLight(0xffffff, 0.5)
    this.spotLightOne.position.set( -100, 2000, 100 )
    this.spotLightOne.castShadow = true

    this.spotLightOne.shadow.mapSize.width = 2048
    this.spotLightOne.shadow.mapSize.height = 2048

    this.spotLightOne.shadow.camera.near = 500
    this.spotLightOne.shadow.camera.far = 4000
    this.spotLightOne.shadow.camera.fov = 30

    this.scene.add(this.spotLightOne)

    this.spotLightTwo = new THREE.SpotLight(0xffffff, 0.5)
    this.spotLightTwo.position.set(1500, 20000, 800)
    this.spotLightTwo.rotation.set(0, 0, Math.PI)

    this.scene.add(this.spotLightTwo);

    this.directionalLightOne = new THREE.DirectionalLight(0xfafafa, 1)
    this.directionalLightOne.position.set(0, -1000, 0)
    this.directionalLightOne.castShadow = true
    this.scene.add(this.directionalLightOne)

    // create an orbit controller

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.minDistance = 500
    // this.controls.maxDistance = 1200
    // this.controls.minPolarAngle = 0
    // this.controls.maxPolarAngle = (Math.PI / 2) + 0.02
    this.controls.enabled = true
    this.controls.update()

    // add an effect composer
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    
    const copyPass = new ShaderPass(CopyShader)
    copyPass.renderToScreen = true
    this.composer.addPass(copyPass)

    // reset the projection matrix on resize
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  render() {
    this.controls.update()
    // this.renderer.render(this.scene, this.camera)
    this.composer.render()
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  get rendererElement() {
    return this.renderer.domElement
  }
}
