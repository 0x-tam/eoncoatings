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
type Asset = HTMLImageElement | Surface | ImageBitmap;
type Assets = Partial<Record<'room' | 'fabric' | 'stone' | 'macro' | 'grille' | 'deep', Asset>>;
type Pose = {cx:number;cy:number;z:number};
type Flight = {from:Pose;to:Pose;started:number;duration:number;wide:number|null};
type Segment = { from: number; to: number; started: number; duration: number };

const WORLD_WIDTH = 1672;
const WORLD_HEIGHT = 941;
// Register the same photographic grille across the entire original 602px opening.
const GRILLE: Rect = [787.742, 73.61, 738.795, 105];
const GRILLE_SHEAR = -78.54;
const FILES = [
  ['room', '/images/room/room.webp', 0],
  ['fabric', '/images/continuous-zoom/fabric-tile.webp', 0.06],
  ['stone', '/images/zoom-v4/stone-traces.webp', 0.20],
  ['macro', '/images/zoom-v3/fabric-macro.webp', 0.18],
  ['grille', '/images/zoom-v3/duct-closed.webp', 0.02],
  ['deep', '/images/continuous-zoom/duct-internal-v2.webp', 0],
] as const;
const FOCUS: Record<Material, readonly [number, number]> = {
  fabric: [1438, 735],
  stone: [930, 710],
  air: [1163, 81.7],
};
const SLOT = [
  [215, 453.4], [1958, 198.9], [1958, 219.5], [215, 471.6],
] as const;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const ease = (value: number) => (1 - Math.cos(Math.PI * value)) / 2;

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
    const bitmaps: ImageBitmap[] = [];
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
    let flight: Flight | null = null;
    let livePose: Pose | null = null;
    let requestSerial = 0;
    let settledSerial = -1;
    let lastFrameTime = 0;
    let frameIntervals: number[] = [];

    const reportError = () => {
      if (!disposed && !errorReported) {
        errorReported = true;
        callbacks.current.onError();
      }
    };
    const reduced = () => motionQuery.matches
      || document.documentElement.dataset.motionTest === 'reduced'
      || canvas.closest('[data-motion-test="reduced"]') !== null;

    function poseAt(subject: Material | null, amount: number): Pose {
      const base = Math.min(width / WORLD_WIDTH, height / WORLD_HEIGHT);
      const overviewLeft = width - WORLD_WIDTH * base;
      const overviewTop = (height - WORLD_HEIGHT * base) / 2;
      const endZoom = subject === 'air' ? 600 : subject === 'fabric' ? (width <= 600 ? 8 : 4.6) : subject === 'stone' ? (width <= 600 ? 6.5 : 4.7) : 1;
      const amountAvailable = subject === 'air' && !assets.deep ? Math.min(amount, 0.58) : amount;
      const zoom = Math.exp(Math.log(endZoom) * amountAvailable);
      const scale = base * zoom;
      let x = overviewLeft;
      let y = overviewTop;
      if (subject) {
        const [fx, fy] = FOCUS[subject];
        const endScale = base * endZoom;
        const endX = clamp(width * (width > 600 ? 0.7 : 0.5) - fx * endScale, width - WORLD_WIDTH * endScale, 0);
        const endY = clamp(height * 0.5 - fy * endScale, height - WORLD_HEIGHT * endScale, 0);
        // A single fixed optical pivot joins the exact overview and final framing.
        // Do not independently pan or clamp intermediate frames: both made the
        // room slide sideways before the zoom had caught up.
        const opticalTravel = (zoom - 1) / (endZoom - 1);
        x = mix(overviewLeft, endX, opticalTravel);
        y = mix(overviewTop, endY, opticalTravel);
      }

      return {cx:(width*(width>600?.7:.5)-x)/scale,cy:(height*.5-y)/scale,z:Math.log(zoom)};
    }

    function flightPose(now:number): Pose {
      const f=flight!;
      const t=clamp((now-f.started)/f.duration,0,1);
      const u=ease(t);
      const z=f.wide===null?mix(f.from.z,f.to.z,u):
        (1-u)**3*f.from.z+3*(1-u)**2*u*f.wide+3*(1-u)*u*u*f.wide+u**3*f.to.z;
      const start=f.from.z>Math.log(40)?.42:0;
      const end=f.to.z>Math.log(40)?.58:1;
      const v=clamp((u-start)/(end-start),0,1);
      const travel=v*v*(3-2*v);
      return {cx:mix(f.from.cx,f.to.cx,travel),cy:mix(f.from.cy,f.to.cy,travel),z};
    }

    function draw() {
      if (disposed || !width || !height || !assets.room) return;
      const base=Math.min(width/WORLD_WIDTH,height/WORLD_HEIGHT);
      const pose=flight?flightPose(performance.now()):poseAt(material,progress);
      livePose=pose;
      const zoom=Math.exp(pose.z),scale=base*zoom;
      const x=width*(width>600?.7:.5)-pose.cx*scale;
      const y=height*.5-pose.cy*scale;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#eee5d4';
      ctx.fillRect(0, 0, width, height);
      const drawWorld = (asset: Asset | undefined, rect: Rect) => {
        if (!asset) return;
        const dx = x + rect[0] * scale;
        const dy = y + rect[1] * scale;
        const dw = rect[2] * scale;
        const dh = rect[3] * scale;
        const shear = asset === assets.grille ? GRILLE_SHEAR / GRILLE[2] : 0;
        const sourceWidth = asset instanceof HTMLImageElement ? asset.naturalWidth : asset.width;
        const sourceHeight = asset instanceof HTMLImageElement ? asset.naturalHeight : asset.height;
        // Inverse-map viewport bounds into the source, including the grille's shear.
        // Keep draw destinations bounded even during the final passage through the slot.
        const left = clamp(-dx - 2, 0, dw);
        const right = clamp(width - dx + 2, 0, dw);
        const top = clamp(Math.min(-dy - shear * left, -dy - shear * right) - 2, 0, dh);
        const bottom = clamp(Math.max(height - dy - shear * left, height - dy - shear * right) + 2, 0, dh);
        if (right <= left || bottom <= top) return;
        ctx.save();
        ctx.transform(1, shear, 0, 1, dx, dy);
        ctx.drawImage(asset,
          left / dw * sourceWidth, top / dh * sourceHeight,
          (right - left) / dw * sourceWidth, (bottom - top) / dh * sourceHeight,
          left, top, right - left, bottom - top);
        ctx.restore();
      };
      drawWorld(assets.room, [0, 0, WORLD_WIDTH, WORLD_HEIGHT]);
      drawWorld(assets.fabric, [1160, 580, 512, 325]);
      drawWorld(assets.stone, [610, 635, 490, 200]);
      drawWorld(assets.macro, [1355.2956, 684, 162.7463, 130]);
      drawWorld(assets.grille, GRILLE);

      if (zoom >= 3.6 && assets.deep && assets.grille) {
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
        const deep = assets.deep!;
        const nativeWidth = deep instanceof HTMLImageElement ? deep.naturalWidth : deep.width;
        const nativeHeight = deep instanceof HTMLImageElement ? deep.naturalHeight : deep.height;
        const rearProgress = clamp((Math.log(zoom)/Math.log(600) - 0.20) / 0.80, 0, 1);
        const rearZoom = mix(1.06, 1, rearProgress);
        const viewLeft = width <= 600 ? 0 : width * (width <= 1100 ? 0.42 : 0.36);
        const viewWidth = width - viewLeft;
        const deepScale = Math.max(viewWidth / nativeWidth, height / nativeHeight) * rearZoom;
        const deepWidth = nativeWidth * deepScale;
        const deepHeight = nativeHeight * deepScale;
        ctx.drawImage(deep, viewLeft + (viewWidth - deepWidth) / 2, (height - deepHeight) / 2, deepWidth, deepHeight);
        ctx.restore();
      }

      canvas.dataset.cameraProgress = progress.toFixed(5);
      canvas.dataset.cameraMaterial = material ?? 'overview';
      canvas.dataset.cameraFlight = flight ? 'direct' : 'none';
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
      if (frameIntervals.length) {
        const sorted = [...frameIntervals].sort((a, b) => a - b);
        canvas.dataset.frameTiming = JSON.stringify({frames: sorted.length, medianMs: +sorted[Math.floor(sorted.length / 2)].toFixed(1), p95Ms: +sorted[Math.floor(sorted.length * .95)].toFixed(1), over34Ms: sorted.filter(n => n > 34).length});
      }
      callbacks.current.onSettled();
    }

    function animate(to: number) {
      const forward = to > progress;
      const fullDuration = material === 'air'
        ? (forward ? 1550 : 1250)
        : (forward ? 1450 : 1200);
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
      if (lastFrameTime) frameIntervals.push(now - lastFrameTime);
      lastFrameTime = now;
      if (flight) {
        const complete=now-flight.started>=flight.duration;
        if(complete){flight=null;material=desired;progress=desired?1:0;}
        draw();
        if(complete)settled();else frame=requestAnimationFrame(tick);
        return;
      }
      const finished = sample(now);
      draw();
      if (finished) plan();
      else if (segment) frame = requestAnimationFrame(tick);
    }

    function request(next: Material | null) {
      if (disposed) return;
      // Capture the rendered camera before changing destinations, including an interrupted flight.
      sample(performance.now());
      draw();
      const from=livePose;
      const direct=!!flight || (material!==null && next!==null && material!==next);
      desired = next;
      requestSerial += 1;
      lastFrameTime = 0;
      frameIntervals = [];
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      segment = null;
      flight = null;
      if (direct && from && loaded && !reduced()) {
        const to=poseAt(next,next?1:0);
        const crossesAir=from.z>Math.log(40)||to.z>Math.log(40);
        flight={from,to,started:performance.now(),duration:crossesAir?1650:1000,wide:crossesAir?Math.log(1.8):null};
        material=next;
        progress=next?1:0;
        frame=requestAnimationFrame(tick);
      } else plan();
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
      let source: Asset = image;
      if (edge) {
        const surface = feather(image, edge, key === 'grille');
        surfaces.push(surface);
        source = surface;
      }
      // Immutable decoded sources avoid re-uploading mutable canvas textures each frame.
      if (typeof createImageBitmap === 'function') {
        try {
          const bitmap = await createImageBitmap(source);
          if (disposed) { bitmap.close(); return; }
          bitmaps.push(bitmap);
          source = bitmap;
        } catch { /* Keep the decoded image fallback on unsupported browsers. */ }
      }
      assets[key] = source;
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
      for (const bitmap of bitmaps) bitmap.close();
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
