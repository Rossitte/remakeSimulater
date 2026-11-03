import type { DeathCauseEntry } from '../data/deathCauses';
import {
  OCCUPATIONAL_HAZARDS,
  getProfessionIdByName,
} from '../data/deathCauses';
import { weightedRandom } from '../utils/weightedRandom';
import { chance } from '../utils/random';

/** 按年龄 / 性别筛掉不适用的死因 */
function filterByCase(pool: DeathCauseEntry[], age: number, gender: '男' | '女'): DeathCauseEntry[] {
  const list = pool.filter((d) => {
    if (d.minAge !== undefined && age < d.minAge) return false;
    if (d.maxAge !== undefined && age > d.maxAge) return false;
    if (d.gender && d.gender !== gender) return false;
    return true;
  });
  return list.length > 0 ? list : pool;
}

/** 从死因池里按权重抽一条 */
export function pickDeathCause(
  pool: DeathCauseEntry[],
  age: number,
  gender: '男' | '女',
): DeathCauseEntry {
  const list = filterByCase(pool, age, gender);
  return weightedRandom(list.map((item) => ({ item, weight: Math.max(0.01, item.weight) })));
}

export interface RefinedDeath {
  cause: string;
  title: string;
  description: string;
}

/**
 * 职业伤害死因改写。
 *
 * 前提是「这个人已经因 accident / illness 死亡」，
 * 这里只是把死因描述替换成与职业相符的具体场景（电工触电、矿工瓦斯爆炸……），
 * 所以不会改变整体的死亡概率分布，只改变说法。
 */
export function refineOccupationalDeath(
  deathType: string,
  professionName: string,
  probabilityScale = 1,
): RefinedDeath | null {
  if (!professionName) return null;

  const id = getProfessionIdByName(professionName);
  if (!id) return null;

  for (const hazard of OCCUPATIONAL_HAZARDS) {
    if (hazard.professionIds.indexOf(id) === -1) continue;
    if (hazard.deathTypes.indexOf(deathType as 'accident' | 'illness' | 'crime' | 'war') === -1) continue;

    if (!chance(hazard.probability * probabilityScale)) return null;

    const picked = weightedRandom(hazard.deaths.map((item) => ({ item, weight: 1 })));
    return { cause: picked.cause, title: picked.title, description: picked.description };
  }

  return null;
}
