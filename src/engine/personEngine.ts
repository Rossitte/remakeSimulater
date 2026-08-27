import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { CheatEffect } from '../data/cheatCards';
import { clamp, gaussian, randomFloat } from '../utils/random';

/** 根据出生信息生成隐藏人物属性（可选传入作弊效果） */
export function generatePerson(birth: BirthInfo, effect: CheatEffect = {}): Person {
  const { country, family, gender } = birth;
  const famScore = family.economicScore;

  // 扰动系数：每个人有 ±20% 的随机偏差（部分属性可达 ±30%）
  const perturb = (strength = 0.2) => randomFloat(-strength, strength);
  const bigPerturb = () => randomFloat(-0.3, 0.3);

  // 生成基础属性
  let health       = clamp(Math.round((55 + (country.healthcareLevel - 50) * 0.35 + family.healthLevel * 0.15 + gaussian(0, 14)) * (1 + perturb())), 1, 99);
  let intelligence = clamp(Math.round((50 + gaussian(0, 18) + (country.educationLevel - 50) * 0.12 + (famScore - 50) * 0.06) * (1 + perturb())), 1, 99);
  let appearance   = clamp(Math.round((50 + gaussian(0, 20) + family.healthLevel * 0.08) * (1 + perturb())), 1, 99);
  let strength     = clamp(Math.round((50 + gaussian(0, 18) + (gender === '男' ? 6 : -4)) * (1 + perturb())), 1, 99);
  let mental       = clamp(Math.round((50 + gaussian(0, 18) + family.stability * 0.15) * (1 + perturb())), 1, 99);
  let charisma     = clamp(Math.round((50 + gaussian(0, 18) + appearance * 0.12 + mental * 0.05) * (1 + perturb())), 1, 99);
  let luck         = clamp(Math.round((50 + gaussian(0, 20)) * (1 + bigPerturb())), 1, 99);
  let stamina      = clamp(Math.round(52 + gaussian(0, 16) + (health - 50) * 0.1), 1, 99);
  let immunity     = clamp(Math.round(55 + gaussian(0, 16) + (health - 50) * 0.1), 1, 99);
  let willpower    = clamp(Math.round(50 + gaussian(0, 18) + (mental - 50) * 0.12), 1, 99);
  let socialConnection = clamp(Math.round((charisma * 0.4 + famScore * 0.2 + gaussian(0, 15)) * (1 + perturb(0.25))), 1, 99);
  let education    = clamp(Math.round(intelligence * 0.4 + (country.educationLevel - 50) * 0.4 + (famScore - 50) * 0.3 + gaussian(0, 15)), 0, 100);

  // ---------- 应用作弊效果 ----------
  const floor = effect.attrsFloor ?? {};
  const delta = effect.attrsDelta ?? {};
  const apply = (v: number, key: string, extraMin?: number, extraMax?: number) => {
    let out = v;
    const f = Math.max(extraMin ?? 0, (floor[key] ?? 0) + (floor[toOldKey(key)] ?? 0));
    if (f > 0) out = Math.max(f, out);
    out = out + (delta[key] ?? 0) + (delta[toOldKey(key)] ?? 0);
    const mx = extraMax ?? 100;
    if (mx < 100) out = Math.min(mx, out);
    return clamp(Math.round(out), 1, 99);
  };

  health       = apply(health, 'health', effect.healthMin, effect.healthMax);
  intelligence = apply(intelligence, 'intelligence', effect.intelligenceMin, effect.intelligenceMax);
  appearance   = apply(appearance, 'appearance', effect.appearanceMin, effect.appearanceMax);
  charisma     = apply(charisma, 'charisma', effect.charismaMin);
  strength     = apply(strength, 'strength');
  mental       = apply(mental, 'mental');
  stamina      = apply(stamina, 'stamina');
  immunity     = apply(immunity, 'immunity');
  willpower    = apply(willpower, 'willpower');
  socialConnection = apply(socialConnection, 'socialConnection');
  education    = clamp(Math.round(education + (delta.education ?? 0)), Math.max(0, (floor.education ?? 0)), 100);

  // 运气偏移
  luck = clamp(Math.round(luck + (effect.luckDelta ?? 0)), 1, 99);

  // 财富（基数不受影响，家庭经济已经由 birthEngine 改了）
  const wealth = Math.max(200, (famScore / 100) * (0.4 + country.economicLevel / 100) * 80000 * (0.5 + Math.random()));

  const diseaseRisk = clamp(Math.round((100 - health) * 0.7 + (100 - country.healthcareLevel) * 0.3 + gaussian(0, 5)), 1, 99);
  const accidentRisk = clamp(Math.round((100 - country.safetyLevel) * 0.4 + (100 - luck) * 0.3 + gaussian(0, 8)), 1, 99);
  const crimeRisk = clamp(Math.round((100 - country.safetyLevel) * 0.5 + (100 - family.stability) * 0.2 + gaussian(0, 8)), 1, 99);
  const addictionRisk = clamp(Math.round((100 - mental) * 0.5 + (100 - family.stability) * 0.2 + gaussian(0, 10)), 1, 99);

  // 职业与财富潜力加入随机扰动
  const careerPotential = clamp(Math.round((intelligence * 0.3 + education * 0.25 + socialConnection * 0.2 + luck * 0.15 + (country.economicLevel - 50) * 0.1) * (1 + perturb())), 1, 99);
  const financialPotential = clamp(Math.round((intelligence * 0.15 + luck * 0.25 + famScore * 0.2 + (country.economicLevel - 50) * 0.15 + socialConnection * 0.1) * (1 + perturb())), 1, 99);

  return {
    attributes: {
      health,
      intelligence,
      appearance,
      strength,
      stamina,
      immunity,
      willpower,
      mental,
      charisma,
      luck,
      wealth,
      education,
      socialConnection,
    },
    risks: { diseaseRisk, accidentRisk, crimeRisk, addictionRisk },
    potential: { careerPotential, financialPotential },
  };
}

/** 兼容旧的 key 命名，允许用中英文或别名字段 */
function toOldKey(key: string): string { return key; }

/** 供其他引擎使用的随机性能分（-1 ~ 1） */
export function careerPerformance(person: Person): number {
  const { intelligence, luck } = person.attributes;
  const { careerPotential } = person.potential;
  return clamp((intelligence - 50) / 70 + (luck - 50) / 120 + (careerPotential - 50) / 180 + randomFloat(-0.3, 0.3), -1, 1);
}
