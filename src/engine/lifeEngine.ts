import type { Person } from '../models/Person';
import type { LifeEvent, LifeResult } from '../models/LifeResult';
import type { LifeRecord } from '../models/LifeRecord';
import type { EducationResult } from './educationEngine';
import type { CareerResult } from './careerEngine';
import type { FamilySimResult } from './familyEngine';
import type { HealthResult } from './healthEngine';
import type { WealthResult } from './wealthEngine';
import type { CheatEffect } from '../data/cheatCards';
import { generateBirthInfo } from './birthEngine';
import { generatePerson } from './personEngine';
import { simulateEducation } from './educationEngine';
import { simulateCareer } from './careerEngine';
import { simulateFamily } from './familyEngine';
import { simulateHealth } from './healthEngine';
import { simulateWealth } from './wealthEngine';
import { sampleSocialEvent } from './eventEngine';
import { computeScore } from './scoreEngine';
import { buildEvaluation } from './evaluationEngine';
import { chance, randomInt, uid } from '../utils/random';

export interface GenerateLifeOptions {
  /** 作弊合并后的效果 */
  cheatEffect?: CheatEffect;
  /** 用户在面板选择的国家ID */
  preferredCountryId?: string;
}

/** 生成完整的一次人生记录（可携带作弊效果） */
export function generateLife(index: number, opts: GenerateLifeOptions = {}): LifeRecord {
  const birth = generateBirthInfo(opts.cheatEffect ?? {}, opts.preferredCountryId);
  const person = generatePerson(birth, opts.cheatEffect ?? {});

  const edu = simulateEducation(birth, person);
  // 估算一个退休年龄用于健康模拟（healthEngine 的 retireAge 参数实际未使用）
  const roughRetireAge = 65;
  const health = simulateHealth(birth, person, roughRetireAge);
  const career = simulateCareer(birth, person, edu, health.age);
  const family = simulateFamily(birth, person, health.age);
  const wealth = simulateWealth(birth, person, career, family, health);

  // 逐岁采样社交类随机事件
  const socialEvents: LifeEvent[] = [];
  const triggeredIds = new Set<string>();
  for (let age = 8; age <= health.age; age++) {
    const e = sampleSocialEvent(age, birth, person);
    if (e) {
      socialEvents.push(e);
      // 蝴蝶效应：某些事件触发后记录，避免重复
      triggeredIds.add(e.title);
    }
  }

  const regrets = buildRegrets(person, edu, career, family, health, wealth);

  const allEvents: LifeEvent[] = [
    ...edu.events,
    ...career.events,
    ...family.events,
    ...wealth.events,
    ...socialEvents,
  ];

  const healthEvts = health.events.filter((e) => e.age <= health.age);
  const deathEvent = healthEvts.length > 0 ? healthEvts[healthEvts.length - 1] : null;

  const majorEvents: LifeEvent[] = [...allEvents, ...healthEvts]
    .filter((e) => e.age <= health.age)
    .sort((a, b) => {
      if (a.age !== b.age) return a.age - b.age;
      const aIsDeath = a === deathEvent;
      const bIsDeath = b === deathEvent;
      if (aIsDeath && !bIsDeath) return 1;
      if (!aIsDeath && bIsDeath) return -1;
      return 0;
    });

  const lifeResult: LifeResult = {
    birthInfo: birth,
    age: health.age,
    lifespanDays: health.lifespanDays,
    deathCause: health.deathCause,
    deathType: health.deathType,
    education: edu.level,
    careerStages: career.stages,
    mainCareer: career.mainCareer,
    highestPrestige: career.highestPrestige,
    marriage: family.marriage,
    children: family.children,
    lifetimeIncome: wealth.lifetimeIncome,
    peakAssets: wealth.peakAssets,
    finalAssets: wealth.finalAssets,
    majorEvents,
    hadMajorIllness: health.events.some((e) => e.type === 'health' && e.title.startsWith('确诊')),
    hadAccident: health.events.some((e) => e.type === 'accident'),
    luckyEvents:
      wealth.events.filter((e) => ['彩票中奖', '获得遗产', '投资大赚', '创业成功'].includes(e.title)).length +
      (person.attributes.luck >= 85 ? 1 : 0),
    regrets,
  };

  const { score, label } = computeScore(birth, person, lifeResult, regrets);
  const evaluation = buildEvaluation(lifeResult, person, score, label, regrets);

  return {
    id: uid(),
    index,
    birthInfo: birth,
    lifeResult,
    person,
    score,
    label,
    evaluation,
    createdAt: Date.now(),
  };
}

/** 根据实际人生数据计算人生遗憾 */
function buildRegrets(
  person: Person,
  edu: EducationResult,
  career: CareerResult,
  family: FamilySimResult,
  health: HealthResult,
  wealth: WealthResult,
): string[] {
  const regrets: string[] = [];
  const { intelligence, luck, charisma } = person.attributes;

  if (intelligence >= 70 && edu.levelIndex <= 3) regrets.push('没有机会接受更好的教育');
  if (health.age < 55) regrets.push('生命太过短暂');
  if (wealth.finalAssets < 10000 && person.potential.financialPotential >= 65) regrets.push('没能兑现自己的财富潜力');
  if (career.highestPrestige < 40 && person.potential.careerPotential >= 70) regrets.push('工作上的抱负没能完全实现');
  if (family.marriage.everMarried && family.children === 0 && chance(0.5)) regrets.push('膝下无子，晚年有些孤独');
  if (!family.marriage.everMarried && chance(0.5)) regrets.push('始终没能遇到相伴一生的人');

  // 新增遗憾
  if (luck <= 25) regrets.push('命运多舛，运气从未眷顾过自己');
  if (charisma >= 70 && career.highestPrestige < 50) regrets.push('空有才华却没能遇到赏识自己的人');
  if (health.events.some((e) => e.type === 'health' && e.title.startsWith('确诊'))) regrets.push('健康被病魔夺走，再也无法挽回');
  if (wealth.peakAssets > wealth.finalAssets * 5 && wealth.finalAssets < 50000) regrets.push('曾经拥有过财富，却没能守住');
  if (edu.levelIndex >= 5 && career.highestPrestige < 50) regrets.push('读了那么多书，却没能找到对口的工作');
  if (family.marriage.count > 1) regrets.push('感情的坎坷让自己伤痕累累');
  if (health.age >= 70 && !family.marriage.everMarried) regrets.push('一生未娶/未嫁，老来形单影只');
  if (person.attributes.mental < 30) regrets.push('内心始终被阴霾笼罩，没能找到真正的快乐');

  // 随机遗憾（50% 概率）
  if (chance(0.5) && regrets.length < 5) {
    const extraRegrets = [
      '没能好好陪伴家人',
      '错过了那段本该珍惜的感情',
      '年轻时太冲动，做了很多错事',
      '一直想去的远方，终究没能成行',
      '没能对父母尽到足够的孝道',
      '曾经有一个改变命运的机会，却擦肩而过',
      '没能坚持自己的梦想',
      '活得太在意别人的眼光',
      '不敢做出选择，错过了很多机会',
      '没有好好保护自己的身体',
      '被感情伤得太深，从此不敢再爱',
      '浪费了太多时间在无意义的事上',
      '没有好好教育孩子',
      '没能让父母过上好日子',
      '没有珍惜那个真心爱你的人',
      '一辈子都在为别人活，从没为自己活过',
      '胆小怕事，错过了本该属于自己的机会',
      '性格太孤僻，没有几个真心朋友',
      '太善良，被人利用了也不自知',
      '没能学会拒绝别人',
    ];
    regrets.push(extraRegrets[randomInt(0, extraRegrets.length - 1)]);
  }

  // 第二个随机遗憾（30% 概率）
  if (chance(0.3) && regrets.length < 6) {
    const secondRegrets = [
      '没能好好学一门技能',
      '没有认真谈过一次恋爱',
      '一辈子都在原地踏步',
      '没有勇气离开舒适区',
      '太容易相信别人，吃了很多亏',
      '一直没有找到人生的方向',
      '活在父母的阴影下，没能活出自我',
      '做了太多违背心意的决定',
      '没有结识真正的良师益友',
      '没能控制好自己的脾气',
      '在最该拼搏的年纪选择了安逸',
      '对孩子亏欠太多',
      '没有和兄弟姐妹好好相处',
      '没能成为自己想成为的人',
      '回头看这一生，感觉白活了',
    ];
    regrets.push(secondRegrets[randomInt(0, secondRegrets.length - 1)]);
  }

  return regrets;
}
