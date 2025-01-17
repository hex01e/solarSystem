
import './App.css'
import { useRef , useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import starsTexture from './assets/stars.jpg';
import sunTexture from './assets/sun.jpg';
import mercuryTexture from './assets/mercury.jpg';
import venusTexture from './assets/venus.jpg';
import earthTexture from './assets/earth.jpg';
import marsTexture from './assets/mars.jpg';
import jupiterTexture from './assets/jupiter.jpg';
import saturnTexture from './assets/saturn.jpg';
import saturnRingTexture from './assets/saturn ring.png';
import uranusTexture from './assets/uranus.jpg';
import uranusRingTexture from './assets/uranus ring.png';
import neptuneTexture from './assets/neptune.jpg';
import plutoTexture from './assets/pluto.jpg';
import { texture } from 'three/webgpu';

function App() {
  const ref = useRef(null);

  useEffect(function (){
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.set(-90, 140, 140);


    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
      starsTexture,
      starsTexture,
      starsTexture,
      starsTexture,
      starsTexture,
      starsTexture,
    ]);

    const textureLoader = new THREE.TextureLoader();






    // sun
    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
      map : textureLoader.load(sunTexture),
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    // point light (suns light)
    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    pointLight.power = 127000;
    sun.add(pointLight);

    function createPlanete(size: any, texture: any, position: any, ringInfo:any = null){
      const geo = new THREE.SphereGeometry(size, 30, 30);
      const mat = new THREE.MeshStandardMaterial({
        map : textureLoader.load(texture),
      });
      const mesh = new THREE.Mesh(geo, mat);
      const parent = new THREE.Object3D();
      parent.add(mesh);
      mesh.position.x = position;
      if (ringInfo){
        const ringGeo = new THREE.RingGeometry(ringInfo.inner, ringInfo.outer, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          map : textureLoader.load(ringInfo.texture),
          side : THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.x = position;
        ring.rotation.x = -0.5 * Math.PI;
        parent.add(ring);
      }
      scene.add(parent);
      return {mesh: mesh, parent: parent};
    }


    // planets
    const mercury = createPlanete(3.2, mercuryTexture, 28);
    const venus = createPlanete(5.8, venusTexture, 44);
    const earth = createPlanete(6, earthTexture, 62);
    const mars = createPlanete(4, marsTexture, 78);
    const jupiter = createPlanete(12, jupiterTexture, 100);
    const saturn = createPlanete(10, saturnTexture, 138,  {
      inner:10,
      outer:20,
      texture:saturnRingTexture
    });
    const uranus = createPlanete(7, uranusTexture, 176,  {
      inner:7,
      outer:12,
      texture:uranusRingTexture
    });
    const neptune = createPlanete(7, neptuneTexture, 200);
    const pluto = createPlanete(2.8, plutoTexture, 216);

    function animate() {
      sun.rotateY(0.004);

      mercury.mesh.rotateY(0.004);
      mercury.parent.rotateY(0.04);

      venus.mesh.rotateY(0.002);
      venus.parent.rotateY(0.015);

      earth.mesh.rotateY(0.02);
      earth.parent.rotateY(0.01);

      mars.mesh.rotateY(0.018);
      mars.parent.rotateY(0.008);
      
      jupiter.mesh.rotateY(0.04);
      jupiter.parent.rotateY(0.002);

      saturn.mesh.rotateY(0.0038);
      saturn.parent.rotateY(0.0009);

      uranus.mesh.rotateY(0.03);
      uranus.parent.rotateY(0.0004);

      neptune.mesh.rotateY(0.032);
      neptune.parent.rotateY(0.0001);

      pluto.mesh.rotateY(0.008);
      pluto.parent.rotateY(0.00007);


      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    return (() => {
      ref.current.removeChild(renderer.domElement);
    });
  }, []);
  return (
    <>
      <div ref={ref}></div>
    </>
  )
}

export default App
