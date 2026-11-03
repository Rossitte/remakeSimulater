import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { LifeResult } from '../models/LifeResult';
import { clamp } from '../utils/random';

export interface ScoreResult {
  score: number;
  label: string;
}

/**
 * 人生评分 0-100。
 *
 * 各分项满分加起来约等于 100，所以满分只有在「样样都顶配」时才可能拿到，
 * 90 以上天然稀有；同时把基准分抬起来，让一次普通、体面的一生能落在 55-65。
 * （旧版权重加起来只有 92，中位分 41，导致绝大多数人一抽就是「坎坷/悲惨」。）
 */
export function computeScore(birth: BirthInfo, person: Person, life: LifeResult, regrets: string[]): ScoreResult {
  // 寿命 0-20
  const longevity = clamp(Math.round((life.age / 78) * 20), 0, 20);

  // 财富 0-20
  const fa = life.finalAssets;
  let wealthPts: number;
  if (fa >= 8_000_000) wealthPts = 20;
  else if (fa >= 3_000_000) wealthPts = 18;
  else if (fa >= 1_000_000) wealthPts = 16;
  else if (fa >= 300_000) wealthPts = 12;
  else if (fa >= 100_000) wealthPts = 8;
  else if (fa >= 30_000) wealthPts = 4;
  else wealthPts = 1;

  // 事业 0-15
  const careerPts = Math.round((life.highestPrestige / 100) * 15);

  // 家庭 0-15
  let familyPts = life.marriage.everMarried ? 11 : 5;
  familyPts += Math.min(5, life.children);
  if (life.marriage.everMarried && life.marriage.count >= 2) familyPts -= 2;
  familyPts = clamp(familyPts, 0, 15);

  // 健康 0-9（基于实际经历而非静态属性）
  let healthPts = Math.round((person.attributes.health / 100) * 9);
  if (life.hadMajorIllness) healthPts -= 4;
  if (life.hadAccident) healthPts -= 2;
  if (life.age < 40) healthPts -= 4;
  else if (life.age < 60) healthPts -= 2;
  healthPts = clamp(healthPts, 0, 9);

  // 幸运 0-10
  const luckPts = clamp(Math.round((person.attributes.luck / 100) * 9 + Math.min(2, life.luckyEvents)), 0, 10);

  // 社会 0-4
  const socialPts = Math.round((person.attributes.socialConnection / 100) * 4);

  // 遗憾 0 ~ -3
  const regretPenalty = Math.min(3, regrets.length);

  // 出身加成 ±3
  const birthBonus = clamp(
    (birth.family.economicScore - 50) * 0.05 + (birth.country.economicLevel - 50) * 0.05,
    -3,
    3,
  );

  let score = Math.round(
    clamp(longevity + wealthPts + careerPts + familyPts + healthPts + luckPts + socialPts - regretPenalty + birthBonus + 15, 1, 100),
  );

  // 不同死亡方式的保底上限
  if (life.deathType === 'infant') score = Math.min(score, 8);
  else if (life.deathType === 'childhood') score = Math.min(score, 14);
  else if (life.deathType === 'war') score = Math.min(score, 32);
  else if (life.deathType === 'disaster') score = Math.min(score, 36);
  else if (life.deathType === 'crime') score = Math.min(score, 40);

  let label: string;
  if (score >= 93) label = '传奇人生';
  else if (score >= 85) label = '成功人生';
  else if (score >= 76) label = '幸福人生';
  else if (score >= 66) label = '普通人生';
  else if (score >= 50) label = '平凡人生';
  else if (score >= 34) label = '坎坷人生';
  else if (score >= 18) label = '悲惨人生';
  else label = '极度不幸';

  return { score, label };
}
