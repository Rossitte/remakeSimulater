import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { LifeEvent } from '../models/LifeResult';
import { chance, clamp, gaussian, randomInt } from '../utils/random';

export interface HealthResult {
  age: number;
  lifespanDays: number;
  deathCause: string;
  deathType: 'natural' | 'illness' | 'accident' | 'infant' | 'childhood' | 'war' | 'disaster' | 'crime';
  events: LifeEvent[];
}

const ILLNESSES = ['癌症', '心脏病', '中风', '严重肺炎', '肝硬化', '肾病'];

const WAR_DEATHS = ['炮弹袭击', '枪战死', '空袭遇难', '地雷爆炸', '武装冲突', '化学武器', '围困饿死', '人质遇难'];
const TRAFFIC_DEATHS = ['车祸身亡', '交通事故', '酒驾事故', '摩托车事故', '行人被撞', '大巴翻车'];
const ACCIDENT_DEATHS = ['意外坠楼', '溺水事故', '火灾遇难', '触电身亡', '雪崩掩埋', '建筑物倒塌', '窒息身亡', '中毒身亡', '高处坠落', '工业事故'];
const DISASTER_DEATHS = ['地震遇难', '海啸吞没', '火山喷发', '泥石流掩埋', '飓风袭击', '龙卷风', '洪水淹没'];
const CRIME_DEATHS = ['凶杀案', '抢劫遇害', '绑架撕票', '恐怖袭击', '帮派火并'];

/** 根据年龄获取战争死亡基础概率系数 */
function warAgeFactor(age: number): number {
  if (age < 5) return 0.3;
  if (age < 15) return 0.6;
  if (age < 45) return 1.0;
  if (age < 65) return 0.7;
  return 0.4;
}

/** 根据国家安全等级获取犯罪死亡概率系数 */
function crimeFactor(safetyLevel: number): number {
  return (100 - safetyLevel) / 100;
}

/** 自动模拟健康轨迹与死亡 */
export function simulateHealth(birth: BirthInfo, person: Person, _retireAge: number): HealthResult {
  const { health, luck } = person.attributes;
  const { diseaseRisk, accidentRisk } = person.risks;
  const events: LifeEvent[] = [];

  const country = birth.country;
  const warLevel = country.warLevel;
  const safetyLevel = country.safetyLevel;

  // 婴儿期夭折
  const infantRate = (0.012 * (110 - country.healthcareLevel)) / 60;
  if (chance(infantRate)) {
    const days = randomInt(1, 300);
    return { age: 0, lifespanDays: days, deathCause: '早产夭折', deathType: 'infant', events: [] };
  }

  // 战争婴儿死亡（战乱国家婴儿死亡率更高）
  if (warLevel > 40) {
    const warInfantRate = (warLevel - 40) / 800;
    if (chance(warInfantRate)) {
      const days = randomInt(1, 365);
      return {
        age: 0,
        lifespanDays: days,
        deathCause: '战乱中因缺乏医疗夭折',
        deathType: 'infant',
        events: [],
      };
    }
  }

  // 童年夭折
  const childRate = (0.008 * (110 - country.healthcareLevel)) / 60;
  if (chance(childRate)) {
    const age = randomInt(1, 12);
    const days = age * 365 + randomInt(0, 364);
    return {
      age,
      lifespanDays: days,
      deathCause: '童年时的一场疾病',
      deathType: 'childhood',
      events: [{
        age,
        type: 'health',
        title: '病重',
        description: '一场疾病在童年时夺走了你的生命。',
      }],
    };
  }

  // 计算预期寿命
  let age = Math.round(country.lifeExpectancy + (health - 50) * 0.18 + gaussian(0, 9));
  age = clamp(age, 8, 110);

  let deathType: HealthResult['deathType'] = 'natural';
  let deathCause = '寿终正寝';

  // ===== 战争死亡判定（战乱国家）=====
  if (warLevel > 30) {
    const warBaseRate = warLevel / 2500;

    for (let y = 3; y < Math.min(age, 65); y++) {
      const yearlyRate = warBaseRate * warAgeFactor(y);

      // 战乱高峰期概率翻倍
      const warPeakBonus = warLevel > 60 ? 1.5 : 1.0;

      if (chance(yearlyRate * warPeakBonus)) {
        const cause = WAR_DEATHS[randomInt(0, WAR_DEATHS.length - 1)];

        const warEvents: LifeEvent[] = [{
          age: y,
          type: 'accident',
          title: '战乱遇难',
          description: `在战乱中，你的生命被${cause}夺走。`,
        }];

        // 如果年龄较大，可能先有长期战乱经历
        if (y > 15 && chance(0.4)) {
          warEvents.unshift({
            age: Math.max(5, y - randomInt(2, 10)),
            type: 'social',
            title: '战乱流离',
            description: '你在战乱中被迫流离失所，生活困顿不堪。',
          });
        }

        return {
          age: y,
          lifespanDays: y * 365 + randomInt(0, 364),
          deathCause: cause,
          deathType: 'war',
          events: warEvents,
        };
      }
    }
  }

  // ===== 犯罪/凶杀死亡判定 =====
  if (deathType === 'natural') {
    const crimeRate = crimeFactor(safetyLevel) / 3000;
    for (let y = 10; y < age; y++) {
      if (chance(crimeRate * (y >= 18 && y <= 55 ? 1.5 : 0.5))) {
        if (chance(0.7)) {
          const cause = CRIME_DEATHS[randomInt(0, CRIME_DEATHS.length - 1)];
          age = y;
          deathType = 'crime';
          deathCause = cause;
          events.push({
            age: y,
            type: 'accident',
            title: '遭遇不测',
            description: `你不幸成为了${cause}的受害者。`,
          });
          break;
        } else {
          events.push({
            age: y,
            type: 'accident',
            title: '治安事件',
            description: '你遭遇了治安事件，所幸躲过一劫。',
          });
        }
      }
    }
  }

  // ===== 重大疾病 =====
  if (deathType === 'natural') {
    let illAge = -1;
    for (let y = 38; y < age && y < 92; y++) {
      if (chance(diseaseRisk / 2400)) {
        illAge = y;
        break;
      }
    }

    if (illAge > 0) {
      const illness = ILLNESSES[randomInt(0, ILLNESSES.length - 1)];
      events.push({
        age: illAge,
        type: 'health',
        title: `确诊${illness}`,
        description: `${illness}的阴影笼罩了你，你开始了漫长的治疗。`,
      });

      const survived = chance(0.3 + health / 170 + luck / 350);
      if (survived) {
        events.push({
          age: illAge + randomInt(1, 3),
          type: 'health',
          title: '战胜病魔',
          description: '经过治疗，你终于康复了，但身体大不如前。',
        });
        age = Math.min(age - randomInt(2, 8), illAge + randomInt(15, 35));
      } else {
        age = illAge + randomInt(0, 3);
        deathType = 'illness';
        deathCause = illness;
      }
    }
  }

  // ===== 非自然死亡判定（车祸/意外/灾难）=====
  if (deathType === 'natural') {
    // 1. 交通事故死亡
    const trafficRate = accidentRisk / 5000;
    for (let y = 12; y < age; y++) {
      // 年轻驾驶员风险更高
      const ageRisk = y >= 16 && y <= 40 ? 1.8 : 0.6;
      if (chance(trafficRate * ageRisk)) {
        if (chance(0.35)) {
          const cause = TRAFFIC_DEATHS[randomInt(0, TRAFFIC_DEATHS.length - 1)];
          age = y;
          deathType = 'accident';
          deathCause = cause;
          events.push({
            age: y,
            type: 'accident',
            title: '车祸遇难',
            description: `一场${cause}夺走了你的生命。`,
          });
          break;
        } else {
          events.push({
            age: y,
            type: 'accident',
            title: '交通事故',
            description: '你经历了一场交通事故，侥幸活了下来。',
          });
        }
      }
    }
  }

  if (deathType === 'natural') {
    // 2. 其他意外死亡
    const accidentRate = accidentRisk / 4000;
    for (let y = 5; y < age; y++) {
      // 意外在各年龄段都可能发生
      const ageRisk =
        y < 5 ? 1.5 :
        y < 18 ? 1.0 :
        y < 65 ? 0.8 :
        1.5;

      if (chance(accidentRate * ageRisk)) {
        if (chance(0.3)) {
          const cause = ACCIDENT_DEATHS[randomInt(0, ACCIDENT_DEATHS.length - 1)];
          age = y;
          deathType = 'accident';
          deathCause = cause;
          events.push({
            age: y,
            type: 'accident',
            title: '意外离世',
            description: `一场${cause}夺走了你的生命。`,
          });
          break;
        } else {
          events.push({
            age: y,
            type: 'accident',
            title: '遭遇事故',
            description: '你经历了一场事故，所幸大难不死。',
          });
        }
      }
    }
  }

  if (deathType === 'natural') {
    // 3. 自然灾害死亡（概率较低，但可能发生）
    const disasterRate = 1 / 15000;
    if (chance(disasterRate)) {
      const cause = DISASTER_DEATHS[randomInt(0, DISASTER_DEATHS.length - 1)];
      const disasterAge = randomInt(5, Math.max(10, age - 5));
      age = disasterAge;
      deathType = 'disaster';
      deathCause = cause;
      events.push({
        age: disasterAge,
        type: 'accident',
        title: '天灾降临',
        description: `一场${cause}夺走了你的生命。`,
      });
    }
  }

  // 寿终正寝
  if (deathType === 'natural') {
    if (age >= 80) deathCause = '寿终正寝';
    else if (age >= 60) deathCause = '安详离世';
    else deathCause = '在睡梦中离世';
  }

  age = clamp(age, 0, 110);

  // 过滤掉所有发生在死亡年龄之后的事件
  const validEvents = events.filter(e => e.age <= age);

  const lifespanDays = age * 365 + randomInt(0, 364);

  return { age, lifespanDays, deathCause, deathType, events: validEvents };
}
