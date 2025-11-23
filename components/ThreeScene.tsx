import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, FRAGMENT_SHADER, VERTEX_SHADER } from '../constants';

/**
 * Mascot blob with eyes that follow the cursor.
 * Matches the simple working implementation the user provided.
 */
const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
    });
    console.debug('[ThreeScene] canvas rect', renderer.domElement.getBoundingClientRect());

    // Mascot mesh
    const geometry = new THREE.IcosahedronGeometry(3.8, 32);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uScale: { value: 60.0 },
        uLightDir: { value: new THREE.Vector3(1, 1, 1).normalize() },
        uColorPrimary: { value: new THREE.Color(COLORS.primary) },
        uColorSecondary: { value: new THREE.Color(COLORS.secondary) },
        uColorDark: { value: new THREE.Color(COLORS.dark) },
      },
    });
    const mascot = new THREE.Mesh(geometry, material);
    mascot.position.set(2.2, 0.4, 0);
    scene.add(mascot);
    // Fallback helper to ensure something renders even if shader fails
    const fallback = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.0, 12),
      new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.15 })
    );
    fallback.position.copy(mascot.position);
    scene.add(fallback);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftEyeGroup = new THREE.Group();
    const rightEyeGroup = new THREE.Group();

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), pupilMat);
    leftPupil.position.z = 0.35;
    leftEyeGroup.add(leftEye, leftPupil);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), pupilMat);
    rightPupil.position.z = 0.35;
    rightEyeGroup.add(rightEye, rightPupil);

    leftEyeGroup.position.set(-0.9, 0.85, 3.6);
    rightEyeGroup.position.set(0.9, 0.85, 3.6);
    mascot.add(leftEyeGroup);
    mascot.add(rightEyeGroup);

    // Brows
    const browMat = new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false });
    const browGeo = new THREE.BoxGeometry(0.9, 0.12, 0.05);
    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-1.15, 1.45, 3.8);
    leftBrow.rotation.z = -0.15;
    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(1.15, 1.45, 3.8);
    rightBrow.rotation.z = 0.15;
    mascot.add(leftBrow, rightBrow);

    // Mouse tracking
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const clock = new THREE.Clock();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    let tick = 0;
    const animate = () => {
      const time = clock.getElapsedTime();
      material.uniforms.uTime.value = time;
      if (tick % 240 === 0) {
        console.debug('[ThreeScene] tick', tick, 'canvas', renderer.domElement.width, renderer.domElement.height);
      }
      tick += 1;

      // Float and rotate toward cursor
      targetRotation.x = mouse.y * 0.5;
      targetRotation.y = mouse.x * 0.5;
      mascot.position.y = Math.sin(time) * 0.2;
      mascot.rotation.x += (targetRotation.x - mascot.rotation.x) * 0.05;
      mascot.rotation.y += (targetRotation.y - mascot.rotation.y) * 0.05;

      // Eyes follow mouse with slight strabismus for charm
      const baseTarget = new THREE.Vector3(mouse.x * 5, mouse.y * 5, 10);
      const cross = Math.sin(time * 2) * 0.12 + 0.12; // tiny cross-eyed bias, slightly more pronounced
      leftEyeGroup.lookAt(baseTarget.clone().add(new THREE.Vector3(-cross, 0, 0)));
      rightEyeGroup.lookAt(baseTarget.clone().add(new THREE.Vector3(cross, 0, 0)));

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 opacity-100 pointer-events-none" />;
};

export default ThreeScene;
