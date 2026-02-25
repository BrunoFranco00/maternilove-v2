'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';

const PINK_ROSE = 0xf6a9c4;
const PINK_SOFT = 0xfff1f4;

function getSizeComparison(week: number): string {
  const comparisons: Record<number, string> = {
    4: 'semente de papoula',
    5: 'semente de gergelim',
    6: 'lentilha',
    7: 'mirtilo',
    8: 'framboesa',
    9: 'cereja',
    10: 'morangão',
    11: 'lima',
    12: 'ameixa',
    13: 'pêssego',
    14: 'limão',
    15: 'maçã',
    16: 'abacate',
    17: 'pera',
    18: 'batata-doce',
    19: 'manga',
    20: 'banana',
    21: 'cenoura',
    22: 'mamão papaia',
    23: 'toranja',
    24: 'espiga de milho',
    25: 'couve-flor',
    26: 'alface',
    27: 'repolho',
    28: 'coco',
    29: 'abóbora',
    30: 'pepino',
    31: 'coco',
    32: 'jicama',
    33: 'abacaxi',
    34: 'melão',
    35: 'melão amarelo',
    36: 'mamão',
    37: 'acelga',
    38: 'alho-poró',
    39: 'melancia',
    40: 'melancia',
  };
  const clamped = Math.max(4, Math.min(40, week));
  return comparisons[clamped] ?? comparisons[24];
}

export function Progress3DModel({ week = 24 }: { week?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh;
    glowMesh: THREE.Mesh;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ob = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    ob.observe(container);
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVisible) return;

    let mount = true;
    const init = async () => {
      const THREE = await import('three');

      const width = container.clientWidth;
      const height = container.clientHeight || 200;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 4);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: typeof window !== 'undefined' && window.devicePixelRatio <= 2,
        powerPreference: 'low-power',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = false;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      container.appendChild(renderer.domElement);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, PINK_SOFT, 0.9);
      scene.add(hemisphereLight);

      const ambientLight = new THREE.AmbientLight(0xfff5f8, 0.6);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.4);
      pointLight.position.set(2, 2, 2);
      scene.add(pointLight);

      const geometry = new THREE.IcosahedronGeometry(0.5, 2);
      geometry.scale(0.7, 1.1, 0.5);

      const material = new THREE.MeshLambertMaterial({
        color: PINK_ROSE,
        flatShading: false,
        transparent: true,
        opacity: 0.92,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      scene.add(mesh);

      const glowGeometry = new THREE.SphereGeometry(0.75, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: PINK_ROSE,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.scale.set(1.2, 1.4, 1);
      scene.add(glowMesh);

      const clock = { getElapsedTime: () => 0 };
      const startTime = performance.now() / 1000;

      sceneRef.current = { scene, camera, renderer, mesh, glowMesh };

      const animate = () => {
        if (!mount || !sceneRef.current) return;
        const { mesh, glowMesh, renderer, scene, camera } = sceneRef.current;
        const t = (performance.now() / 1000 - startTime) * (Math.PI * 2) / 4;
        const breath = 1 + 0.02 * Math.sin(t);
        mesh.scale.setScalar(breath);
        glowMesh.scale.set(1.2 * breath, 1.4 * breath, 1 * breath);
        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    init();
    return () => {
      mount = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (sceneRef.current?.renderer?.domElement?.parentNode) {
        sceneRef.current.renderer.dispose();
        sceneRef.current.renderer.domElement.parentNode?.removeChild(sceneRef.current.renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [isVisible]);

  const comparison = getSizeComparison(week);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="w-full h-[200px] min-h-[200px] relative bg-transparent"
        style={{ backgroundColor: 'transparent' }}
      />
      <p className="text-center text-[#5F5F5F] text-sm font-medium">
        Seu bebê está do tamanho de uma{' '}
        <span className="text-[#B3124F] font-semibold">{comparison}</span>
      </p>
    </div>
  );
}
