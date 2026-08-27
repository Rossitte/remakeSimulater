import { useEffect, useState } from 'react';
import type { AchievementDef } from '../../data/achievements';
import { RARITY_COLOR, RARITY_LABEL } from '../../data/achievements';
import './AchievementToast.css';

interface Props {
  unlocks: AchievementDef[];
  onDismissAll: () => void;
}

/** 成就解锁 Toast：按稀有度从高到低依次弹出，每个展示约 3.5s */
export default function AchievementToast({ unlocks, onDismissAll }: Props) {
  // 当前正在展示的队列索引（初始为 0，每展示完一个 +1）
  const [index, setIndex] = useState(0);

  // unlocks 变化时重置并从第一个开始
  useEffect(() => {
    if (unlocks.length > 0) setIndex(0);
  }, [unlocks]);

  // 自动切换到下一条；最后一条结束后调用 dismiss
  useEffect(() => {
    if (unlocks.length === 0) return;
    if (index >= unlocks.length) {
      onDismissAll();
      return;
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), 3500);
    return () => window.clearTimeout(t);
  }, [index, unlocks.length, onDismissAll]);

  if (unlocks.length === 0 || index >= unlocks.length) return null;

  const current = unlocks[index];
  const color = RARITY_COLOR[current.rarity];
  const remain = unlocks.length - index - 1;

  return (
    <div className="ach-toast-layer" onClick={() => setIndex((i) => i + 1)}>
      <div
        className="ach-toast"
        style={{
          background: `linear-gradient(135deg, ${color.bg} 0%, ${color.bg}dd 100%)`,
          borderColor: color.ring,
          boxShadow: `0 10px 40px -10px ${color.glow}, 0 0 0 1px ${color.ring}66`,
        }}
      >
        <div className="ach-toast-left">
          <div className="ach-toast-icon">{current.icon}</div>
        </div>
        <div className="ach-toast-body">
          <div className="ach-toast-tag" style={{ color: color.text, borderColor: color.ring }}>
            解锁成就 · {RARITY_LABEL[current.rarity]}
          </div>
          <div className="ach-toast-name" style={{ color: color.text }}>
            {current.name}
          </div>
          <div className="ach-toast-desc">{current.description}</div>
        </div>
        <div className="ach-toast-close" title="跳过">
          ×
        </div>
      </div>
      {remain > 0 && (
        <div className="ach-toast-remain">还有 {remain} 个成就解锁待查看…（点击跳过）</div>
      )}
    </div>
  );
}
