'use client';

import { useEffect, useRef } from 'react';

// A água do hero: a foto responde ao toque com ondas que se dissipam em 3s, e a superfície
// ondula sozinha de leve.
//
// É opcional POR CONSTRUÇÃO. A foto está no HTML como <img> normal, com fetchPriority alto,
// e é ela o LCP. Este canvas desenha por cima só depois que o shader compila e a textura
// sobe. Sem WebGL, com o contexto perdido, ou com prefers-reduced-motion, a foto continua
// lá e ninguém percebe falta.

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// Recorta a textura como object-fit:cover, para a água ficar exatamente onde a foto está.
// rp guarda até 12 toques vivos (posição x, y e instante em que nasceu).
const FS =
  'precision highp float;uniform sampler2D T;uniform vec2 R;uniform vec2 I;uniform float t;uniform float S;uniform float W;uniform vec3 rp[12];\n' +
  'void main(){vec2 uv=gl_FragCoord.xy/R;uv.y=1.-uv.y;float ra=R.x/R.y,ia=I.x/I.y;vec2 f=vec2(min(1.,ra/ia),min(1.,ia/ra));vec2 off=vec2(0.);\n' +
  'for(int i=0;i<12;i++){vec3 r=rp[i];float age=t-r.z;if(age>0.0&&age<3.0){vec2 d=uv-r.xy;d.x*=ra;float ds=length(d)+1e-4;float w=sin(ds*55.-age*7.5)*exp(-ds*7.)*exp(-age*2.0)*0.014*S;off+=(d/ds)*w;}}\n' +
  'float wm=smoothstep(.45,1.,uv.y)*W;off.y+=sin(uv.x*22.+t*1.5)*0.0028*wm;off.x+=cos(uv.y*17.-t*1.1)*0.0016*wm;\n' +
  'vec2 tuv=(uv-.5+off)*f+.5;gl_FragColor=texture2D(T,tuv);}';

export default function AguaHero({ fotoId = 'hero-foto', dicaId = 'dica-agua' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const foto = document.getElementById(fotoId);
    const dica = document.getElementById(dicaId);
    if (!cv || !foto) return undefined;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let gl = null;
    try {
      gl =
        cv.getContext('webgl', {
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'low-power',
        }) || cv.getContext('experimental-webgl');
    } catch {
      return undefined;
    }
    if (!gl) return undefined;

    const compilar = (tipo, src) => {
      const s = gl.createShader(tipo);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compilar(gl.VERTEX_SHADER, VS);
    const fs = compilar(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return undefined;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pl = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(pl);
    gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const uR = U('R'), uI = U('I'), uT = U('t'), uS = U('S'), uW = U('W'), uRp = U('rp');

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const toques = new Float32Array(36).fill(-999);
    let iToque = 0, imgW = 0, imgH = 0;
    let pronto = false, aparecendo = false, raf = null, visivel = true, tentativas = 0;

    // A textura sempre passa por um canvas 2D intermediário, nunca pela tag de imagem
    // direta. Motivo: em tela estreita o navegador ainda estava decodificando a foto e o
    // texImage2D no elemento NÃO lançava exceção, só marcava INVALID_OPERATION calado. A
    // água ficava desligada sem nenhum sintoma. Desenhar no canvas primeiro força a
    // decodificação e dá uma fonte com dimensão que eu controlo.
    const reagendar = (fonte) => {
      if (tentativas++ < 8) setTimeout(() => usarImagem(fonte), 250);
    };

    function usarImagem(fonte) {
      if (pronto) return;
      const w = fonte.naturalWidth || fonte.width;
      const h = fonte.naturalHeight || fonte.height;
      if (!w || !h) { reagendar(fonte); return; }

      // No celular a textura grande custa memória e o primeiro quadro demora: 1280 basta.
      const teto = Math.min(
        gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048,
        window.innerWidth < 760 ? 1280 : 2048
      );
      const k = Math.min(1, teto / w, teto / h);
      const c = document.createElement('canvas');
      c.width = Math.max(2, Math.round(w * k));
      c.height = Math.max(2, Math.round(h * k));
      const ctx = c.getContext('2d');
      if (!ctx) return;
      try { ctx.drawImage(fonte, 0, 0, c.width, c.height); }
      catch { reagendar(fonte); return; }

      gl.bindTexture(gl.TEXTURE_2D, tex);
      while (gl.getError() !== gl.NO_ERROR) { /* limpa erro anterior antes de medir o meu */ }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c);
      // texImage2D não lança: ele sinaliza por getError. Sem checar aqui, o pronto=true
      // mentia e o shader desenhava uma textura vazia.
      if (gl.getError() !== gl.NO_ERROR) { reagendar(fonte); return; }

      imgW = c.width;
      imgH = c.height;
      pronto = true;
    }

    // A foto do hero já está no DOM e já foi baixada: reaproveita, sem segunda requisição.
    // decode() garante que os pixels estão prontos antes do upload.
    const usarQuandoDecodificar = () => {
      const espera = foto.decode ? foto.decode() : Promise.resolve();
      espera.then(() => usarImagem(foto)).catch(() => usarImagem(foto));
    };
    if (foto.complete && foto.naturalWidth > 0) usarQuandoDecodificar();
    else foto.addEventListener('load', usarQuandoDecodificar, { once: true });

    const redimensionar = () => {
      // dpr limitado: em tela retina de celular, 3x custa caro e não se vê diferença na água.
      const dpr = Math.min(window.innerWidth < 760 ? 1.5 : 2, window.devicePixelRatio || 1);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (!w || !h) return;
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const agora = () => performance.now() / 1000;

    const ondular = (cx, cy) => {
      const r = cv.getBoundingClientRect();
      const i = (iToque++ % 12) * 3;
      toques[i] = (cx - r.left) / r.width;
      toques[i + 1] = (cy - r.top) / r.height;
      toques[i + 2] = agora();
    };

    let ux = -99, uy = -99;
    const mover = (e) => {
      if (Math.hypot(e.clientX - ux, e.clientY - uy) > 26) {
        ux = e.clientX; uy = e.clientY;
        ondular(e.clientX, e.clientY);
      }
    };
    const tocar = (e) => { ux = e.clientX; uy = e.clientY; ondular(e.clientX, e.clientY); };

    cv.addEventListener('pointermove', mover, { passive: true });
    cv.addEventListener('pointerdown', tocar, { passive: true });
    window.addEventListener('resize', redimensionar, { passive: true });

    function quadro() {
      raf = requestAnimationFrame(quadro);
      if (!pronto || !visivel) return;
      redimensionar();
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform2f(uI, imgW, imgH);
      gl.uniform1f(uT, agora());
      gl.uniform1f(uS, 1.2);
      gl.uniform1f(uW, 1);
      gl.uniform3fv(uRp, toques);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!aparecendo) {
        aparecendo = true;
        cv.classList.add('ligado');
        if (dica) dica.hidden = false;
      }
    }
    quadro();

    // Fora da tela ou aba escondida, o laço para: não gastar bateria desenhando água que
    // ninguém está vendo.
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => { visivel = es[0].isIntersecting; }, { threshold: 0.01 });
      io.observe(cv);
    }
    const aoTrocarAba = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) quadro();
    };
    document.addEventListener('visibilitychange', aoTrocarAba);

    // Se a placa de vídeo desistir, a foto embaixo continua lá.
    const aoPerderContexto = (e) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = null;
      cv.classList.remove('ligado');
      if (dica) dica.hidden = true;
    };
    cv.addEventListener('webglcontextlost', aoPerderContexto);

    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener('pointermove', mover);
      cv.removeEventListener('pointerdown', tocar);
      cv.removeEventListener('webglcontextlost', aoPerderContexto);
      window.removeEventListener('resize', redimensionar);
      document.removeEventListener('visibilitychange', aoTrocarAba);
      if (io) io.disconnect();
    };
  }, [fotoId, dicaId]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
