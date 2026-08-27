import { useMemo } from 'react';
import type { LifeRecord } from '../../models/LifeRecord';
import type { AchievementDef } from '../../data/achievements';
import ScoreCard from '../ScoreCard/ScoreCard';
import AchievementToast from '../AchievementToast/AchievementToast';
import AttributeRadar, { type RadarAxis, type RadarSeries } from '../AttributeRadar/AttributeRadar';
import { formatLifespan, formatMoney, formatUSD } from '../../utils/format';
import '../AttributeRadar/AttributeRadar.css';
import './LifeResult.css';

interface Props {
  record: LifeRecord;
  onAgain: () => void;
  onHome: () => void;
  achievementUnlocks?: AchievementDef[];
  onDismissAchievements?: () => void;
}

export default function LifeResult({
  record,
  onAgain,
  onHome,
  achievementUnlocks = [],
  onDismissAchievements,
}: Props) {
  const r = record.lifeResult;
  const b = record.birthInfo;
  const c = b.country;
  const p = record.person;

  // ---------- 雷达图：最终结果 vs 出生（6 维） ----------
  const finalAxes = useMemo<RadarAxis[]>(() => {
    const levelHint = (v: number) => {
      if (v >= 85) return '顶级';
      if (v >= 70) return '优秀';
      if (v >= 50) return '中等';
      if (v >= 30) return '偏下';
      return '偏弱';
    };

    // 「最终财富」从 USD 归一到 0-100
    const wealthFinal = normalizeWealth(r.finalAssets);
    // 「最终学识」根据学历给分
    const eduMap: Record<string, number> = {
      文盲: 5, 小学: 15, 初中: 30, 高中: 45, 大专: 60, 大学: 75, 硕士: 88, 博士: 98,
    };
    const eduFinal = eduMap[r.education] ?? 40;
    // 「最终声望/社会地位」
    const prestigeFinal = r.highestPrestige;
    // 「最终家庭幸福度」婚姻+子女综合
    const familyFinal = computeFamilyScore(r);
    // 「最终健康」= 初始健康 * 年龄衰减 * 大病惩罚
    const healthFinal = computeFinalHealth(p.attributes.health, r.age, r.hadMajorIllness, r.lifespanDays);
    // 「最终人缘/成就」声望+婚姻的合成
    const socialFinal = Math.max(0, Math.min(100,
      0.4 * prestigeFinal +
      0.3 * p.attributes.charisma +
      0.3 * (r.marriage.everMarried ? 80 : (r.children >= 1 ? 70 : 45)),
    ));

    return [
      { key: 'wealth', label: '💰 财富', value: wealthFinal, hint: levelHint(wealthFinal) },
      { key: 'edu', label: '🎓 学识', value: eduFinal, hint: r.education },
      { key: 'prestige', label: '🎯 声望', value: prestigeFinal, hint: levelHint(prestigeFinal) },
      { key: 'family', label: '🏡 家庭', value: familyFinal, hint: levelHint(familyFinal) },
      { key: 'health', label: '🫀 健康', value: healthFinal, hint: levelHint(healthFinal) },
      { key: 'social', label: '🤝 人缘', value: socialFinal, hint: levelHint(socialFinal) },
    ];
  }, [r, p.attributes.health, p.attributes.charisma]);

  const compareSeries = useMemo<RadarSeries[]>(() => {
    // 计算一组「初始潜力」基线作为对比：
    // 基线 = 初始属性在同一维度上的合理估算映射
    const birthBaseline: Record<string, number> = {
      wealth: Math.max(10, Math.min(100, b.family.economicScore * 0.6 + p.potential.financialPotential * 0.5)),
      edu: Math.max(10, Math.min(100, p.attributes.education * 0.75 + p.attributes.intelligence * 0.3)),
      prestige: Math.max(10, Math.min(100, p.potential.careerPotential * 0.7 + p.attributes.socialConnection * 0.3)),
      family: Math.max(15, Math.min(95, b.family.stability * 0.5 + p.attributes.mental * 0.4 + (p.attributes.charisma) * 0.2)),
      health: p.attributes.health,
      social: Math.max(10, Math.min(100, p.attributes.charisma * 0.6 + p.attributes.socialConnection * 0.5)),
    };
    return [
      {
        name: '初始潜力',
        color: '#94a3b8',
        values: birthBaseline,
        fillOpacity: 0.15,
      },
      {
        name: '人生终局',
        color: '#22d3ee',
        values: finalAxes.reduce<Record<string, number>>((acc, ax) => {
          acc[ax.key] = ax.value;
          return acc;
        }, {}),
        fillOpacity: 0.35,
      },
    ];
  }, [finalAxes, p, b.family]);

  const compareLegend = [
    { name: '初始潜力', color: '#94a3b8' },
    { name: '人生终局', color: '#22d3ee' },
  ];

  return (
    <div className="result fade-up">
      {achievementUnlocks.length > 0 && onDismissAchievements && (
        <AchievementToast unlocks={achievementUnlocks} onDismissAll={onDismissAchievements} />
      )}
      <h1 className="result-head title-serif">你的一生</h1>
      <p className="result-age">
        享年 <span className="gold">{formatLifespan(r.age, r.lifespanDays)}</span>
      </p>

      <div className="card result-card">
        <h2 className="result-card-title">出生报告</h2>
        <dl className="result-grid">
          <Row label="国家" value={`${c.flag} ${c.name}`} />
          <Row label="地区" value={b.region ?? '—'} />
          <Row label="城市" value={b.city} />
          <Row label="出生年份" value={`${b.year}年`} />
          <Row label="性别" value={b.gender === '男' ? '👦 男' : '👧 女'} />
          <Row label="家庭" value={b.family.levelDescription} />
          <Row label="家庭经济" value={b.family.economicDescription} />
          <Row label="父亲" value={b.family.father.job} />
          <Row label="母亲" value={b.family.mother.job} />
          <Row label="兄弟姐妹" value={`${b.family.childrenCount} 人`} />
        </dl>
      </div>

      <div className="card result-card">
        <h2 className="result-card-title">人生结果</h2>
        <dl className="result-grid">
          <Row label="职业" value={r.careerStages.map((s) => s.title).join(' → ') || '无业'} />
          <Row label="婚姻" value={r.marriage.everMarried ? `结婚 ${r.marriage.count} 次` : '未婚'} />
          <Row label="子女" value={`${r.children} 人`} />
          <Row label="最高学历" value={r.education} />
          <Row label="一生总收入" value={`约 ${formatMoney(r.lifetimeIncome, c)} （约${formatUSD(r.lifetimeIncome)}）`} />
          <Row label="最高资产" value={`约 ${formatMoney(r.peakAssets, c)} （约${formatUSD(r.peakAssets)}）`} />
          <Row label="最终资产" value={`约 ${formatMoney(r.finalAssets, c)} （约${formatUSD(r.finalAssets)}）`} />
          <Row label="死因" value={r.deathCause} />
        </dl>

        <div className="result-radar-wrap">
          <h3 className="radar-title">人生终局 vs 初始潜力</h3>
          <AttributeRadar axes={finalAxes} series={compareSeries} size={340} />
          <div className="radar-legend">
            {compareLegend.map((l) => (
              <span key={l.name} className="radar-legend-item">
                <span
                  className="radar-legend-swatch"
                  style={{ borderColor: l.color, background: `${l.color}33` }}
                />
                {l.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {r.majorEvents.length > 0 && (
        <div className="card result-card">
          <h2 className="result-card-title">重大人生事件</h2>
          <ul className="result-events">
            {r.majorEvents.map((e, i) => (
              <li key={i} className="result-event">
                <span className="result-event-age">{e.age}岁</span>
                <span className="result-event-title">{e.title}</span>
                <span className="result-event-desc">{e.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ScoreCard score={record.score} label={record.label} />

      <div className="card result-card">
        <h2 className="result-card-title">人生评价</h2>
        <p className="result-eval">{record.evaluation}</p>
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={onAgain}>
          再次投胎
        </button>
        <button className="btn-ghost" onClick={onHome}>
          返回首页
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="result-label">{label}</dt>
      <dd className="result-value">{value}</dd>
    </>
  );
}

/** 将 USD 资产数值近似归一到 0-100 分 */
function normalizeWealth(usd: number): number {
  // log10 压缩量级，然后线性映射
  // $100 -> 10分  $10k -> 40分  $100万 -> 75分  $5000万 -> 97分
  if (usd <= 0) return 5;
  const log = Math.log10(Math.max(1, usd)); // 0~~8
  let score = Math.round((log - 1) * 15 + 10);
  return Math.max(5, Math.min(100, score));
}

/** 根据婚姻/子女计算家庭幸福度 0-100 */
function computeFamilyScore(r: LifeRecord['lifeResult']): number {
  let s = 30; // 起步 30（独身也不会特别差）
  if (r.marriage.everMarried) {
    if (r.marriage.count === 1) s += 35; // 白首偕行加分
    else if (r.marriage.count === 2) s += 18;
    else s += 8; // 多次婚姻一般说明不顺利
  }
  // 子女加分：0~25
  const childrenBonus = Math.min(25, r.children * 8);
  s += childrenBonus;
  return Math.max(5, Math.min(100, s));
}

/** 计算最终健康分（初始健康 * 年龄衰减 * 大病惩罚） */
function computeFinalHealth(
  initialHealth: number,
  age: number,
  hadMajorIllness: boolean,
  lifespanDays: number,
): number {
  // 早夭：天数直接替代
  if (age <= 0) {
    if (lifespanDays <= 3) return 2;
    if (lifespanDays <= 30) return 8;
    return 15;
  }
  // 年龄本身的衰减（活到 70 不减分，之后每 10 年 -10，80 -10，90 -20，100 -30）
  let agePenalty = 0;
  if (age > 70) agePenalty = Math.min(30, Math.floor((age - 70) / 10) * 10 + 5);
  if (age < 40) agePenalty = -8; // 走得早可能非健康原因
  const diseasePenalty = hadMajorIllness ? 25 : 0;
  const score = initialHealth - agePenalty - diseasePenalty;
  return Math.max(0, Math.min(100, score));
}
