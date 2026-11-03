import { useMemo, useState } from 'react';
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
  // hover / 首点 后显示「多点我几次试试？」的小提示
  const [tipVisible, setTipVisible] = useState(false);
  const [tipAutoHideTimer, setTipAutoHideTimer] = useState<number | null>(null);

  const showTipBriefly = () => {
    setTipVisible(true);
    if (tipAutoHideTimer !== null) window.clearTimeout(tipAutoHideTimer);
    const t = window.setTimeout(() => setTipVisible(false), 2500);
    setTipAutoHideTimer(t);
  };

  // 连点 3 次打开作弊控制台——注意 handler 必须通过 useMemo 稳定化，
  // 否则每次重渲染都会创建新的 withThreeTap 内部 count（计数就归零了）
  const handleStatsTap = useMemo(
    () => withThreeTap(() => setCheatOpen(true)),
    [],
  );

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

      <button className="btn-primary home-start" onClick={onStart}>
        开始投胎
      </button>

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

      {/* 作弊入口：底部悬浮胶囊，连点 3 次打开 */}
      <div className="cheat-fab-wrap">
        <button
          className={`cheat-fab ${cheat.cheatMode ? 'enabled' : ''}`}
          onClick={() => {
            showTipBriefly();
            handleStatsTap();
          }}
          onMouseEnter={() => setTipVisible(true)}
          onMouseLeave={() => setTipVisible(false)}
          aria-label="作弊控制台入口"
        >
          <span className="cheat-fab-icon">{cheat.cheatMode ? '🎩' : '🎲'}</span>
          <span className="cheat-fab-text">
            {cheat.cheatMode ? '作弊已开启' : '作弊改命'}
          </span>
        </button>
        {tipVisible && (
          <div className="cheat-fab-tip" role="tooltip">
            连点 3 次打开作弊控制台
            <span className="cheat-fab-tip-arrow" />
          </div>
        )}
      </div>
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

/** 连点 3 次就触发的「隐秘入口」包装器，2.5 秒内计数归零。 */
function withThreeTap(fn: () => void) {
  let count = 0;
  let timer: number | null = null;
  return function onClick() {
    count += 1;
    if (timer !== null) window.clearTimeout(timer);
    timer = window.setTimeout(() => { count = 0; timer = null; }, 2500);
    if (count >= 3) {
      count = 0;
      if (timer !== null) { window.clearTimeout(timer); timer = null; }
      fn();
    }
  };
}
