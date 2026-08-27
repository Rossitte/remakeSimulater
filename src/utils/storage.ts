import type { LifeRecord } from '../models/LifeRecord';

const STORAGE_KEY = 'reincarnation-simulator.lives';
const ACHIEVEMENT_KEY = 'reincarnation-simulator.achievements.v1';
const MAX_LIVES = 300;

export function loadLives(): LifeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LifeRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveLives(lives: LifeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lives.slice(0, MAX_LIVES)));
  } catch {
    // 存储失败时静默忽略（如隐私模式）
  }
}

export function clearLives(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ---------- 成就解锁持久化 ----------

export function loadAchievements(): string[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function saveAchievements(ids: string[]): void {
  try {
    // 去重后再写
    const deduped = Array.from(new Set(ids));
    localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(deduped));
  } catch {
    // ignore
  }
}

export function clearAchievements(): void {
  try {
    localStorage.removeItem(ACHIEVEMENT_KEY);
  } catch {
    // ignore
  }
}
