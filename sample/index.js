/* global MakeGLB */
/* eslint-disable
    no-param-reassign,
    prefer-destructuring,
    prefer-arrow-callback,
    prefer-template,
    func-names
*/

const files = []
const fileblobs = []

let gltf = null
let remainingfilestoprocess = 0
let glbfilename = 'test'

function handleDragOver(event) {
  event.stopPropagation()
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

function startDownload() {
  document.getElementById('downloadLink').click()
}

function addDownloadButton() {
  const btn = document.createElement('button')
  btn.id = 'downloadBtn'
  btn.disabled = true
  btn.onclick = startDownload
  btn.appendChild(document.createTextNode('Processing...'))
  document.getElementById('download').appendChild(btn)
}

function processBuffers() {
  return new Promise(function (resolve) {
    GLBfromGLTF(gltf, fileblobs)
      .then(function (arrayBuffer) {
        resolve(arrayBuffer)
      })
  })
}

function fileSave(arrayBuffer) {
  const a = document.getElementById('downloadLink')
  const file = MakeGLB.BLOBfromGLB(arrayBuffer)
  a.href = URL.createObjectURL(file)
  a.download = glbfilename + '.glb'
  document.getElementById('downloadBtn').disabled = false
  document.getElementById('downloadBtn').textContent = 'Download .glb'
  a.click()
}

function checkRemaining() {
  remainingfilestoprocess -= 1

  if (remainingfilestoprocess === 0) {
    processBuffers().then(fileSave)
  }
}

function traverseFileTree(item, path) {
  path = path || ''

  if (item.isFile) {
    item.file(function (file) {
      files.push(file)
      const fileitem = '<li><strong>'
        + escape(file.name)
        + '</strong> ('
        + file.type
        + ') - '
        + file.size
        + ' bytes, last modified: '
        + file.lastModifiedDate
        + '</li>'

      document.getElementById('list').innerHTML += fileitem

      const extension = file.name.split('.').pop()

      if (extension === 'gltf') {
        glbfilename = file.name.substr(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.'))
        const reader = new FileReader()

        reader.onload = function (event) {
          gltf = JSON.parse(event.target.result)
          checkRemaining()
        }

        reader.readAsText(file)
      } else {
        const reader = new FileReader()

        reader.onload = function (event) {
          fileblobs[file.name.toLowerCase()] = (event.target.result)
          checkRemaining()
        }

        reader.readAsArrayBuffer(file)
      }
    }, function (error) {
      /* eslint-disable no-console */
      console.error(error)
      /* eslint-enable no-console */
    })
  } else if (item.isDirectory) {
    const dirReader = item.createReader()

    dirReader.readEntries(function (entries) {
      remainingfilestoprocess += entries.length
      checkRemaining()

      for (let i = 0; i < entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + '/')
      }
    })
  }
}

function handleFileSelect(event) {
  event.stopPropagation()
  event.preventDefault()

  document.getElementById('list').innerHTML = ''
  addDownloadButton()

  const items = event.dataTransfer.items

  remainingfilestoprocess = items.length

  for (let i = 0; i < items.length; i++) {
    let entry = null

    if (items[i].getAsEntry) {
      entry = items[i].getAsEntry()
    } else if (items[i].webkitGetAsEntry) {
      entry = items[i].webkitGetAsEntry()
    }

    if (entry) {
      traverseFileTree(entry)
    }
  }
}

/* eslint-disable no-unused-vars */
function makeGltf() {
  fetch('/data/glTF/Avocado.gltf')
    .then(function (response) { return response.json() })
    .then(function (gltfJson) { return MakeGLB.GLBfromGLTF(gltfJson) })
    .then(function (arrayBuffer) {
      addDownloadButton()
      fileSave(arrayBuffer)
    })
}
/* eslint-enable no-unused-vars */

const dropZone = document.getElementById('drop_zone')
dropZone.addEventListener('dragover', handleDragOver, false)
dropZone.addEventListener('drop', handleFileSelect, false)
