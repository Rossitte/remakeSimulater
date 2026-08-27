import { useMemo, useState } from 'react';
import {
  ACHIEVEMENTS,
  RARITY_LABEL,
  RARITY_COLOR,
  type AchievementDef,
  type Rarity,
} from '../../data/achievements';
import type { AchievementStats } from '../../store/gameStore';
import './AchievementWall.css';

type Filter = 'all' | Rarity | 'unlocked' | 'locked';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unlocked', label: '已解锁' },
  { key: 'locked', label: '未解锁' },
  { key: 'legendary', label: '传说' },
  { key: 'epic', label: '史诗' },
  { key: 'rare', label: '稀有' },
  { key: 'common', label: '普通' },
];

export interface Props {
  unlockedIds: Set<string>;
  stats: AchievementStats;
  /** 点击重置成就（长按提示，提供给上层弹窗） */
  onRequestReset?: () => void;
}

export default function AchievementWall({ unlockedIds, stats, onRequestReset }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const rarityOrder: Record<Rarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };
    const list = ACHIEVEMENTS.filter((a) => {
      const unlocked = unlockedIds.has(a.id);
      if (filter === 'unlocked') return unlocked;
      if (filter === 'locked') return !unlocked;
      if (filter === 'all') return true;
      return a.rarity === filter;
    });
    return list.sort((a, b) => {
      // 已解锁优先，然后按稀有度高→低，同稀有度按 id 稳定排序
      const ua = unlockedIds.has(a.id) ? 0 : 1;
      const ub = unlockedIds.has(b.id) ? 0 : 1;
      if (ua !== ub) return ua - ub;
      if (rarityOrder[a.rarity] !== rarityOrder[b.rarity])
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      return a.id.localeCompare(b.id);
    });
  }, [filter, unlockedIds]);

  const progressPct = stats.total === 0 ? 0 : Math.round((stats.unlocked / stats.total) * 100);

  return (
    <div className="achievement-wall">
      <div className="aw-head">
        <div className="aw-title-wrap">
          <h2 className="aw-title title-serif">🏅 成就殿堂</h2>
          <div className="aw-progress-wrap">
            <div className="aw-progress-bar">
              <div
                className="aw-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="aw-progress-text">
              解锁 <strong className="gold">{stats.unlocked}</strong> / {stats.total}
              <span className="aw-pct"> · {progressPct}%</span>
            </div>
          </div>
        </div>
        <div className="aw-rarity-summary">
          <RarityChip rarity="legendary" count={stats.byRarity.legendary} />
          <RarityChip rarity="epic" count={stats.byRarity.epic} />
          <RarityChip rarity="rare" count={stats.byRarity.rare} />
          <RarityChip rarity="common" count={stats.byRarity.common} />
          {onRequestReset && (
            <button className="aw-reset btn-link btn-danger" onClick={onRequestReset}>
              重置成就
            </button>
          )}
        </div>
      </div>

      <div className="aw-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`aw-filter ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="aw-grid">
        {filtered.map((a) => (
          <AchievementCard key={a.id} def={a} unlocked={unlockedIds.has(a.id)} />
        ))}
        {filtered.length === 0 && (
          <div className="aw-empty">这个分类下暂时没有成就。</div>
        )}
      </div>
    </div>
  );
}

function RarityChip({ rarity, count }: { rarity: Rarity; count: number }) {
  const c = RARITY_COLOR[rarity];
  return (
    <span
      className="aw-rarity-chip"
      style={{
        background: c.bg,
        color: c.text,
        borderColor: c.ring,
      }}
    >
      {RARITY_LABEL[rarity]} <strong>{count}</strong>
    </span>
  );
}

function AchievementCard({ def, unlocked }: { def: AchievementDef; unlocked: boolean }) {
  const c = RARITY_COLOR[def.rarity];
  const style = unlocked
    ? {
        background: c.bg,
        borderColor: c.ring,
        boxShadow: `0 0 24px -4px ${c.glow}, inset 0 0 0 1px ${c.ring}33`,
      }
    : undefined;

  return (
    <div
      className={`ach-card ${unlocked ? 'unlocked' : 'locked'} rarity-${def.rarity}`}
      style={style}
      title={unlocked ? `已解锁：${def.name}` : `未解锁：${def.description}`}
    >
      <div className={`ach-icon ${unlocked ? '' : 'dim'}`}>
        <span aria-hidden>{unlocked ? def.icon : '🔒'}</span>
      </div>
      <div className="ach-body">
        <div className="ach-name" style={{ color: unlocked ? c.text : '#94A3B8' }}>
          {unlocked ? def.name : '？？？'}
        </div>
        <div className="ach-rarity" style={{ color: c.text }}>
          {RARITY_LABEL[def.rarity]}
        </div>
        <div className={`ach-desc ${unlocked ? '' : 'muted'}`}>
          {unlocked ? def.description : maskDescription(def.description)}
        </div>
      </div>
    </div>
  );
}

/** 未解锁时，把描述做一半「打码」处理，更有探索感 */
function maskDescription(desc: string): string {
  if (desc.length <= 4) return '？'.repeat(desc.length);
  // 保留首尾各 2 个字符，中间替换为 ·
  const head = desc.slice(0, 2);
  const tail = desc.slice(-2);
  const mid = '·'.repeat(Math.max(desc.length - 4, 4));
  return `${head}${mid}${tail}`;
}
