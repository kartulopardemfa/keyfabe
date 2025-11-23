import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, FRAGMENT_SHADER, VERTEX_SHADER } from '../constants';

/**
 * Single blob with clearly visible eyes that track the mouse.
 * Kept minimal to avoid previous conflicts.
 */
const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null; // overlay on page

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Blob geometry/material
    const geometry = new THREE.IcosahedronGeometry(2.2, 28);
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
    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // Eyes attached to blob so they move with it
    const eyeGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });
    const pupilMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const makeEye = (x: number, y: number) => {
      const group = new THREE.Group();
      const eye = new THREE.Mesh(eyeGeo, eyeMat.clone());
      eye.renderOrder = 10;
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), pupilMat.clone());
      pupil.position.z = 0.28;
      pupil.renderOrder = 11;
      group.add(eye, pupil);
      group.position.set(x, y, 1.45);
      return { group, pupil };
    };

    const left = makeEye(-0.65, 0.45);
    const right = makeEye(0.65, 0.45);
    blob.add(left.group, right.group);

    // Mouth (simple half-torus) that reacts to mouse Y for "mood"
    const mouthGeo = new THREE.TorusGeometry(0.55, 0.08, 12, 32, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthTest: false,
      depthWrite: false,
    });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.rotation.x = Math.PI / 2; // face camera
    mouth.rotation.z = Math.PI; // open upward
    mouth.position.set(0, -0.35, 1.6);
    mouth.renderOrder = 12;
    blob.add(mouth);

    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const clock = new THREE.Clock();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      const time = clock.getElapsedTime();
      material.uniforms.uTime.value = time;

      targetRotation.x = mouse.y * 0.5;
      targetRotation.y = mouse.x * 0.5;

      blob.position.y = Math.sin(time) * 0.25;
      blob.rotation.x += (targetRotation.x - blob.rotation.x) * 0.05;
      blob.rotation.y += (targetRotation.y - blob.rotation.y) * 0.05;
      blob.rotation.z += 0.01;

      // Compute a stable look target in front of the camera based on mouse
      const lookTarget = new THREE.Vector3(mouse.x * 5, mouse.y * 5, 10);
      left.group.lookAt(lookTarget);
      right.group.lookAt(lookTarget);
      const pupilOffsetX = THREE.MathUtils.clamp(mouse.x * 0.25, -0.18, 0.18);
      const pupilOffsetY = THREE.MathUtils.clamp(mouse.y * 0.25, -0.18, 0.18);
      left.pupil.position.set(pupilOffsetX, pupilOffsetY, 0.28);
      right.pupil.position.set(pupilOffsetX, pupilOffsetY, 0.28);

      // Mouth mood based on mouse Y: higher mouse -> bigger grin
      const mood = THREE.MathUtils.clamp((mouse.y + 1) * 0.5, 0, 1);
      mouth.scale.setScalar(0.9 + mood * 0.4);
      mouth.position.y = -0.35 + mood * 0.15;
      mouth.rotation.z = Math.PI + THREE.MathUtils.lerp(0.1, -0.2, mood);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none" />;
};

export default ThreeScene;
