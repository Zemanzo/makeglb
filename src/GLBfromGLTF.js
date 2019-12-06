// reference
// https://github.com/sbtron/makegltf/blob/master/index.html
// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#reference-image

const FILE_HEADER_LENGTH = 12
const JSON_CHUNK_HEADER_LENGTH = 8
const BIN_CHUNK_HEADER_LENGTH = 8
const GLTF_MAGIC = 0x46546C67
const GLTF_VERSION = 2
const JSON_HEADER = 0x4E4F534A
const BIN_HEADER = 0x004E4942
const LITTLE_ENDIAN = true

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

  return new Promise((resolve, reject) => {
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
      .catch((exception) => reject(exception))
  })
}

const combineResources = (gltf) => {
  const resources = []

  gltf.buffers.forEach((buffer) => {
    const { uri } = buffer
    resources.push({ type: 'buffer', uri })
  })

  if (gltf.images) {
    gltf.images.forEach((image) => {
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

const handleBinaryData = async (gltf, fileBlobs) => {
  let bufferOffset = 0
  const bufferMap = {}

  const resources = combineResources(gltf)
  let buffers = await downloadResources(resources, fileBlobs)

  /* eslint-disable no-param-reassign, array-callback-return */
  gltf.buffers.map((buffer, bufferIndex) => {
    delete buffer.uri
    buffer.byteLength = buffers[bufferIndex].data.byteLength

    bufferMap[bufferIndex] = bufferOffset
    bufferOffset += calculateAlignedLength(buffers[bufferIndex].data.byteLength, 4)
  })

  if (gltf.images) {
    gltf.images.map((image, imageIndex) => {
      const bufferIndex = gltf.buffers.length + imageIndex

      bufferMap[bufferIndex] = bufferOffset

      const bufferView = {
        buffer: 0,
        byteOffset: bufferOffset,
        byteLength: buffers[bufferIndex].data.byteLength,
      }

      bufferOffset += calculateAlignedLength(buffers[bufferIndex].data.byteLength, 4)

      const bufferViewIndex = gltf.bufferViews.length
      gltf.bufferViews.push(bufferView)

      image.bufferView = bufferViewIndex
      image.mimeType = image.mimeType

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

export const GLBfromGLTF = async (gltf, fileBlobs) => {
  if (gltf instanceof ArrayBuffer) {
    const utf8decoder = new TextDecoder("utf-8")
    gltf = utf8decoder.decode(gltf)
  } else if (typeof gltf !== "string") {
    gltf = JSON.stringify(gltf)
  }
  gltf = JSON.parse(gltf)

  try {
    let bufferMap, bufferSize, buffers
    if (gltf.asset.version === "1.0") {
     ({ bufferMap, bufferSize, buffers } = await handleBinaryData(gltf, fileBlobs))
    }/* else if (gltf.asset.version === "2.0") {
       debugger
      bufferMap = gltf.buffers
      bufferSize = gltf.buffers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.byteLength
      })
      bufferMap = bufferMap.map((buffer) => {
        const encoder = new TextEncoder()
        buffer.uri = encoder.encode(buffer.uri)
        return buffer
      })
    } */ else {
      throw new Error(`Unsupported GLTF version (${gltf.asset.version})`)
    }
    gltf.buffers = [{
      byteLength: bufferSize,
    }]

    const jsonBuffer = jsonToArray(gltf)
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
    return { error: e }
  }
}
