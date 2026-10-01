import { useEffect, useRef } from "react";

/**
 * v13 background (01/10/2026, Mike): "Thynk Flow" — a planet made of dots, with space dust around it.
 * Replaces the v11 ParticleField on ?v=13 only. No face (the particle Muse read as Talos).
 *
 * - On load the dots fall from the sky into a curved surface that bends away to a horizon.
 * - Space dust drifts around the camera; as you scroll you fly through it, faster at the end.
 * - The page scroll tells the method: the field stirs up (Audit), then calms into an exact grid
 *   (Strategy → Implementation) and streams forward (Scale). The camera glides from above the
 *   horizon down to skim the surface.
 * - The cursor lifts the surface and lights a few dots in Thynk orange.
 *
 * Plain WebGL1 (no three.js dependency). ~90k dots on desktop, ~36k on phones.
 * Paused when the tab is hidden. prefers-reduced-motion: no intro, no drift, still follows scroll.
 * Prototype it came from: https://claude.ai/artifact/X7qaaHemNthW6JkqjfVPGJ
 */

const SNOISE = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
 const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
 vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
 vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
 vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+2.0*C.xxx;vec3 x3=x0-1.0+3.0*C.xxx;
 i=mod(i,289.0);
 vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
 float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);
 vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
 vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
 vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
 vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
 vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
 return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const FIELD_VS = `
precision highp float;
attribute vec2 aGrid; attribute float aRand; attribute vec3 aSky;
uniform mat4 uProj, uView;
uniform float uTime, uWave, uCalm, uStream, uActivity, uAppear, uCurve, uPx, uFade;
uniform vec3 uCursor;
varying float vA; varying float vOr;
${SNOISE}
void main(){
  float jit = 1.0-uCalm;
  vec2 g = aGrid + vec2(fract(aRand*91.7)-0.5, fract(aRand*37.3)-0.5)*0.011*jit;
  float x = g.x*22.0;
  float z = g.y*46.0 - 40.0;
  float zs = z + uStream;
  float n = snoise(vec3(x*0.07, zs*0.07, uTime*0.10))*2.0 + snoise(vec3(x*0.16, zs*0.16, uTime*0.22))*0.7;
  float amp = uWave*(1.0-0.9*uCalm);
  vec3 p = vec3(x, -1.3 + n*amp*0.34, z);
  float r2 = x*x*0.6 + (z-4.0)*(z-4.0);
  p.y -= r2*uCurve;
  float cd = length(p.xz - uCursor.xz);
  float lift = smoothstep(3.2,0.0,cd)*uActivity;
  p.y += lift*0.7;
  float d = aRand*0.55 + (1.0-g.y)*0.3;
  float t = smoothstep(d, d+0.45, uAppear);
  p = mix(aSky, p, t);
  vec4 mv = uView*vec4(p,1.0);
  float dist = -mv.z;
  float crest = clamp(n*0.35+0.5,0.0,1.0);
  float fadeFar = 1.0 - smoothstep(22.0, 40.0, dist);
  float fadeNear = smoothstep(0.4, 1.6, dist);
  vA = (0.10 + 0.55*crest) * fadeFar * fadeNear;
  vA = mix(vA, 0.34*fadeFar*fadeNear, uCalm*0.6);
  vA *= mix(0.35, 1.0, t) * uFade;
  vOr = clamp(lift*step(0.82,aRand) + step(0.9965,aRand), 0.0, 1.0);
  float base = vOr>0.5 ? 1.8 : 1.2;
  gl_PointSize = clamp(base*uPx*(6.0/dist), 0.9, 6.5*uPx);
  gl_Position = uProj*mv;
}`;

const DUST_VS = `
precision highp float;
attribute vec3 aPos; attribute float aRand;
uniform mat4 uProj, uView;
uniform float uTime, uFly, uPx, uFade; uniform vec3 uCam;
varying float vA; varying float vOr;
void main(){
  vec3 p = aPos;
  p.x += sin(uTime*0.08 + aRand*40.0)*0.6;
  p.y += cos(uTime*0.07 + aRand*31.0)*0.4;
  p.z += uFly;
  vec3 box = vec3(30.0, 14.0, 44.0);
  p = uCam + mod(p - uCam + box*0.5, box) - box*0.5;
  vec4 mv = uView*vec4(p,1.0);
  float dist = -mv.z;
  float edge = 1.0 - smoothstep(16.0, 22.0, dist);
  vA = (0.25 + 0.6*fract(aRand*13.1)) * edge * smoothstep(0.3, 2.0, dist) * uFade;
  vOr = step(0.94, aRand);
  gl_PointSize = clamp((0.8 + fract(aRand*7.3)*1.8)*uPx*(7.0/dist), 0.8, 5.0*uPx);
  gl_Position = uProj*mv;
}`;

const FS = `
precision highp float;
varying float vA; varying float vOr;
void main(){
  vec2 c = gl_PointCoord-0.5; float r = length(c);
  if(r>0.5) discard;
  float a = smoothstep(0.5,0.15,r)*vA;
  vec3 ink = vec3(0.063,0.067,0.078);      /* --ink #101114 */
  vec3 orange = vec3(1.0,0.416,0.102);     /* --orange #ff6a1a */
  gl_FragColor = vec4(mix(ink,orange,vOr), clamp(a,0.0,1.0));
}`;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function perspective(fovDeg: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}
function lookAt(e: number[], t: number[]) {
  let zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2];
  let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
  // x = up(0,1,0) × z
  const xy = 0;
  let xx = zz, xz = -zx;
  l = Math.hypot(xx, xz); xx /= l; xz /= l;
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1,
  ]);
}

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
  return p;
}

export function PlanetField({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const gl = cvs.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const small = window.matchMedia("(max-width: 760px)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, small ? 2 : 1.5);

    const progs = (() => {
      try {
        return [program(gl, FIELD_VS, FS), program(gl, DUST_VS, FS)] as const;
      } catch {
        return null; // no field rather than a broken page
      }
    })();
    if (!progs) return;
    const [fieldP, dustP] = progs;

    // field: a lattice the shader bends into a planet
    const N = small ? 36000 : 90000;
    const cols = Math.round(Math.sqrt(N * 0.48));
    const rows = Math.ceil(N / cols);
    const fdata = new Float32Array(N * 6); // grid(2) rand(1) sky(3)
    for (let k = 0; k < N; k++) {
      const o = k * 6;
      fdata[o] = ((k % cols) / (cols - 1)) * 2 - 1;
      fdata[o + 1] = ((k / cols) | 0) / (rows - 1);
      fdata[o + 2] = Math.random();
      fdata[o + 3] = (Math.random() - 0.5) * 40;
      fdata[o + 4] = 4 + Math.random() * 12;
      fdata[o + 5] = -30 + Math.random() * 34;
    }
    const fbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fbuf);
    gl.bufferData(gl.ARRAY_BUFFER, fdata, gl.STATIC_DRAW);

    // dust: stars around the camera
    const M = small ? 900 : 2200;
    const ddata = new Float32Array(M * 4);
    for (let i = 0; i < M; i++) {
      ddata[i * 4] = (Math.random() - 0.5) * 30;
      ddata[i * 4 + 1] = Math.random() * 14 - 5;
      ddata[i * 4 + 2] = (Math.random() - 0.5) * 44;
      ddata[i * 4 + 3] = Math.random();
    }
    const dbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dbuf);
    gl.bufferData(gl.ARRAY_BUFFER, ddata, gl.STATIC_DRAW);

    const U = (p: WebGLProgram, names: string[]) =>
      Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)])) as Record<string, WebGLUniformLocation | null>;
    const fu = U(fieldP, ["uProj", "uView", "uTime", "uWave", "uCalm", "uStream", "uActivity", "uAppear", "uCurve", "uPx", "uFade", "uCursor"]);
    const du = U(dustP, ["uProj", "uView", "uTime", "uFly", "uPx", "uFade", "uCam"]);
    const fa = { grid: gl.getAttribLocation(fieldP, "aGrid"), rand: gl.getAttribLocation(fieldP, "aRand"), sky: gl.getAttribLocation(fieldP, "aSky") };
    const da = { pos: gl.getAttribLocation(dustP, "aPos"), rand: gl.getAttribLocation(dustP, "aRand") };

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    // transparent canvas: blend colour normally but keep alpha linear (plain blendFunc would square it
    // and the dots come out far fainter than on an opaque ground)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let W = 0, H = 0, proj = perspective(42, 1, 0.05, 120);
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      cvs.width = Math.round(W * DPR);
      cvs.height = Math.round(H * DPR);
      cvs.style.width = W + "px";
      cvs.style.height = H + "px";
      gl.viewport(0, 0, cvs.width, cvs.height);
      proj = perspective(42, W / H, 0.05, 120);
    };
    resize();
    window.addEventListener("resize", resize);

    // input
    let mx = 0, my = 0, tmx = 0, tmy = 0, active = false, lastMove = 0;
    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / W) * 2 - 1;
      tmy = -((e.clientY / H) * 2 - 1);
      active = true;
      lastMove = performance.now();
    };
    const onLeave = () => (active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let prog = 0, progS = 0, hero = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      hero = clamp(window.scrollY / window.innerHeight, 0, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const t0 = performance.now();
    let last = t0, stream = 0, fly = 0, raf = 0, activity = 0;
    const cursor = [0, -1.3, -99];

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const tsec = reduced ? 0 : now / 1000;
      progS = lerp(progS, prog, reduced ? 1 : 0.08);
      mx = lerp(mx, tmx, 0.05);
      my = lerp(my, tmy, 0.05);
      const p = progS;

      // the page as the method: stir (audit) → calm → order → stream
      const appear = reduced ? 1.0001 : clamp((now - t0) / 2600, 0, 1.0001);
      const wave = 1.0 + 1.4 * sstep(0.08, 0.3, p);
      const calm = sstep(0.45, 0.8, p);
      const curve = lerp(0.0045, 0.0018, sstep(0, 0.3, p));
      const speed = reduced ? 0 : 0.7 + 1.2 * hero + 3.0 * sstep(0.85, 1, p);
      stream += dt * speed;
      fly += dt * speed * 1.6;
      // strong behind the hero, quieter behind the content so the text stays easy to read
      const fade = lerp(1, 0.5, sstep(0.02, 0.12, p));

      // camera: above the horizon → glide down → skim the surface
      const glide = sstep(0, 0.3, p), skim = sstep(0.3, 0.75, p);
      const drift = reduced ? 0 : Math.sin(tsec * 0.12) * 0.5;
      const eye = [mx * 0.9 + drift, lerp(lerp(2.2, 3.6, glide), 0.6, skim) + my * 0.3, lerp(6.5, 4.0, skim)];
      const tgt = [mx * 0.4 + drift * 0.5, lerp(lerp(0.4, -1.2, glide), -0.5, skim) + my * 0.15, lerp(lerp(-14, -9, glide), -16, skim)];
      const view = lookAt(eye, tgt);

      // cursor onto the surface plane y = -1.3
      if (active) {
        const f = 1 / Math.tan((42 * Math.PI) / 360);
        const vx = (mx * (W / H)) / f, vy = my / f; // camera-space ray (z = -1)
        // camera basis from the view matrix (rows of its rotation)
        const dx = view[0] * vx + view[1] * vy - view[2];
        const dy = view[4] * vx + view[5] * vy - view[6];
        const dz = view[8] * vx + view[9] * vy - view[10];
        if (dy < -1e-4) {
          const s = (-1.3 - eye[1]) / dy;
          cursor[0] = lerp(cursor[0], eye[0] + dx * s, 0.15);
          cursor[2] = lerp(cursor[2], eye[2] + dz * s, 0.15);
        }
      }
      const idle = (now - lastMove) / 1000;
      activity += ((active && idle < 3 ? 1 : 0) - activity) * 0.06;

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(fieldP);
      gl.uniformMatrix4fv(fu.uProj, false, proj);
      gl.uniformMatrix4fv(fu.uView, false, view);
      gl.uniform1f(fu.uTime, tsec);
      gl.uniform1f(fu.uWave, wave);
      gl.uniform1f(fu.uCalm, calm);
      gl.uniform1f(fu.uStream, stream);
      gl.uniform1f(fu.uActivity, activity);
      gl.uniform1f(fu.uAppear, appear);
      gl.uniform1f(fu.uCurve, curve);
      gl.uniform1f(fu.uPx, 1.6 * DPR);
      gl.uniform1f(fu.uFade, fade);
      gl.uniform3f(fu.uCursor, cursor[0], cursor[1], cursor[2]);
      gl.bindBuffer(gl.ARRAY_BUFFER, fbuf);
      gl.enableVertexAttribArray(fa.grid);
      gl.vertexAttribPointer(fa.grid, 2, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(fa.rand);
      gl.vertexAttribPointer(fa.rand, 1, gl.FLOAT, false, 24, 8);
      gl.enableVertexAttribArray(fa.sky);
      gl.vertexAttribPointer(fa.sky, 3, gl.FLOAT, false, 24, 12);
      gl.drawArrays(gl.POINTS, 0, N);
      gl.disableVertexAttribArray(fa.grid);
      gl.disableVertexAttribArray(fa.rand);
      gl.disableVertexAttribArray(fa.sky);

      gl.useProgram(dustP);
      gl.uniformMatrix4fv(du.uProj, false, proj);
      gl.uniformMatrix4fv(du.uView, false, view);
      gl.uniform1f(du.uTime, tsec);
      gl.uniform1f(du.uFly, fly);
      gl.uniform1f(du.uPx, 1.6 * DPR);
      gl.uniform1f(du.uFade, fade);
      gl.uniform3f(du.uCam, eye[0], eye[1], eye[2]);
      gl.bindBuffer(gl.ARRAY_BUFFER, dbuf);
      gl.enableVertexAttribArray(da.pos);
      gl.vertexAttribPointer(da.pos, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(da.rand);
      gl.vertexAttribPointer(da.rand, 1, gl.FLOAT, false, 16, 12);
      gl.drawArrays(gl.POINTS, 0, M);
      gl.disableVertexAttribArray(da.pos);
      gl.disableVertexAttribArray(da.rand);

      raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteBuffer(fbuf);
      gl.deleteBuffer(dbuf);
      gl.deleteProgram(fieldP);
      gl.deleteProgram(dustP);
    };
  }, [reduced]);

  return <canvas ref={ref} className="t11-field" aria-hidden="true" />;
}
