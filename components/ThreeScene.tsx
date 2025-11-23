import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS, FRAGMENT_SHADER, VERTEX_SHADER } from '../constants';

gsap.registerPlugin(ScrollTrigger);

type MascotBundle = {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  eyes: [THREE.Group, THREE.Group];
  velocity: THREE.Vector2;
};

const PALETTES = [
  { primary: 0xff4719, secondary: 0x00a8ff, dark: 0x1a1a1a },
  { primary: 0xe6b31e, secondary: 0x00a8ff, dark: 0x0d0d0d },
  { primary: 0x00a8ff, secondary: 0xff4719, dark: 0x0f0f0f },
  { primary: 0xff7a00, secondary: 0x00d0ff, dark: 0x111111 },
];

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotsRef = useRef<MascotBundle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.8, 30);

    const createMascot = (offsetX: number, offsetY: number, paletteIndex = 0): MascotBundle => {
      const palette = PALETTES[0];
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uScale: { value: 60.0 },
          uLightDir: { value: new THREE.Vector3(1, 1, 1).normalize() },
          uColorPrimary: { value: new THREE.Color(palette.primary) },
          uColorSecondary: { value: new THREE.Color(palette.secondary) },
          uColorDark: { value: new THREE.Color(palette.dark) },
        },
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(offsetX, offsetY, 0);
      scene.add(mesh);

      const eyeGeo = new THREE.SphereGeometry(0.3, 32, 32);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

      const leftEyeGroup = new THREE.Group();
      leftEyeGroup.add(new THREE.Mesh(eyeGeo, eyeMat));
      const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), pupilMat);
      leftPupil.position.z = 0.25;
      leftEyeGroup.add(leftPupil);
      leftEyeGroup.position.set(-0.6, 0.5, 1.4);

      const rightEyeGroup = new THREE.Group();
      rightEyeGroup.add(new THREE.Mesh(eyeGeo, eyeMat));
      const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), pupilMat);
      rightPupil.position.z = 0.25;
      rightEyeGroup.add(rightPupil);
      rightEyeGroup.position.set(0.6, 0.5, 1.4);

      mesh.add(leftEyeGroup);
      mesh.add(rightEyeGroup);

      return {
        mesh,
        material,
        eyes: [leftEyeGroup, rightEyeGroup],
        velocity: new THREE.Vector2(
          (Math.random() * 0.012 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
          (Math.random() * 0.012 + 0.006) * (Math.random() > 0.5 ? 1 : -1)
        ),
      };
    };

    mascotsRef.current = [
      createMascot(-2.4, 0.3, 0),
      createMascot(2.4, -0.2, 1),
      createMascot(0, 0.25, 2),
    ];

    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const clock = new THREE.Clock();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mascotsRef.current.forEach(({ material }) => {
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      });
    };

    const applyPalette = () => {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      mascotsRef.current.forEach(({ material }, idx) => {
        const variation = PALETTES[(PALETTES.indexOf(palette) + idx) % PALETTES.length];
        material.uniforms.uColorPrimary.value.set(variation.primary);
        material.uniforms.uColorSecondary.value.set(variation.secondary);
        material.uniforms.uColorDark.value.set(variation.dark);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', applyPalette);

    // Kick off with a palette and keep shifting every few seconds
    applyPalette();
    const paletteInterval = window.setInterval(applyPalette, 7000);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetRotation.x = mouse.y * 0.5;
      targetRotation.y = mouse.x * 0.5;

      mascotsRef.current.forEach(({ mesh, material, eyes }) => {
        material.uniforms.uTime.value = time;
        mesh.position.y += Math.sin(time + mesh.position.x) * 0.002;
        mesh.position.x += Math.sin(time * 0.2 + mesh.position.y) * 0.002; // gentle drift
        eyes.forEach((eye) => eye.lookAt(new THREE.Vector3(mouse.x * 5, mouse.y * 5, 10)));
        mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.05;
        mesh.rotation.z += 0.01; // idle wobble to keep motion obvious
      });

      // Bounce logic
      const boundsX = 3.5;
      const boundsY = 2.6;
      mascotsRef.current.forEach((bundle) => {
        bundle.mesh.position.x += bundle.velocity.x;
        bundle.mesh.position.y += bundle.velocity.y;

        if (bundle.mesh.position.x > boundsX || bundle.mesh.position.x < -boundsX) {
          bundle.velocity.x *= -1;
        }
        if (bundle.mesh.position.y > boundsY || bundle.mesh.position.y < -boundsY) {
          bundle.velocity.y *= -1;
        }
      });

      // Simple collision response: swap velocities on overlap
      for (let i = 0; i < mascotsRef.current.length; i++) {
        for (let j = i + 1; j < mascotsRef.current.length; j++) {
          const a = mascotsRef.current[i];
          const b = mascotsRef.current[j];
          const dist = a.mesh.position.distanceTo(b.mesh.position);
          const minDist = 3.2; // approximate diameter clearance
          if (dist < minDist) {
            const tempV = a.velocity.clone();
            a.velocity.copy(b.velocity);
            b.velocity.copy(tempV);
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          mascotsRef.current.forEach(({ mesh }, idx) => {
            gsap.to(mesh.rotation, {
              y: (idx % 2 === 0 ? 1 : -1) * progress * Math.PI * 2,
              overwrite: 'auto',
              duration: 0.1,
            });
            const spread = 2.4 + idx * 0.15;
            const baseOffset = idx === 0 ? -spread : idx === 1 ? spread : 0;
            gsap.to(mesh.position, { x: baseOffset, duration: 1 });
            gsap.to(mesh.scale, { x: 0.9 - progress * 0.08, y: 0.9 - progress * 0.08, z: 0.9 - progress * 0.08, duration: 1 });
          });
        },
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', applyPalette);
      window.clearInterval(paletteInterval);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      ctx.revert();
    };
  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-screen h-screen z-0 opacity-100 pointer-events-none mix-blend-multiply" />;
};

export default ThreeScene;
