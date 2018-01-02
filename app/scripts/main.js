// external imports
import * as THREE from 'three'
import TweenMax from 'gsap'

// custom component imports
import Renderer from './components/Renderer'

let renderer
let scene, camera

function init() {
  renderer = new Renderer(0xCCFF00)
  document.body.appendChild(renderer.rendererElement)

  scene = renderer.scene
  camera = renderer.camera

  TweenMax.ticker.addEventListener('tick', loop)
}

function loop() {
  renderer.render()
}

window.addEventListener('load', init)
