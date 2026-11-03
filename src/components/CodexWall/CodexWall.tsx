import { useMemo, useState } from 'react';
import {
  CODEX_CATEGORIES,
  DEATH_CODEX,
  type CodexCategory,
} from '../../data/deathCodex';
import type { CodexStats } from '../../store/gameStore';
import './CodexWall.css';

type Filter = 'all' | 'unlocked' | 'locked' | CodexCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unlocked', label: '已解锁' },
  { key: 'locked', label: '未解锁' },
  ...CODEX_CATEGORIES.map((c) => ({ key: c.key as Filter, label: c.label })),
];

interface Props {
  unlocked: Set<string>;
  stats: CodexStats;
}

/**
 * 终章图鉴：收集「这一世是怎么走的」。
 * 未解锁的条目只露分类，不剧透具体死法。
 */
export default function CodexWall({ unlocked, stats }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const list = DEATH_CODEX.filter((entry) => {
      const isUnlocked = unlocked.has(entry.id);
      if (filter === 'unlocked') return isUnlocked;
      if (filter === 'locked') return !isUnlocked;
      if (filter === 'all') return true;
      return entry.category === filter;
    });
    const catOrder = new Map(CODEX_CATEGORIES.map((c, i) => [c.key, i]));
    return list.slice().sort((a, b) => {
      // 在「全部」里按分类成册，读起来像一本册子；
      // 在「已解锁 / 未解锁」里则把收集进度放在一起看
      if (filter === 'all') {
        const ca = catOrder.get(a.category) ?? 99;
        const cb = catOrder.get(b.category) ?? 99;
        if (ca !== cb) return ca - cb;
        return a.name.localeCompare(b.name, 'zh-CN');
      }
      const ua = unlocked.has(a.id) ? 0 : 1;
      const ub = unlocked.has(b.id) ? 0 : 1;
      if (ua !== ub) return ua - ub;
      return a.name.localeCompare(b.name, 'zh-CN');
    });
  }, [filter, unlocked]);

  const pct = stats.total === 0 ? 0 : Math.round((stats.unlocked / stats.total) * 100);

  return (
    <div className="codex">
      <div className="codex-head">
        <h2 className="codex-title title-serif">🕯️ 终章图鉴</h2>
        <div className="codex-progress">
          <div className="codex-bar">
            <div className="codex-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="codex-progress-text">
            已收集 <strong className="gold">{stats.unlocked}</strong> / {stats.total}
            <span className="codex-pct"> · {pct}%</span>
          </div>
        </div>
      </div>

      <div className="codex-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`codex-chip ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="codex-grid">
        {filtered.map((entry) => {
          const isUnlocked = unlocked.has(entry.id);
          const cat = CODEX_CATEGORIES.find((c) => c.key === entry.category);
          return (
            <div
              key={entry.id}
              className={`codex-tile ${isUnlocked ? 'on' : 'off'} codex-cat-${entry.category}`}
              title={isUnlocked ? entry.name : '还没遇到过这种终章'}
            >
              <span className="codex-icon">{cat ? cat.icon : '❓'}</span>
              <span className="codex-name">{isUnlocked ? entry.name : '？？？'}</span>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="codex-empty">这一类还没有收集到，再去投几次胎吧。</p>
      )}
    </div>
  );
}
