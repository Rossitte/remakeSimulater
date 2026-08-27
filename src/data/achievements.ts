import type { LifeRecord } from '../models/LifeRecord';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  /** 基于单个人生判定是否解锁（多数成就用这个） */
  check?: (record: LifeRecord) => boolean;
  /** 基于累计历史记录判定（统计型成就用） */
  checkAggregate?: (allRecords: LifeRecord[]) => boolean;
}

/** 稀有度中文标签 */
export const RARITY_LABEL: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

/** 稀有度色卡（供 CSS 与组件复用） */
export const RARITY_COLOR: Record<Rarity, { text: string; bg: string; ring: string; glow: string }> = {
  common:    { text: '#9CA3AF', bg: '#374151', ring: '#6B7280', glow: 'rgba(107,114,128,0.35)' },
  rare:      { text: '#93C5FD', bg: '#1E3A8A', ring: '#3B82F6', glow: 'rgba(59,130,246,0.45)' },
  epic:      { text: '#D8B4FE', bg: '#581C87', ring: '#A855F7', glow: 'rgba(168,85,247,0.55)' },
  legendary: { text: '#FCD34D', bg: '#78350F', ring: '#F59E0B', glow: 'rgba(245,158,11,0.65)' },
};

/** 所有成就定义（注意：id 不能改！改了存档会失去对应解锁状态） */
export const ACHIEVEMENTS: AchievementDef[] = [
  // ---------- 基础引导类 ----------
  {
    id: 'first_life',
    name: '初入轮回',
    description: '完成你的第一次投胎。',
    icon: '🌱',
    rarity: 'common',
    checkAggregate: (arr) => arr.length >= 1,
  },
  {
    id: 'ten_lives',
    name: '十世为人',
    description: '累计投胎 10 次。',
    icon: '🔟',
    rarity: 'common',
    checkAggregate: (arr) => arr.length >= 10,
  },
  {
    id: 'fifty_lives',
    name: '半百轮回',
    description: '累计投胎 50 次。',
    icon: '🕒',
    rarity: 'rare',
    checkAggregate: (arr) => arr.length >= 50,
  },
  {
    id: 'hundred_lives',
    name: '百世修行',
    description: '累计投胎 100 次。',
    icon: '💯',
    rarity: 'epic',
    checkAggregate: (arr) => arr.length >= 100,
  },

  // ---------- 评分 / 人生标签类 ----------
  {
    id: 'legendary_score',
    name: '天选之子',
    description: '获得「传奇人生」评价（评分 ≥ 90）。',
    icon: '👑',
    rarity: 'legendary',
    check: (r) => r.label === '传奇人生',
  },
  {
    id: 'success_score',
    name: '人生赢家',
    description: '获得「成功人生」评价（评分 ≥ 80）。',
    icon: '🏆',
    rarity: 'epic',
    check: (r) => r.label === '成功人生' || r.label === '传奇人生',
  },
  {
    id: 'happiness_score',
    name: '知足常乐',
    description: '获得「幸福人生」评价。',
    icon: '😊',
    rarity: 'rare',
    check: (r) => r.label === '幸福人生',
  },
  {
    id: 'extreme_misfortune',
    name: '天命无常',
    description: '获得「极度不幸」评价（评分 ≤ 15）。',
    icon: '💀',
    rarity: 'legendary',
    check: (r) => r.label === '极度不幸',
  },
  {
    id: 'tragic_life',
    name: '人间失格',
    description: '获得「悲惨人生」评价。',
    icon: '🥀',
    rarity: 'epic',
    check: (r) => r.label === '悲惨人生' || r.label === '极度不幸',
  },

  // ---------- 寿命类 ----------
  {
    id: 'centenarian',
    name: '百年修行',
    description: '活到 90 岁以上。',
    icon: '🎂',
    rarity: 'epic',
    check: (r) => r.lifeResult.age >= 90,
  },
  {
    id: 'ripe_old_age',
    name: '儿孙满堂',
    description: '活到 75 岁以上且至少有 1 个子女。',
    icon: '👵',
    rarity: 'rare',
    check: (r) => r.lifeResult.age >= 75 && r.lifeResult.children >= 1,
  },
  {
    id: 'life_cut_short',
    name: '英年早逝',
    description: '寿命在 18 ~ 40 岁之间。',
    icon: '🕊️',
    rarity: 'rare',
    check: (r) => r.lifeResult.age >= 18 && r.lifeResult.age < 40,
  },
  {
    id: 'fleeting_life',
    name: '昙花一现',
    description: '人生不足 3 天（早夭）。',
    icon: '🌸',
    rarity: 'rare',
    check: (r) => r.lifeResult.age <= 0 && r.lifeResult.lifespanDays <= 3,
  },
  {
    id: 'never_grow_up',
    name: '还没长大',
    description: '在童年离世（年龄 < 12 岁）。',
    icon: '🧸',
    rarity: 'epic',
    check: (r) => r.lifeResult.age >= 1 && r.lifeResult.age < 12,
  },

  // ---------- 出身 vs 结果（反差类，最好玩） ----------
  {
    id: 'rags_to_riches',
    name: '寒门贵子',
    description: '出身「极度贫困」或「贫困」家庭，最终资产 ≥ 1,000,000。',
    icon: '🚀',
    rarity: 'legendary',
    check: (r) => {
      const fam = r.birthInfo.family.level;
      return (fam === '极度贫困' || fam === '贫困') && r.lifeResult.finalAssets >= 1_000_000;
    },
  },
  {
    id: 'born_lucky',
    name: '赢在起跑线',
    description: '出身「超级富裕」家庭。',
    icon: '💰',
    rarity: 'legendary',
    check: (r) => r.birthInfo.family.level === '超级富裕',
  },
  {
    id: 'education_escape',
    name: '知识改变命运',
    description: '出身极度贫困/贫困，但拿到了硕士及以上学历。',
    icon: '🎓',
    rarity: 'epic',
    check: (r) => {
      const fam = r.birthInfo.family.level;
      return (fam === '极度贫困' || fam === '贫困') &&
        (r.lifeResult.education === '硕士' || r.lifeResult.education === '博士');
    },
  },
  {
    id: 'like_father_like_son',
    name: '子承父业',
    description: '主职业与父亲职业完全相同。',
    icon: '👨‍👦',
    rarity: 'rare',
    check: (r) => {
      const main = r.lifeResult.mainCareer?.trim();
      const father = r.birthInfo.family.father.job?.trim();
      return !!main && !!father && main !== '无业' && main === father;
    },
  },

  // ---------- 财富 & 职业 ----------
  {
    id: 'tycoon',
    name: '富甲一方',
    description: '一生最高资产 ≥ 10,000,000。',
    icon: '🏦',
    rarity: 'epic',
    check: (r) => r.lifeResult.peakAssets >= 10_000_000,
  },
  {
    id: 'high_income',
    name: '财源广进',
    description: '一生总收入 ≥ 5,000,000。',
    icon: '💵',
    rarity: 'rare',
    check: (r) => r.lifeResult.lifetimeIncome >= 5_000_000,
  },
  {
    id: 'lost_fortune',
    name: '千金散尽',
    description: '曾拥有 ≥ 1,000,000 资产，但最终只剩 ≤ 50,000。',
    icon: '📉',
    rarity: 'rare',
    check: (r) => r.lifeResult.peakAssets >= 1_000_000 && r.lifeResult.finalAssets <= 50_000,
  },
  {
    id: 'career_peak',
    name: '登峰造极',
    description: '事业声望达到 85 以上（行业顶尖）。',
    icon: '🎯',
    rarity: 'epic',
    check: (r) => r.lifeResult.highestPrestige >= 85,
  },
  {
    id: 'phd_dropout',
    name: '天妒英才',
    description: '学历博士，但寿命 < 35 岁。',
    icon: '⚰️',
    rarity: 'epic',
    check: (r) => r.lifeResult.education === '博士' && r.lifeResult.age < 35,
  },

  // ---------- 婚姻家庭类 ----------
  {
    id: 'large_family',
    name: '子孙满堂',
    description: '子女数量 ≥ 4 个。',
    icon: '👨‍👩‍👧‍👦',
    rarity: 'rare',
    check: (r) => r.lifeResult.children >= 4,
  },
  {
    id: 'happy_couple',
    name: '执子之手',
    description: '结婚一次且相伴一生，寿命 ≥ 60 岁。',
    icon: '💍',
    rarity: 'rare',
    check: (r) => r.lifeResult.marriage.everMarried && r.lifeResult.marriage.count === 1 && r.lifeResult.age >= 60,
  },
  {
    id: 'serial_marriage',
    name: '情路坎坷',
    description: '一生结婚 ≥ 3 次。',
    icon: '💔',
    rarity: 'rare',
    check: (r) => r.lifeResult.marriage.count >= 3,
  },
  {
    id: 'forever_alone',
    name: '单身贵族',
    description: '终身未婚未育，但活到了 70 岁以上。',
    icon: '🐱',
    rarity: 'epic',
    check: (r) => !r.lifeResult.marriage.everMarried && r.lifeResult.children === 0 && r.lifeResult.age >= 70,
  },

  // ---------- 死亡方式类 ----------
  {
    id: 'good_death',
    name: '寿终正寝',
    description: '自然死亡（无病无灾），且年龄 ≥ 80。',
    icon: '🌙',
    rarity: 'rare',
    check: (r) => r.lifeResult.deathType === 'natural' && r.lifeResult.age >= 80,
  },
  {
    id: 'war_victim',
    name: '乱世浮萍',
    description: '在战争中丧生。',
    icon: '⚔️',
    rarity: 'epic',
    check: (r) => r.lifeResult.deathType === 'war',
  },
  {
    id: 'disaster_victim',
    name: '天有不测风云',
    description: '在自然灾害中丧生。',
    icon: '🌪️',
    rarity: 'epic',
    check: (r) => r.lifeResult.deathType === 'disaster',
  },

  // ---------- 稀有彩蛋类 ----------
  {
    id: 'lucky_dog',
    name: '锦鲤附体',
    description: '单个人生中触发 ≥ 3 次幸运事件。',
    icon: '🐟',
    rarity: 'legendary',
    check: (r) => r.lifeResult.luckyEvents >= 3,
  },
  {
    id: 'world_traveler',
    name: '环游世界',
    description: '出生在亚洲以外的国家，或父母双方都不是当地常见职业（小概率）。',
    icon: '🌏',
    rarity: 'rare',
    check: (r) => {
      // 出生在亚洲以外的大陆（或具体判定：国家 id 不是亚洲常见的）
      const nonAsianIds = ['US', 'DE', 'FR', 'UK', 'BR', 'CA', 'AU', 'RU', 'MX', 'AR', 'ZA', 'EG', 'NG', 'ES', 'IT'];
      return nonAsianIds.includes(r.birthInfo.countryId);
    },
  },
];

/** 成就总数（方便计算进度） */
export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;
