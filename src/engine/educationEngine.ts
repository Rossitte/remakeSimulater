import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { EducationLevel, LifeEvent } from '../models/LifeResult';
import { EDUCATION_LEVELS } from '../data/professions';
import { clamp, chance, randomInt } from '../utils/random';

export interface EducationResult {
  level: EducationLevel;
  levelIndex: number;
  graduateAge: number;
  events: LifeEvent[];
}

/** 各学历层次对应的毕业年龄 */
const GRAD_AGE = [0, 12, 15, 18, 21, 22, 25, 28];

/** 家庭经济水平对最低学历的强制约束 */
function minLevelForFamily(famScore: number): number {
  if (famScore >= 90) return 5; // 超级富裕：最低大学
  if (famScore >= 75) return 4; // 富裕：最低大专
  if (famScore >= 60) return 3; // 中产：最低高中
  if (famScore >= 45) return 2; // 普通：最低初中
  return 0;
}

/** 自动模拟教育经历 */
export function simulateEducation(birth: BirthInfo, person: Person): EducationResult {
  const { intelligence, luck } = person.attributes;
  const eduEnv = birth.country.educationLevel;
  const fam = birth.family.economicScore;
  const intScore = intelligence * 0.5 + eduEnv * 0.25 + fam * 0.25;

  let levelIndex: number;
  if (intScore >= 82) levelIndex = 7;
  else if (intScore >= 73) levelIndex = 6;
  else if (intScore >= 61) levelIndex = 5;
  else if (intScore >= 54) levelIndex = 4;
  else if (intScore >= 44) levelIndex = 3;
  else if (intScore >= 31) levelIndex = 2;
  else if (intScore >= 18) levelIndex = 1;
  else levelIndex = 0;

  // 强制最低学历约束：富裕家庭不可能出现低学历
  const minLevel = minLevelForFamily(fam);
  if (levelIndex < minLevel) {
    levelIndex = minLevel;
  }

  // 运气扰动：好运可能提升一级，厄运可能降低（但不低于家庭最低约束）
  if (luck >= 80 && chance(0.15)) {
    levelIndex = clamp(levelIndex + 1, minLevel, 7);
  } else if (luck <= 20 && chance(0.15)) {
    levelIndex = clamp(levelIndex - 1, minLevel, 7);
  }

  // 随机扰动：8% 概率上下浮动一级（不低于家庭最低约束）
  if (chance(0.08)) {
    levelIndex = clamp(levelIndex + randomInt(-1, 1), minLevel, 7);
  }

  const graduateAge = GRAD_AGE[levelIndex];
  const events: LifeEvent[] = [];

  if (levelIndex >= 5) {
    events.push({ age: 18, type: 'education', title: '考上大学', description: '你考上了大学，成为了全家人的骄傲。' });
  }
  if (levelIndex >= 3) {
    events.push({
      age: graduateAge,
      type: 'education',
      title: '毕业',
      description: `你完成了${EDUCATION_LEVELS[levelIndex]}教育，带着对未来的憧憬踏入社会。`,
    });
  }
  if (levelIndex <= 1) {
    events.push({
      age: Math.max(6, graduateAge - 1),
      type: 'education',
      title: '早早辍学',
      description: '由于家境或条件所限，你没能接受太多教育。',
    });
  }

  return { level: EDUCATION_LEVELS[levelIndex], levelIndex, graduateAge, events };
}
