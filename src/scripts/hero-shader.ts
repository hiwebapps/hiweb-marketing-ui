/**
 * WebGL mesh gradient for `.hero-contrast [data-hero-shader]`.
 * Progressive enhancement — CSS fallback remains if WebGL fails.
 */
export function initHeroShader(speed = 1) {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-shader]');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });

  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  const vsSource = `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    uniform vec2 u_res;
    uniform float u_time;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      float t = u_time * 0.18;
      vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);
      p += 0.08 * vec2(noise(p * 1.4 + t), noise(p * 1.6 - t * 0.8));

      float b1 = length(p - vec2(0.35 + 0.08 * sin(t), 0.15 + 0.05 * cos(t * 0.7)));
      float b2 = length(p - vec2(1.05 + 0.06 * cos(t * 0.9), 0.55));
      float b3 = length(p - vec2(0.55, 1.05 + 0.04 * sin(t * 1.1)));
      float b4 = length(p - vec2(-0.05, 0.7));

      vec3 ink = vec3(0.02, 0.025, 0.07);
      vec3 navy = vec3(0.06, 0.1, 0.38);
      vec3 cyan = vec3(0.05, 0.88, 1.0);
      vec3 purple = vec3(0.55, 0.42, 1.0);
      vec3 orange = vec3(1.0, 0.42, 0.12);
      vec3 sky = vec3(0.45, 0.65, 1.0);

      vec3 col = mix(ink, navy, smoothstep(1.1, 0.15, b3));
      col = mix(col, cyan, 0.72 * (1.0 - smoothstep(0.0, 0.75, b1)));
      col = mix(col, purple, 0.55 * (1.0 - smoothstep(0.0, 0.85, b2)));
      col = mix(col, orange, 0.18 * (1.0 - smoothstep(0.0, 0.75, b4)));
      col = mix(col, sky, 0.22 * smoothstep(0.35, 1.0, uv.y));

      float vig = smoothstep(1.4, 0.2, length(uv - vec2(0.5, 0.42)));
      col *= 0.7 + 0.4 * vig;
      // Soft film grain — keep subtle (Arcade), not stipple spray
      float grain = (hash(gl_FragCoord.xy * 0.7 + floor(t * 2.0)) - 0.5) * 0.028;
      col += grain;
      col = min(col, vec3(1.0));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, vsSource);
  const fs = compile(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    canvas.style.display = 'none';
    return;
  }

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.style.display = 'none';
    return;
  }
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_res');
  const uTime = gl.getUniformLocation(program, 'u_time');

  let raf = 0;
  const start = performance.now();

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };

  const draw = (timeSec: number) => {
    gl.uniform1f(uTime, timeSec);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const loop = (now: number) => {
    draw(((now - start) / 1000) * speed);
    raf = requestAnimationFrame(loop);
  };

  resize();
  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);

  if (reduceMotion) {
    draw(4.2);
  } else {
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    },
    { once: true },
  );
}
