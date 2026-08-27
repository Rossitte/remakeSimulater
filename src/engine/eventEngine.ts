import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { LifeEvent } from '../models/LifeResult';
import { SOCIAL_EVENTS, WEALTH_EVENTS, type EventTemplate } from '../data/events';
import { weightedRandom } from '../utils/weightedRandom';
import { chance, randomFloat, randomInt } from '../utils/random';

/** 根据年龄、性别、家庭背景筛选并加权事件 */
function pickTemplate(pool: EventTemplate[], age: number, birth: BirthInfo, scale = 1): EventTemplate | null {
  const famScore = birth.family.economicScore;
  const econLevel = birth.country.economicLevel;
  const gender = birth.gender;
  const currentYear = birth.year + age;

  const eligible = pool.filter((t) => {
    if (age < t.minAge || age > t.maxAge) return false;
    if (t.gender && t.gender !== gender) return false;
    // 年份合理性检查：事件发生年份必须 >= minYear
    if (t.minYear && currentYear < t.minYear) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  const scored = eligible.map((t) => {
    let w = t.weight * scale;

    // 家庭经济条件约束
    if (t.minFamScore && famScore < t.minFamScore) {
      w *= 0.2;
    }
    if (t.maxFamScore && famScore > t.maxFamScore) {
      w *= 0.2;
    }

    // 国家经济条件约束
    if (t.minEconLevel && econLevel < t.minEconLevel) {
      w *= 0.3;
    }

    return { item: t, weight: Math.max(0.01, w) };
  });

  return weightedRandom(scored);
}

/** 采样社交 / 生活类随机事件 */
export function sampleSocialEvent(age: number, birth: BirthInfo, _person: Person): LifeEvent | null {
  // 概率随年龄变化：青少年和中年事件密度更高
  let prob = 0.045;
  if (age >= 13 && age <= 22) prob = 0.065;
  else if (age >= 25 && age <= 45) prob = 0.055;
  else if (age >= 55) prob = 0.04;

  if (!chance(prob)) return null;
  const t = pickTemplate(SOCIAL_EVENTS, age, birth);
  if (!t) return null;
  return { age, type: t.type, title: t.title, description: t.description };
}

export interface WealthEventResult {
  event: LifeEvent;
  /** 资产变化量（USD，可正可负） */
  delta: number;
}

/** 采样财富类随机事件 */
export function sampleWealthEvent(age: number, birth: BirthInfo, assets: number): WealthEventResult | null {
  if (!chance(0.05)) return null;
  const t = pickTemplate(WEALTH_EVENTS, age, birth);
  if (!t) return null;
  const famFactor = 0.3 + birth.family.economicScore / 120;

  switch (t.id) {
    case 'lottery': {
      const amount = randomInt(3, 90) * 10000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta: amount };
    }
    case 'inherit': {
      const amount = randomInt(2, 40) * 10000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta: amount };
    }
    case 'investWin': {
      const delta = Math.max(1000 * famFactor, assets * randomFloat(0.05, 0.2));
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'investLose': {
      const delta = -assets * randomFloat(0.05, 0.2);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'fraud': {
      const delta = -Math.min(assets * randomFloat(0.05, 0.3), randomInt(2, 15) * 10000);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'business_opp': {
      const delta = Math.max(2000 * famFactor, assets * randomFloat(0.08, 0.25));
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'stock_crash': {
      const delta = -assets * randomFloat(0.1, 0.35);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'realestate_win': {
      const delta = assets * randomFloat(0.05, 0.15);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'side_hustle': {
      const delta = randomInt(5, 30) * 1000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'bankruptcy': {
      const delta = -assets * randomFloat(0.3, 0.6);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'insurance_payout': {
      const delta = randomInt(5, 50) * 1000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'crypto_swing_ev':
    case 'crypto_crash_ev': {
      const positive = t.id === 'crypto_swing_ev';
      const delta = (positive ? 1 : -1) * assets * randomFloat(0.1, 0.3) * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'angel_invest': {
      const delta = -Math.min(assets * randomFloat(0.1, 0.3), randomInt(10, 50) * 10000);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'tax_audit': {
      const delta = -Math.min(assets * randomFloat(0.05, 0.15), randomInt(2, 20) * 10000);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'bonus_ev': {
      const delta = randomInt(5, 30) * 1000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'severance': {
      const delta = randomInt(10, 50) * 1000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'debt_forgive': {
      const delta = randomInt(10, 50) * 1000;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'crowdfund': {
      const delta = randomInt(5, 30) * 1000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'inherit_early': {
      const delta = randomInt(10, 60) * 10000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'royalty': {
      const delta = randomInt(2, 15) * 1000 * famFactor;
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'gamble_win': {
      const delta = Math.min(assets * randomFloat(0.05, 0.2), randomInt(5, 30) * 1000);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    case 'gamble_lose': {
      const delta = -Math.min(assets * randomFloat(0.1, 0.4), randomInt(5, 30) * 1000);
      return { event: { age, type: t.type, title: t.title, description: t.description }, delta };
    }
    default:
      return null;
  }
}
