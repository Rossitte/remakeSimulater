import type { LifeRecord } from '../models/LifeRecord';
import { ACHIEVEMENTS, type AchievementDef } from '../data/achievements';

export interface AchievementUnlockResult {
  /** 这次检查后「新解锁」的成就 ID 列表（按稀有度从高到低排序） */
  newlyUnlocked: AchievementDef[];
  /** 当前所有已解锁的成就 ID 集合 */
  allUnlockedIds: Set<string>;
}

/**
 * 检查成就。
 * @param record      — 当前新生成的人生记录（用于单局判定型成就）
 * @param allRecords  — 全部历史记录（含最新这条，用于累计型成就）
 * @param already     — 已经解锁过的成就 ID（避免重复报解锁）
 */
export function checkAchievements(
  record: LifeRecord,
  allRecords: LifeRecord[],
  already: Set<string> | string[],
): AchievementUnlockResult {
  const alreadySet = already instanceof Set ? already : new Set(already);
  const newlyUnlocked: AchievementDef[] = [];
  const allUnlockedIds = new Set(alreadySet);

  for (const def of ACHIEVEMENTS) {
    if (allUnlockedIds.has(def.id)) continue;

    let ok = false;
    try {
      if (def.checkAggregate) ok = def.checkAggregate(allRecords);
      else if (def.check) ok = def.check(record);
    } catch {
      // 判定函数异常时静默跳过，避免影响游戏流程
      ok = false;
    }

    if (ok) {
      newlyUnlocked.push(def);
      allUnlockedIds.add(def.id);
    }
  }

  // 按稀有度排序：legendary → epic → rare → common
  const rarityRank = { legendary: 0, epic: 1, rare: 2, common: 3 };
  newlyUnlocked.sort((a, b) => rarityRank[a.rarity] - rarityRank[b.rarity]);

  return { newlyUnlocked, allUnlockedIds };
}

/** 仅基于累计历史刷新统计类成就（首次加载存档时补判定用） */
export function backfillAggregateAchievements(
  allRecords: LifeRecord[],
  already: Set<string> | string[],
): { newlyUnlocked: AchievementDef[]; allUnlockedIds: Set<string> } {
  const alreadySet = already instanceof Set ? already : new Set(already);
  const newlyUnlocked: AchievementDef[] = [];
  const allUnlockedIds = new Set(alreadySet);

  for (const def of ACHIEVEMENTS) {
    if (allUnlockedIds.has(def.id)) continue;
    if (!def.checkAggregate) continue;
    try {
      if (def.checkAggregate(allRecords)) {
        newlyUnlocked.push(def);
        allUnlockedIds.add(def.id);
      }
    } catch {
      // ignore
    }
  }

  const rarityRank = { legendary: 0, epic: 1, rare: 2, common: 3 };
  newlyUnlocked.sort((a, b) => rarityRank[a.rarity] - rarityRank[b.rarity]);

  return { newlyUnlocked, allUnlockedIds };
}

/** 计算某用户已解锁成就数量和各稀有度分布 */
export function computeAchievementStats(unlockedIds: Iterable<string>) {
  const set = new Set(unlockedIds);
  let common = 0, rare = 0, epic = 0, legendary = 0;
  for (const def of ACHIEVEMENTS) {
    if (!set.has(def.id)) continue;
    if (def.rarity === 'common') common++;
    else if (def.rarity === 'rare') rare++;
    else if (def.rarity === 'epic') epic++;
    else if (def.rarity === 'legendary') legendary++;
  }
  return {
    total: ACHIEVEMENTS.length,
    unlocked: common + rare + epic + legendary,
    byRarity: { common, rare, epic, legendary },
  };
}
