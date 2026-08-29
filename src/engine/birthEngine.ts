import type { BirthInfo, FamilyInfo, FamilyLevel, ParentInfo } from '../models/BirthInfo';
import type { City, Country } from '../data/countries';
import { COUNTRIES } from '../data/countries';
import { weightedRandom } from '../utils/weightedRandom';
import { chance, clamp, gaussian, lerp, randomInt } from '../utils/random';
import type { CheatEffect } from '../data/cheatCards';

interface FamilyLevelDef {
  level: FamilyLevel;
  description: string;
  economicScore: number;
  weightPoor: number;
  weightRich: number;
}

const FAMILY_LEVELS: FamilyLevelDef[] = [
  { level: '极度贫困', description: '极度贫困家庭', economicScore: 5, weightPoor: 22, weightRich: 1 },
  { level: '贫困', description: '贫困家庭', economicScore: 15, weightPoor: 30, weightRich: 3 },
  { level: '普通', description: '普通家庭', economicScore: 32, weightPoor: 28, weightRich: 10 },
  { level: '中产', description: '中产阶级', economicScore: 55, weightPoor: 14, weightRich: 30 },
  { level: '富裕', description: '富裕家庭', economicScore: 75, weightPoor: 4, weightRich: 34 },
  { level: '非常富裕', description: '非常富裕家庭', economicScore: 88, weightPoor: 1, weightRich: 14 },
  { level: '超级富裕', description: '超级富裕家庭', economicScore: 97, weightPoor: 0.2, weightRich: 5 },
];

/** 生成一次完整的出生信息（可选传入作弊效果） */
export function generateBirthInfo(effect: CheatEffect = {}, preferredCountryId?: string): BirthInfo {
  const country = pickCountry(effect, preferredCountryId);
  const { region, city } = pickRegionAndCity(country);
  const year = pickBirthYear(effect);
  let gender: '男' | '女' = chance(0.5) ? '男' : '女';
  if (effect.forceGender === '男') gender = '男';
  else if (effect.forceGender === '女') gender = '女';
  const family = generateFamily(country, year, effect);
  return { countryId: country.id, country, region, city, year, gender, family };
}

/** 按人口 × 出生率加权随机出生国家（支持作弊 forceCountryId / 用户指定国家） */
function pickCountry(effect: CheatEffect, preferredCountryId?: string): Country {
  // 优先级：effect.forceCountryId（卡片） >  preferredCountryId（用户在面板选的） > 正常加权
  const forced = effect.forceCountryId ?? preferredCountryId;
  if (forced) {
        // 注意：CHEAT_CARDS 里 forceCountryId 写成了大写 ISO 代码（KR/UA/GB…），而 COUNTRIES.id 全部是小写（kr/ua/gb…）
    // 这里统一按「忽略大小写 + trim」匹配，避免任何一方的书写风格不一致导致作弊失效
    const key = forced.trim().toLowerCase();
    const direct = COUNTRIES.find((c) => c.id.trim().toLowerCase() === key);
    if (direct) return direct;
  }
  return weightedRandom(
    COUNTRIES.map((c) => ({ item: c, weight: c.population * c.birthRate })),
  );
}

interface RegionGroup {
  name: string;
  population: number;
  cities: City[];
}

/** 先按地区人口加权选地区，再在地区内按城市人口加权选城市 */
function pickRegionAndCity(country: Country): { region: string; city: string } {
  const groups = new Map<string, RegionGroup>();
  for (const c of country.cities) {
    const regionName = c.region || '全国';
    let g = groups.get(regionName);
    if (!g) {
      g = { name: regionName, population: 0, cities: [] };
      groups.set(regionName, g);
    }
    g.population += c.population;
    g.cities.push(c);
  }
  const region = weightedRandom([...groups.values()].map((g) => ({ item: g, weight: g.population })));
  const city = weightedRandom(region.cities.map((c) => ({ item: c.name, weight: c.population })));
  return { region: region.name, city };
}

/** 出生年份：近年权重更高（因为近年人口基数更大），支持作弊效果 clamp 范围 */
function pickBirthYear(effect: CheatEffect): number {
  const decades = [
    { item: 1945, weight: 2 },
    { item: 1955, weight: 3 },
    { item: 1965, weight: 4 },
    { item: 1975, weight: 5 },
    { item: 1985, weight: 6 },
    { item: 1995, weight: 7 },
    { item: 2005, weight: 8 },
    { item: 2015, weight: 8 },
  ];
  const minY = effect.birthYearMin ?? 1940;
  const maxY = effect.birthYearMax ?? 2024;
  // 若强制区间很窄，则直接在区间内均匀采样
  if (maxY - minY < 10) {
    return randomInt(minY, maxY);
  }
  for (let attempt = 0; attempt < 10; attempt++) {
    const start = weightedRandom(decades);
    const y = start + randomInt(0, 9);
    if (y >= minY && y <= maxY) return y;
  }
  return randomInt(minY, maxY);
}

function generateFamily(country: Country, year: number, effect: CheatEffect): FamilyInfo {
  const t = clamp(country.economicLevel / 100, 0, 1);
  // 作弊：familyLevelDelta ±%  —— 把 poor↔rich 的 t 向富裕侧 (+100) 或贫困侧 (-100) 偏移
  const deltaT = effect.familyLevelDelta !== undefined
    ? clamp(effect.familyLevelDelta / 100, -0.95, 0.95)
    : 0;
  const tAdjusted = clamp(t + deltaT, 0.01, 0.99);

  const levelDef = weightedRandom(
    FAMILY_LEVELS.map((f) => ({
      item: f,
      weight: Math.max(0.01, lerp(f.weightPoor, f.weightRich, tAdjusted)),
    })),
  );

  const stabilityRaw = 60
    + gaussian(0, 15)
    + (levelDef.economicScore - 50) * 0.1
    + (country.safetyLevel - 50) * 0.1
    + (effect.familyStabilityDelta ?? 0);
  const stability = clamp(Math.round(stabilityRaw), 10, 98);
  const healthLevel = clamp(Math.round(60 + gaussian(0, 14) + (country.healthcareLevel - 50) * 0.15), 15, 98);

  const jobPool = jobsForFamily(levelDef, country, effect.parentJobWealthDelta ?? 0);
  const father = makeParent(jobPool, '男', year);
  const mother = makeParent(jobPool, '女', year, levelDef);

  const siblings = clamp(
    Math.round(2 + (50 - country.educationLevel) * 0.02 + (year < 1985 ? 1 : 0) + randomInt(-1, 1) - levelDef.economicScore * 0.01),
    0,
    6,
  );

  return {
    level: levelDef.level,
    levelDescription: levelDef.description,
    economicScore: levelDef.economicScore,
    economicDescription: describeEconomy(levelDef.economicScore),
    stability,
    healthLevel,
    father,
    mother,
    childrenCount: siblings,
  };
}

function describeEconomy(score: number): string {
  if (score >= 90) return '极其优渥';
  if (score >= 75) return '富裕';
  if (score >= 60) return '中等偏上';
  if (score >= 40) return '中等水平';
  if (score >= 25) return '紧巴巴';
  return '非常拮据';
}

function jobsForFamily(def: FamilyLevelDef, country: Country, parentWealthDelta = 0): string[] {
  // cheat: parentJobWealthDelta -20~40 → 相当于在原基础上调整经济分数的等价偏移
  const s = clamp(def.economicScore + parentWealthDelta, 0, 100);
  const pool: string[] = [];
  if (s >= 78) {
    pool.push('企业家', '企业高管', '医生', '律师', '金融从业者', '大学教师', '科研人员');
  } else if (s >= 55) {
    pool.push('公务员', '医生', '小学教师', '企业员工', '中层管理者', '金融从业者', '个体经营者');
  } else if (s >= 32) {
    pool.push('工厂工人', '司机', '服务员', '企业员工', '个体经营者', '厨师');
  } else {
    pool.push('农民', '建筑工人', '服务员', '快递员', '工厂工人');
  }
  if (country.economicLevel >= 70) {
    pool.push('程序员', '护士', '自由职业者');
  }
  return [...new Set(pool)];
}

function makeParent(jobPool: string[], gender: '男' | '女', year: number, family?: FamilyLevelDef): ParentInfo {
  const job = weightedRandom(jobPool.map((j) => ({ item: j, weight: 1 })));
  const age = randomInt(22, 40) + (year < 1970 ? 2 : 0) - (gender === '女' ? 2 : 0);
  const isHomemaker =
    gender === '女' &&
    family !== undefined &&
    family.economicScore >= 40 &&
    (year < 1985 ? chance(0.4) : chance(0.12));
  return {
    age,
    job: isHomemaker ? '家庭主妇' : job,
    education: educationForJob(job),
  };
}

function educationForJob(job: string): string {
  if (['医生', '律师', '大学教师', '科研人员', '金融从业者'].includes(job)) return '大学及以上';
  if (['公务员', '小学教师', '中层管理者', '程序员', '护士', '企业高管'].includes(job)) return '大学';
  if (['企业员工', '厨师', '个体经营者'].includes(job)) return '高中';
  return '初中及以下';
}
