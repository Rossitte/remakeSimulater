import { useMemo } from 'react';
import './AttributeRadar.css';

export interface RadarAxis {
  key: string;
  label: string;
  /** 0 ~ 100 之间的数值 */
  value: number;
  /** 补充展示的小标签（如等级文案 / 单位） */
  hint?: string;
}

export interface RadarSeries {
  name: string;
  /** 0 ~ 100 */
  values: Record<string, number>;
  color: string;
  /** 填充颜色（半透明），不传就按 color 自动推导 */
  fillOpacity?: number;
}

interface Props {
  /** 轴定义（最多 8 个，推荐 5~7 个视觉效果最好） */
  axes: RadarAxis[];
  series: RadarSeries[];
  /** SVG 绘制尺寸（正方形，默认 360） */
  size?: number;
  /** 背景分圈数（默认 5 圈） */
  levels?: number;
  /** 中心留出的半径比例，0~0.3，默认 0.08 */
  innerRatio?: number;
  /** 是否显示数值标签（默认 true） */
  showValue?: boolean;
  className?: string;
}

/**
 * 纯 SVG 绘制的雷达图组件，无第三方依赖。
 * 支持单系列 / 多系列叠加（双系列对比场景最常用）。
 */
export default function AttributeRadar({
  axes,
  series,
  size = 360,
  levels = 5,
  innerRatio = 0.08,
  showValue = true,
  className = '',
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  // 图形区域半径，外圈留 24px 给轴标签
  const outerR = Math.max(40, size / 2 - 28);
  const innerR = Math.max(4, outerR * Math.min(0.3, Math.max(0, innerRatio)));
  const n = axes.length;

  // 每个轴的角度（从上=12点钟方向顺时针分布）
  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  /** 按 0~1 的比例 r 在轴 i 上取点 */
  const pointAt = (i: number, ratio: number): [number, number] => {
    const r = innerR + (outerR - innerR) * Math.max(0, Math.min(1, ratio));
    const a = angleFor(i);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };

  // 背景正多边形网格（每个 level 一个）
  const gridPolygons = useMemo(() => {
    const arr: { points: string; level: number }[] = [];
    for (let lv = 0; lv < levels; lv++) {
      const ratio = (lv + 1) / levels;
      const pts: string[] = [];
      for (let i = 0; i < n; i++) {
        const [x, y] = pointAt(i, ratio);
        pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
      }
      arr.push({ points: pts.join(' '), level: lv + 1 });
    }
    return arr;
  }, [levels, n, cx, cy, outerR, innerR]); // eslint-disable-line react-hooks/exhaustive-deps

  // 每个轴的从内到外连线（蜘蛛网线）
  const axisLines = useMemo(() => {
    return axes.map((_, i) => {
      const [inX, inY] = pointAt(i, 0);
      const [outX, outY] = pointAt(i, 1);
      return { x1: inX, y1: inY, x2: outX, y2: outY };
    });
  }, [axes.length, cx, cy, outerR, innerR]); // eslint-disable-line react-hooks/exhaustive-deps

  // 轴外标签位置（放在 outerR + 18 处）
  const axisLabels = useMemo(() => {
    return axes.map((ax, i) => {
      const a = angleFor(i);
      const r = outerR + 18;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      // 根据角度确定 text-anchor 与对齐偏移
      const cosA = Math.cos(a);
      let anchor: 'start' | 'middle' | 'end' = 'middle';
      if (cosA > 0.3) anchor = 'start';
      else if (cosA < -0.3) anchor = 'end';
      // 垂直微调：上/下
      let dy = '0.35em';
      if (Math.sin(a) < -0.5) dy = '-0.2em';
      else if (Math.sin(a) > 0.5) dy = '1em';
      return { x, y, anchor, dy, axis: ax };
    });
  }, [axes, cx, cy, outerR]); // eslint-disable-line react-hooks/exhaustive-deps

  // 每个系列的多边形 points 字符串 + 每个点的坐标
  const seriesPolygons = useMemo(() => {
    return series.map((s) => {
      const pts: string[] = [];
      const dots: { x: number; y: number; axis: RadarAxis; value: number }[] = [];
      for (let i = 0; i < n; i++) {
        const ax = axes[i];
        const v = s.values[ax.key] ?? 0;
        const ratio = v / 100;
        const [x, y] = pointAt(i, ratio);
        pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
        dots.push({ x, y, axis: ax, value: Math.max(0, Math.min(100, v)) });
      }
      return { series: s, points: pts.join(' '), dots };
    });
  }, [series, axes, n, cx, cy, outerR, innerR]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`attribute-radar ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="radar-svg">
        <defs>
          {series.map((s, idx) => (
            <radialGradient
              key={`grad-${idx}-${s.name}`}
              id={`radar-grad-${idx}-${s.name.replace(/[^a-zA-Z0-9]/g, '')}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity={(s.fillOpacity ?? 0.35) * 0.5} />
              <stop offset="100%" stopColor={s.color} stopOpacity={s.fillOpacity ?? 0.35} />
            </radialGradient>
          ))}
        </defs>

        {/* 背景分圈 */}
        <g className="radar-grid">
          {gridPolygons.map((g, i) => (
            <polygon
              key={i}
              points={g.points}
              className={`radar-grid-level ${i === gridPolygons.length - 1 ? 'outer' : ''}`}
            />
          ))}
        </g>

        {/* 蜘蛛网线 */}
        <g className="radar-axis-lines">
          {axisLines.map((ln, i) => (
            <line
              key={i}
              x1={ln.x1}
              y1={ln.y1}
              x2={ln.x2}
              y2={ln.y2}
              className="radar-axis-line"
            />
          ))}
        </g>

        {/* 系列多边形（后放的在上层） */}
        <g className="radar-series">
          {seriesPolygons.map((sp, idx) => (
            <g key={`series-${idx}-${sp.series.name}`} className="radar-series-item">
              <polygon
                className="radar-fill"
                points={sp.points}
                style={{
                  fill: `url(#radar-grad-${idx}-${sp.series.name.replace(/[^a-zA-Z0-9]/g, '')})`,
                  stroke: sp.series.color,
                }}
              />
            </g>
          ))}
          {/* 描边单独画一遍，避免多系列填充盖住彼此的描边 */}
          {seriesPolygons.map((sp, idx) => (
            <polygon
              key={`stroke-${idx}-${sp.series.name}`}
              className="radar-stroke"
              points={sp.points}
              style={{ stroke: sp.series.color }}
            />
          ))}
          {/* 顶点圆点 */}
          {seriesPolygons.flatMap((sp, idx) =>
            sp.dots.map((d, di) => (
              <circle
                key={`dot-${idx}-${di}`}
                cx={d.x}
                cy={d.y}
                r={3.2}
                className="radar-dot"
                style={{ fill: sp.series.color, stroke: '#0B1220' }}
              />
            )),
          )}
        </g>

        {/* 中心参考点 */}
        <circle cx={cx} cy={cy} r={2} className="radar-center" />

        {/* 轴标签 */}
        <g className="radar-axis-labels">
          {axisLabels.map((lbl, i) => (
            <g key={i}>
              <text
                x={lbl.x}
                y={lbl.y}
                textAnchor={lbl.anchor}
                dominantBaseline="middle"
                dy={lbl.dy}
                className="radar-axis-label"
              >
                {lbl.axis.label}
              </text>
              {showValue && (
                <text
                  x={lbl.x}
                  y={lbl.y}
                  textAnchor={lbl.anchor}
                  dominantBaseline="middle"
                  dy={
                    Math.sin(angleFor(i)) < -0.5
                      ? '1.1em'
                      : Math.sin(angleFor(i)) > 0.5
                      ? '-0.8em'
                      : '1.5em'
                  }
                  className="radar-axis-value"
                >
                  {Math.round(lbl.axis.value)}
                  {lbl.axis.hint ? ` · ${lbl.axis.hint}` : ''}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
