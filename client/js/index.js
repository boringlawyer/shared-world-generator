// https://github.com/mrdoob/three.js/blob/dev/build/three.module.js
import * as THREE from '/three.module.js';
// set up the scene, camera, and renderer
// From https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.y = 5;
camera.position.z = 5;
camera.rotation.set(-Math.PI / 4, 0, 0, 'XYZ');
let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// prevent the right click menu from showing up on the canvas
renderer.domElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})
// basic render loop
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();


// create grid, with help from https://threejs.org/docs/index.html#api/en/helpers/GridHelper
let size = 10;
let divisions = 10;
let gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );


let newWorldBtn = document.querySelector('#newWorld');
let enterWorldBtn = document.querySelector("#enterWorld");
let idField = document.querySelector("#idField");
let errorDisplay = document.querySelector("#error");
window.onload = () => {
    // gets a new id, then redirects to the app with a url containing the id
    newWorldBtn.addEventListener('click', () => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/new');
        xhr.setRequestHeader('Accept', "text/plain");
        xhr.onload = () => {
            if (xhr.status != 200) {
                return;
            }
            // With help from https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
            //window.location.replace(window.location.href + `engine?id=${xhr.responseText}`);
            window.location.href = window.location.href += `engine?id=${xhr.responseText}`;
        }
        xhr.send();
    });
    // takes the id text field input, checks if the id exists on the server,
    // and if so puts it in the url to redirect.
    enterWorldBtn.addEventListener('click', () => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/getScene?id=${idField.value}`);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = () => {
            let jsonResponse = JSON.parse(xhr.response);
            if (!jsonResponse.errorCode) {
                window.location.href = window.location.href += `engine?id=${idField.value}`;
            }
            // Thanks to https://www.w3schools.com/js/tryit.asp?filename=tryjs_visibility for a quick refresher
            else {
                errorDisplay.style.visibility = "visible";
            }
        }
        xhr.send();
    });
}

// https://halfbaked.city/tutorials/getting-started-with-webxr-part-1
function onResize () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);
