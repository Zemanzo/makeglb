// reference
// https://github.com/sbtron/makeglb/blob/master/index.html
// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#reference-image
import sharp from 'sharp'

const FILE_HEADER_LENGTH = 12
const JSON_CHUNK_HEADER_LENGTH = 8
const BIN_CHUNK_HEADER_LENGTH = 8
const GLTF_MAGIC = 0x46546C67
const GLTF_VERSION = 2
const JSON_HEADER = 0x4E4F534A
const BIN_HEADER = 0x004E4942
const LITTLE_ENDIAN = true

const GLTF_MIME_TYPES = {
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'text/plain': ['glsl', 'vert', 'vs', 'frag', 'fs', 'txt'],
  'image/vnd-ms.dds': ['dds'],
}

const SCALABLE_MIME_TYPES = ['image/png', 'image/jpeg']

const downloadResources = async (resources, fileBlobs) => {
  const promises = resources.map((resource) => {
    const { uri } = resource

    return new Promise(async (resolve) => {
      // uri can be base64 image url inline, filename that is a key in fileBlobs,
      // or an external url that needs to be fetched
      if (fileBlobs) {
        const parts = uri.split('/')
        const key = parts[parts.length - 1].toLowerCase()
        resolve(fileBlobs[key])
      } else {
        const response = await fetch(uri)
        const data = await response.arrayBuffer()
        resolve(data)
      }
    })
  })

  return new Promise((resolve) => {
    Promise.all(promises)
      .then((blobs) => {
        const embeds = resources.map((resource, index) => {
          const { type } = resource
          const data = blobs[index]

          return {
            index,
            type,
            data,
          }
        })

        resolve(embeds)
      })
  })
}

const combineResources = (glb) => {
  const resources = []

  glb.buffers.forEach((buffer) => {
    const { uri } = buffer
    resources.push({ type: 'buffer', uri })
  })

  if (glb.images) {
    glb.images.forEach((image) => {
      const { uri } = image
      resources.push({ type: 'image', uri })
    })
  }

  return resources
}

const calculateAlignedLength = (bufferLength, alignment) => {
  let alignedLength = 0
  if (bufferLength > 0) {
    const byteAlignment = bufferLength % alignment

    alignedLength = bufferLength + (byteAlignment === 0 ? 0 : (alignment - byteAlignment))
  }

  return alignedLength
}

const mimeTypeFromFilename = (filename) => {
  const mimeTypes = Object.keys(GLTF_MIME_TYPES)

  for (let m = 0; m < mimeTypes.length; ++m) {
    const mimeType = mimeTypes[m]

    for (let e = 0; e < GLTF_MIME_TYPES[mimeType].length; ++e) {
      const extension = GLTF_MIME_TYPES[mimeType][e]

      if (filename.toLowerCase().indexOf(extension) > 0) {
        return mimeType
      }
    }
  }

  // default
  return 'application/octet-stream'
}

const scaleBuffers = async (resources, glbBufferCount, buffers, scalingInfo) => new Promise((resolve, reject) => {
  const scalingPromises = resources.map((resource, resourceIndex) => {
    const mimeType = mimeTypeFromFilename(resource.uri)

    if (SCALABLE_MIME_TYPES.indexOf(mimeType) >= 0) {
      const bufferIndex = (glbBufferCount + resourceIndex - 1)
      const image = sharp(buffers[bufferIndex].data)

      return new Promise((imageResolve, imageReject) => {
        image
          .metadata()
          .then((metadata) => {
            if (metadata.width <= scalingInfo.textureSize) {
              imageReject(new Error(`image size (${metadata.width}) less than or equal to requested scaled size (${scalingInfo.textureSize})`))
              return
            }

            image
              .resize({ width: scalingInfo.textureSize, height: scalingInfo.textureSize })
              .toBuffer()
              .then(data => imageResolve({ index: bufferIndex, data }))
              .catch(exception => imageReject(exception))
          })
          .catch(exception => imageReject(exception))
      })
    }

    return Promise.resolve()
  })

  Promise.all(scalingPromises)
    .then((values) => {
      values.forEach((value) => {
        if (value) {
          /* eslint-disable no-param-reassign */
          buffers[value.index].data = value.data
          /* eslint-enable no-param-reassign */
        }
      })

      //resolve(buffers)
      reject(new Error("ERRORRORORORROROROROOROROROROR"))
    })
    .catch(exception) => {
      console.log(`caught ${exception.message} while scaling`)

      reject(eception)
    })
})

const handleBinaryData = async (glb, fileBlobs, scalingInfo) => {
  let bufferOffset = 0
  const bufferMap = {}

  const resources = combineResources(glb)
  let buffers = await downloadResources(resources, fileBlobs)

  // if scaling info is provided, then we need to scale the image down before
  // calculate the offset and aligned length
  if (scalingInfo && resources) {
    try {
      buffers = await scaleBuffers(resources, glb.buffers.length, buffers, scalingInfo)
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  /* eslint-disable no-param-reassign, array-callback-return */
  glb.buffers.map((buffer, bufferIndex) => {
    delete buffer.uri
    buffer.byteLength = buffers[bufferIndex].data.byteLength

    bufferMap[bufferIndex] = bufferOffset
    bufferOffset += calculateAlignedLength(buffers[bufferIndex].data.byteLength, 4)
  })

  if (glb.images) {
    glb.images.map((image, imageIndex) => {
      const bufferIndex = glb.buffers.length + imageIndex

      bufferMap[bufferIndex] = bufferOffset

      const bufferView = {
        buffer: 0,
        byteOffset: bufferOffset,
        byteLength: buffers[bufferIndex].data.byteLength,
      }

      bufferOffset += calculateAlignedLength(buffers[bufferIndex].data.byteLength, 4)

      const bufferViewIndex = glb.bufferViews.length
      glb.bufferViews.push(bufferView)

      image.bufferView = bufferViewIndex
      image.mimeType = mimeTypeFromFilename(image.uri)

      delete image.uri
    })
  }
  /* eslint-enable no-param-reassign, array-callback-return */

  return {
    bufferMap,
    bufferSize: bufferOffset,
    buffers,
  }
}

const jsonToArray = (json) => {
  const str = JSON.stringify(json, null, 0)
  const ret = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i)
  }
  return ret
}

export const GLBfromGLTF = async (gltf, fileBlobs, scaleInfo) => {
  const glb = JSON.parse(JSON.stringify(gltf))

  try {
    const { bufferMap, bufferSize, buffers } = await handleBinaryData(glb, fileBlobs, scaleInfo)
    glb.buffers = [{
      byteLength: bufferSize,
    }]

    const jsonBuffer = jsonToArray(glb)
    const jsonAlignedLength = calculateAlignedLength(jsonBuffer.length, 4)
    const jsonPadding = jsonAlignedLength - jsonBuffer.length

    const totalLength = FILE_HEADER_LENGTH
      + JSON_CHUNK_HEADER_LENGTH
      + jsonAlignedLength
      + BIN_CHUNK_HEADER_LENGTH
      + bufferSize

    const finalBuffer = new ArrayBuffer(totalLength)
    const dataView = new DataView(finalBuffer)
    let bufferIndex = 0

    dataView.setUint32(bufferIndex, GLTF_MAGIC, LITTLE_ENDIAN)
    bufferIndex += 4
    dataView.setUint32(bufferIndex, GLTF_VERSION, LITTLE_ENDIAN)
    bufferIndex += 4
    dataView.setUint32(bufferIndex, totalLength, LITTLE_ENDIAN)
    bufferIndex += 4

    // JSON
    dataView.setUint32(bufferIndex, jsonAlignedLength, LITTLE_ENDIAN)
    bufferIndex += 4
    dataView.setUint32(bufferIndex, JSON_HEADER, LITTLE_ENDIAN)
    bufferIndex += 4

    for (let j = 0; j < jsonBuffer.length; ++j) {
      dataView.setUint8(bufferIndex, jsonBuffer[j])
      bufferIndex += 1
    }

    for (let p = 0; p < jsonPadding; ++p) {
      dataView.setUint8(bufferIndex, 0x20)
      bufferIndex += 1
    }

    // BINARY
    dataView.setUint32(bufferIndex, bufferSize, LITTLE_ENDIAN)
    bufferIndex += 4
    dataView.setUint32(bufferIndex, BIN_HEADER, LITTLE_ENDIAN)
    bufferIndex += 4

    for (let b = 0; b < buffers.length; ++b) {
      const bufferOffset = bufferIndex + bufferMap[b]
      const buffer = new Uint8Array(buffers[b].data)
      for (let d = 0; d < buffers[b].data.byteLength; ++d) {
        dataView.setUint8(bufferOffset + d, buffer[d])
      }
    }

    return finalBuffer
  } catch (e) {
    throw e
  }
}

export const BLOBfromGLB = arrayBuffer => new Blob([arrayBuffer], { type: 'model/json-binary' })
