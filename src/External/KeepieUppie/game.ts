import * as THREE from "three";

export type GameState = "ready" | "playing" | "over";
export type PowerUpKind = "big" | "small";
export type PopupTone = "perfect" | "good" | "miss" | "power";

export interface HudState {
  state: GameState;
  score: number;
  best: number;
  combo: number;
  powerUp: { kind: PowerUpKind; secondsLeft: number } | null;
}

export interface GameCallbacks {
  onHud: (hud: HudState) => void;
  onPopup: (text: string, tone: PopupTone) => void;
}

// World units are roughly metres. The play area is a vertical slice at z = 0.
const WALL_X = 2.4;
const BASE_RADIUS = 0.35;
const BASE_GRAVITY = 12;
// A tap connects while the bottom of the ball is below this height...
const KICK_WINDOW = 1.5;
// ...and counts as perfect below this one.
const PERFECT_WINDOW = 0.65;
const BOOT_HEIGHT = 0.16;
const POWER_DURATION = 8;
const ORB_LIFETIME = 8;
const ORB_RADIUS = 0.32;
const RESTART_DELAY = 0.8;
const BEST_KEY = "keepieUppieBest";

export const POWER_UPS: Record<
  PowerUpKind,
  {
    radius: number;
    gravity: number;
    window: number;
    points: number;
    label: string;
    color: number;
  }
> = {
  big: { radius: 1.9, gravity: 0.7, window: 1.5, points: 1, label: "BIG", color: 0xff8a00 },
  small: { radius: 0.55, gravity: 1.15, window: 0.7, points: 3, label: "MINI", color: 0x00d4ff },
};

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

// Truncated-icosahedron look: colour each triangle black when it sits close
// to one of the 12 icosahedron vertices (the pentagon centres).
function createSoccerBallGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.IcosahedronGeometry(BASE_RADIUS, 6);
  const ico = new THREE.IcosahedronGeometry(1, 0);
  const icoPos = ico.getAttribute("position");
  const centres: THREE.Vector3[] = [];
  for (let i = 0; i < icoPos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(icoPos, i).normalize();
    if (!centres.some((c) => c.distanceToSquared(v) < 1e-4)) centres.push(v);
  }
  ico.dispose();

  const pos = geometry.getAttribute("position");
  const colors = new Float32Array(pos.count * 3);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const threshold = Math.cos(0.36);
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    const centroid = a.add(b).add(c).normalize();
    const nearest = Math.max(...centres.map((v) => v.dot(centroid)));
    const shade = nearest > threshold ? 0.07 : 0.95;
    for (let k = 0; k < 9; k++) colors[i * 3 + k] = shade;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function createPitchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#3f9e4a";
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "#358c40";
  ctx.fillRect(0, 64, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLabelTexture(text: string, color: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 72px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#1a1a1a";
  ctx.strokeText(text, 128, 64);
  ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  ctx.fillText(text, 128, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class KeepieUppieGame {
  private container: HTMLElement;
  private callbacks: GameCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  private clock = new THREE.Clock();
  private resizeObserver: ResizeObserver;
  private raf = 0;
  private audio: AudioContext | null = null;
  private textures: THREE.Texture[] = [];

  private ball: THREE.Mesh;
  private leg = new THREE.Group();
  private shadow: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
  private ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  private orb = new THREE.Group();
  private orbMaterial: THREE.MeshStandardMaterial;
  private orbLabel: THREE.Sprite;
  private orbLabelMaterials: Record<PowerUpKind, THREE.SpriteMaterial>;

  private state: GameState = "ready";
  private pos = new THREE.Vector2(0, 2.2);
  private vel = new THREE.Vector2();
  private spin = new THREE.Vector3();
  private radius = BASE_RADIUS;
  private score = 0;
  private best = 0;
  private combo = 0;
  private cooldown = 0;
  private kickT = 1;
  private kickLift = 0;
  private power: { kind: PowerUpKind; timeLeft: number } | null = null;
  private orbState: { kind: PowerUpKind; x: number; y: number; age: number } | null = null;
  private orbTimer = 0;
  private overTime = 0;
  private elapsed = 0;
  private lastHudKey = "";

  constructor(container: HTMLElement, callbacks: GameCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    try {
      this.best = Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      this.best = 0;
    }

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.scene.fog = new THREE.Fog(0xbfe6ff, 20, 45);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x3a7a3a, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(3, 8, 6);
    this.scene.add(sun);

    // Pitch
    const pitchTexture = createPitchTexture();
    this.textures.push(pitchTexture);
    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ map: pitchTexture, roughness: 1 }),
    );
    pitch.rotation.x = -Math.PI / 2;
    this.scene.add(pitch);

    // Goal in the background for context
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const goal = new THREE.Group();
    for (const x of [-3.66, 3.66]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.44, 12), postMaterial);
      post.position.set(x, 1.22, 0);
      goal.add(post);
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 7.46, 12), postMaterial);
    bar.rotation.z = Math.PI / 2;
    bar.position.y = 2.44;
    goal.add(bar);
    goal.position.z = -12;
    this.scene.add(goal);

    // Ball
    this.ball = new THREE.Mesh(
      createSoccerBallGeometry(),
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45 }),
    );
    this.scene.add(this.ball);

    // Shadow + timing ring under the ball
    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }),
    );
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.01;
    this.scene.add(this.shadow);
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.85, 1, 48),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false }),
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = 0.02;
    this.scene.add(this.ring);

    // Leg: sock + boot, origin at the sole
    const sock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.09, 1.0, 14),
      new THREE.MeshStandardMaterial({ color: 0xe53935 }),
    );
    sock.position.y = BOOT_HEIGHT + 0.5;
    const boot = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, BOOT_HEIGHT, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.6 }),
    );
    boot.position.set(0, BOOT_HEIGHT / 2, 0.3);
    this.leg.add(sock, boot);
    // Sit the leg behind the ball so it never clips through; the toe reaches under it.
    this.leg.position.z = -0.35;
    this.scene.add(this.leg);

    // Power-up orb
    this.orbMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    this.orb.add(new THREE.Mesh(new THREE.SphereGeometry(ORB_RADIUS, 24, 16), this.orbMaterial));
    const bigLabel = createLabelTexture(POWER_UPS.big.label, POWER_UPS.big.color);
    const smallLabel = createLabelTexture(POWER_UPS.small.label, POWER_UPS.small.color);
    this.textures.push(bigLabel, smallLabel);
    this.orbLabelMaterials = {
      big: new THREE.SpriteMaterial({ map: bigLabel, depthTest: false }),
      small: new THREE.SpriteMaterial({ map: smallLabel, depthTest: false }),
    };
    this.orbLabel = new THREE.Sprite(this.orbLabelMaterials.big);
    this.orbLabel.scale.set(0.8, 0.4, 1);
    this.orbLabel.position.y = ORB_RADIUS + 0.3;
    this.orb.add(this.orbLabel);
    this.orb.visible = false;
    this.scene.add(this.orb);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.emitHud();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Single input: start, kick, or restart depending on state. */
  tap() {
    this.ensureAudio();
    if (this.state === "ready") {
      this.start();
      return;
    }
    if (this.state === "over") {
      if (this.overTime >= RESTART_DELAY) this.start();
      return;
    }
    if (this.cooldown > 0) return;

    const h = this.pos.y - this.radius;
    const scale = this.power ? POWER_UPS[this.power.kind].window : 1;
    if (h <= KICK_WINDOW * scale && this.vel.y < 2) {
      this.kick(h <= PERFECT_WINDOW * scale, h);
    } else {
      this.combo = 0;
      this.cooldown = 0.45;
      this.kickT = 0;
      this.kickLift = 0.4;
      this.callbacks.onPopup("Too early!", "miss");
      this.tone(220, 160, 0.12, "square", 0.05);
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
      }
    });
    Object.values(this.orbLabelMaterials).forEach((m) => m.dispose());
    this.textures.forEach((t) => t.dispose());
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.audio?.close().catch(() => undefined);
  }

  private start() {
    this.state = "playing";
    this.pos.set(0, 2.6);
    this.vel.set(0, 1.5);
    this.spin.set(0, 0, 0);
    this.score = 0;
    this.combo = 0;
    this.cooldown = 0;
    this.power = null;
    this.orbState = null;
    this.orb.visible = false;
    this.orbTimer = 5;
  }

  private gravity() {
    const ramp = 1 + Math.min(this.score, 120) * 0.005;
    return BASE_GRAVITY * ramp * (this.power ? POWER_UPS[this.power.kind].gravity : 1);
  }

  private kick(perfect: boolean, h: number) {
    // Aim for a fixed apex so the rhythm stays readable whatever the tap height.
    const apex = (perfect ? 3.4 : 2.9) + randomRange(-0.25, 0.25);
    this.vel.y = Math.sqrt(2 * this.gravity() * Math.max(apex - h, 0.5));
    this.vel.x = THREE.MathUtils.clamp(-this.pos.x * 0.6 + randomRange(-1.2, 1.2), -2.5, 2.5);
    this.spin.set(randomRange(-8, -3), randomRange(-2, 2), -this.vel.x * 2);

    this.combo = perfect ? this.combo + 1 : 0;
    const powerPoints = this.power ? POWER_UPS[this.power.kind].points : 1;
    const points = (perfect ? 2 : 1) * powerPoints * (1 + Math.floor(this.combo / 5));
    this.score += points;
    this.cooldown = 0.15;
    this.kickT = 0;
    this.kickLift = THREE.MathUtils.clamp(h, 0.1, 1.2);

    if (perfect) {
      this.callbacks.onPopup(`PERFECT +${points}`, "perfect");
      if (this.combo > 0 && this.combo % 5 === 0) this.callbacks.onPopup(`STREAK x${this.combo}!`, "power");
      this.tone(180, 60, 0.12, "sine", 0.4);
      this.tone(880, 1320, 0.15, "triangle", 0.12);
    } else {
      this.callbacks.onPopup(`+${points}`, "good");
      this.tone(160, 55, 0.12, "sine", 0.35);
    }
  }

  private gameOver() {
    this.state = "over";
    this.overTime = 0;
    this.power = null;
    this.orbState = null;
    this.orb.visible = false;
    if (this.score > this.best) {
      this.best = this.score;
      try {
        localStorage.setItem(BEST_KEY, String(this.best));
      } catch {
        // storage unavailable; best only lasts this session
      }
    }
    this.tone(300, 80, 0.5, "sawtooth", 0.08);
  }

  private spawnOrb() {
    const kind: PowerUpKind = Math.random() < 0.5 ? "big" : "small";
    this.orbState = { kind, x: randomRange(-WALL_X + 0.5, WALL_X - 0.5), y: randomRange(2.0, 3.2), age: 0 };
    this.orbMaterial.color.setHex(POWER_UPS[kind].color);
    this.orbMaterial.emissive.setHex(POWER_UPS[kind].color);
    this.orbLabel.material = this.orbLabelMaterials[kind];
    this.orb.visible = true;
  }

  private collect(kind: PowerUpKind) {
    this.power = { kind, timeLeft: POWER_DURATION };
    this.orbState = null;
    this.orb.visible = false;
    this.orbTimer = randomRange(6, 10);
    this.callbacks.onPopup(kind === "big" ? "BIG BALL!" : "MINI BALL! x3", "power");
    [523, 659, 784].forEach((f, i) => setTimeout(() => this.tone(f, f, 0.1, "triangle", 0.12), i * 70));
  }

  private frame = () => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(this.clock.getDelta(), 1 / 30);
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  private update(dt: number) {
    this.elapsed += dt;
    this.cooldown -= dt;

    const targetRadius = BASE_RADIUS * (this.power ? POWER_UPS[this.power.kind].radius : 1);
    this.radius += (targetRadius - this.radius) * Math.min(1, dt * 8);

    if (this.state === "ready") {
      this.pos.set(0, 2.2 + Math.sin(this.elapsed * 2) * 0.15);
      this.ball.rotation.y += dt;
    } else {
      this.stepBall(dt);
    }

    if (this.state === "playing") this.updatePowerUps(dt);
    if (this.state === "over") this.overTime += dt;

    this.updateVisuals(dt);
    this.emitHud();
  }

  private stepBall(dt: number) {
    this.vel.y -= this.gravity() * dt;
    this.pos.addScaledVector(this.vel, dt);

    const limit = WALL_X - this.radius;
    if (this.pos.x > limit) {
      this.pos.x = limit;
      this.vel.x = -Math.abs(this.vel.x) * 0.8;
    } else if (this.pos.x < -limit) {
      this.pos.x = -limit;
      this.vel.x = Math.abs(this.vel.x) * 0.8;
    }

    if (this.pos.y - this.radius <= 0) {
      this.pos.y = this.radius;
      if (this.state === "playing") this.gameOver();
      this.vel.y = Math.abs(this.vel.y) * 0.45;
      this.vel.x *= 0.8;
      if (this.vel.y < 0.6) this.vel.y = 0;
    }

    if (this.state === "over" && this.vel.y === 0) {
      this.vel.x *= Math.max(0, 1 - dt * 1.5);
      this.spin.set(0, 0, -this.vel.x / this.radius);
    }
    this.ball.rotation.x += this.spin.x * dt;
    this.ball.rotation.y += this.spin.y * dt;
    this.ball.rotation.z += this.spin.z * dt;
  }

  private updatePowerUps(dt: number) {
    if (this.power) {
      this.power.timeLeft -= dt;
      if (this.power.timeLeft <= 0) {
        this.power = null;
        this.callbacks.onPopup("Back to normal", "power");
      }
    }

    if (this.orbState) {
      const orb = this.orbState;
      orb.age += dt;
      const dx = this.pos.x - orb.x;
      const dy = this.pos.y - orb.y;
      if (Math.hypot(dx, dy) < this.radius + ORB_RADIUS) {
        this.collect(orb.kind);
      } else if (orb.age > ORB_LIFETIME) {
        this.orbState = null;
        this.orb.visible = false;
        this.orbTimer = randomRange(6, 10);
      }
    } else if (!this.power) {
      this.orbTimer -= dt;
      if (this.orbTimer <= 0) this.spawnOrb();
    }
  }

  private updateVisuals(dt: number) {
    this.ball.position.set(this.pos.x, this.pos.y, 0);
    this.ball.scale.setScalar(this.radius / BASE_RADIUS);

    // Shadow shrinks and fades with height.
    const h = Math.max(0, this.pos.y - this.radius);
    const shadowScale = this.radius * (1.1 - Math.min(h / 8, 0.5));
    this.shadow.position.x = this.pos.x;
    this.shadow.scale.setScalar(shadowScale);
    this.shadow.material.opacity = 0.35 - Math.min(h / 20, 0.2);

    // Timing ring: white = wait, green = kick now, gold = perfect.
    const scale = this.power ? POWER_UPS[this.power.kind].window : 1;
    const ringMat = this.ring.material;
    this.ring.position.x = this.pos.x;
    this.ring.visible = this.state !== "over";
    if (this.state === "playing" && this.vel.y < 2 && h <= PERFECT_WINDOW * scale) {
      ringMat.color.setHex(0xffd400);
      ringMat.opacity = 0.95;
      this.ring.scale.setScalar(this.radius * 1.9);
    } else if (this.state === "playing" && this.vel.y < 2 && h <= KICK_WINDOW * scale) {
      ringMat.color.setHex(0x4cff6a);
      ringMat.opacity = 0.85;
      this.ring.scale.setScalar(this.radius * 1.7);
    } else {
      ringMat.color.setHex(0xffffff);
      ringMat.opacity = 0.3;
      this.ring.scale.setScalar(this.radius * 1.6);
    }

    // Leg tracks the ball horizontally and snaps up on a kick.
    const legTargetX = this.state === "over" ? this.leg.position.x : this.pos.x - 0.05;
    this.leg.position.x += (legTargetX - this.leg.position.x) * Math.min(1, dt * 14);
    this.kickT = Math.min(1, this.kickT + dt / 0.25);
    const lift = this.kickT < 0.2 ? this.kickT / 0.2 : 1 - (this.kickT - 0.2) / 0.8;
    const eased = Math.sin((lift * Math.PI) / 2);
    this.leg.position.y = this.kickLift * eased;
    this.leg.rotation.x = -0.6 * eased;

    if (this.orbState) {
      const blink = this.orbState.age > ORB_LIFETIME - 2 && Math.floor(this.orbState.age * 8) % 2 === 0;
      this.orb.visible = !blink;
      this.orb.position.set(this.orbState.x, this.orbState.y + Math.sin(this.elapsed * 3) * 0.1, 0);
      this.orb.rotation.y += dt * 2;
    }
  }

  private resize() {
    const width = this.container.clientWidth || 1;
    const height = this.container.clientHeight || 1;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    // Pull the camera back far enough to fit both the play width and height.
    const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const distance = Math.max(3.2 / t, (WALL_X + 0.5) / (t * this.camera.aspect));
    // On tall screens, raise the view so the pitch sits near the bottom edge.
    const lookY = Math.max(2.2, distance * t * 0.6);
    this.camera.position.set(0, lookY + 0.2, distance);
    this.camera.lookAt(0, lookY, 0);
    this.camera.updateProjectionMatrix();
  }

  private emitHud() {
    const hud: HudState = {
      state: this.state,
      score: this.score,
      best: this.best,
      combo: this.combo,
      powerUp: this.power ? { kind: this.power.kind, secondsLeft: Math.ceil(this.power.timeLeft) } : null,
    };
    const key = JSON.stringify(hud);
    if (key !== this.lastHudKey) {
      this.lastHudKey = key;
      this.callbacks.onHud(hud);
    }
  }

  private ensureAudio() {
    if (!this.audio) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.audio = new Ctor();
    }
    if (this.audio.state === "suspended") this.audio.resume().catch(() => undefined);
  }

  private tone(from: number, to: number, duration: number, type: OscillatorType, volume: number) {
    const ctx = this.audio;
    if (!ctx || ctx.state === "closed") return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }
}
