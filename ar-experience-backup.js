
// import * as THREE from"../node_modules/three";
// import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import {sceneInformation} from './sceneInformation.js';

let camera, clock, renderer, scene, video;
let audioListener, audioLoader;
let targetBone = null;
let userLocation = null;
let isAudioReady = false;
let isCameraReady = false;
let isLocationReady = false;
let deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
let arObjects = [];
let mixers = []

let pathwaysReady = false;
let pathwayAnimations = [];
let animationMixer_2 = null;
let audioSegments = [];
let audioSubtitles = [];
let pathways = [];

let pathwayDurations = [];
let activePath = 0;
let curveCount = 2;
let animTimer = 0;
let elapsedTime = 0;
let currentAnimation = -1;
let currentSceneName = "Scene1";

let modelDistance = 80;

let readyToGo = false;

let windowSize = [window.innerWidth, window.innerHeight];

const arObjectsConfig = [
    {
        name: "Platypus Swimming",
        offsetLat: 0.001,
        offsetLng: 0,
        scale: { x: 1, y: 1, z: 1},
    }
];

/** Dictionary holding start button unlock flags */
const launchFlags = {
    "Model": false,
    "Audio": false,
    "Paths": false,
    "Camera": true
}


const offset = new THREE.Vector3(0, 5, 20);
const targetPosition = new THREE.Vector3();

const C_ORIGIN = 0;
const C_LINEAR = 1;
const C_QUADRATIC = 2;

const audioPath = "resources/audio/";
// const oldsceneInformation = {
//   "act1": {
//     "curves": [
//       [   C_ORIGIN, [ [0.0, 0.0, 0.0] ]],
//       [   C_LINEAR, [ [1.0, 1.0, 1.0] ]],
//       [   C_LINEAR, [ [4.0, -3.0, -2.0] ]],
//       [C_QUADRATIC, [ [2.0, 0.0, 1.0], [5.0, -5.0, 5.0] ]],
//       [   C_LINEAR, [ [-3.0, 0.0, 0.0] ]]
//     ],
//     "animations": [
//         0,
//         1,
//         2,
//         3,
//         4,
//         5
//     ],
//     "duration": 20,
//     "audio": "audioCut.mp3",
//     "subtitles": [
//       [0, 3.5, "This is a duck-billed platypus."],
//       [3.5, 8, "The local Wiradjuri people, call them Biladurang."],
//       [8, 11, "They are very shy, and good at hiding"],
//       [11, 15, "so it's extremely rare to see platypus in the wild."]
//     ],
//     "colour": 0xffff00
//   },
//   "act2": {
//     "curves": [
//       [   C_ORIGIN, [ [-3.0, 0.0, 0.0] ]],
//       [   C_LINEAR, [ [-1.0, 1.0, -1.0] ]],
//       [   C_LINEAR, [ [-4.0, -3.0, 2.0] ]],
//       [   C_LINEAR, [ [3.0, 0.0, -0.0] ]]
//     ],
//     "duration": 10,
//     "colour": 0xff00ff,
//     "audio": "1156474.mp3",
//     "subtitles": [
//       [0, 3, "Hello world 2"],
//       [3, 6, "More testing 2"],
//       [6, 10, "Even morerer testing 2"]
//     ],
//   }
// }
// const subtitleInformation = [
//     [0, 3.5, "This is a duck-billed platypus."],
//     [3.5, 8, "The local Wiradjuri people, call them Biladurang."],
//     [8, 11, "They are very shy, and good at hiding"],
//     [11, 15, "so it's extremely rare to see platypus in the wild."]
// ];
// const animationInformation = [
//     [0, 2],
//     [3.5, 6],
//     [99999999, 0]
// ]

const sceneInformation = {
    "Scene1": {
        "Audio": "audioCut.mp3",
        "AudioStart": 0,
        "AudioEnd": 10,
        // "Curves": [
        //     [   C_ORIGIN, [ [0.0, 0.0, 0.0] ]],
        //     [   C_LINEAR, [ [1.0, 1.0, 1.0] ]],
        //     [   C_LINEAR, [ [4.0, -3.0, -2.0] ]],
        //     [C_QUADRATIC, [ [2.0, 0.0, 1.0], [5.0, -5.0, 5.0] ]],
        //     [   C_LINEAR, [ [-3.0, 0.0, 0.0] ]]
        // ],
        // "Curves": [
        //     [C_ORIGIN, [[0.0, 0.0, 0.0]]],
        //     [C_LINEAR, [[0.0, 0.0, -20.0]]],
        //     [C_LINEAR, [[10.0, 0, 0, 0]]]
        // ],
        "Curves": [
            [C_ORIGIN, [[0, 0, 40]]],
            [C_LINEAR, [[10, 0, 40]]],
            [C_LINEAR, [[10, 0, 30]]],
            [C_LINEAR, [[0, 0, 30]]],
            [C_LINEAR, [[0, 0, 40]]],
            [C_LINEAR, [[10, 0, 30]]],
            [C_LINEAR, [[10, 0, 40]]],
            [C_LINEAR, [[0, 0, 30]]]
        ],
        "Subtitles": [
            [0, 3.5, "This is a duck-billed platypus."],
            [3.5, 8, "The local Wiradjuri people, call them Biladurang."],
            [8, 11, "They are very shy, and good at hiding"],
            [11, 15, "so it's extremely rare to see platypus in the wild."]
        ],
        "Animations": [
            [0, 2],
            [2, 6],
            [4, 2],
            [6, 6],
            [8, 2],
            [99999999, 0]
        ],
        "CurveDuration": 10
    },
    "Scene2": {
        "Audio": "audioCut.mp3",
        "AudioStart": 10,
        "AudioEnd": 20,
        "Curves": [
            [   C_ORIGIN, [ [-3.0, 0.0, 0.0] ]],
            [   C_LINEAR, [ [-1.0, 1.0, -1.0] ]],
            [   C_LINEAR, [ [-4.0, -3.0, 2.0] ]],
            [   C_LINEAR, [ [3.0, 0.0, -0.0] ]]
        ],
        "Subtitles": [
            [0, 3, "Example subtitles"],
            [3, 6, "Example subtitles"],
            [6, 10, "Example subtitles"]
        ],
        "Animations": [
            [0, 2],
            [1, 6],
            [2, 3],
            [3, 7]
            [99999999, 0]
        ],
        "CurveDuration": 8
    }
}

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                frameRate: { ideal: 120, min: 30 }
            },
            audio: false
        });

        const video = document.getElementById('camera-feed');
        if (video) {
            video.srcObject = stream;
            video.autoplay = true;
            video.playsinline = true;
            video.muted = true;

            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play().then(resolve).catch(console.error);
                };
            });
        }

        isCameraReady = true;
        console.log('Camera ready');
        checkReadyToStart();
        return true;

    } catch (error) {
        console.error('Camera failed to initialize:', error);
        return false;
    }
}

// store visibility data in object;
//  can only draw line when both are visible.
let markerVisible = { marker0: false, marker1: false };
let markerSceneMap = { marker0: "Scene1", marker1: "Scene2"};


let lastMarkerMap = { marker0: 0, marker1: 1};
let markerPositions = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];

let lastMarker = -1;

AFRAME.registerComponent('registerevents', {
    init: function () 
    {
        let marker = this.el;
        
        marker.addEventListener('markerFound', function() {
            markerVisible[ marker.id ] = true;
            console.log(marker.id, " found");
            console.log(lastMarkerMap[marker.id], " ", lastMarker)
            // Needs to be done this way for some reason
            // Updating lastMarker after the if statement meant it didn't get updated
            let sceneChange = (lastMarkerMap[marker.id] != lastMarker);
            lastMarker = lastMarkerMap[marker.id];
            if (sceneChange) {
                console.log("Scene change!");
                changeScene(markerSceneMap[marker.id]);
            }
        });

        marker.addEventListener('markerLost', function() {
            markerVisible[ marker.id ] = false;
            console.log(marker.id, " lost");
        });
    }
});

AFRAME.registerComponent('run', {
    init: function() {
        this.m0 = document.querySelector("#marker0");
        this.p0 = new THREE.Vector3();
        this.m1 = document.querySelector("#marker1");
        this.p1 = new THREE.Vector3();
    },
    
    tick: function(time, deltaTime) {
        if (markerVisible["marker0"] && launchFlags["Model"]) {
            this.m0.object3D.getWorldPosition(this.p0);
            console.log(this.p0);
            // let newPos = new THREE.Vector3((this.p0.x + 1.0) / 2 * windowSize[0], (this.p0.y + 1.0) / 2 * windowSize[1], -1).unproject(camera);
            // arObjects[0].position.set((this.p0.x + 1.0) / 2 * windowSize[0], (this.p0.y + 1.0) / 2 * windowSize[1], this.p0.z);
            // arObjects[0].position.set(newPos.x, newPos.y, newPos.z);
            arObjects[0].position.set(this.p0.x*100, this.p0.y*100, this.p0.z*100);
            markerPositions[0] = this.p0;
            currentSceneName = "Scene1";
        }
    }
})

AFRAME.registerComponent('loadcamera', {
    init: function() {
        // let camera = this;
        console.log("NEW CAMERA LOADED");
        launchFlags["Camera"] = true;
        attemptUnlock();
    }
})

// var ArToolKitSource = new THREEx.ArToolkitSource({
//     sourceType:"webcam"
// });


function changeScene(sceneId) {
    audioSegments[0].pause();
    audioSegments[0].currentTime = sceneInfromation[sceneId]["AudioStart"];
    audioSegments[0].play();
    activePath = 0;
    animTimer = 0;
}

/*
function initOrientation() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            deviceOrientation = {
                alpha: event.alpha || 0,
                beta: event.beta || 0,
                gamma: event.gamma || 0
            };
        });

        if (typeof DeviceOrientationEvent.requestPermission == 'function') {
            DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    console.log('Device orientation permission granted');
                }
            })
            .catch(console.error);
        }
    }
}
*/

function initThreeJS() {

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );

    console.log(camera);

    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, 30);
    console.log('Camera position:', camera.position);

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '1';

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    audioListener = new THREE.AudioListener();
    // camera.add(audioListener);

    audioLoader = new THREE.AudioLoader();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, -5);
    scene.add(directionalLight);

    const dirLight2 = new THREE.DirectionalLight(0xfffff, 0.8);
    dirLight2.position.set(0, 0, -30);
    scene.add(dirLight2);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-2, -5, -2);
    scene.add(fillLight);

    const modelLight = new THREE.PointLight(0xffffff, 0.5, 20);
    modelLight.position.set(0, 2, 0);
    scene.add(modelLight);

    console.log('Three.js initialized');
}

function loadARObjects() {
    console.log('arObjectsConfig:', arObjectsConfig);

    const loader = new THREE.GLTFLoader();

    arObjectsConfig.forEach((config, index) => {

        // const targetLat = userLocation.lat + config.offsetLat;
        // const targetLng = userLocation.lng + config.offsetLng;

        loader.load(
            'resources/models/platypus.glb',
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, 0, 50);

                // config.scale ||
                const modelScale = { x:1, y:1, z:1 };

                model.scale.set(modelScale.x, modelScale.y, modelScale.z);

                scene.add(model);
                arObjects.push(model);

                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(model);
                    animationMixer_2 = mixer;
                    for (let i = 0; i < gltf.animations.length; i++) {
                        const action = mixer.clipAction(gltf.animations[i]);
                        action.setLoop(THREE.LoopRepeat)
                        pathwayAnimations.push(action);
                    }
                    // const action = mixer.clipAction();
                }

                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(model);

                    const diveAnimation = gltf.animations.find(clip => clip.name == 'dive_end');
                    const swimAnimation = gltf.animations.find(clip => clip.name == 'swim');

                    model.animationActions = [];

                    if (diveAnimation) {
                        const diveEndAnimation = mixer.clipAction(diveAnimation);
                        diveEndAnimation.setLoop(THREE.LoopRepeat);
                        diveEndAnimation.play();
                        console.log('Playing animation:', diveAnimation.name || 'unnamed');
                        model.animationActions.push(diveEndAnimation);
                    }

                    if (swimAnimation) {
                        const swimEndAnimation = mixer.clipAction(swimAnimation);
                        swimEndAnimation.setLoop(THREE.LoopRepeat);
                        swimEndAnimation.play();
                        console.log('Playing animation:', swimAnimation.name || 'unnamed');
                        model.animationActions.push(swimEndAnimation);
                    }

                    /*

                    // foreach to loop through all animations

                    gltf.animations.forEach(clip => {
                        const action = mixer.clipAction(clip);

                        action.setLoop(THREE.LoopRepeat);
                        action.play();
                        console.log('Playing animation:', clip.name || 'unnamed');

                        if (!model.animationActions) model.animationActions = [];
                        model.animationActions.push(action);
                    });
                    */
                    mixers.push(mixer);
                }

                /*
                if (model.animationActions.length > 0) {
                }
                */

                loadModelAudio(model, index);

                launchFlags["Model"] = true;
                console.log("<Finished loading: Model>");
                attemptUnlock();
            },
            (progress) => {
                // commenting out because it clutters the console
                /*
                console.log('Loading model:', Math.round(progress.loaded / progress.total * 100) + '%');
                */
            },
            // this is quite fragile, need to test more
            (error) => {
                console.warn('Could not load main model, using low poly version', error);
                // TODO: fallback to low poly version?
            }
        );
    });
}

function loadModelAudio(model, modelIndex) {
    
    // positionalAudio = new THREE.PositionalAudio(audioListener);

    // audioLoader.load(
    //     'resources/audio/test_narration.mp3',
    //     (buffer) => {
    //         positionalAudio.setBuffer(buffer);
    //         positionalAudio.setRefDistance(20);
    //         positionalAudio.setVolume(0.75);

    //         model.add(positionalAudio);
    //         model.positionalAudio = positionalAudio;

    //         console.log(`Audio loaded for model ${modelIndex}`)

    //         isAudioReady = true;

    //         checkReadyToStart();
    //     },
    //     (progress) => {
    //         console.log(`Audio loading progress for model ${modelIndex}:`, Math.round(progress.loaded / progress.total * 100) + '%');
    //     },
    //     (error) => {
    //         console.warn(`Could not load audio for model ${modelIndex}:`, error);
    //         // continue anyway
    //         isAudioReady = true;
    //         checkReadyToStart();
    //     }
    // );

    // Function to update the subtitle box
    function subtitleChange(event) {
        document.getElementById("subtitle-container").textContent = event.target.text;
    }
    // Load each audio file and assign the subtitles
    for (const [curveName, curveInfo] of Object.entries(sceneInformation)) {
        console.log("Loading audio:", curveInfo["Audio"]);
        const audioPlayer = new Audio(audioPath + curveInfo["Audio"]);
        const track = audioPlayer.addTextTrack("subtitles");

        console.log("Loading subtitles");
        for (let i = 0; i < curveInfo["Subtitles"].length; i++) {
            const cue = new VTTCue(...curveInfo["Subtitles"][i]);
            cue.onenter = subtitleChange;
            track.addCue(cue);
        }

        audioSegments.push(audioPlayer);
        audioSubtitles.push(track);

        console.log("Loaded audio:", curveInfo["Audio"]);
    }
    
    // audioSegments[0].play();

    launchFlags["Audio"] = true;
    console.log("<Finished loading: Audio>");
    attemptUnlock();
}

function checkReadyToStart() {
    console.log('Is Camera Ready:', isCameraReady);
    console.log('Is Audio Ready:', isAudioReady);
    if (isLocationReady && isCameraReady && isAudioReady) {
        setTimeout(startSyncedExperience, 500);
    }
}

function startSyncedExperience() {

    console.log('Starting synced AR experience...');

    arObjects.forEach((model) => {
        if (model.animationActions) {
            model.animationActions.forEach(action => {
                action.play();
            });
        }

        if (model.positionalAudio && !model.positionalAudio.isPlaying) {
            model.positionalAudio.play();
        }
    });

    console.log('Audio and animations started')

}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    windowSize = [window.innerWidth, window.innerHeight];
}

function findTargetBone() {
    if (arObjects.length > 0) {
        const model = arObjects[0];
        model.traverse((child) => {
            if (child.isBone && child.name === 'Object_12') {
                console.log('Found target bone:', child);
                targetBone = child;
                return;
            }
        });
    }
}

let previousPos = new THREE.Vector3(0, 0, 0);
function animate() {

    const deltaTime = clock.getDelta();

    if (arObjects.length > 0) {
        const model = arObjects[0];
        
        if (pathwaysReady) {
            if (activePath < 0) {
                activePath = 0;
            }

            // if (activePath < curveCount) {
            if (activePath < 10000000) {
                let nextPos;
                if (animTimer < 1) {
                    // console.log(pathways, activePath, animTimer);
                    nextPos = pathways[activePath].getPoint(animTimer);
                }
                else {
                    nextPos = new THREE.Vector3(model.position.x, model.position.y, model.position.z);
                }
                // const nextPos = new THREE.Vector3(0, 0, 0);
                const movDir = new THREE.Vector3(
                    nextPos.x - previousPos.x,
                    nextPos.y - previousPos.y,
                    nextPos.z - previousPos.z
                );
                previousPos = nextPos;
                // const movDir = 
                movDir.normalize();
                let rotAngel = Math.atan2(movDir.x, movDir.z);
                model.rotation.y = rotAngel;
                // console.log(markerPositions[0]);
                // console.log(model.rotation.y, movDir, rotAngel);
                console.log(nextPos, previousPos)

                if (animTimer < 1) {
                    // model.position.set(
                    //     nextPos.x*3+markerPositions[0].x*modelDistance*Math.tan(35 * (Math.PI / 180)),
                    //     nextPos.y*3+markerPositions[0].y*modelDistance*Math.tan(35 * (Math.PI / 180)),
                    //     nextPos.z*3-modelDistance);
                    model.position.set(
                        nextPos.x, nextPos.y, nextPos.z
                    )
                }
                else {

                }

                document.getElementById("model-coords").textContent = nextPos.x + " " + nextPos.y + " " + nextPos.z;
                
                document.getElementById("model-coords").textContent = model.position.x + " " + model.position.y + " " + model.position.z;
                
                animTimer += deltaTime * pathwayDurations[activePath];
                // if (animTimer > 1) {
                //     activePath += 1;
                //     animTimer = 0;
                // }
            }

        }
    }

    if (animationMixer_2) {
        animationMixer_2.update(deltaTime);

        if (elapsedTime > sceneInformation[currentSceneName]["Animations"][currentAnimation + 1][0]) {
            pathwayAnimations[sceneInformation[currentSceneName]["Animations"][currentAnimation+1][1]].play();
            if (currentAnimation > -1) {
                pathwayAnimations[sceneInformation[currentSceneName]["Animations"][currentAnimation][1]].stop();
            }
            currentAnimation += 1;
            
            if (currentAnimation > 0) {
                // pathwayAnimations[animationInformation[currentAnimation][1]].crossFadeFrom(pathwayAnimations[animationInformation[currentAnimation-1][1]], 0.2, false);
                // pathwayAnimations[sceneInformation[currentSceneName]["Animations"][currentAnimation-1][1]].fadeOut(1);
                // pathwayAnimations[sceneInformation[currentSceneName]["Animations"][currentAnimation][1]].fadeIn(1);
            }

            document.getElementById("active-animation").textContent = sceneInformation[currentSceneName]["Animations"][currentAnimation][1];
        }
    }

    elapsedTime += deltaTime;
    document.getElementById("elapsed-time").textContent = elapsedTime;

    renderer.render(scene, camera);     
    requestAnimationFrame(animate);
}

/**
 * Using pre-defined coordinates, generate a set of three.js Path objects
 * for the 3D model to follow.
 */
function generatePaths() {
    for (const [curveName, curveInfo] of Object.entries(sceneInformation)) {
        // Generate a curve
        const curPath = new THREE.Path();
        for (let i = 1; i < curveInfo["Curves"].length; i++) {
            switch(curveInfo["Curves"][i][0]) {
            // Form a straight line segment
            case C_LINEAR:
                curPath.add(new THREE.LineCurve3(
                new THREE.Vector3(...curveInfo["Curves"][i - 1][1][0]),
                new THREE.Vector3(...curveInfo["Curves"][i][1][0])
                ));
                break;
            // Form a quadratic bezier line segment
            case C_QUADRATIC:
                curPath.add(new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(...curveInfo["Curves"][i - 1][1][0]),
                new THREE.Vector3(...curveInfo["Curves"][i][1][1]),
                new THREE.Vector3(...curveInfo["Curves"][i][1][0]),
                ));
            }
        }
        pathways.push(curPath);
        pathwayDurations.push(1 / curveInfo["CurveDuration"]);
    }

    pathwaysReady = true;

    launchFlags["Paths"] = true;
    console.log("<Finished loading: Paths>");
    attemptUnlock();
}

/** Unlock the start button once all assets are loaded. */
function attemptUnlock() {
    console.log("Attempting launch!");
    for (const key in launchFlags) {
        if (launchFlags.hasOwnProperty(key)) {
            console.log(launchFlags[key]);
            // If a flag is false, not all assets are ready
            if (launchFlags[key] == false) {
                return;
            }
            else {
                document.getElementById("start-button").disabled = false;
                document.getElementById("start-button").innerText = "Start";
                readyToGo = true;
            }
        }
    }
}

// document.getElementById("start-button").onclick = function() {startFunction()};

// Runs once everything is setup and the start button is pressed
function startFunction() {
    // const btn = document.getElementById("start-button");
    // ();
    animate();
    audioSegments[0].play();
}

async function init() {
    console.log('Initializing AR experience...');

    const cameraSuccess = await initCamera();
    if (!cameraSuccess) {
        console.error('Camera initalization failed');
        return;
    }

    initThreeJS();

    setTimeout(() => {

        loadARObjects();
    }, 1000);

    findTargetBone();

    generatePaths();

    // animate();

    startSyncedExperience();

    

    window.addEventListener('resize', onWindowResize);

    console.log('AR experience ready');
}

// debugging model bound values
/*
function logModelBounds(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    console.log('Model bounds:', {
        size: { x: size.x, y: size.y, z: size.z },
        center: { x: center.x, y: center.y, z: center.z },
        min: { x: min.x, y: min.y, z: min.z },
        max: { x: max.x, y: max.y, z: max.z },
    });
}
*/

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/*
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Pausing - Page hidden');
    } else {
        console.log('Resuming - Page visible');
    }
});
*/
