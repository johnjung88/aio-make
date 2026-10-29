"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { FloorPlan } from "./architecture";
import styles from "./samples.module.css";

type Props = {
  floor: number;
  room: number;
  stage: number;
  exploded: boolean;
  night: boolean;
  resetToken: number;
  active: boolean;
  onFloor: (floor: number) => void;
  onRoom: (room: number) => void;
  onStatus?: (status: "loading" | "ready" | "failed") => void;
  onInteract?: () => void;
  brandLighting?: boolean;
  viewPadding?: number;
  assemblyPhase?: number;
};

export default function BuildingScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef(props);
  const wake = useRef<() => void>(() => {});
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const { onStatus } = props;
  useEffect(() => {
    onStatus?.(failed ? "failed" : ready ? "ready" : "loading");
  }, [failed, ready, onStatus]);
  const { floor: fallbackFloor, onFloor: selectFallbackFloor } = props;
  useEffect(() => {
    if (failed && fallbackFloor < 0) selectFallbackFloor(0);
  }, [failed, fallbackFloor, selectFallbackFloor]);
  useEffect(() => {
    current.current = props;
    wake.current();
  }, [props]);
  useEffect(() => {
    let disposed = false;
    const releases: (() => void)[] = [];
    const release = () => {
      releases
        .splice(0)
        .reverse()
        .forEach((fn) => fn());
    };
    const init = async () => {
      const T = await import("three");
      const { OrbitControls } = await import(
        "three/addons/controls/OrbitControls.js"
      );
      const { RoomEnvironment } = await import(
        "three/addons/environments/RoomEnvironment.js"
      );
      if (disposed || !host.current) return;
      const el = host.current;
      const brand = props.brandLighting;
      const tokens = getComputedStyle(el);
      const blue = new T.Color(
        tokens.getPropertyValue("--blue").trim() || "#2F6BFF",
      );
      const cyan = new T.Color(
        tokens.getPropertyValue("--cyan").trim() || "#06B6D4",
      );
      const renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      releases.push(() => {
        renderer.dispose();
        renderer.domElement.remove();
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = brand ? 0.92 : 1.18;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.domElement.setAttribute(
        "aria-label",
        "성수 코트야드 건물 3D · 드래그로 회전, 층 선택 버튼으로 공간 탐색",
      );
      renderer.domElement.setAttribute("role", "img");
      el.appendChild(renderer.domElement);
      const contextLost = (event: Event) => {
        event.preventDefault();
        release();
        if (!disposed) {
          setReady(false);
          setFailed(true);
        }
      };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      releases.push(() =>
        renderer.domElement.removeEventListener(
          "webglcontextlost",
          contextLost,
        ),
      );
      const scene = new T.Scene();
      releases.push(() => {
        const geometries = new Set<THREE.BufferGeometry>(),
          materials = new Set<THREE.Material>();
        scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry) geometries.add(m.geometry);
          if (m.material)
            (Array.isArray(m.material) ? m.material : [m.material]).forEach(
              (v) => materials.add(v),
            );
        });
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
      });
      const pmrem = new T.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const environment = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = environment.texture;
      pmrem.dispose();
      roomEnv.dispose();
      releases.push(() => environment.dispose());
      const camera = new T.OrthographicCamera(-10, 10, 7, -7, 0.1, 160);
      camera.position.set(14, 12, 17);
      const controls = new OrbitControls(camera, renderer.domElement);
      renderer.domElement.style.touchAction = "pan-y";
      controls.target.set(0, 3.1, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.09;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = 0.35;
      controls.maxPolarAngle = Math.PI / 2.15;
      releases.push(() => controls.dispose());
      let dirty = true,
        visible = true;
      controls.addEventListener("change", () => {
        dirty = true;
        wake.current();
      });
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const sun = new T.DirectionalLight(0xfff1d8, 3.1);
      sun.position.set(-7, 15, 10);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1536, 1536);
      Object.assign(sun.shadow.camera, {
        left: -18,
        right: 18,
        top: 18,
        bottom: -18,
        near: 0.1,
        far: 60,
      });
      sun.shadow.bias = -0.0008;
      sun.shadow.normalBias = 0.035;
      scene.add(sun);
      const sky = new T.HemisphereLight(0xf4f5ed, 0x78715f, 1.5);
      scene.add(sky);
      const fill = new T.DirectionalLight(0xe9eef7, 0.8);
      fill.position.set(10, 6, -8);
      scene.add(fill);
      if (brand) {
        const rim = new T.DirectionalLight(blue, 4.5);
        rim.position.set(-9, 8, -8);
        const bounce = new T.PointLight(cyan, 65, 30, 2);
        bounce.position.set(7, 3, 6);
        scene.add(rim, bounce);
      }
      const mat = (color: number, roughness = 0.78) =>
        new T.MeshStandardMaterial({ color, roughness, metalness: 0.04 });
      const stone = mat(brand ? 0xb4b5b2 : 0xe6dfd1, brand ? 0.44 : 0.78),
        edges = mat(brand ? 0xcdd7df : 0xf6f2e9, brand ? 0.32 : 0.78),
        wood = mat(0x766047),
        dark = mat(0x413e37),
        floorMat = mat(0xcfc2ac),
        soft = mat(0xf4eee4),
        leaves = mat(0x7f8e61),
        green = mat(0xa0ad7b);
      const glass = new T.MeshPhysicalMaterial({
        color: 0xadc0b8,
        metalness: 0.1,
        roughness: 0.14,
        transparent: true,
        opacity: 0.34,
        transmission: 0.1,
        clearcoat: 1,
        emissive: 0xf4ba70,
        emissiveIntensity: 0.01,
        depthWrite: false,
      });
      const patch = mat(0xd9d7b4);
      if (brand) {
        patch.color.copy(cyan);
        patch.emissive.copy(blue);
        patch.emissiveIntensity = 0.45;
      }
      const box = (
        parent: THREE.Object3D,
        size: number[],
        xyz: number[],
        material: THREE.Material,
        cast = true,
      ) => {
        const mesh = new T.Mesh(
          new T.BoxGeometry(size[0], size[1], size[2]),
          material,
        );
        mesh.position.set(xyz[0], xyz[1], xyz[2]);
        mesh.castShadow = cast;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };
      const cylinder = (
        parent: THREE.Object3D,
        radius: number,
        height: number,
        xyz: number[],
        material: THREE.Material,
      ) => {
        const mesh = new T.Mesh(
          new T.CylinderGeometry(radius, radius, height, 28),
          material,
        );
        mesh.position.set(...(xyz as [number, number, number]));
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };
      box(
        scene,
        [20, 0.2, 15],
        [0, -0.32, 0],
        brand
          ? new T.MeshPhysicalMaterial({
              color: 0x101722,
              metalness: 0.62,
              roughness: 0.19,
              clearcoat: 1,
            })
          : mat(0xe1ddcf),
      );
      box(scene, [10, 0.25, 7.3], [0, -0.12, 0], stone);
      const landscape = new T.Group();
      scene.add(landscape);
      box(landscape, [3.1, 0.12, 5.5], [-6.4, -0.15, 0.3], mat(0xb8c39a));
      box(landscape, [2.3, 0.1, 5], [6.5, -0.12, 0.2], mat(0xc3cbaa));
      box(
        landscape,
        [6.6, 0.04, 1.8],
        [-0.1, -0.1, 5.2],
        new T.MeshPhysicalMaterial({
          color: 0x8baaa5,
          roughness: 0.15,
          metalness: 0.24,
          clearcoat: 1,
        }),
      );
      for (let i = 0; i < 8; i++)
        box(landscape, [0.45, 0.07, 2.1], [-3.7 + i * 0.49, -0.05, 5.2], stone);
      for (let i = 0; i < 4; i++)
        box(
          landscape,
          [2.3, 0.12, 0.5],
          [0.8, -0.02 + i * 0.09, 3.7 - i * 0.36],
          edges,
        );
      function tree(x: number, z: number, scale = 1) {
        const group = new T.Group();
        group.position.set(x, 0, z);
        group.scale.setScalar(scale);
        landscape.add(group);
        cylinder(group, 0.065, 1.9, [0, 0.9, 0], wood);
        for (let i = 0; i < 13; i++) {
          const leaf = new T.Mesh(
            new T.IcosahedronGeometry(0.46 + (i % 3) * 0.11, 1),
            i % 2 ? leaves : green,
          );
          leaf.position.set(
            Math.sin(i * 2.4) * 0.5,
            1.5 + (i % 4) * 0.23,
            Math.cos(i * 2.4) * 0.45,
          );
          leaf.scale.y = 0.7;
          leaf.castShadow = true;
          group.add(leaf);
        }
      }
      tree(-6.2, -2.1, 1.3);
      tree(-6.4, 2.3, 1);
      tree(6.3, -2.6, 1.4);
      tree(6.3, 1, 0.9);
      const foundations = new T.Group();
      scene.add(foundations);
      for (const x of [-3.9, 0, 3.9])
        for (const z of [-2.7, 2.7])
          box(foundations, [0.9, 0.2, 0.9], [x, 0.02, z], stone);
      const floors: {
        group: THREE.Group;
        facade: THREE.Group;
        interior: THREE.Group;
        patches: THREE.Mesh[];
      }[] = [];
      for (let f = 0; f < 3; f++) {
        const group = new T.Group();
        group.position.y = f * 2.7;
        group.userData.floor = f;
        scene.add(group);
        const facade = new T.Group(),
          interior = new T.Group();
        group.add(facade, interior);
        box(group, [9.2, 0.2, 6.8], [0, 0.12, 0], edges);
        box(group, [8.6, 0.05, 6.2], [0, 0.25, 0], floorMat);
        box(facade, [8.7, 2.35, 0.18], [0, 1.43, -3.05], stone);
        box(facade, [0.16, 2.35, 6.2], [-4.24, 1.43, 0], stone);
        for (const x of [-4.1, -2.05, 0, 2.05, 4.1]) {
          box(group, [0.16, 2.45, 0.18], [x, 1.45, 2.98], dark);
          box(group, [0.16, 2.45, 0.18], [x, 1.45, -2.98], stone);
        }
        for (let i = 0; i < 4; i++)
          box(
            facade,
            [1.86, 2.2, 0.025],
            [-3.075 + i * 2.05, 1.45, 2.96],
            glass,
            false,
          );
        for (const y of [0.4, 2.52])
          box(facade, [8.5, 0.07, 0.08], [0, y, 2.99], dark);
        box(facade, [0.025, 2.2, 5.9], [4.19, 1.45, 0], glass, false);
        for (let i = 0; i < 27; i++)
          box(facade, [0.11, 2.35, 0.055], [4.3, 1.44, -2.9 + i * 0.225], wood);
        const patches: THREE.Mesh[] = [];
        for (let r = 0; r < 3; r++) {
          const p = box(
            interior,
            [2.55, 0.025, 5.65],
            [-2.75 + r * 2.75, 0.292, 0],
            floorMat,
          );
          p.userData.room = r;
          p.userData.floor = f;
          patches.push(p);
        }
        box(interior, [0.09, 1.85, 2.5], [-1.3, 1.2, -1.55], edges);
        box(interior, [0.09, 1.85, 2.5], [1.35, 1.2, -1.55], edges);
        // A furnished lounge makes the floor cutaway readable at building scale.
        box(interior, [2.0, 0.35, 0.82], [-2.65, 0.55, -0.3], soft);
        box(interior, [2.0, 0.62, 0.16], [-2.65, 0.88, -0.66], soft);
        for (const x of [-3.57, -1.73])
          box(interior, [0.16, 0.52, 0.82], [x, 0.74, -0.3], soft);
        cylinder(interior, 0.52, 0.1, [-2.65, 0.66, 1], wood);
        cylinder(interior, 0.1, 0.35, [-2.65, 0.44, 1], dark);
        box(interior, [1.7, 0.1, 0.9], [0.02, 1.05, -0.55], wood);
        for (const x of [-0.65, 0.7])
          for (const z of [-0.88, -0.22])
            box(interior, [0.05, 0.72, 0.05], [x, 0.64, z], dark);
        for (const x of [-0.53, 0.58])
          for (const z of [-1.25, 0.15]) {
            box(interior, [0.43, 0.08, 0.42], [x, 0.73, z], soft);
            box(
              interior,
              [0.43, 0.45, 0.07],
              [x, 0.92, z + (z < 0 ? -0.2 : 0.2)],
              soft,
            );
          }
        if (f === 2) {
          box(interior, [1.65, 0.32, 2.1], [2.75, 0.5, -0.5], wood);
          box(interior, [1.62, 0.2, 2.05], [2.75, 0.76, -0.5], soft);
          box(interior, [1.62, 0.04, 1.3], [2.75, 0.89, 0], mat(0xb1b9a4));
          for (const x of [2.35, 3.12])
            box(interior, [0.62, 0.14, 0.42], [x, 0.92, -1.2], soft);
        } else {
          box(interior, [1.5, 0.8, 0.46], [2.7, 0.69, -2.25], wood);
          for (let i = 0; i < 6; i++)
            box(
              interior,
              [0.12, 0.35 + (i % 2) * 0.12, 0.27],
              [2.25 + i * 0.16, 1.18, -2.25],
              i % 2 ? dark : soft,
            );
          cylinder(interior, 0.55, 0.08, [2.65, 0.93, 0.4], wood);
          cylinder(interior, 0.08, 0.6, [2.65, 0.6, 0.4], dark);
        }
        for (const x of [-3.8, 3.8]) {
          cylinder(interior, 0.24, 0.4, [x, 0.5, 2.1], stone);
          const foliage = new T.Mesh(
            new T.SphereGeometry(0.36, 12, 10),
            leaves,
          );
          foliage.position.set(x, 1.0, 2.1);
          foliage.scale.y = 1.5;
          interior.add(foliage);
        }
        for (let i = 0; i < 11; i++)
          box(
            interior,
            [0.7, 0.1, 0.22],
            [-3.7, 0.4 + i * 0.19, -2.6 + i * 0.2],
            edges,
          );
        floors.push({ group, facade, interior, patches });
      }
      const roof = new T.Group();
      roof.position.y = 8.1;
      scene.add(roof);
      box(roof, [9.3, 0.2, 6.9], [0, 0.12, 0], edges);
      box(roof, [8.6, 0.05, 6.2], [0, 0.25, 0], mat(0xbdc6a7));
      for (const z of [-3.2, 3.2])
        box(roof, [9, 0.45, 0.13], [0, 0.5, z], stone);
      for (const x of [-4.4, 4.4])
        box(roof, [0.13, 0.45, 6.4], [x, 0.5, 0], stone);
      for (let i = 0; i < 6; i++)
        box(roof, [0.9, 0.08, 1.5], [-2.9 + i * 1.05, 0.33, 0], mat(0x4c6265));
      // A slender figure establishes the scale of the entry and building.
      cylinder(landscape, 0.095, 0.7, [2.1, 0.57, 4.1], dark);
      const head = new T.Mesh(new T.SphereGeometry(0.1, 12, 8), mat(0xc9ad90));
      head.position.set(2.1, 1.02, 4.1);
      landscape.add(head);
      const resize = () => {
        const width = el.clientWidth,
          height = el.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const aspect = width / height;
        const extent =
          Math.max(current.current.exploded ? 9.5 : 6.9, 7.3 / aspect) *
          (props.viewPadding ?? 1);
        camera.left = -extent * aspect;
        camera.right = extent * aspect;
        camera.top = extent;
        camera.bottom = -extent;
        camera.updateProjectionMatrix();
        dirty = true;
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(el);
      resize();
      releases.push(() => resizeObserver.disconnect());
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        dirty = true;
        wake.current();
      });
      observer.observe(el);
      releases.push(() => observer.disconnect());
      const raycaster = new T.Raycaster(),
        pointer = new T.Vector2();
      let down = { x: 0, y: 0 };
      const pointerDown = (event: PointerEvent) => {
        down = { x: event.clientX, y: event.clientY };
      };
      const pointerUp = (event: PointerEvent) => {
        if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) {
          current.current.onInteract?.();
          return;
        }
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          (-(event.clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(pointer, camera);
        for (const hit of raycaster.intersectObjects(scene.children, true)) {
          let ancestor: THREE.Object3D | null = hit.object;
          let renderable = true;
          while (ancestor) {
            if (!ancestor.visible) {
              renderable = false;
              break;
            }
            ancestor = ancestor.parent;
          }
          if (!renderable) continue;
          let object: THREE.Object3D | null = hit.object;
          const roomIndex = object.userData.room;
          while (object && object.userData.floor === undefined)
            object = object.parent;
          if (object) {
            current.current.onInteract?.();
            current.current.onFloor(object.userData.floor as number);
            if (typeof roomIndex === "number")
              current.current.onRoom(roomIndex);
            break;
          }
        }
      };
      renderer.domElement.addEventListener("pointerdown", pointerDown);
      renderer.domElement.addEventListener("pointerup", pointerUp);
      releases.push(() => {
        renderer.domElement.removeEventListener("pointerdown", pointerDown);
        renderer.domElement.removeEventListener("pointerup", pointerUp);
      });
      const cameraGoal = camera.position.clone(),
        targetGoal = controls.target.clone();
      let previousFloor = -100,
        previousReset = -1,
        previousStage = -1,
        previousRoom = -1,
        previousNight = false,
        previousExploded = false,
        previousAssembly = -1,
        cameraMoving = true;
      let raf = 0;
      let assemblyStarted = 0;
      const animate = () => {
        raf = 0;
        if (disposed) return;
        const p = current.current;
        if (!p.active || !visible || document.hidden) return;
        raf = requestAnimationFrame(animate);
        const changed =
          p.floor !== previousFloor ||
          p.resetToken !== previousReset ||
          p.stage !== previousStage ||
          p.room !== previousRoom ||
          p.night !== previousNight ||
          p.exploded !== previousExploded;
        const assemblyChanged = (p.assemblyPhase ?? 2) !== previousAssembly;
        if (assemblyChanged && p.assemblyPhase === 1)
          assemblyStarted = performance.now();
        if (
          p.floor !== previousFloor ||
          p.resetToken !== previousReset ||
          p.exploded !== previousExploded
        ) {
          const targetY = p.exploded
            ? 4.9
            : p.floor < 0
              ? 3.1
              : p.floor * 2.7 + 0.9;
          targetGoal.set(0, targetY, 0);
          cameraGoal.set(14, targetY + 10.4, 17);
          cameraMoving = true;
          resize();
        }
        previousFloor = p.floor;
        previousReset = p.resetToken;
        previousStage = p.stage;
        previousRoom = p.room;
        previousNight = p.night;
        previousExploded = p.exploded;
        previousAssembly = p.assemblyPhase ?? 2;
        let moving = false;
        const alpha = motion.matches ? 1 : 0.085;
        for (let i = 0; i < floors.length; i++) {
          const f = floors[i];
          f.group.visible =
            p.stage > 0 &&
            (p.floor < 0 || i <= p.floor || p.exploded) &&
            (p.assemblyPhase !== 1 ||
              performance.now() - assemblyStarted >= i * 120);
          f.facade.visible = p.stage >= 2;
          f.interior.visible = p.stage >= 2;
          const goalY =
            i * 2.7 +
            (p.exploded ? i * 1.75 : p.assemblyPhase === 1 ? i * 0.85 : 0);
          f.group.position.y += (goalY - f.group.position.y) * alpha;
          if (Math.abs(goalY - f.group.position.y) > 0.002) moving = true;
          f.patches.forEach((mesh, r) => {
            mesh.material = p.floor === i && p.room === r ? patch : floorMat;
          });
        }
        roof.visible =
          p.stage >= 2 &&
          p.floor < 0 &&
          !p.exploded &&
          (p.assemblyPhase !== 1 || performance.now() - assemblyStarted >= 360);
        landscape.visible = p.stage === 3;
        const lightGoal = p.night ? 0.58 : 3.1;
        sun.intensity += (lightGoal - sun.intensity) * alpha;
        sky.intensity = p.night ? 0.43 : 1.5;
        fill.intensity = p.night ? 0.32 : 0.8;
        glass.emissiveIntensity = p.night ? 0.75 : 0.01;
        if (Math.abs(sun.intensity - lightGoal) > 0.005) moving = true;
        if (cameraMoving) {
          camera.position.lerp(cameraGoal, alpha);
          controls.target.lerp(targetGoal, alpha);
          cameraMoving =
            camera.position.distanceTo(cameraGoal) > 0.01 ||
            controls.target.distanceTo(targetGoal) > 0.01;
          moving = true;
        }
        const orbitChanged = controls.update();
        if (dirty || changed || assemblyChanged || moving || orbitChanged) {
          renderer.render(scene, camera);
          dirty = false;
        }
      };
      wake.current = () => {
        if (
          !raf &&
          !disposed &&
          current.current.active &&
          visible &&
          !document.hidden
        )
          raf = requestAnimationFrame(animate);
      };
      document.addEventListener("visibilitychange", wake.current);
      releases.push(() => {
        document.removeEventListener("visibilitychange", wake.current);
        wake.current = () => {};
      });
      wake.current();
      releases.push(() => cancelAnimationFrame(raf));
      if (!disposed) setReady(true);
    };
    init().catch(() => {
      release();
      if (!disposed) setFailed(true);
    });
    return () => {
      disposed = true;
      release();
    };
  }, [attempt, props.brandLighting, props.viewPadding]);
  return (
    <div ref={host} className={styles.threeHost}>
      {!ready && !failed && (
        <div className={styles.sceneLoading}>
          <span />
          건축 공간 불러오는 중
        </div>
      )}
      {failed && (
        <div className={styles.planFallback}>
          <p>이 기기에서는 평면으로 공간을 탐색할 수 있습니다</p>
          <button
            type="button"
            onClick={() => {
              setFailed(false);
              setReady(false);
              setAttempt((n) => n + 1);
            }}
          >
            3D 다시 시도
          </button>
          <FloorPlan
            floor={Math.max(0, props.floor)}
            room={props.room}
            onRoom={props.onRoom}
          />
        </div>
      )}
    </div>
  );
}
