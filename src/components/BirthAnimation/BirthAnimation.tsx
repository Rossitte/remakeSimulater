import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRIES } from '../../data/countries';
import { CONTINENTS, GRATICULE, MAP_H, MAP_W, getMarker } from '../../data/worldMap';
import { randomPick } from '../../utils/random';
import type { LifeRecord } from '../../models/LifeRecord';
import './BirthAnimation.css';

interface Props {
  record: LifeRecord;
  onComplete: () => void;
}

const BORN_PHASE = 7;

interface ZoomInfo {
  cls: string;
  icon: string;
  scope: string;
  text: string;
  done: number;
}

/** 各阶段地图放大倍率 */
const ZOOM_SCALE: Record<number, number> = { 1: 1, 2: 3.2, 3: 7.2 };

interface Transform {
  tx: number;
  ty: number;
  k: number;
}

/** 计算目标变换：让 marker 精确居中于 viewBox 中心 */
function computeTarget(countryId: string, phase: number): Transform {
  const marker = getMarker(countryId);
  const k = ZOOM_SCALE[phase] ?? 1;
  const cx = MAP_W / 2;
  const cy = MAP_H / 2;
  return {
    tx: cx - k * marker.x,
    ty: cy - k * marker.y,
    k,
  };
}

/** ease-out cubic 缓动 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * 投胎动画：国家 → 地区 → 城市
 * 使用 requestAnimationFrame 在 SVG <g> 上实现平滑 transform 过渡，
 * 确保所有浏览器中都能看到从全球缩放到目标国家的流畅动画。
 */
export default function BirthAnimation({ record, onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  const [rollFlag, setRollFlag] = useState('🌍');
  const [rollName, setRollName] = useState('地球');
  const doneRef = useRef(false);

  // 当前动画变换值（RAF 逐帧更新）
  const [animT, setAnimT] = useState<Transform>({ tx: 0, ty: 0, k: 1 });
  const animStartRef = useRef<Transform>({ tx: 0, ty: 0, k: 1 });
  const rafRef = useRef<number | undefined>(undefined);

  const b = record.birthInfo;

  // === 国家滚动 ===
  useEffect(() => {
    if (phase !== 0) return;
    let stopped = false;
    let t: number | undefined;
    let delay = 60;
    const tick = () => {
      if (stopped) return;
      const c = randomPick(COUNTRIES);
      setRollFlag(c.flag);
      setRollName(c.name);
      delay = Math.min(320, delay * 1.28);
      if (delay >= 320) {
        t = window.setTimeout(() => {
          if (!stopped) setPhase(1);
        }, 240);
        return;
      }
      t = window.setTimeout(tick, delay);
    };
    t = window.setTimeout(tick, delay);
    return () => {
      stopped = true;
      if (t) clearTimeout(t);
    };
  }, [phase]);

  // === 阶段推进 ===
  useEffect(() => {
    if (phase < 1 || phase >= BORN_PHASE) return;
    const wait = phase <= 3 ? 950 : 480;
    const t = window.setTimeout(() => setPhase((p) => p + 1), wait);
    return () => clearTimeout(t);
  }, [phase]);

  // === 出生 → 完成回调 ===
  useEffect(() => {
    if (phase !== BORN_PHASE) return;
    const t = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete();
    }, 750);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  // === 核心：RAF 动画 —— phase 变化时平滑过渡 transform ===
  useEffect(() => {
    if (phase < 1 || phase > 3) return;
    const target = computeTarget(b.countryId, phase);
    const start = { ...animStartRef.current };
    const duration = 950;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const e = easeOutCubic(t);
      const cur: Transform = {
        tx: start.tx + (target.tx - start.tx) * e,
        ty: start.ty + (target.ty - start.ty) * e,
        k: start.k + (target.k - start.k) * e,
      };
      setAnimT(cur);
      animStartRef.current = cur;
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, b.countryId]);

  const zoomInfo: ZoomInfo | null =
    phase === 1
      ? { cls: 'is-country', icon: b.country.flag, scope: '国家', text: b.country.name, done: 1 }
      : phase === 2
        ? { cls: 'is-region', icon: '🗺️', scope: '地区', text: b.region, done: 2 }
        : phase === 3
          ? { cls: 'is-city', icon: '📍', scope: '城市', text: b.city, done: 3 }
          : null;

  const mapGroupStyle = useMemo(
    () => ({
      transform: `translate(${animT.tx}px, ${animT.ty}px) scale(${animT.k})`,
      transformOrigin: '0 0',
    }),
    [animT],
  );

  const markers = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        id: c.id,
        marker: getMarker(c.id),
      })),
    [],
  );

  const ZOOM_LEVELS = ['国家', '地区', '城市'];
  const targetMarker = getMarker(b.countryId);

  return (
    <div className="birth">
      {phase === 0 ? (
        <div className="birth-rolling fade-up">
          <div className="birth-flag">{rollFlag}</div>
          <div className="birth-name">{rollName}</div>
          <p className="birth-hint">正在寻找你的出生地点……</p>
        </div>
      ) : (
        <div className="birth-reveal">
          {phase <= 3 && zoomInfo && (
            <>
              <div className={`zoom ${zoomInfo.cls}`}>
                <svg
                  viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                  className="zoom-svg"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(80,120,200,0.08)" />
                      <stop offset="100%" stopColor="rgba(20,30,60,0)" />
                    </radialGradient>
                    <filter id="markerGlow" x="-200%" y="-200%" width="400%" height="400%">
                      <feGaussianBlur stdDeviation="18" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#oceanGrad)" />

                  <g className="zoom-map-group" style={mapGroupStyle}>
                    {GRATICULE.vertical.map(([x1, y1, x2, y2], i) => (
                      <line key={`v${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="zoom-graticule" />
                    ))}
                    {GRATICULE.horizontal.map(([x1, y1, x2, y2], i) => (
                      <line key={`h${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="zoom-graticule" />
                    ))}

                    {CONTINENTS.map((d, i) => (
                      <path key={i} d={d} className="zoom-continent" />
                    ))}

                    {markers.map((m) => (
                      <circle
                        key={m.id}
                        cx={m.marker.x}
                        cy={m.marker.y}
                        r={m.id === b.countryId ? (phase >= 2 ? 12 : 9) : 2.4}
                        className={m.id === b.countryId ? 'zoom-marker target' : 'zoom-marker'}
                        filter={m.id === b.countryId && phase >= 2 ? 'url(#markerGlow)' : undefined}
                      />
                    ))}

                    <circle
                      cx={targetMarker.x}
                      cy={targetMarker.y}
                      r={phase === 1 ? 48 : phase === 2 ? 28 : 18}
                      className="zoom-marker-halo"
                    />
                    <circle
                      cx={targetMarker.x}
                      cy={targetMarker.y}
                      r={phase === 1 ? 72 : phase === 2 ? 44 : 28}
                      className="zoom-marker-halo-outer"
                    />

                    {phase === 1 && (
                      <g className="zoom-reticle">
                        <rect
                          x={targetMarker.x - 110}
                          y={targetMarker.y - 55}
                          width="220"
                          height="110"
                          rx="8"
                          className="zoom-reticle-box"
                        />
                        <line x1={targetMarker.x - 110} y1={targetMarker.y} x2={targetMarker.x - 85} y2={targetMarker.y} className="zoom-reticle-tick" />
                        <line x1={targetMarker.x + 85} y1={targetMarker.y} x2={targetMarker.x + 110} y2={targetMarker.y} className="zoom-reticle-tick" />
                        <line x1={targetMarker.x} y1={targetMarker.y - 55} x2={targetMarker.x} y2={targetMarker.y - 38} className="zoom-reticle-tick" />
                        <line x1={targetMarker.x} y1={targetMarker.y + 38} x2={targetMarker.x} y2={targetMarker.y + 55} className="zoom-reticle-tick" />
                      </g>
                    )}

                    {phase === 2 && (
                      <circle
                        cx={targetMarker.x}
                        cy={targetMarker.y}
                        r="52"
                        className="zoom-region-ring"
                      />
                    )}

                    {phase === 3 && (
                      <g className="zoom-crosshair">
                        <line x1={targetMarker.x - 80} y1={targetMarker.y} x2={targetMarker.x - 22} y2={targetMarker.y} className="zoom-crosshair-line" />
                        <line x1={targetMarker.x + 22} y1={targetMarker.y} x2={targetMarker.x + 80} y2={targetMarker.y} className="zoom-crosshair-line" />
                        <line x1={targetMarker.x} y1={targetMarker.y - 80} x2={targetMarker.x} y2={targetMarker.y - 22} className="zoom-crosshair-line" />
                        <line x1={targetMarker.x} y1={targetMarker.y + 22} x2={targetMarker.x} y2={targetMarker.y + 80} className="zoom-crosshair-line" />
                        <circle cx={targetMarker.x} cy={targetMarker.y} r="14" className="zoom-crosshair-ring" />
                      </g>
                    )}
                  </g>
                </svg>

                <div className="zoom-ring zoom-ring-1" />
                <div className="zoom-ring zoom-ring-2" />
                <div className="zoom-ring zoom-ring-3" />
                <div className="zoom-dot" />
                <div className="zoom-vignette" />
              </div>

              <div className="zoom-path">
                {ZOOM_LEVELS.map((label, i) => (
                  <Fragment key={label}>
                    {i > 0 && <span className="zoom-path-sep">›</span>}
                    <span className={i + 1 <= zoomInfo.done ? 'on' : ''}>{label}</span>
                  </Fragment>
                ))}
              </div>

              <div className="zoom-line fade-up">
                <span className="zoom-line-icon">{zoomInfo.icon}</span>
                <span className="zoom-line-scope">{zoomInfo.scope}</span>
                <span className="zoom-line-text">{zoomInfo.text}</span>
              </div>
            </>
          )}

          {phase >= 4 && <RevealLine icon="📅" text={`${b.year}年`} />}
          {phase >= 5 && <RevealLine icon={b.gender === '男' ? '👦' : '👧'} text={b.gender} />}
          {phase >= 6 && <RevealLine icon="🏠" text={b.family.levelDescription} />}
          {phase >= BORN_PHASE && <div className="birth-born title-serif gold">你出生了</div>}
        </div>
      )}
    </div>
  );
}

function RevealLine({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="birth-line fade-up">
      <span className="birth-line-icon">{icon}</span>
      <span className="birth-line-text">{text}</span>
    </div>
  );
}
