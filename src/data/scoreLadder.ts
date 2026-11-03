/**
 * 人生评分的天梯。
 *
 * CDF 是用 2 万次模拟跑出来的真实分布：CDF[s] = 「分数 ≤ s 的投胎者占比」。
 * 有了它就能给出「超过 xx% 的人」这种具体的位置感，而不是干巴巴一个分数。
 *
 * 评分逻辑一旦调整，这张表要重新跑（scripts 里保留了生成脚本）。
 */
export const SCORE_CDF: number[] = [
  0, 0, 0, 0, 0, 0, 0, 0, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 2, 2, 2, 2, 2, 2.1,
  2.2, 2.3, 2.5, 2.9, 3.4, 3.9, 4.8, 5.6, 6.5, 7.4, 8.3, 9.1, 14.2, 14.7, 15.3, 15.9, 16.5, 17, 17.8, 18.8,
  20.3, 21.4, 22.7, 24.1, 25.9, 27.8, 29.9, 32.1, 34.6, 37.4, 40.1, 43.1, 46.1, 49.1, 52.2, 55.1, 58.4, 61.3, 64.3,
  66.9, 69.5, 71.8, 73.9, 75.9, 77.9, 79.5, 81.1, 82.6, 83.9, 85, 86.1, 87.2, 88.1, 89.2, 90.1, 90.9, 91.6, 92.3, 93.2, 93.9,
  94.5, 95, 95.5, 96.1, 96.6, 97.1, 97.6, 98, 98.4, 98.6, 98.9, 99.1, 99.3, 99.5, 99.6, 99.7, 99.8, 99.9, 99.9, 100, 100,
];

export type LifeRarity = 'N' | 'R' | 'SR' | 'SSR';

export interface RarityTier {
  key: LifeRarity;
  /** 达到该分即算这一档 */
  min: number;
  label: string;
  color: string;
  /** 卡片边框/光晕用色 */
  glow: string;
  /** 一句话描述这一档的感觉 */
  tagline: string;
}

/** 分档阈值按真实分布切，保证 SSR 是真的稀有（约 1.6%） */
export const RARITY_TIERS: RarityTier[] = [
  { key: 'SSR', min: 90, label: 'SSR', color: '#f0d488', glow: 'rgba(240, 212, 136, 0.55)', tagline: '万中无一' },
  { key: 'SR', min: 78, label: 'SR', color: '#c4b5fd', glow: 'rgba(196, 181, 253, 0.45)', tagline: '百里挑一' },
  { key: 'R', min: 62, label: 'R', color: '#7dd3fc', glow: 'rgba(125, 211, 252, 0.40)', tagline: '过得不错' },
  { key: 'N', min: 0, label: 'N', color: '#9ca3af', glow: 'rgba(156, 163, 175, 0.30)', tagline: '众生常态' },
];

/** 分数 → 落在哪一档 */
export function rarityOf(score: number): RarityTier {
  for (const tier of RARITY_TIERS) {
    if (score >= tier.min) return tier;
  }
  return RARITY_TIERS[RARITY_TIERS.length - 1];
}

/** 这一档命中的概率（%），由 CDF 反推 */
export function rarityChance(tier: RarityTier): number {
  const upper = scoreAtLeast(tier.min);
  const index = RARITY_TIERS.indexOf(tier);
  const next = index > 0 ? RARITY_TIERS[index - 1] : null;
  const lower = next ? scoreAtLeast(next.min) : 0;
  return Math.round((upper - lower) * 10) / 10;
}

/** 分数 ≥ min 的占比（%） */
function scoreAtLeast(min: number): number {
  if (min <= 0) return 100;
  const below = SCORE_CDF[Math.min(SCORE_CDF.length - 1, Math.max(0, min - 1))] ?? 0;
  return 100 - below;
}

/** 「超过 xx% 的投胎者」里的 xx */
export function percentileOf(score: number): number {
  const clamped = Math.min(SCORE_CDF.length - 1, Math.max(0, Math.round(score)));
  const pct = SCORE_CDF[clamped] ?? 0;
  // 49.1 这种小数没意义，取整；但别显示 0% 或 100%
  return Math.min(99, Math.max(1, Math.round(pct)));
}

/** 概率文案，例如「1.6%」 */
export function rarityChanceLabel(tier: RarityTier): string {
  const p = rarityChance(tier);
  return p < 1 ? p.toFixed(2) + '%' : p.toFixed(1) + '%';
}
