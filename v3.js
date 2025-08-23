import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

const loader = new GLTFLoader();

let time = 0;

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(
  	`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`
  	);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

const light = new THREE.DirectionalLight( 0xFFFFFF );
scene.add( light );

const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );

let theModel;
let mixer;
let clock = new THREE.Clock();
loader.load( 'model3\\low_poly_humanoid_robot.glb', function ( gltf ) {
// loader.load( '3dmodel\\theModel.glb', function ( gltf ) {

  scene.add( gltf.scene );
  console.log(dumpObject(gltf.scene).join("\n"));

  theModel = gltf.scene.getObjectByName('RootNode');
  // const boxhelp = new THREE.BoxHelper(theModel);
  // scene.add(boxhelp);

  console.log(theModel);

  console.log(gltf.animations);

  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();

  function animate() {
    // requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.05;
    // loader.rotation.x += 0.1;
    time += clock.getDelta() * 0.1;
    if (time > 1) {
      time = 0;
      console.log("Reache end");
      activePath += 1;
      console.log(activePath);
      // sound.play();
    }

    // console.log(clock.getDelta());

    if (theModel) {
  /*    theModel.rotation.x += 0.02;
      theModel.scale.x += 0.002;
      theModel.scale.z += 0.002;
      theModel.scale.y += 0.002;*/

      if (activePath < segments.length) {
        theModel.position.x = pathways[activePath].getPoint(time).x * 100;
        theModel.position.y = pathways[activePath].getPoint(time).y * 100;
        // theModel.position.y = path2.getPoint(time).z * 100;
        if (pathways[activePath].getPoint(time).z) {
          theModel.position.z = pathways[activePath].getPoint(time).z * 100;
        }
        else {
          theModel.position.z = 0;
        }
      }
      // console.log(path2.getPoint(time).z);
      // console.log(path2.getPoint(time));
    }

    const delta = clock.getDelta();
    mixer.update(0.0001);

    controls.update();
    renderer.render( scene, camera );
  }

  renderer.setAnimationLoop( animate );

}, undefined, function ( error ) {

  console.error( error );

} );

const C_ORIGIN = 0;
const C_LINEAR = 1;
const C_QUADRATIC = 2;

const sceneInformation = {
  "act1": {
    "curves": [
      [   C_ORIGIN, [ [0.0, 0.0, 0.0] ]],
      [   C_LINEAR, [ [1.0, 1.0, 1.0] ]],
      [   C_LINEAR, [ [4.0, -3.0, -2.0] ]],
      [C_QUADRATIC, [ [2.0, 0.0, 1.0], [5.0, -5.0, 5.0] ]],
      [   C_LINEAR, [ [-3.0, 0.0, 0.0] ]]
    ],
    "colour": 0xffff00
  },
  "act2": {
    "curves": [
      [   C_ORIGIN, [ [-3.0, 0.0, 0.0] ]],
      [   C_LINEAR, [ [-1.0, 1.0, -1.0] ]],
      [   C_LINEAR, [ [-4.0, -3.0, 2.0] ]],
      [   C_LINEAR, [ [3.0, 0.0, -0.0] ]]
    ],
    "colour": 0xff00ff
  }
}

const pathways = [];

const generatedPaths = [];
for (const [curveName, curveInfo] of Object.entries(sceneInformation)) {
  // Generate a curve
  const curPath = new THREE.Path();
  for (let i = 1; i < curveInfo["curves"].length; i++) {
    switch(curveInfo["curves"][i][0]) {
      // Form a straight line segment
      case C_LINEAR:
        curPath.add(new THREE.LineCurve3(
          new THREE.Vector3(...curveInfo["curves"][i - 1][1][0]),
          new THREE.Vector3(...curveInfo["curves"][i][1][0])
        ));
        break;
      case C_QUADRATIC:
        curPath.add(new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...curveInfo["curves"][i - 1][1][0]),
          new THREE.Vector3(...curveInfo["curves"][i][1][1]),
          new THREE.Vector3(...curveInfo["curves"][i][1][0]),
        ));
    }
  }

  // Create line renderer
  const curPoints = curPath.getPoints();
  const curGeometry = new THREE.BufferGeometry().setFromPoints(curPoints);
  const curMaterial = new THREE.LineBasicMaterial({color: curveInfo["colour"], linewidth: 5});
  const curLine = new THREE.Line(curGeometry, curMaterial);
  scene.add(curLine);
  console.log(curPoints);

  // Add to animation path
  pathways.push(curPath);
}

const segments = [4, 3]

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

let activePath = 0;

// const listener = new THREE.AudioListener();
// camera.add(listener);

// const sound = new THREE.Audio(listener);

// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( 'audio/s6026.ogg', function( buffer ) {
//   sound.setBuffer( buffer );
//   // sound.setLoop( true );
//   sound.setVolume( 0.5 );
//   // sound.play();
// });


// function animate() {
// 	// cube.rotation.x += 0.01;
// 	// cube.rotation.y += 0.05;
// 	// loader.rotation.x += 0.1;
//   time += clock.getDelta() * 0.1;
//   if (time > 1) {
//     time = 0;
//     console.log("Reache end");
//     activePath += 1;
//     console.log(activePath);
//     // sound.play();
//   }

//   // console.log(clock.getDelta());

// 	if (theModel) {
// /*		theModel.rotation.x += 0.02;
// 		theModel.scale.x += 0.002;
// 		theModel.scale.z += 0.002;
// 		theModel.scale.y += 0.002;*/

//     if (activePath < segments.length) {
//       theModel.position.x = pathways[activePath].getPoint(time).x * 100;
//       theModel.position.y = pathways[activePath].getPoint(time).y * 100;
//       // theModel.position.y = path2.getPoint(time).z * 100;
//       if (pathways[activePath].getPoint(time).z) {
//         theModel.position.z = pathways[activePath].getPoint(time).z * 100;
//       }
//       else {
//         theModel.position.z = 0;
//       }
//     }
//     // console.log(path2.getPoint(time).z);
//     // console.log(path2.getPoint(time));
// 	}

//   // const delta = clock.getDelta();
//   mixer.update(clock.getDelta());

//   controls.update();
//   renderer.render( scene, camera );
// }
// renderer.setAnimationLoop( animate );

const eventTypes = {
  SceneLaunch: 0
}
