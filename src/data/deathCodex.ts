import {
  ACCIDENT_DEATHS,
  CRIME_DEATHS,
  DISASTER_DEATHS,
  ILLNESS_DEATHS,
  OCCUPATIONAL_HAZARDS,
  TRAFFIC_DEATHS,
  WAR_DEATHS,
} from './deathCauses';

/**
 * 终章图鉴：把所有可能的「怎么走的」列成一本收集册。
 *
 * 死因字符串本身就是唯一 id —— 它同时也是 LifeResult.deathCause 的取值，
 * 所以解锁判定不需要额外维护映射。
 */

export type CodexCategory =
  | 'natural'
  | 'early'
  | 'illness'
  | 'accident'
  | 'traffic'
  | 'disaster'
  | 'crime'
  | 'war'
  | 'job';

export interface CodexEntry {
  id: string;
  name: string;
  category: CodexCategory;
}

export const CODEX_CATEGORIES: { key: CodexCategory; label: string; icon: string }[] = [
  { key: 'natural', label: '善终', icon: '🕯️' },
  { key: 'early', label: '早夭', icon: '🫧' },
  { key: 'illness', label: '疾病', icon: '🫀' },
  { key: 'accident', label: '意外', icon: '⚡' },
  { key: 'traffic', label: '交通', icon: '🚗' },
  { key: 'disaster', label: '天灾', icon: '🌪️' },
  { key: 'crime', label: '人祸', icon: '🔪' },
  { key: 'war', label: '战火', icon: '💥' },
  { key: 'job', label: '职业伤害', icon: '🦺' },
];

const CATEGORY_OF: Record<CodexCategory, string> = {
  natural: '善终',
  early: '早夭',
  illness: '疾病',
  accident: '意外',
  traffic: '交通',
  disaster: '天灾',
  crime: '人祸',
  war: '战火',
  job: '职业伤害',
};

function pushUnique(list: CodexEntry[], seen: Set<string>, name: string, category: CodexCategory): void {
  if (!name || seen.has(name)) return;
  seen.add(name);
  list.push({ id: name, name, category });
}

function buildCodex(): CodexEntry[] {
  const list: CodexEntry[] = [];
  const seen = new Set<string>();

  // 善终
  for (const name of ['寿终正寝', '安详离世', '在睡梦中离世']) pushUnique(list, seen, name, 'natural');

  // 早夭
  for (const name of ['早产夭折', '战乱中因缺乏医疗夭折', '童年时的一场疾病']) pushUnique(list, seen, name, 'early');

  // 疾病
  for (const name of ILLNESS_DEATHS) pushUnique(list, seen, name, 'illness');

  // 各类意外 / 天灾 / 人祸 / 战火
  for (const d of ACCIDENT_DEATHS) pushUnique(list, seen, d.cause, 'accident');
  for (const d of TRAFFIC_DEATHS) pushUnique(list, seen, d.cause, 'traffic');
  for (const d of DISASTER_DEATHS) pushUnique(list, seen, d.cause, 'disaster');
  for (const d of CRIME_DEATHS) pushUnique(list, seen, d.cause, 'crime');
  for (const d of WAR_DEATHS) pushUnique(list, seen, d.cause, 'war');

  // 职业伤害（按职业归类）
  for (const hazard of OCCUPATIONAL_HAZARDS) {
    for (const d of hazard.deaths) pushUnique(list, seen, d.cause, 'job');
  }

  return list;
}

export const DEATH_CODEX: CodexEntry[] = buildCodex();

/** 死因 → 所属分类的中文名 */
export function codexCategoryLabel(category: CodexCategory): string {
  return CATEGORY_OF[category];
}
