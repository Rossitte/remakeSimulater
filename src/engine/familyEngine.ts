import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { LifeEvent, MarriageInfo } from '../models/LifeResult';
import { PROFESSIONS } from '../data/professions';
import { weightedRandom } from '../utils/weightedRandom';
import { chance, clamp, gaussian, randomInt } from '../utils/random';

export interface FamilySimResult {
  marriage: MarriageInfo;
  children: number;
  firstChildAge: number;
  events: LifeEvent[];
}

/** 自动模拟婚姻与子女 */
export function simulateFamily(birth: BirthInfo, person: Person, maxAge?: number): FamilySimResult {
  const { charisma, mental, luck } = person.attributes;
  const econ = birth.country.economicLevel;
  const year = birth.year;
  const events: LifeEvent[] = [];

  // 如果在能结婚的年龄前就去世了，直接返回单身无子女
  const MARRIAGE_MIN_AGE = 16;
  if (maxAge !== undefined && maxAge < MARRIAGE_MIN_AGE) {
    return {
      marriage: { count: 0, everMarried: false },
      children: 0,
      firstChildAge: 0,
      events: [],
    };
  }

  let marryP = 0.82;
  marryP += charisma > 60 ? 0.06 : charisma < 40 ? -0.08 : 0;
  marryP += mental < 40 ? -0.05 : 0;
  marryP += econ > 75 ? -0.05 : 0;
  marryP += year < 1960 ? 0.04 : 0;
  // 运气影响：厄运的人更难遇到合适的人
  marryP += (luck - 50) * 0.001;
  // 早逝的人结婚概率降低
  if (maxAge !== undefined && maxAge < 30) {
    marryP *= (maxAge - MARRIAGE_MIN_AGE) / (30 - MARRIAGE_MIN_AGE);
  }
  marryP = clamp(marryP, 0.05, 0.96);

  const everMarried = chance(marryP);
  const marriage: MarriageInfo = { count: 0, everMarried };

  if (everMarried) {
    let firstMarriageAge = clamp(Math.round(21 + gaussian(0, 3) + (econ - 50) * 0.02 - (charisma - 50) * 0.03), 16, 40);

    // 如果死亡年龄早于计划结婚年龄，调整或取消婚姻
    if (maxAge !== undefined && firstMarriageAge > maxAge) {
      // 尝试更早结婚
      firstMarriageAge = clamp(Math.round(maxAge - 1), 16, maxAge);
      if (firstMarriageAge < MARRIAGE_MIN_AGE) {
        return {
          marriage: { count: 0, everMarried: false },
          children: 0,
          firstChildAge: 0,
          events: [],
        };
      }
    }

    marriage.count = 1;
    marriage.firstMarriageAge = firstMarriageAge;
    const spouseJob = weightedRandom(PROFESSIONS.map((p) => ({ item: p.name, weight: 1 })));
    marriage.spouseJob = spouseJob;
    events.push({
      age: firstMarriageAge,
      type: 'marriage',
      title: '结婚',
      description: `你与一位从事${spouseJob}工作的人结为夫妻。`,
    });

    const divP = 0.1 + (100 - mental) * 0.003 + (100 - birth.family.stability) * 0.002;
    if (chance(clamp(divP, 0.03, 0.5))) {
      const divAge = firstMarriageAge + randomInt(3, 12);
      if (maxAge === undefined || divAge <= maxAge) {
        events.push({
          age: divAge,
          type: 'marriage',
          title: '离婚',
          description: '这段婚姻走到了尽头，你们最终选择了分开。',
        });
        if (chance(0.35)) {
          const secondAge = firstMarriageAge + randomInt(4, 12);
          if (maxAge === undefined || secondAge <= maxAge) {
            marriage.count += 1;
            events.push({
              age: secondAge,
              type: 'marriage',
              title: '再婚',
              description: '多年后，你遇到了新的伴侣并再次步入婚姻。',
            });
          }
        }
      }
    }
  }

  let children = 0;
  let firstChildAge = 0;
  if (everMarried) {
    const base = birth.country.birthRate < 10 ? 1 : birth.country.birthRate > 25 ? 3 : 2;
    const adjust = base + (year > 1995 ? -1 : 0) + (econ > 75 ? -1 : 0) + randomInt(-1, 1);
    children = clamp(adjust, 0, 4);
    if (children > 0) {
      let childAge = (marriage.firstMarriageAge ?? 25) + randomInt(1, 4);
      // 如果死亡年龄早于生育年龄，取消子女
      if (maxAge !== undefined && childAge > maxAge) {
        children = 0;
      } else {
        firstChildAge = childAge;
        events.push({
          age: firstChildAge,
          type: 'family',
          title: birth.gender === '男' ? '成为父亲' : '成为母亲',
          description: '你的第一个孩子出生了，生活从此有了新的牵挂。',
        });
      }
    }
  }

  return { marriage, children, firstChildAge, events };
}
