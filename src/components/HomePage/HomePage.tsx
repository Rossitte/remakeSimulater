import { useState } from 'react';
import type { GameStats, AchievementStats, CodexStats } from '../../store/gameStore';
import CodexWall from '../CodexWall/CodexWall';
import type { LifeRecord } from '../../models/LifeRecord';
import type { CheatOptions } from '../../engine/cheatEngine';
import LifeHistory from '../LifeHistory/LifeHistory';
import AchievementWall from '../AchievementWall/AchievementWall';
import CheatConsole from '../CheatConsole/CheatConsole';
import '../CheatConsole/CheatConsole.css';
import './HomePage.css';

interface Props {
  lives: LifeRecord[];
  stats: GameStats;
  achievementStats: AchievementStats;
  unlockedAchievementIds: Set<string>;
  codexStats: CodexStats;
  unlockedCodex: Set<string>;
  cheat: CheatOptions;
  onStart: () => void;
  onSelect: (rec: LifeRecord) => void;
  onClear: () => void;
  onResetAchievements?: () => void;
  onToggleCheatMode: (v: boolean) => void;
  onPickCountry: (countryId: string | undefined) => void;
  onActivateCards: (ids: string[]) => void;
  onClearCards: () => void;
}

type Tab = 'history' | 'achievements' | 'codex';

export default function HomePage({
  lives,
  stats,
  achievementStats,
  unlockedAchievementIds,
  codexStats,
  unlockedCodex,
  cheat,
  onStart,
  onSelect,
  onClear,
  onResetAchievements,
  onToggleCheatMode,
  onPickCountry,
  onActivateCards,
  onClearCards,
}: Props) {
  const [tab, setTab] = useState<Tab>('history');
  const [cheatOpen, setCheatOpen] = useState(false);

  return (
    <div className="home fade-up">
      <div className="home-orb" aria-hidden />

      <h1 className="home-title title-serif">投胎模拟器</h1>
      <p className="home-subtitle">
        “你
        {cheat.cheatMode ? (
          <> <span className="strike-word">无法</span> </>
        ) : (
          <>无法</>
        )}
        选择出生。”
      </p>

      <div className="start-zone">
        <button className="btn-primary home-start" onClick={onStart}>
          开始投胎
        </button>

        {/* 藏在开始按钮后面的小把手：平时只露一条边，hover 才展开；点一次直接进作弊台 */}
        <button
          type="button"
          className={`cheat-peek ${cheat.cheatMode ? 'enabled' : ''}`}
          onClick={() => setCheatOpen(true)}
          title="打开作弊控制台"
          aria-label="打开作弊控制台"
          aria-haspopup="dialog"
        >
          {/* 三道小抓痕，像抽屉把手；hover 后换成文字 */}
          <span className="cheat-peek-grip" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="cheat-peek-label">
            {cheat.cheatMode ? '作弊已开启' : '作弊改命'}
          </span>
        </button>
      </div>

      <CheatConsole
        open={cheatOpen}
        cheat={cheat}
        onClose={() => setCheatOpen(false)}
        onToggleCheatMode={onToggleCheatMode}
        onPickCountry={onPickCountry}
        onActivateCardsPack={onActivateCards}
        onClearCards={onClearCards}
        onGoStart={() => {
          setCheatOpen(false);
          // 触发开始投胎（由 HomePage 的 onStart prop 提供，通过 callback 包装）
          window.setTimeout(() => onStart(), 50);
        }}
      />

      <div className="card home-stats">
        <Stat label="已经投胎" value={`${stats.count} 次`} />
        <Stat label="最高人生评分" value={stats.count > 0 ? `${stats.bestScore}` : '—'} />
        <Stat label="最短人生" value={stats.shortestLabel} />
        <Stat label="最长人生" value={stats.count > 0 ? `${stats.longest} 岁` : '—'} />
        <Stat
          label="成就解锁"
          value={`${achievementStats.unlocked} / ${achievementStats.total}`}
        />
      </div>

      <div className="home-tabs">
        <button
          className={`home-tab ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          📜 我的历史人生
        </button>
        <button
          className={`home-tab ${tab === 'achievements' ? 'active' : ''}`}
          onClick={() => setTab('achievements')}
        >
          🏅 成就殿堂
          {achievementStats.unlocked > 0 && (
            <span className="home-tab-badge">{achievementStats.unlocked}</span>
          )}
        </button>
        <button
          className={`home-tab ${tab === 'codex' ? 'active' : ''}`}
          onClick={() => setTab('codex')}
        >
          🕯️ 终章图鉴
          {codexStats.unlocked > 0 && (
            <span className="home-tab-badge">{codexStats.unlocked}</span>
          )}
        </button>
      </div>

      {tab === 'history' && <LifeHistory lives={lives} onSelect={onSelect} onClear={onClear} />}
      {tab === 'achievements' && (
        <AchievementWall
          unlockedIds={unlockedAchievementIds}
          stats={achievementStats}
          onRequestReset={onResetAchievements}
        />
      )}
      {tab === 'codex' && <CodexWall unlocked={unlockedCodex} stats={codexStats} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="home-stat">
      <div className="home-stat-label">{label}</div>
      <div className="home-stat-value gold">{value}</div>
    </div>
  );
}
