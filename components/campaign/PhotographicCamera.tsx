'use client';

import { useEffect, useRef } from 'react';

type Material = 'air' | 'fabric' | 'stone';
type Props = {
  active: Material | null;
  onReady: () => void;
  onSettled: () => void;
  onError: () => void;
};
type Rect = readonly [number, number, number, number];
type Surface = HTMLCanvasElement | OffscreenCanvas;
type Asset = HTMLImageElement | Surface;
type Assets = Partial<Record<'room' | 'fabric' | 'stone' | 'macro' | 'grille' | 'deep', Asset>>;
type Segment = { from: number; to: number; started: number; duration: number };

const WORLD_WIDTH = 1672;
const WORLD_HEIGHT = 941;
const GRILLE: Rect = [976, 43, 303, 103.823];
const GRILLE_SHEAR = -4.66;
const FILES = [
  ['room', '/images/room/room.webp', 0],
  ['fabric', '/images/continuous-zoom/fabric-tile.webp', 0.06],
  ['stone', '/images/continuous-zoom/stone-tile.webp', 0.20],
  ['macro', '/images/zoom-v3/fabric-macro.webp', 0.18],
  ['grille', '/images/zoom-v3/duct-closed.webp', 0.02],
  ['deep', '/images/continuous-zoom/duct-internal-v2.webp', 0],
] as const;
const FOCUS: Record<Material, readonly [number, number]> = {
  fabric: [0.88 * WORLD_WIDTH, 0.76 * WORLD_HEIGHT],
  stone: [0.515 * WORLD_WIDTH, 0.79 * WORLD_HEIGHT],
  air: [1127.57, 88.48],
};
const SLOT = [
  [215, 453.4], [1958, 198.9], [1958, 219.5], [215, 471.6],
] as const;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const ease = (value: number) => value < 0.5
  ? 4 * value * value * value
  : 1 - Math.pow(-2 * value + 2, 3) / 2;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      image.onload = null;
      image.onerror = null;
      if (typeof image.decode === 'function') {
        image.decode().then(() => resolve(image), () => resolve(image));
      } else resolve(image);
    };
    image.onerror = () => {
      image.onload = null;
      image.onerror = null;
      reject(new Error('Photographic asset failed to load: ' + src));
    };
    image.src = src;
  });
}

function feather(image: HTMLImageElement, fraction: number, grille = false): Surface {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const surface: Surface = typeof OffscreenCanvas === 'function'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas');
  surface.width = width;
  surface.height = height;
  const context = surface.getContext('2d') as
    CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
  if (!context) throw new Error('Photographic tile canvas is unavailable');
  context.drawImage(image, 0, 0);
  context.globalCompositeOperation = 'destination-in';
  if (grille) {
    context.beginPath();
    [[215,310],[1958,44],[1958,397],[215,625]].forEach(([x,y],i)=>{if(i===0)context.moveTo(x/2139*width,y/735*height);else context.lineTo(x/2139*width,y/735*height)});
    context.closePath();context.fill();
    context.globalCompositeOperation='source-over';
    return surface;
  }
  const horizontal = context.createLinearGradient(0, 0, width, 0);
  horizontal.addColorStop(0, 'rgba(0,0,0,0)');
  horizontal.addColorStop(fraction, 'rgba(0,0,0,1)');
  horizontal.addColorStop(1 - fraction, 'rgba(0,0,0,1)');
  horizontal.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = horizontal;
  context.fillRect(0, 0, width, height);
  const vertical = context.createLinearGradient(0, 0, 0, height);
  vertical.addColorStop(0, 'rgba(0,0,0,0)');
  vertical.addColorStop(fraction, 'rgba(0,0,0,1)');
  vertical.addColorStop(1 - fraction, 'rgba(0,0,0,1)');
  vertical.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = vertical;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = 'source-over';
  return surface;
}

export default function PhotographicCamera({ active, onReady, onSettled, onError }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onReady, onSettled, onError });
  const desiredRef = useRef<Material | null>(active);
  const requestRef = useRef<((next: Material | null) => void) | null>(null);

  useEffect(() => {
    callbacks.current = { onReady, onSettled, onError };
  }, [onReady, onSettled, onError]);

  useEffect(() => {
    desiredRef.current = active;
    requestRef.current?.(active);
  }, [active]);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    const canvas: HTMLCanvasElement = element;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      callbacks.current.onError();
      return;
    }
    const ctx = context;
    const assets: Assets = {};
    const surfaces: Surface[] = [];
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let loaded = false;
    let errorReported = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let material: Material | null = null;
    let progress = 0;
    let desired = desiredRef.current;
    let segment: Segment | null = null;
    let requestSerial = 0;
    let settledSerial = -1;

    const reportError = () => {
      if (!disposed && !errorReported) {
        errorReported = true;
        callbacks.current.onError();
      }
    };
    const reduced = () => motionQuery.matches
      || document.documentElement.dataset.motionTest === 'reduced'
      || canvas.closest('[data-motion-test="reduced"]') !== null;

    function draw() {
      if (disposed || !width || !height || !assets.room) return;
      const base = Math.max(width / WORLD_WIDTH, height / WORLD_HEIGHT);
      const overviewLeft = (width - WORLD_WIDTH * base) / 2;
      let zoom = 1;
      let pan = 0;
      if (material === 'air') {
        const airProgress = assets.deep ? progress : Math.min(progress, 0.58);
        if (airProgress <= 0.58) {
          pan = airProgress / 0.58;
          zoom = Math.exp(Math.log(4.8) * pan);
        } else {
          pan = 1;
          zoom = 4.8 * Math.exp(Math.log(600 / 4.8) * ((airProgress - 0.58) / 0.42));
        }
      } else if (material) {
        pan = progress;
        zoom = Math.exp(Math.log(material === 'fabric' ? 3.2 : 3.6) * progress);
      }
      const scale = base * zoom;
      let x = overviewLeft;
      let y = 0;
      if (material) {
        const [fx, fy] = FOCUS[material];
        const targetX = width * (width > 600 ? 0.7 : 0.5);
        const endX = clamp(targetX - fx * scale, width - WORLD_WIDTH * scale, 0);
        const endY = clamp(height * 0.5 - fy * scale, height - WORLD_HEIGHT * scale, 0);
        x = mix(overviewLeft, endX, pan);
        y = mix(0, endY, pan);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, width, height);
      const drawWorld = (asset: Asset | undefined, rect: Rect) => {
        if (!asset) return;
        const dx = x + rect[0] * scale;
        const dy = y + rect[1] * scale;
        const dw = rect[2] * scale;
        const dh = rect[3] * scale;
        if (dx >= width || dy >= height || dx + dw <= 0 || dy + dh <= 0) return;
        if(asset===assets.grille){ctx.save();ctx.transform(1,GRILLE_SHEAR/GRILLE[2],0,1,dx,dy);ctx.drawImage(asset,0,0,dw,dh);ctx.restore()}else ctx.drawImage(asset, dx, dy, dw, dh);
      };
      drawWorld(assets.room, [0, 0, WORLD_WIDTH, WORLD_HEIGHT]);
      drawWorld(assets.fabric, [1160, 580, 512, 325]);
      drawWorld(assets.stone, [610, 635, 490, 200]);
      drawWorld(assets.macro, [1355.2956, 684, 162.7463, 130]);
      drawWorld(assets.grille, GRILLE);

      if (material === 'air' && progress >= 0.58 && assets.deep && assets.grille) {
        ctx.save();
        ctx.beginPath();
        SLOT.forEach(([sx, sy], index) => {
          const px = x + (GRILLE[0] + sx / 2139 * GRILLE[2]) * scale;
          const py = y + (GRILLE[1] + sy / 735 * GRILLE[3] + sx / 2139 * GRILLE_SHEAR) * scale;
          if (index === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.clip();
        const deep = assets.deep as HTMLImageElement;
        const rearProgress = clamp((progress - 0.58) / 0.42, 0, 1);
        const rearZoom = mix(1.06, 1, rearProgress);
        const viewLeft = width <= 600 ? 0 : width * (width <= 1100 ? 0.42 : 0.36);
        const viewWidth = width - viewLeft;
        const deepScale = Math.max(viewWidth / deep.naturalWidth, height / deep.naturalHeight) * rearZoom;
        const deepWidth = deep.naturalWidth * deepScale;
        const deepHeight = deep.naturalHeight * deepScale;
        ctx.drawImage(deep, viewLeft + (viewWidth - deepWidth) / 2, (height - deepHeight) / 2, deepWidth, deepHeight);
        ctx.restore();
      }

      canvas.dataset.cameraProgress = progress.toFixed(5);
      canvas.dataset.cameraMaterial = material ?? 'overview';
    }

    function sample(now: number) {
      if (!segment) return false;
      const elapsed = clamp((now - segment.started) / segment.duration, 0, 1);
      progress = mix(segment.from, segment.to, ease(elapsed));
      if (elapsed === 1) {
        progress = segment.to;
        segment = null;
        return true;
      }
      return false;
    }

    function settled() {
      if (settledSerial === requestSerial) return;
      settledSerial = requestSerial;
      callbacks.current.onSettled();
    }

    function animate(to: number) {
      const forward = to > progress;
      const fullDuration = material === 'air'
        ? (forward ? 1100 : 750)
        : (forward ? 650 : 450);
      segment = {
        from: progress,
        to,
        started: performance.now(),
        duration: Math.max(1, fullDuration * Math.abs(to - progress)),
      };
      draw();
      frame = requestAnimationFrame(tick);
    }

    function plan() {
      if (!loaded || disposed) return;
      if (reduced()) {
        material = desired;
        progress = desired ? 1 : 0;
        segment = null;
        draw();
        settled();
        return;
      }
      if (material !== desired) {
        if (material !== null && progress > 0) {
          animate(0);
          return;
        }
        material = desired;
        progress = 0;
      }
      if (material && progress < 1) {
        animate(1);
      } else {
        draw();
        settled();
      }
    }

    function tick(now: number) {
      frame = 0;
      if (disposed) return;
      const finished = sample(now);
      draw();
      if (finished) plan();
      else if (segment) frame = requestAnimationFrame(tick);
    }

    function request(next: Material | null) {
      if (disposed) return;
      desired = next;
      requestSerial += 1;
      sample(performance.now());
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      segment = null;
      plan();
    }
    requestRef.current = request;

    function resize() {
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const nextWidth = Math.max(1, Math.round(width * dpr));
      const nextHeight = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
      draw();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement ?? canvas);
    window.addEventListener('resize', resize);
    const motionChange = () => request(desired);
    motionQuery.addEventListener('change', motionChange);
    const motionObserver = new MutationObserver(motionChange);
    motionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion-test'],
    });
    resize();

    void Promise.allSettled(FILES.map(async ([key, src, edge]) => {
      const image = await loadImage(src);
      if (disposed) return;
      if (edge) {
        const surface = feather(image, edge, key === 'grille');
        surfaces.push(surface);
        assets[key] = surface;
      } else assets[key] = image;
    })).then(results => {
      if (disposed) return;
      if (results.some(result => result.status === 'rejected')) reportError();
      if (!assets.room) return;
      loaded = true;
      resize();
      canvas.style.visibility = 'visible';
      callbacks.current.onReady();
      plan();
    });

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      segment = null;
      requestRef.current = null;
      observer.disconnect();
      motionObserver.disconnect();
      motionQuery.removeEventListener('change', motionChange);
      window.removeEventListener('resize', resize);
      for (const surface of surfaces) {
        surface.width = 1;
        surface.height = 1;
      }
      canvas.width = 1;
      canvas.height = 1;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="photographic-camera"
      role="img"
      aria-label={active==='air'?'Photographic camera through a grille slot into an illustrative duct inspection':active==='fabric'?'Close view of the same blue sofa weave':active==='stone'?'Close view of the same stone table':'Sunlit room with a closed AC grille, blue sofa and stone table'}
      data-camera-progress="0"
      data-camera-material="overview"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', visibility: 'hidden' }}
    />
  );
}
