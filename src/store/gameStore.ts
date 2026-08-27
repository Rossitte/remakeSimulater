import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LifeRecord } from '../models/LifeRecord';
import {
  loadLives,
  saveLives,
  clearLives as clearStorageLives,
  loadAchievements,
  saveAchievements,
  clearAchievements as clearStorageAchievements,
} from '../utils/storage';
import { formatLifespan } from '../utils/format';
import type { AchievementDef } from '../data/achievements';
import {
  checkAchievements,
  backfillAggregateAchievements,
  computeAchievementStats,
} from '../engine/achievementEngine';

export interface GameStats {
  count: number;
  bestScore: number;
  longest: number;
  /** 最短人生的展示文本（如 “3 天” / “1 岁”） */
  shortestLabel: string;
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  byRarity: { common: number; rare: number; epic: number; legendary: number };
}

export interface GameStore {
  lives: LifeRecord[];
  stats: GameStats;
  // 成就
  unlockedAchievementIds: Set<string>;
  achievementStats: AchievementStats;
  /** 最新一次生成人生后「新解锁」的成就（供 Toast 展示，消费后需清空） */
  pendingUnlocks: AchievementDef[];
  /** 清空待展示的新成就解锁提示（展示完毕后调用） */
  dismissPendingUnlocks: () => void;
  // 动作
  addLife: (record: LifeRecord) => void;
  clearHistory: () => void;
  clearAllAchievements: () => void;
}

/** 全局游戏状态（基于 localStorage 持久化） */
export function useGameStore(): GameStore {
  const [lives, setLives] = useState<LifeRecord[]>(() => loadLives());
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(() => new Set(loadAchievements()));
  const [pendingUnlocks, setPendingUnlocks] = useState<AchievementDef[]>([]);

  // 首次挂载：补跑累计型成就（以防存档升级 / 成就池扩充时遗留未解锁）
  useEffect(() => {
    const all = loadLives();
    if (all.length === 0) return;
    const ids = loadAchievements();
    const { newlyUnlocked, allUnlockedIds } = backfillAggregateAchievements(all, ids);
    if (newlyUnlocked.length > 0) {
      setUnlockedIds(allUnlockedIds);
      saveAchievements(Array.from(allUnlockedIds));
    }
    // 首次补漏不弹 Toast，避免老用户一进页面被刷屏
  }, []);

  const dismissPendingUnlocks = useCallback(() => setPendingUnlocks([]), []);

  const addLife = useCallback((record: LifeRecord) => {
    setLives((prev) => {
      const nextLives = [record, ...prev].slice(0, 300);
      saveLives(nextLives);

      // 基于当前最新存档 + 最新 record 跑成就判定
      setUnlockedIds((prevIds) => {
        const { newlyUnlocked, allUnlockedIds } = checkAchievements(record, nextLives, prevIds);
        // 写回存档
        if (newlyUnlocked.length > 0) {
          saveAchievements(Array.from(allUnlockedIds));
          // 触发 Toast
          setPendingUnlocks((p) => [...newlyUnlocked, ...p].slice(0, 6));
        }
        return allUnlockedIds;
      });

      return nextLives;
    });
  }, []);

  const clearHistory = useCallback(() => {
    clearStorageLives();
    setLives([]);
    // 不清空成就——解锁过的成就永久保留（符合常规游戏体验）
  }, []);

  const clearAllAchievements = useCallback(() => {
    clearStorageAchievements();
    setUnlockedIds(new Set());
    setPendingUnlocks([]);
  }, []);

  const stats = useMemo<GameStats>(() => {
    if (lives.length === 0) {
      return { count: 0, bestScore: 0, longest: 0, shortestLabel: '—' };
    }
    const bestScore = Math.max(...lives.map((l) => l.score));
    const longest = Math.max(...lives.map((l) => l.lifeResult.age));
    let shortestLabel = '';
    let shortestKey = Infinity;
    for (const l of lives) {
      const { age, lifespanDays } = l.lifeResult;
      const key = age <= 0 ? lifespanDays : age;
      if (key < shortestKey) {
        shortestKey = key;
        shortestLabel = formatLifespan(age, lifespanDays);
      }
    }
    return { count: lives.length, bestScore, longest, shortestLabel };
  }, [lives]);

  const achievementStats = useMemo<AchievementStats>(
    () => computeAchievementStats(unlockedIds),
    [unlockedIds],
  );

  return {
    lives,
    stats,
    unlockedAchievementIds: unlockedIds,
    achievementStats,
    pendingUnlocks,
    dismissPendingUnlocks,
    addLife,
    clearHistory,
    clearAllAchievements,
  };
}
