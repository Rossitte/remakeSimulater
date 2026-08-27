import {
  CHEAT_CARDS,
  type CheatCardDef,
  type CheatEffect,
  type CardRarity,
} from '../data/cheatCards';

/** 作弊面板状态（只需要「持久化激活的卡片ID」和用户主动选的国家即可） */
export interface CheatOptions {
  cheatMode: boolean;
  /** 用户主动在面板选的国家ID（未选=undefined=让引擎随机） */
  preferredCountryId?: string;
  /** 用户抽卡后「已激活」的卡片 id 列表（有顺序） */
  activeCardIds: string[];
}

export const DEFAULT_CHEAT_OPTIONS: CheatOptions = {
  cheatMode: false,
  preferredCountryId: undefined,
  activeCardIds: [],
};

/* ------------------------------------------------------------------ */
/*  工具：按「每个稀有度档位独立权重」抽取 3 张不重复的卡片
    算法说明（满足「每张卡相对独立 + 不重复」的诉求）：
    1. 先计算每个 rarity 的相对出现概率（好卡档与坏卡档平衡）
    2. 抽取第 1 张时，在全卡池（带稀有度权重）里按权重随机
    3. 从候选池中移除该 id，权重归一后再抽第 2 张，同样再抽第 3 张
    → 这样每张被抽到时的概率相对独立且不会重复
   ------------------------------------------------------------------ */

/** 各稀有度的基础出卡权重（红色少，蓝色多，坏卡档黑与好卡档总权重对齐） */
const RARITY_WEIGHTS: Record<CardRarity, number> = {
  red: 3,
  gold: 14,
  blue: 33,
  black: 50, // 3+14+33 = 50，与黑相同 → 好/坏 出卡 1:1
};

function cardPickWeight(card: CheatCardDef): number {
  return (card.weight ?? 1) * RARITY_WEIGHTS[card.rarity];
}

function pickWeighted<T>(items: T[], weightFn: (t: T) => number): T | null {
  const weights = items.map(weightFn);
  const total = weights.reduce((s, w) => s + Math.max(0, w), 0);
  if (total <= 0) return items[0] ?? null;
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= Math.max(0, weights[i]);
    if (r <= 0) return items[i];
  }
  return items[items.length - 1] ?? null;
}

export interface DrawOptions {
  /** 若已手动选了国家，则剔除所有带 forceCountryId 的国家类卡 */
  excludeCountryCards?: boolean;
  /** 额外要排除的卡片 id */
  excludeIds?: Iterable<string>;
}

export function drawThreeUniqueCards(opts: DrawOptions = {}): CheatCardDef[] {
  const excludeIdSet = new Set<string>(opts.excludeIds ?? []);
  const pool = CHEAT_CARDS.filter((c) => {
    if (excludeIdSet.has(c.id)) return false;
    if (opts.excludeCountryCards && c.effect.forceCountryId) return false;
    return true;
  });
  const remaining = [...pool];
  const picked: CheatCardDef[] = [];
  for (let i = 0; i < 3 && remaining.length > 0; i++) {
    const card = pickWeighted(remaining, cardPickWeight);
    if (!card) break;
    picked.push(card);
    const idx = remaining.indexOf(card);
    if (idx >= 0) remaining.splice(idx, 1);
  }
  return picked;
}

/* ------------------------------------------------------------------ */
/*  效果合并：多张卡的 CheatEffect 聚合为一个（相同字段相加 / 取最值）
   ------------------------------------------------------------------ */
export function mergeEffects(cards: CheatCardDef[]): CheatEffect {
  const out: CheatEffect = {};
  for (const c of cards) {
    const e = c.effect;
    if (e.familyLevelDelta !== undefined)   out.familyLevelDelta   = (out.familyLevelDelta ?? 0) + e.familyLevelDelta;
    if (e.luckDelta !== undefined)           out.luckDelta           = (out.luckDelta ?? 0) + e.luckDelta;
    if (e.parentJobWealthDelta !== undefined)out.parentJobWealthDelta= (out.parentJobWealthDelta ?? 0) + e.parentJobWealthDelta;
    if (e.familyStabilityDelta !== undefined)out.familyStabilityDelta=(out.familyStabilityDelta ?? 0) + e.familyStabilityDelta;
    if (e.forceCountryId !== undefined)      out.forceCountryId      = e.forceCountryId; // 后生效覆盖前
    if (e.forceGender !== undefined)         out.forceGender         = e.forceGender;
    if (e.birthYearMin !== undefined)        out.birthYearMin        = Math.max(out.birthYearMin ?? 1900, e.birthYearMin);
    if (e.birthYearMax !== undefined)        out.birthYearMax        = Math.min(out.birthYearMax ?? 2100, e.birthYearMax);
    if (e.appearanceMin !== undefined)       out.appearanceMin       = Math.max(out.appearanceMin ?? 0, e.appearanceMin);
    if (e.appearanceMax !== undefined)       out.appearanceMax       = Math.min(out.appearanceMax ?? 100, e.appearanceMax);
    if (e.intelligenceMin !== undefined)     out.intelligenceMin     = Math.max(out.intelligenceMin ?? 0, e.intelligenceMin);
    if (e.intelligenceMax !== undefined)     out.intelligenceMax     = Math.min(out.intelligenceMax ?? 100, e.intelligenceMax);
    if (e.healthMin !== undefined)           out.healthMin           = Math.max(out.healthMin ?? 0, e.healthMin);
    if (e.healthMax !== undefined)           out.healthMax           = Math.min(out.healthMax ?? 100, e.healthMax);
    if (e.charismaMin !== undefined)         out.charismaMin         = Math.max(out.charismaMin ?? 0, e.charismaMin);

    if (e.attrsFloor) {
      out.attrsFloor = out.attrsFloor ?? {};
      for (const k of Object.keys(e.attrsFloor)) {
        const v = e.attrsFloor[k]!;
        out.attrsFloor[k] = Math.max(out.attrsFloor[k] ?? 0, v);
      }
    }
    if (e.attrsDelta) {
      out.attrsDelta = out.attrsDelta ?? {};
      for (const k of Object.keys(e.attrsDelta)) {
        out.attrsDelta[k] = (out.attrsDelta[k] ?? 0) + (e.attrsDelta[k] ?? 0);
      }
    }
    if (e.preferredRegions) {
      out.preferredRegions = [...(out.preferredRegions ?? []), ...e.preferredRegions];
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  工具：把一个 0-100 的原始数值按「clamp( floor±delta, max )」逻辑变形
   ------------------------------------------------------------------ */
export function applyNumericModifier(
  raw: number,
  params: { floor?: number; max?: number; delta?: number },
): number {
  let v = raw;
  if (params.floor !== undefined) v = Math.max(params.floor, v);
  if (params.delta !== undefined) v = v + params.delta;
  if (params.max !== undefined)   v = Math.min(params.max, v);
  return Math.max(0, Math.min(100, Math.round(v)));
}
