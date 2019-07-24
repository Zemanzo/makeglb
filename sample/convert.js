import fs from 'fs'
import { GLBfromGLTF } from '../src'

const file = './sample/data/glTF/Avocado.gltf'

const files = [
  './sample/data/glTF/Avocado.bin',
  './sample/data/glTF/Avocado_baseColor.png',
  './sample/data/glTF/Avocado_normal.png',
  './sample/data/glTF/Avocado_roughnessMetallic.png'
]

const scaledVersions = [
  {
    textureSize: 2048,
    suffix: '2k'
  },
  {
    textureSize: 1024,
    suffix: '1k'
  },
  {
    textureSize: 512,
    suffix: '512'
  }
]

var gltf = JSON.parse(fs.readFileSync(file))

const fileBlobs = []

files.map(file => {
  const parts = file.split('/')
  const key = parts[parts.length - 1].toLowerCase()

  const buffer = fs.readFileSync(file)

  fileBlobs[key] = buffer
})

const glb = GLBfromGLTF(gltf, fileBlobs)

glb.then(glbBuffer => {
  fs.writeFileSync(`./sample/data/output/Avacado.glb`, new Buffer(glbBuffer))
  console.log(`wrote original glb`)
})

scaledVersions.map(scaleInfo => {
  const scaledGlb = GLBfromGLTF(gltf, fileBlobs, scaleInfo)

  scaledGlb.then(scaledGlbBuffer => {
    if (scaledGlbBuffer) {
      fs.writeFileSync(`./sample/data/output/Avacado.${scaleInfo.suffix}.glb`, new Buffer(scaledGlbBuffer))
      console.log(`wrote scaled glb (${scaleInfo.suffix})`)
    }
    else {
      console.log(`unable to scale glb (${scaleInfo.suffix})`)
    }
  })
})
