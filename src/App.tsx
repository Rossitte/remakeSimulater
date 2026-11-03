import { useCallback, useState } from 'react';
import HomePage from './components/HomePage/HomePage';
import BirthAnimation from './components/BirthAnimation/BirthAnimation';
import LifeResult from './components/LifeResult/LifeResult';
import FeedbackDialog from './components/FeedbackDialog/FeedbackDialog';
import './components/FeedbackDialog/FeedbackDialog.css';
import { useGameStore } from './store/gameStore';
import { generateLife } from './engine/lifeEngine';
import type { LifeRecord } from './models/LifeRecord';
import {
  DEFAULT_CHEAT_OPTIONS,
  mergeEffects,
  type CheatOptions,
} from './engine/cheatEngine';
import { CHEAT_CARD_BY_ID } from './data/cheatCards';

type Screen = 'home' | 'rolling' | 'result';

export default function App() {
  const {
    lives,
    stats,
    addLife,
    clearHistory,
    achievementStats,
    unlockedAchievementIds,
    codexStats,
    unlockedCodex,
    pendingUnlocks,
    dismissPendingUnlocks,
    clearAllAchievements,
  } = useGameStore();

  const [screen, setScreen] = useState<Screen>('home');
  const [draft, setDraft] = useState<LifeRecord | null>(null);
  const [current, setCurrent] = useState<LifeRecord | null>(null);
  const [cheat, setCheat] = useState<CheatOptions>(DEFAULT_CHEAT_OPTIONS);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const onToggleCheatMode = useCallback((v: boolean) => {
    setCheat((c) => ({ ...c, cheatMode: v }));
  }, []);
  const onPickCountry = useCallback((countryId: string | undefined) => {
    setCheat((c) => ({ ...c, preferredCountryId: countryId }));
  }, []);
  const onActivateCards = useCallback((ids: string[]) => {
    // 规则：一次抽 3 张必须打包带走，且最多同时生效 3 张
    // 每次新抽卡都会**完全覆盖**之前的激活列表（只有最后一次抽卡生效）
    setCheat((c) => ({ ...c, activeCardIds: ids.slice(0, 3) }));
  }, []);
  const onClearCards = useCallback(() => {
    setCheat((c) => ({ ...c, activeCardIds: [] }));
  }, []);

  const startReincarnation = () => {
    // 开始新一轮前清掉上轮残留的成就 Toast，避免展示错位
    dismissPendingUnlocks();

    // 作弊生效：只有 cheatMode 开启时，才把选国家 + 激活卡片效果注入
    const activeCards = cheat.cheatMode
      ? cheat.activeCardIds.map((id) => CHEAT_CARD_BY_ID[id]).filter(Boolean)
      : [];
    const cheatEffect = activeCards.length > 0 ? mergeEffects(activeCards) : undefined;
    const preferredCountryId = cheat.cheatMode ? cheat.preferredCountryId : undefined;

    const rec = generateLife(lives.length + 1, { cheatEffect, preferredCountryId });
    setDraft(rec);
    setCurrent(null);
    setScreen('rolling');
  };

  const handleBirthDone = () => {
    if (!draft) return;
    addLife(draft);
    setCurrent(draft);
    setScreen('result');
  };

  const handleView = (rec: LifeRecord) => {
    // 查看历史时不展示成就解锁 Toast（只在新生成那一次展示）
    dismissPendingUnlocks();
    setCurrent(rec);
    setScreen('result');
  };

  let content: JSX.Element;

  if (screen === 'rolling' && draft) {
    content = (
      <div className="app">
        <BirthAnimation record={draft} onComplete={handleBirthDone} />
      </div>
    );
  } else if (screen === 'result' && current) {
    content = (
      <div className="app">
        <LifeResult
          record={current}
          onAgain={startReincarnation}
          onHome={() => setScreen('home')}
          achievementUnlocks={pendingUnlocks}
          onDismissAchievements={dismissPendingUnlocks}
        />
      </div>
    );
  } else {
    content = (
      <div className="app">
        <HomePage
          lives={lives}
          stats={stats}
          achievementStats={achievementStats}
          unlockedAchievementIds={unlockedAchievementIds}
          codexStats={codexStats}
          unlockedCodex={unlockedCodex}
          cheat={cheat}
          onStart={startReincarnation}
          onSelect={handleView}
          onClear={clearHistory}
          onResetAchievements={() => {
            if (window.confirm('确定要重置所有成就吗？解锁过的成就将全部消失，无法恢复。')) {
              clearAllAchievements();
            }
          }}
          onToggleCheatMode={onToggleCheatMode}
          onPickCountry={onPickCountry}
          onActivateCards={onActivateCards}
          onClearCards={onClearCards}
        />
      </div>
    );
  }

  // 每个页面底部都挂一个意见反馈入口（弹窗用 portal 渲染到 body）
  return (
    <>
      {content}
      <button
        type="button"
        className="feedback-fab"
        onClick={() => setFeedbackOpen(true)}
        title="意见反馈"
        aria-label="意见反馈"
        aria-haspopup="dialog"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4.2 3.4a.6.6 0 0 1-1-.6V5.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="10" r="1" fill="currentColor" />
          <circle cx="12" cy="10" r="1" fill="currentColor" />
          <circle cx="15.5" cy="10" r="1" fill="currentColor" />
        </svg>
        <span className="feedback-fab-label">反馈</span>
      </button>
      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
