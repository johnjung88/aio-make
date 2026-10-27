"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import styles from "./studies.module.css";

type Props = {
  variant: "spatial" | "story" | "machine";
  focus?: number;
  progress?: number;
  branch?: boolean;
  running?: boolean;
  fault?: boolean;
  stage?: number;
  volume?: number;
  paused?: boolean;
  resetToken?: number;
  onSelect?: (index: number) => void;
};

export default function StudyScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef(props);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    current.current = props;
  }, [props]);

  useEffect(() => {
    let disposed = false;
    const releases: (() => void)[] = [];
    const defer = (release: () => void) => {
      let released = false;
      const once = () => {
        if (!released) {
          released = true;
          release();
        }
      };
      releases.push(once);
      return once;
    };
    const cleanup = () => {
      [...releases].reverse().forEach((release) => release());
    };
    async function init() {
      const T = await import("three");
      const { OrbitControls } = await import(
        "three/addons/controls/OrbitControls.js"
      );
      const { RoomEnvironment } = await import(
        "three/addons/environments/RoomEnvironment.js"
      );
      if (!host.current || disposed) return;
      const element = host.current;
      const variant = current.current.variant;
      const dark = variant === "spatial";
      const renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      defer(() => renderer.dispose());
      defer(() => renderer.domElement.remove());
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = dark ? 1.1 : 1.45;
      renderer.domElement.setAttribute(
        "aria-label",
        dark
          ? "드래그로 회전하고 부품을 선택하는 3D 시스템"
          : "선택한 상태에 반응하는 3D 시스템",
      );
      renderer.domElement.setAttribute("role", "img");
      element.appendChild(renderer.domElement);
      const scene = new T.Scene();
      defer(() => {
        const geometries = new Set<THREE.BufferGeometry>();
        const materials = new Set<THREE.Material>();
        scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) geometries.add(mesh.geometry);
          if (mesh.material)
            (Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material]
            ).forEach((material) => materials.add(material));
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
      });
      const camera = new T.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 2.3, 12.2);
      const pmrem = new T.PMREMGenerator(renderer);
      const releasePMREM = defer(() => pmrem.dispose());
      const room = new RoomEnvironment();
      const releaseRoom = defer(() => room.dispose());
      const environment = pmrem.fromScene(room, 0.04);
      defer(() => environment.dispose());
      scene.environment = environment.texture;
      releaseRoom();
      releasePMREM();
      const controls = new OrbitControls(camera, renderer.domElement);
      defer(() => controls.dispose());
      controls.enabled = dark;
      renderer.domElement.style.touchAction = dark ? "none" : "pan-y";
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableRotate = dark;
      controls.minPolarAngle = 0.45;
      controls.maxPolarAngle = Math.PI * 0.78;
      controls.target.set(0, 0, 0);
      const assembly = new T.Group();
      scene.add(assembly);
      const ink = new T.MeshPhysicalMaterial({
        color: dark ? "#232923" : "#333b39",
        metalness: 0.9,
        roughness: 0.23,
        clearcoat: 1,
      });
      const chrome = new T.MeshPhysicalMaterial({
        color: "#c3ccc5",
        metalness: 1,
        roughness: 0.18,
        clearcoat: 1,
      });
      const accent = new T.MeshPhysicalMaterial({
        color: variant === "story" ? "#e7452b" : dark ? "#dbff83" : "#fb642a",
        metalness: 0.28,
        roughness: 0.24,
        clearcoat: 1,
      });
      const pale = new T.MeshPhysicalMaterial({
        color: dark ? "#e6edce" : "#eceddf",
        metalness: 0.2,
        roughness: 0.2,
        clearcoat: 0.8,
      });
      const railMaterial = new T.MeshStandardMaterial({
        color: dark ? "#64715b" : "#aaa99d",
        metalness: 0.5,
        roughness: 0.4,
      });
      const root = new T.Group();
      root.rotation.set(0.24, -0.45, -0.2);
      assembly.add(root);
      const ring = new T.Mesh(new T.TorusGeometry(1.28, 0.24, 24, 100), chrome);
      ring.rotation.x = Math.PI * 0.5;
      root.add(ring);
      const coreGeometry =
        variant === "spatial"
          ? new T.TorusKnotGeometry(0.69, 0.21, 100, 18, 2, 3)
          : variant === "story"
            ? new T.IcosahedronGeometry(0.92, 1)
            : new T.TorusGeometry(0.78, 0.32, 28, 72);
      const core = new T.Mesh(coreGeometry, accent);
      core.rotation.x = 0.4;
      root.add(core);
      const rings: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const hoop = new T.Mesh(
          new T.TorusGeometry(1.1 + i * 0.14, 0.045, 12, 80),
          i === 1 ? accent : chrome,
        );
        hoop.position.y = (i - 1) * 0.55;
        hoop.rotation.x = Math.PI * 0.5;
        root.add(hoop);
        rings.push(hoop);
      }
      const positions = [
        new T.Vector3(-2.3, 0.5, 0),
        new T.Vector3(0, 0.7, -2.3),
        new T.Vector3(2.3, 0.1, 0),
        new T.Vector3(0, -0.5, 2.3),
      ];
      const ports: THREE.Group[] = [];
      const rails: THREE.Mesh[] = [];
      const hitTargets: THREE.Object3D[] = [];
      const portMaterials: THREE.MeshPhysicalMaterial[] = [];
      positions.forEach((position, i) => {
        const group = new T.Group();
        group.position.copy(position);
        const mat = pale.clone();
        portMaterials.push(mat);
        const drum = new T.Mesh(
          new T.CylinderGeometry(0.57, 0.57, 0.65, 48),
          mat,
        );
        drum.rotation.x = Math.PI / 2;
        const cap = new T.Mesh(
          new T.TorusGeometry(0.33, 0.1, 16, 48),
          i === 2 ? accent : ink,
        );
        cap.position.z = 0.34;
        const pin = new T.Mesh(
          new T.CylinderGeometry(0.13, 0.13, 0.18, 24),
          chrome,
        );
        pin.rotation.x = Math.PI / 2;
        pin.position.z = 0.46;
        group.add(drum, cap, pin);
        for (const mesh of [drum, cap, pin]) {
          mesh.userData.port = i;
          hitTargets.push(mesh);
        }
        group.rotation.z = (i * Math.PI) / 2;
        root.add(group);
        ports.push(group);
        const curve = new T.QuadraticBezierCurve3(
          new T.Vector3(0, 0, 0),
          position
            .clone()
            .multiplyScalar(0.55)
            .add(new T.Vector3(0, 0.6, 0)),
          position,
        );
        const rail = new T.Mesh(
          new T.TubeGeometry(curve, 32, 0.045, 8, false),
          railMaterial,
        );
        rails.push(rail);
        root.add(rail);
      });
      const particles: {
        mesh: THREE.Mesh;
        curve: THREE.QuadraticBezierCurve3;
        offset: number;
        branch: boolean;
      }[] = [];
      for (let i = 0; i < 4; i++) {
        const end = positions[i];
        const curve = new T.QuadraticBezierCurve3(
          new T.Vector3(0, 0.05, 0),
          end
            .clone()
            .multiplyScalar(0.5)
            .add(new T.Vector3(0, 0.7, 0)),
          end,
        );
        for (let j = 0; j < 4; j++) {
          const particle = new T.Mesh(
            new T.SphereGeometry(0.075, 12, 8),
            accent,
          );
          root.add(particle);
          particles.push({
            mesh: particle,
            curve,
            offset: j / 4 + i * 0.11,
            branch: i === 3,
          });
        }
      }
      const halo = new T.Mesh(
        new T.TorusGeometry(3.25, 0.015, 8, 140),
        railMaterial,
      );
      halo.rotation.x = Math.PI * 0.5;
      halo.position.y = -0.5;
      root.add(halo);
      const point = new T.PointLight(dark ? "#e3ffb5" : "#fff3dd", 30, 15);
      point.position.set(-4, 5, 4);
      scene.add(point);
      const rim = new T.DirectionalLight(dark ? "#d2ebff" : "#ffffff", 3);
      rim.position.set(4, 3, -2);
      scene.add(rim);
      let cameraResizePending = true;
      const resize = () => {
        const width = element.clientWidth,
          height = element.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height);
        cameraResizePending = true;
        if (variant === "machine") camera.position.z = width < 600 ? 12.2 : 9.8;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      defer(() => observer.disconnect());
      observer.observe(element);
      resize();
      let visible = true;
      const intersection = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "100px" },
      );
      defer(() => intersection.disconnect());
      intersection.observe(element);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      let lastFocus = -2,
        transition = 0,
        frame = 0,
        lastTime = 0,
        elapsed = 0;
      let lastReset = current.current.resetToken ?? 0;
      defer(() => cancelAnimationFrame(frame));
      let pointerX = 0,
        pointerY = 0;
      const pointer = (event: PointerEvent) => {
        const bounds = element.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      };
      element.addEventListener("pointermove", pointer);
      defer(() => element.removeEventListener("pointermove", pointer));
      const raycaster = new T.Raycaster();
      let press = { x: 0, y: 0 };
      const down = (event: PointerEvent) => {
        press = { x: event.clientX, y: event.clientY };
      };
      const up = (event: PointerEvent) => {
        if (
          !dark ||
          Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8
        )
          return;
        const rect = renderer.domElement.getBoundingClientRect();
        raycaster.setFromCamera(
          new T.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1,
          ),
          camera,
        );
        const hit = raycaster.intersectObjects(hitTargets)[0];
        if (hit) current.current.onSelect?.(hit.object.userData.port as number);
      };
      renderer.domElement.addEventListener("pointerdown", down);
      renderer.domElement.addEventListener("pointerup", up);
      defer(() => renderer.domElement.removeEventListener("pointerdown", down));
      defer(() => renderer.domElement.removeEventListener("pointerup", up));
      controls.addEventListener("start", () => {
        transition = 100;
      });
      const cameraGoal = new T.Vector3();
      const targetGoal = new T.Vector3();
      const focusDirection = new T.Vector3();
      const animate = (time: number) => {
        if (disposed) return;
        frame = requestAnimationFrame(animate);
        const delta = Math.min((time - lastTime) / 1000 || 0, 0.04);
        lastTime = time;
        if (!visible || document.hidden) return;
        const p = current.current;
        const still = reduced.matches || p.paused;
        if (!still) elapsed += delta;
        const selection = p.focus ?? -1;
        const reset = p.resetToken ?? 0;
        if (lastFocus !== selection || lastReset !== reset || cameraResizePending) {
          lastFocus = selection;
          lastReset = reset;
          cameraResizePending = false;
          transition = 0;
        }
        if (dark) {
          if (selection < 0) {
            cameraGoal.set(0, 2.3, camera.aspect < 1 ? 15 : 12.2);
            targetGoal.set(0, 0, 0);
          } else {
            ports[selection].getWorldPosition(targetGoal);
            focusDirection
              .copy(targetGoal)
              .setY(1.8)
              .normalize()
              .multiplyScalar(camera.aspect < 1 ? 9 : 7.5);
            cameraGoal.copy(targetGoal).add(focusDirection);
          }
          if (transition < 95) {
            camera.position.lerp(cameraGoal, still ? 1 : 0.06);
            controls.target.lerp(targetGoal, still ? 1 : 0.06);
            transition++;
          }
          if (!still && selection < 0)
            root.rotation.y = -0.45 + Math.sin(elapsed * 0.18) * 0.17;
        } else if (variant === "story") {
          const progress = reduced.matches
            ? Math.floor((p.progress ?? 0) * 3) / 3
            : (p.progress ?? 0);
          root.rotation.y = -0.45 + progress * Math.PI * 1.5;
          root.rotation.z = -0.2 + progress * 0.6;
          root.scale.setScalar(1 + progress * 0.2);
          ports.forEach((port, index) =>
            port.position
              .copy(positions[index])
              .multiplyScalar(1 + progress * 0.6),
          );
          rails.forEach((rail) => rail.scale.setScalar(1 + progress * 0.6));
        } else {
          root.rotation.y +=
            (-0.4 + (still ? 0 : pointerX * 0.12) - root.rotation.y) * 0.04;
          root.rotation.x +=
            (0.3 + (still ? 0 : pointerY * 0.06) - root.rotation.x) * 0.04;
          ports[3].position
            .copy(positions[3])
            .multiplyScalar(p.branch ? 1.16 : 0.72);
          rails[3].scale.setScalar(p.branch ? 1.16 : 0.72);
          accent.color.set(p.fault ? "#e24432" : "#fa642b");
        }
        core.rotation.y = still ? 0.2 : elapsed * 0.14;
        rings.forEach((hoop, i) => {
          hoop.rotation.z = elapsed * 0.04 * (i % 2 ? -1 : 1);
        });
        ports.forEach((port, i) => {
          const active =
            variant === "machine" ? (p.stage ?? -1) === i : selection === i;
          const target = active ? 1.2 : 1;
          port.scale.lerp(
            new T.Vector3(target, target, target),
            still ? 1 : 0.08,
          );
          portMaterials[i].emissive.set(
            active ? (dark ? "#a8ce50" : "#ff792f") : "#000000",
          );
          portMaterials[i].emissiveIntensity = active ? 0.3 : 0;
        });
        particles.forEach(({ mesh, curve, offset, branch }) => {
          mesh.visible =
            !still && (dark || !!p.running) && (!branch || !!p.branch || dark);
          mesh.position.copy(
            curve.getPoint(
              (elapsed * (0.16 + (p.volume ?? 3) * 0.008) + offset) % 1,
            ),
          );
          if (variant === "story")
            mesh.position.multiplyScalar(1 + (p.progress ?? 0) * 0.6);
          if (variant === "machine" && branch)
            mesh.position.multiplyScalar(p.branch ? 1.16 : 0.72);
        });
        controls.update();
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(animate);
      setReady(true);
    }
    init().catch(() => {
      cleanup();
      if (!disposed) setFailed(true);
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={host}
      className={styles.scene}
      data-ready={ready}
      data-webgl={failed ? "unavailable" : "active"}
    >
      {!ready && !failed && (
        <span className={styles.sceneLoading}>
          장면을 준비하고 있습니다
          <span />
        </span>
      )}
      {failed && (
        <div className={styles.sceneFallback}>
          이 브라우저에서 3D 장면을 열지 못했습니다.
          <br />
          아래 제어로 같은 구조와 결과를 탐색할 수 있습니다.
        </div>
      )}
    </div>
  );
}
