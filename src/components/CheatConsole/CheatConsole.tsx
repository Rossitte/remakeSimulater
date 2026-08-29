import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES } from '../../data/countries';
import {
  CARD_RARITY_META,
  CHEAT_CARD_BY_ID,
  type CheatCardDef,
} from '../../data/cheatCards';
import { drawThreeUniqueCards, mergeEffects, type CheatOptions } from '../../engine/cheatEngine';
import './CheatConsole.css';

interface Props {
  open: boolean;
  cheat: CheatOptions;
  onClose: () => void;
  onToggleCheatMode: (v: boolean) => void;
  onPickCountry: (countryId: string | undefined) => void;
  /** 一次打包激活传入的所有卡片 id（用户无法选择单张） */
  onActivateCardsPack: (ids: string[]) => void;
  onClearCards: () => void;
  /** 用户在抽卡用完或主动点击「开始投胎」后，关闭控制台并触发开始 */
  onGoStart?: () => void;
}

type FlipPhase = 'none' | 'flipping' | 'all-face-up';

const MAX_DRAWS = 3;

export default function CheatConsole({
  open,
  cheat,
  onClose,
  onToggleCheatMode,
  onPickCountry,
  onActivateCardsPack,
  onClearCards,
  onGoStart,
}: Props) {
  // 抽卡次数：每次打开控制台重置为 0，关闭后不清零（用户可以暂时关上再回来继续抽），清空卡片时清零
  const [drawCount, setDrawCount] = useState(0);
  const [drawn, setDrawn] = useState<CheatCardDef[]>([]);
  const [flipPhase, setFlipPhase] = useState<FlipPhase>('none');
  // 本次「已打包激活」的卡片 id（仅用于 UI 展示勾号）
  const [packActivatedIds, setPackActivatedIds] = useState<Set<string>>(new Set());
  // 是否刚刚自动激活过一轮（防止翻面动画还没结束重复激活）
  const [autoActivatedToken, setAutoActivatedToken] = useState(0);

  const activeCards = useMemo(
    () => cheat.activeCardIds.map((id) => CHEAT_CARD_BY_ID[id]).filter(Boolean) as CheatCardDef[],
    [cheat.activeCardIds],
  );

  const previewEffect = useMemo(() => mergeEffects(activeCards), [activeCards]);

  const drawsLeft = Math.max(0, MAX_DRAWS - drawCount);
  const countrySelected = !!cheat.preferredCountryId;

  /* ---------- 当清空卡片时，顺便重置 drawCount / packActivatedIds，用户可以重新抽 ---------- */
  useEffect(() => {
    // activeCards 从有→变空，视为用户点了清空
    if (activeCards.length === 0) {
      setDrawCount((d) => (d === 0 ? 0 : 0));
      setPackActivatedIds(new Set());
    }
  }, [activeCards.length]);

  // 每次点开面板（open:true），如果之前没有任何抽卡结果，就显示占位
  useEffect(() => {
    if (!open) return;
  }, [open]);

  const handleDraw = () => {
    if (drawsLeft <= 0) {
      onGoStart?.();
      return;
    }
    const picks = drawThreeUniqueCards({
      excludeCountryCards: countrySelected,
    });
    setDrawn(picks);
    setFlipPhase('flipping');
    setAutoActivatedToken((t) => t + 1);

    const myToken = autoActivatedToken + 1;

    // 翻面全部完成后，自动打包激活（覆盖上一次——只有最后一次抽的3张生效）
    const flipFinishMs = 1800;
    window.setTimeout(() => {
      setFlipPhase('all-face-up');
      const ids = picks.map((c) => c.id).slice(0, 3);
      // 只把 UI 激活标记设成当前这轮的 id（覆盖——不是追加）
      setPackActivatedIds(new Set(ids));
      if (ids.length > 0) {
        onActivateCardsPack(ids);
      }
      // 只有当这一轮仍未被覆盖时才递增 drawCount
      setAutoActivatedToken((t) => {
        if (t === myToken) {
          setDrawCount((d) => d + 1);
        }
        return t;
      });
    }, flipFinishMs);
  };

  const handleClear = () => {
    onClearCards();
    setDrawCount(0);
    setDrawn([]);
    setFlipPhase('none');
    setPackActivatedIds(new Set());
  };

  const selectedCountryName = useMemo(() => {
    if (!cheat.preferredCountryId) return null;
    const c = COUNTRIES.find((x) => x.id === cheat.preferredCountryId);
    return c ? `${c.flag} ${c.name}` : null;
  }, [cheat.preferredCountryId]);

  /* ---------- 覆盖冲突检测：drawn 同 3 张中，单值型字段（强制国家/强制性别/出生年份min-max）被后续卡覆盖时 ----------
     为每张卡生成 status：active | overridden（核心效果已废掉） | partial（部分被覆盖但还有效）
  */
  type SlotOverrideInfo =
    | { state: 'active' }
    | { state: 'overridden'; reason: string }
    | { state: 'partial'; warning: string };

  const slotInfos = useMemo<SlotOverrideInfo[]>(() => {
    const list = drawn;
    const out: SlotOverrideInfo[] = list.map(() => ({ state: 'active' }));
    if (list.length < 2) return out;

    // 1. 扫描 forceCountryId：找出最后一次出现的索引，之前的都标记
    const lastCountryIdx = list.reduceRight<number>((acc, c, i) => (
      acc >= 0 ? acc : (c.effect.forceCountryId ? i : acc)
    ), -1);
    for (let i = 0; i < lastCountryIdx; i++) {
      if (!list[i].effect.forceCountryId) continue;
      const finalCountry = list[lastCountryIdx].effect.forceCountryId!;
      const finalCountryCardName = list[lastCountryIdx].name;
      // 如果此卡**只有** forceCountryId（及附带的小加成），视为核心完全被覆盖
      const e = list[i].effect;
      const hasOtherEffect =
        (e.familyLevelDelta !== undefined) ||
        (e.luckDelta !== undefined) ||
        (e.parentJobWealthDelta !== undefined) ||
        (e.familyStabilityDelta !== undefined) ||
        (e.forceGender !== undefined) ||
        (e.birthYearMin !== undefined) || (e.birthYearMax !== undefined) ||
        (e.appearanceMin !== undefined) || (e.appearanceMax !== undefined) ||
        (e.intelligenceMin !== undefined) || (e.intelligenceMax !== undefined) ||
        (e.healthMin !== undefined) || (e.healthMax !== undefined) ||
        (e.charismaMin !== undefined) ||
        !!e.attrsFloor || !!e.attrsDelta || !!e.preferredRegions;
      // 简化：如果这张卡的主描述只讲 forceCountryId（名字/描述通常只含一个国家），或存在其他效果但国家是核心 → 用 partial/overridden 两级
      if (!hasOtherEffect) {
        out[i] = {
          state: 'overridden',
          reason: `强制国家效果被「${finalCountryCardName}」( ${finalCountry.toUpperCase()} ) 覆盖，本卡整体失效`,
        };
      } else {
        out[i] = {
          state: 'partial',
          warning: `⚠️ 强制国家效果已被「${finalCountryCardName}」覆盖，其他加成保留`,
        };
      }
    }

    // 2. 扫描 forceGender：同理
    const lastGenderIdx = list.reduceRight<number>((acc, c, i) => (
      acc >= 0 ? acc : (c.effect.forceGender ? i : acc)
    ), -1);
    for (let i = 0; i < lastGenderIdx; i++) {
      if (!list[i].effect.forceGender) continue;
      const finalGender = list[lastGenderIdx].effect.forceGender!;
      const finalGenderCardName = list[lastGenderIdx].name;
      const eg = list[i].effect;
      const hasOtherEffect_gender =
        (eg.familyLevelDelta !== undefined) ||
        (eg.luckDelta !== undefined) ||
        (eg.parentJobWealthDelta !== undefined) ||
        (eg.familyStabilityDelta !== undefined) ||
        (eg.forceCountryId !== undefined) ||
        (eg.birthYearMin !== undefined) || (eg.birthYearMax !== undefined) ||
        (eg.appearanceMin !== undefined) || (eg.appearanceMax !== undefined) ||
        (eg.intelligenceMin !== undefined) || (eg.intelligenceMax !== undefined) ||
        (eg.healthMin !== undefined) || (eg.healthMax !== undefined) ||
        (eg.charismaMin !== undefined) ||
        !!eg.attrsFloor || !!eg.attrsDelta || !!eg.preferredRegions;
      // 这张卡的"强制性别被覆盖"，是整体作废(overridden)还是部分作废(partial)
      const singleIfActive: SlotOverrideInfo = hasOtherEffect_gender
        ? { state: 'partial', warning: `⚠️ 强制性别已被「${finalGenderCardName}」(${finalGender})覆盖，其他加成保留` }
        : { state: 'overridden', reason: `强制性别效果被「${finalGenderCardName}」(${finalGender})覆盖，本卡整体失效` };

      const prev = out[i];
      if (prev.state === 'active') {
        out[i] = singleIfActive;
      } else if (prev.state === 'overridden') {
        if (singleIfActive.state === 'overridden') {
          out[i] = { state: 'overridden', reason: `${prev.reason}；${singleIfActive.reason}` };
        } else {
          out[i] = { state: 'partial', warning: `${prev.reason}；${singleIfActive.warning}` };
        }
      } else if (prev.state === 'partial') {
        if (singleIfActive.state === 'overridden') {
          out[i] = { state: 'partial', warning: `${prev.warning}；${singleIfActive.reason}` };
        } else {
          out[i] = { state: 'partial', warning: `${prev.warning}；${singleIfActive.warning}` };
        }
      }
    }
    return out;
  }, [drawn]);

  // 冲突汇总（顶部警告条用）
  const conflictWarning = useMemo<string | null>(() => {
    const countryCards = drawn.filter((c) => c.effect.forceCountryId);
    const genderCards = drawn.filter((c) => c.effect.forceGender);
    const parts: string[] = [];
    if (countryCards.length > 1) {
      parts.push(`${countryCards.length} 张卡都设了「强制出生国家」，仅最后一张「${countryCards[countryCards.length - 1].name}」生效`);
    }
    if (genderCards.length > 1) {
      parts.push(`${genderCards.length} 张卡都设了「强制性别」，仅最后一张「${genderCards[genderCards.length - 1].name}」生效`);
    }
    // 下拉国家 + 抽卡中还出现强制国家（理论上应该 exclude，但万一历史数据还在）
    if (cheat.preferredCountryId && countryCards.length > 0) {
      parts.push(`下拉已选「${selectedCountryName}」但抽卡仍含强制国家卡，仅抽卡中的最后一张会生效`);
    }
    return parts.length ? parts.join('；') : null;
  }, [drawn, cheat.preferredCountryId, selectedCountryName]);

  if (!open) return null;

  return (
    <div className="cheat-mask" onClick={onClose}>
      <div className="cheat-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cheat-head">
          <h2 className="cheat-title">🎩 作弊控制台</h2>
          <button className="cheat-close" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <div className="cheat-section">
          <div className="cheat-section-title">作弊开关</div>
          <label className="cheat-switch-row">
            <input
              type="checkbox"
              className="cheat-switch"
              checked={cheat.cheatMode}
              onChange={(e) => onToggleCheatMode(e.target.checked)}
            />
            <span>启用作弊模式</span>
            <span className="cheat-hint">国家选择 &amp; 抽卡才生效</span>
          </label>
        </div>

        <div className={`cheat-section ${cheat.cheatMode ? '' : 'disabled'}`}>
          <div className="cheat-section-title">选择出生国家</div>
          <div className="cheat-country-row">
            <select
              className="cheat-select"
              disabled={!cheat.cheatMode}
              value={cheat.preferredCountryId ?? ''}
              onChange={(e) => onPickCountry(e.target.value || undefined)}
            >
              <option value="">🎲 随机（不选择）</option>
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            {cheat.preferredCountryId && (
              <button
                className="cheat-btn ghost"
                onClick={() => onPickCountry(undefined)}
                disabled={!cheat.cheatMode}
              >
                清除选择
              </button>
            )}
          </div>
          {countrySelected && (
            <div className="cheat-hint" style={{ marginTop: 6 }}>
              ✅ 已选择 <strong>{selectedCountryName}</strong>；
              为了避免冲突，<strong>抽卡将不再出现「指定出生国家」类卡片</strong>。
            </div>
          )}
        </div>

        <div className={`cheat-section ${cheat.cheatMode ? '' : 'disabled'}`}>
          <div className="cheat-section-title-row">
            <div>
              <div className="cheat-section-title" style={{ marginBottom: 2 }}>
                🎴 抽卡改命
              </div>
              <div className="cheat-hint">
                共 <strong>{MAX_DRAWS}</strong> 次抽卡机会，剩余 <strong className="gold">{drawsLeft}</strong> 次。
                每次 3 张，<strong>必须一起打包带走</strong>，不满意只能重抽。
              </div>
            </div>
            <button
              className={`cheat-btn ${drawsLeft > 0 ? 'primary' : 'full'}`}
              onClick={handleDraw}
              disabled={!cheat.cheatMode}
            >
              {drawsLeft > 0
                ? `抽 3 张（第 ${drawCount + 1}/${MAX_DRAWS} 轮）`
                : '🎯 抽完了，去投胎'}
            </button>
          </div>

          <div className="cheat-card-row">
            {[0, 1, 2].map((i) => (
              <CheatCardSlot
                key={i}
                card={drawn[i]}
                flipPhase={flipPhase}
                packActivated={!!drawn[i] && packActivatedIds.has(drawn[i].id)}
                overrideInfo={slotInfos[i]}
              />
            ))}
          </div>
          {conflictWarning && flipPhase === 'all-face-up' && (
            <div className="cheat-conflict" role="alert">⚠️ {conflictWarning}</div>
          )}
          <div className="cheat-hint" style={{ textAlign: 'center', marginTop: 6 }}>
            抽到的 3 张卡会在翻面结束后自动加入激活效果。
            只有<span className="gold">最后一次抽的 3 张</span>同时生效。
            {drawsLeft === 0 && (
              <>
                <br />
                <strong className="gold">抽卡次数已用完，开始投胎吧！</strong>
              </>
            )}
          </div>

          {/* 清空按钮 + 当前效果预览（放在抽卡区下方，不再有「已激活卡片列表」） */}
          <div className="cheat-section-footer-row">
            {activeCards.length > 0 ? (
              <button className="cheat-btn danger-ghost" onClick={handleClear}>
                清空并重置抽卡机会
              </button>
            ) : (
              <span />
            )}
            {drawsLeft === 0 && (
              <button className="cheat-btn full small" onClick={onGoStart}>
                🎯 去投胎
              </button>
            )}
          </div>

          {activeCards.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="cheat-section-subtitle" style={{ marginBottom: 8 }}>
                当前生效的效果（{activeCards.length}/3）：
              </div>
              <EffectSummary effect={previewEffect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- 子组件：单张卡（翻面由父级统一驱动，不接受单张点击激活） ---------- */
function CheatCardSlot({
  card,
  flipPhase,
  packActivated,
  overrideInfo,
}: {
  card?: CheatCardDef;
  flipPhase: FlipPhase;
  packActivated: boolean;
  overrideInfo?:
    | { state: 'active' }
    | { state: 'overridden'; reason: string }
    | { state: 'partial'; warning: string };
}) {
  if (!card) {
    return <div className="cheat-card-slot placeholder">等待抽卡…</div>;
  }
  const meta = CARD_RARITY_META[card.rarity];
  const faceUp = flipPhase === 'all-face-up';
  const overridden = overrideInfo?.state === 'overridden';
  const partial    = overrideInfo?.state === 'partial';
  const showBadge = faceUp && packActivated;
  return (
    <div
      className={`cheat-card-slot ${faceUp ? 'flip-face-up' : flipPhase === 'flipping' ? 'flip-flipping' : 'flip-face-down'} ${packActivated ? 'activated' : ''} ${overridden ? 'slot-overridden' : ''} ${partial ? 'slot-partial' : ''}`}
      aria-disabled
      title={(overridden ? overrideInfo.reason : partial ? overrideInfo.warning : undefined) ?? undefined}
    >
      <div className="cheat-card-inner">
        {/* 卡背 */}
        <div className="cheat-card-face back">
          <div className="cheat-card-back-pattern">?</div>
        </div>
        {/* 卡面 */}
        <div
          className="cheat-card-face front"
          style={{ background: meta.gradient, borderColor: meta.border, color: meta.text }}
        >
          <div className="cheat-card-rarity-tag">{meta.label}</div>
          <div className="cheat-card-icon">{card.icon}</div>
          <div className="cheat-card-name">{card.name}</div>
          <div className="cheat-card-desc">{card.description}</div>
          {showBadge && !overridden && !partial && (
            <div className="cheat-card-activated">✓ 已加入效果</div>
          )}
          {showBadge && overridden && (
            <div className="cheat-card-activated override">⚠ 核心效果被覆盖</div>
          )}
          {showBadge && partial && (
            <div className="cheat-card-activated partial">~ 部分效果被覆盖</div>
          )}
          {/* overridden/partial 的卡面额外覆盖一层小字提示，说明为什么 */}
          {faceUp && overridden && (
            <div className="cheat-card-footnote">{overrideInfo.reason}</div>
          )}
          {faceUp && partial && (
            <div className="cheat-card-footnote">{overrideInfo.warning}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- 效果摘要条 ---------- */
function EffectSummary({ effect }: { effect: ReturnType<typeof mergeEffects> }) {
  const rows: string[] = [];
  const push = (label: string, value: string | number | undefined) => {
    if (value === undefined || value === null || value === '') return;
    rows.push(`${label} ${value}`);
  };
  if (effect.familyLevelDelta) push('家庭经济偏移:', (effect.familyLevelDelta > 0 ? '+' : '') + effect.familyLevelDelta + '%');
  if (effect.luckDelta) push('运气偏移:', (effect.luckDelta > 0 ? '+' : '') + effect.luckDelta);
  if (effect.parentJobWealthDelta) push('父母职业阶层:', (effect.parentJobWealthDelta > 0 ? '+' : '') + effect.parentJobWealthDelta);
  if (effect.familyStabilityDelta) push('家庭稳定性:', (effect.familyStabilityDelta > 0 ? '+' : '') + effect.familyStabilityDelta);
  if (effect.forceCountryId) {
    const rawId: string = effect.forceCountryId;
    const matched = COUNTRIES.find((c) => c.id.trim().toLowerCase() === rawId.trim().toLowerCase());
    push('强制国家:', matched ? `${matched.flag} ${matched.name}` : rawId);
  }  if (effect.forceGender) push('强制性别:', effect.forceGender);
  if (effect.birthYearMin !== undefined || effect.birthYearMax !== undefined) {
    push('出生年份范围:', `${effect.birthYearMin ?? '不限'} ~ ${effect.birthYearMax ?? '不限'}`);
  }
  if (effect.appearanceMin) push('颜值 ≥', effect.appearanceMin);
  if (effect.appearanceMax) push('颜值 ≤', effect.appearanceMax);
  if (effect.intelligenceMin) push('智力 ≥', effect.intelligenceMin);
  if (effect.intelligenceMax) push('智力 ≤', effect.intelligenceMax);
  if (effect.healthMin) push('健康 ≥', effect.healthMin);
  if (effect.healthMax) push('健康 ≤', effect.healthMax);
  if (effect.charismaMin) push('魅力 ≥', effect.charismaMin);
  if (effect.attrsDelta) {
    for (const k of Object.keys(effect.attrsDelta)) {
      const v = effect.attrsDelta[k];
      if (!v) continue;
      push(`${attrLabel(k)} 偏移:`, (v > 0 ? '+' : '') + v);
    }
  }
  if (effect.attrsFloor) {
    for (const k of Object.keys(effect.attrsFloor)) {
      const v = effect.attrsFloor[k];
      if (!v) continue;
      push(`${attrLabel(k)} 下限 ≥`, v);
    }
  }
  if (rows.length === 0) return null;
  return (
    <div className="cheat-effect-summary">
      <div className="cheat-section-subtitle">合并效果预览</div>
      <ul>
        {rows.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}

function attrLabel(k: string): string {
  return (
    {
      health: '健康', intelligence: '智力', appearance: '外貌',
      strength: '体力', stamina: '耐力', immunity: '免疫力',
      willpower: '意志力', mental: '心理', charisma: '魅力',
      luck: '运气', education: '教育', socialConnection: '人缘',
    } as Record<string, string>
  )[k] ?? k;
}
