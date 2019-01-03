# makeglb
Library to convert .gltf file and related geometry and textures into a self contained .glb

`GLBfromGLTF` take a .gltf file with (a) external links, (b) data urls, or (c) external file blobs and embed them in the .glb file

`BLOBfromGLB` helper function to return a blob that can be written as a file

# development / testing
After cloning repo

`npm i`

`npm run start:dev`

go to `http://localhost:3000/`

drop a gltf and related files on the drop area, or click download preconfigured gltf asset

If updating or adding code, run `npm run lint`

# original code is under /sample/legacy
Convert glTF to glb

Drag and drop converter accepts a .gltf file and related geometry or textures and creates a self contained .glb

http://sbtron.github.io/makeglb
