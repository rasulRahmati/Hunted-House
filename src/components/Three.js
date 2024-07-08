import React, {useEffect, useRef} from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import * as dat from 'dat.gui';
import gsap from "gsap";
import typeFaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

const Three = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const parameters = {
        color: 0Xff0000,
    }

    //  Debug
    const gui = new dat.GUI();

    //  Texture
    const textureLoader = new THREE.TextureLoader();
    const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
    const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
    const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
    const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
    const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
    const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
    const doorRoughnessTexture = textureLoader.load('/textures/door/roughtness.jpg');

    const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
    const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
    const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
    const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

    const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
    const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
    const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
    const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

    grassColorTexture.repeat.set(8, 8);
    grassAmbientOcclusionTexture.repeat.set(8, 8);
    grassNormalTexture.repeat.set(8, 8);
    grassRoughnessTexture.repeat.set(8, 8);

    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

    //  Scene
    const scene = new THREE.Scene();

    //  Fog
    const fog = new THREE.Fog('#262837', 1, 15);
    scene.fog = fog;

    // Renderer
    const renderer = new THREE.WebGLRenderer({});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    renderer.setClearColor('#262837');

    //  House
    const house = new THREE.Group();
    scene.add(house);

    //  Walls
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
      })
    );
    walls.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
    );
    walls.position.y = 1.25;
    house.add(walls);

    //  Roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({color: '#ac8e82'})
    );
    roof.rotation.y = Math.PI * 0.25;
    roof.position.y = 2.5 + 0.5;
    house.add(roof);

    //  Door
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
      })
    );
    door.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
    );
    door.position.y = 1;
    door.position.z = 2 + 0.01;
    house.add(door);

    //  Bushes
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'});

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.2);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.2);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);

    house.add(bush1, bush2, bush3, bush4);

    // Graves
    const graves = new THREE.Group();
    scene.add(graves);

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'});

    for (let index = 0; index < 50; index++) {
      const angle = Math.random() * Math.PI * 2;      
      const radius = 3 + Math.random() * 6;      
      const x = Math.sin(angle) * radius;      
      const z = Math.cos(angle) * radius;     
      
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.3, z);
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.castShadow = true;

      graves.add(grave);
    }

    //  Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ 
          side: THREE.DoubleSide,
          map: grassColorTexture,
          aoMap: grassAmbientOcclusionTexture,
          normalMap: grassNormalTexture,
          roughnessMap: grassRoughnessTexture 
        })
    );
    floor.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
    );
    floor.rotation.x = - Math.PI * 0.5;
    floor.position.y = 0;

    house.add(floor);

    //  Lights
    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.09);
    // gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.1);
    moonLight.position.set(4, 5, -2);
    // gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001);
    scene.add(moonLight);

    const doorLight = new THREE.PointLight('#ff7d46', 3, 7);
    doorLight.position.set(0, 2.2, 2.7);
    scene.add(doorLight);

    const ghost1 = new THREE.PointLight('#ff00ff', 3, 3);
    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 7;
    scene.add(ghost1);

    const ghost2 = new THREE.PointLight('#00ffff', 3, 3);
    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 7;
    scene.add(ghost2);

    const ghost3 = new THREE.PointLight('#ff7800', 3, 3);
    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 7;
    scene.add(ghost3);

    //  Shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    moonLight.castShadow = true;
    doorLight.castShadow = true;
    ghost1.castShadow = true;
    ghost2.castShadow = true;
    ghost3.castShadow = true;

    walls.castShadow = true;
    bush1.castShadow = true;
    bush2.castShadow = true;
    bush3.castShadow = true;
    bush4.castShadow = true;

    floor.receiveShadow = true;

    //  Axes helper
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    gui.add(axesHelper, 'visible').name('AxesHelper').setValue(false);

    //  Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(4, 2, 5);
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;


    // Resize
    const handleResize = (event) => {
        //  Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        //  Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    window.addEventListener('resize', handleResize)

    // Clock
    const clock = new THREE.Clock();

    //  Animation
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Ghosts
        const ghost1Angle = elapsedTime * 0.5;
        ghost1.position.x = Math.cos(ghost1Angle) * 4;
        ghost1.position.z = Math.sin(ghost1Angle) * 4;
        ghost1.position.y = Math.sin(elapsedTime * 3);

        const ghost2Angle = - elapsedTime * 0.32;
        ghost2.position.x = Math.cos(ghost2Angle) * 5;
        ghost2.position.z = Math.sin(ghost2Angle) * 5;
        ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

        const ghost3Angle = - elapsedTime * 0.18;
        ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
        ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
        ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

        //  Update controls for damping
        controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        containerRef.current.removeChild(renderer.domElement);
        gui.destroy();
    };
  },[]);

  return (
    <div ref={containerRef}/>
  );
}

export default Three