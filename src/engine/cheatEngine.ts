import {
  CHEAT_CARDS,
  CARD_RARITY_META,
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
/*  抽卡概率模型
  关键：这里定义的是「每个稀有度档位的整体概率」，不是单卡权重。
  因为各档卡片数量不同（红 10 / 金 22 / 蓝 32 / 黑 40），
  如果直接拿一个数字当「单卡权重」，档位概率就会被卡数放大：
  旧版 black=50 权重 × 40 张卡 ≈ 63.9% 坏卡，与注释里写的 1:1 完全不符。
  正确做法见 buildCardWeights：先把档位概率摊到该档的每张卡上。
  改这里即可调手感，四档合计必须为 100。
   ------------------------------------------------------------------ */
export const RARITY_TIER_PERCENT: Record<CardRarity, number> = {
  red: 6,    // 绝世好牌
  gold: 20,  // 上上签
  blue: 56,  // 小确幸
  black: 18, // 厄运缠身（档位比例 好:坏 = 82:18；每包最多 1 张坏卡，实际坏卡槽位约 15%）
};

/** 每包（一次抽 3 张）最多允许出现的坏卡张数：避免「3 张全黑」式的整包废掉 */
export const MAX_BAD_PER_PACK = 1;

export function isBadCard(card: CheatCardDef): boolean {
  return CARD_RARITY_META[card.rarity].category === 'bad';
}

/**
 * 把「档位概率」摊到卡池里的每张卡上：
 *   单卡权重 = 档位概率 × 单卡 weight ÷ 该档在本池中的 weight 之和
 * 好处：无论某档新增/删除多少张卡，整档出卡概率都稳定等于 RARITY_TIER_PERCENT，
 * 加卡只改变「同档里谁能被抽到 / 单卡稀有度」（weight: 0.6 的卡依然更难出）。
 * 权重按「当前候选池」重算，所以勾选国家后剔除国家卡也不会让档位概率漂移。
 */
function buildCardWeights(pool: CheatCardDef[]): Map<string, number> {
  const sumByRarity: Record<CardRarity, number> = { red: 0, gold: 0, blue: 0, black: 0 };
  for (const c of pool) sumByRarity[c.rarity] += c.weight ?? 1;
  const out = new Map<string, number>();
  for (const c of pool) {
    const sum = sumByRarity[c.rarity];
    out.set(
      c.id,
      sum > 0 ? (RARITY_TIER_PERCENT[c.rarity] * (c.weight ?? 1)) / sum : 0,
    );
  }
  return out;
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
  /** 每包最多几张坏卡，默认 MAX_BAD_PER_PACK（1） */
  maxBadPerPack?: number;
}

/** 抽一包：3 张互不重复的卡，坏卡张数受 maxBadPerPack 限制 */
export function drawThreeUniqueCards(opts: DrawOptions = {}): CheatCardDef[] {
  const maxBad = Math.max(0, Math.floor(opts.maxBadPerPack ?? MAX_BAD_PER_PACK));
  const excludeIdSet = new Set<string>(opts.excludeIds ?? []);
  const pool = CHEAT_CARDS.filter((c) => {
    if (excludeIdSet.has(c.id)) return false;
    if (opts.excludeCountryCards && c.effect.forceCountryId) return false;
    return true;
  });
  const weights = buildCardWeights(pool);
  const remaining = [...pool];
  const picked: CheatCardDef[] = [];
  let badPicked = 0;

  for (let i = 0; i < 3 && remaining.length > 0; i++) {
    // 坏卡额度用完后，后续槽位只在好卡里抽
    const candidates = badPicked >= maxBad ? remaining.filter((c) => !isBadCard(c)) : remaining;
    if (candidates.length === 0) break;
    const card = pickWeighted(candidates, (c) => weights.get(c.id) ?? 0);
    if (!card) break;
    if (isBadCard(card)) badPicked += 1;
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
