import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { LifeResult } from '../models/LifeResult';
import { clamp } from '../utils/random';

export interface ScoreResult {
  score: number;
  label: string;
}

/** 根据人生数据计算 0-100 人生评分与人生标签 */
export function computeScore(birth: BirthInfo, person: Person, life: LifeResult, regrets: string[]): ScoreResult {
  // 寿命 0-20
  const longevity = clamp(Math.round((life.age / 80) * 20), 0, 20);

  // 财富 0-20
  const fa = life.finalAssets;
  let wealthPts: number;
  if (fa >= 10_000_000) wealthPts = 20;
  else if (fa >= 4_000_000) wealthPts = 17;
  else if (fa >= 1_500_000) wealthPts = 14;
  else if (fa >= 600_000) wealthPts = 11;
  else if (fa >= 200_000) wealthPts = 8;
  else if (fa >= 50_000) wealthPts = 5;
  else wealthPts = 2;

  // 事业 0-15
  const careerPts = Math.round((life.highestPrestige / 100) * 15);

  // 家庭 0-15
  let familyPts = life.marriage.everMarried ? 10 : 4;
  familyPts += Math.min(4, life.children);
  if (life.marriage.everMarried && life.marriage.count >= 2) familyPts -= 2;
  familyPts = clamp(familyPts, 0, 15);

  // 健康 0-8（基于实际经历而非静态属性）
  let healthPts = Math.round((person.attributes.health / 100) * 8);
  if (life.hadMajorIllness) healthPts -= 3;
  if (life.hadAccident) healthPts -= 2;
  if (life.age < 40) healthPts -= 4;
  else if (life.age < 60) healthPts -= 2;
  healthPts = clamp(healthPts, 0, 8);

  // 幸运 0-10
  const luckPts = clamp(Math.round((person.attributes.luck / 100) * 7 + Math.min(3, life.luckyEvents)), 0, 10);

  // 社会 0-4
  const socialPts = Math.round((person.attributes.socialConnection / 100) * 4);

  // 遗憾 -0 ~ -3
  const regretPenalty = Math.min(3, regrets.length);

  // 出身加成：富裕国家 + 富裕家庭 → 评分稍高；贫困环境 → 评分稍低（±3 分内）
  const birthBonus = clamp(
    (birth.family.economicScore - 50) * 0.05 + (birth.country.economicLevel - 50) * 0.05,
    -3,
    3,
  );

  // 整体基准分上浮，避免整体评分偏低
  let score = Math.round(
    clamp(longevity + wealthPts + careerPts + familyPts + healthPts + luckPts + socialPts - regretPenalty + birthBonus + 3, 1, 100),
  );

  // 不同死亡方式的保底分数
  if (life.deathType === 'infant') score = Math.min(score, 8);
  else if (life.deathType === 'childhood') score = Math.min(score, 12);
  else if (life.deathType === 'war') score = Math.min(score, 25);
  else if (life.deathType === 'disaster') score = Math.min(score, 30);
  else if (life.deathType === 'crime') score = Math.min(score, 35);

  let label: string;
  if (score >= 90) label = '传奇人生';
  else if (score >= 80) label = '成功人生';
  else if (score >= 70) label = '幸福人生';
  else if (score >= 60) label = '普通人生';
  else if (score >= 45) label = '平凡人生';
  else if (score >= 30) label = '坎坷人生';
  else if (score >= 15) label = '悲惨人生';
  else label = '极度不幸';

  return { score, label };
}
