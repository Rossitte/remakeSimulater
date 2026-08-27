import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { LifeEvent } from '../models/LifeResult';
import type { CareerResult } from './careerEngine';
import type { FamilySimResult } from './familyEngine';
import type { HealthResult } from './healthEngine';
import { sampleWealthEvent } from './eventEngine';
import { clamp, randomFloat, randomInt } from '../utils/random';

export interface WealthResult {
  lifetimeIncome: number;
  peakAssets: number;
  finalAssets: number;
  events: LifeEvent[];
}

/** 按年自动模拟财富积累 */
export function simulateWealth(
  birth: BirthInfo,
  person: Person,
  career: CareerResult,
  family: FamilySimResult,
  health: HealthResult,
): WealthResult {
  const deathAge = health.age;
  let assets = person.attributes.wealth;
  // 初始财富也要按国家经济水平校正（不然穷国家出生就有几万美元）
  const econ = birth.country.economicLevel;
  const wealthEconFactor = calcWealthEconFactor(econ);
  assets = Math.max(0, assets * wealthEconFactor);

  let peak = assets;
  let lifetimeIncome = 0;
  let windfallTotal = 0;
  const events: LifeEvent[] = [];

  const incomeAt = (age: number): number => {
    for (const s of career.stages) {
      if (age >= s.fromAge && age <= s.toAge) {
        return s.annualIncome;
      }
    }
    return 0;
  };

  // 储蓄率：发达国家(US/JP/DE ~ 85-95) 0.12~0.22，发展中国家 0.15~0.35，欠发达国家 0.25~0.45
  // （穷国家生活成本/收入的比值其实不低，但我们通过「储蓄率更高」来平衡：因为他们没那么多消费项目可花）
  const baseSave = 0.18;
  const savingRate = clamp(
    baseSave + (person.attributes.mental - 50) * 0.0035 + (econ < 55 ? 0.08 : econ > 85 ? -0.06 : 0),
    0.10,
    0.5,
  );
  // 投资回报率基础：富裕国家金融发达 + 穷国家通胀严重 → 穷国基础投资回报甚至可能为负
  // 区间（不含随机波动）：
  //   经济95：1.5%~2.5% / 经济70：0.5%~1.5% / 经济45：-1.0%~0.0% / 经济15：-3.0%~-1.0%
  const investBase = (econ - 55) / 500; // 95→0.08；70→0.03；45→-0.02；15→-0.08
  const investRetVolUpper = 0.02 + Math.max(0, (econ - 50) / 180);    // 50→0.02, 95→0.045
  const investRetVolLower = 0.03 + Math.max(0, (60 - econ) / 120);    // 60→0.03, 15→0.068
  let houseBought = false;
  const houseAge = family.marriage.everMarried
    ? (family.marriage.firstMarriageAge ?? 26) + randomInt(1, 4)
    : randomInt(28, 38);

  const illEventAge = health.events.find((e) => e.type === 'health' && e.title.startsWith('确诊'))?.age;

  for (let age = 8; age <= deathAge; age++) {
    const income = incomeAt(age);
    if (income > 0) lifetimeIncome += income;
    assets += income * savingRate;

    // 投资回报（越穷的国家金融越不稳定，尾部风险越大）
    const ret = investBase
      + randomFloat(-investRetVolLower, investRetVolUpper)
      + (person.attributes.luck > 80 ? 0.008 : 0)
      - (person.attributes.luck < 25 ? 0.012 : 0);
    if (assets > 0) {
      assets += assets * ret;
    }

    // 购房：穷国买房要消耗更多年收入倍数（房贷+首付压力更大），富国相对更轻松
    const houseIncomeMul = (econ >= 85) ? randomInt(2, 5)
                         : (econ >= 60) ? randomInt(3, 7)
                         : (econ >= 40) ? randomInt(4, 9)
                                        : randomInt(5, 12);
    if (!houseBought && age >= houseAge && income > 0 && assets > income * houseIncomeMul * 0.4) {
      const cost = income * houseIncomeMul;
      assets -= cost;
      houseBought = true;
      events.push({
        age,
        type: 'wealth',
        title: '购置房产',
        description: '你买下了属于自己的房子，从此有了一个安稳的家。',
      });
    }

    // 育儿开销：按经济水平调整占比
    const childCostRate = (econ >= 85) ? 0.12 : (econ >= 60) ? 0.10 : (econ >= 40) ? 0.08 : 0.06;
    if (family.children > 0 && age >= family.firstChildAge && age < family.firstChildAge + 20) {
      assets -= income * childCostRate * family.children;
    }

    // 结婚开销（一次性扣除）
    if (family.marriage.firstMarriageAge !== undefined && age === family.marriage.firstMarriageAge) {
      assets -= income * ((econ >= 80) ? 0.4 : (econ >= 55) ? 0.55 : 0.75);
    }

    // 重大疾病医疗开销：穷国家往往要「掏光积蓄」甚至负债
    if (illEventAge !== undefined && age === illEventAge) {
      const healthCostRate = (econ >= 85) ? 0.5 : (econ >= 55) ? 0.9 : 1.6;
      assets -= Math.max(500 * wealthEconFactor, income * healthCostRate + assets * (econ >= 60 ? 0.05 : 0.2));
    }

    // 随机财富事件（也按经济系数校正金额）
    if (age >= 18) {
      const we = sampleWealthEvent(age, birth, Math.max(0, assets));
      if (we) {
        const delta = we.delta * ((we.delta <= 0) ? Math.min(1, 1.0) : Math.min(1.6, wealthEconFactor));
        assets += delta;
        assets = Math.max(0, assets);
        if (delta > 0) windfallTotal += delta;
        events.push(we.event);
      }
    }

    peak = Math.max(peak, assets);
  }

  // 资产上限：不应出现资产远超一生总收入的不合理情况
  // - 有横财的：max(一生总收入*0.85 + 横财，一生总收入*1.15)
  // - 无横财的：最多一生总收入 * 0.9（普通工薪阶层不投资实业，很难攒出比总收入还多的钱）
  if (lifetimeIncome > 0) {
    const withWindfall = lifetimeIncome * 0.85 + windfallTotal;
    const noWindfallCap = lifetimeIncome * (econ >= 85 ? 1.0 : econ >= 55 ? 0.9 : 0.8);
    const maxAssets = Math.max(withWindfall, noWindfallCap);
    if (maxAssets > 0) {
      peak = Math.min(peak, maxAssets);
      assets = Math.min(assets, maxAssets);
    }
  }

  return {
    lifetimeIncome: Math.round(lifetimeIncome),
    peakAssets: Math.round(peak),
    finalAssets: Math.round(Math.max(0, assets)),
    events,
  };
}

/** 国家经济水平 → 初始财富/金额校正系数（越穷系数越小） */
function calcWealthEconFactor(econ: number): number {
  if (econ >= 90) return 0.9 + (econ - 90) * 0.02;           // 90~95 : 0.9~1.0
  if (econ >= 70) return 0.35 + (econ - 70) * 0.0275;         // 70~89 : 0.35~0.875
  if (econ >= 50) return 0.15 + (econ - 50) * 0.0100;         // 50~69 : 0.15~0.34
  if (econ >= 30) return 0.06 + (econ - 30) * 0.0045;         // 30~49 : 0.06~0.14
  return 0.015 + (econ - 15) * 0.0030;                        // 15~29 : 0.015~0.057
}
