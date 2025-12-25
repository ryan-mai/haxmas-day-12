import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './styles.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 2;
controls.maxDistance = 35;
controls.minPolarAngle = Math.PI / 3;
controls.maxPolarAngle = 2 * Math.PI / 3;
controls.enableZoom = false;

const geo = new THREE.BoxGeometry(1, 1, 1);
const texture = new THREE.TextureLoader().load('https://i.imgur.com/uwpZccI.png');
const mat = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh( geo, mat );
scene.add(cube);


const donut_geo = new THREE.TorusGeometry(10, 3, 16, 100);
const donut_tex = new THREE.TextureLoader().load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkt-aLG6aQV9NRiS-n1rWqp3fJVqhuiq9LeA&s');
const donut_mat = new THREE.MeshBasicMaterial({ map: donut_tex });
const donut = new THREE.Mesh(donut_geo, donut_mat);
scene.add(donut);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 5;

const stars = [];

function add_star() {
    const star_radius = Math.floor(Math.random() * 70) + 20;
    const star_geo = new THREE.SphereGeometry(0.25, 24, star_radius);
    const star_mat = new THREE.MeshStandardMaterial({ color: 0xffffff  });
    const star = new THREE.Mesh(star_geo, star_mat);

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(200));

    star.position.set(x, y, z);
    star.userData.timer = 0;
    scene.add(star);
    stars.push(star);
}

Array(400).fill().forEach(add_star);

camera.position.setZ(45);
function scrollCamera() {
    const t = document.body.getBoundingClientRect().top;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0000;
    camera.rotation.y = t * -0.0000;
};

document.body.onscroll = scrollCamera;
scrollCamera;


function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    stars.forEach(star => {
        if (star.userData.timer > 0) {
            const shining = (120 - star.userData.timer) / 120;
            const brightness = Math.sin(shining * Math.PI);
            star.material.emissive.set(0xffffff).multiplyScalar(0.1 + brightness * 0.9);
            star.userData.timer--;
        } else {
            star.material.emissive.set(0xffffff).multiplyScalar(0.1);
            if (Math.random() < 0.005) {
                star.userData.timer = 120;
            }
        }
    });

    renderer.render( scene, camera );
    controls.update();
    requestAnimationFrame(animate);
}

animate();