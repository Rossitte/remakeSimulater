/* ============================================================
   作弊模式 · 抽卡卡池
   - 4 档稀有度：红色(顶级好) / 金色(次好) / 紫蓝(普通好) / 黑色(坏)
   - 好卡与坏卡数量 1:1（实际按红+金+蓝 = 黑，好:坏 = 18:18）
   - 每张卡片带有「效果对象 CheatEffect」，在出生/人生产生时应用
   ============================================================ */

export type CardRarity = 'red' | 'gold' | 'blue' | 'black';

export interface CheatEffect {
  /** 经济等级（家庭等级）权重偏移：正=更富裕，负=更贫穷。单位：% */
  familyLevelDelta?: number;
  /** 国家ID强制选择（单卡） */
  forceCountryId?: string;
  /** 允许/禁止出生在某大洲ID列表 */
  preferredRegions?: string[];
  /** 属性最小值 offset（+x 就把该属性 floor 抬高 x；负 x 压低 floor） */
  attrsFloor?: Partial<Record<string, number>>;
  /** 属性权重偏移（±x 直接加在随机结果上，再 clamp 到 0-100） */
  attrsDelta?: Partial<Record<string, number>>;
  /** 运气统一偏移 */
  luckDelta?: number;
  /** 颜值固定值替换（如颜值保底）：设置了就以 max(原值, 值) 替代 */
  appearanceMin?: number;
  appearanceMax?: number;
  /** 智力上下限 clamping */
  intelligenceMin?: number;
  intelligenceMax?: number;
  /** 健康 clamp */
  healthMin?: number;
  healthMax?: number;
  /** 魅力 clamp */
  charismaMin?: number;
  /** 父母职业权重偏移（正=高薪职业概率更高，负=低薪概率更高，±20） */
  parentJobWealthDelta?: number;
  /** 家庭稳定性偏移 */
  familyStabilityDelta?: number;
  /** 是否强制性别 */
  forceGender?: '男' | '女';
  /** 出生年份 min/max 偏移/强制 */
  birthYearMin?: number;
  birthYearMax?: number;
}

export interface CheatCardDef {
  id: string;
  rarity: CardRarity;
  name: string;
  description: string;
  icon: string;
  effect: CheatEffect;
  /** 权重：相对其他同档卡片的抽取权重，默认 1 */
  weight?: number;
}

/** 稀有度显示配置 */
export const CARD_RARITY_META: Record<CardRarity, {
  label: string;
  gradient: string;
  border: string;
  text: string;
  glow: string;
  category: 'good' | 'bad';
}> = {
  red:   {
    label: '绝世好牌',
    gradient: 'linear-gradient(160deg, #7f1d1d 0%, #dc2626 60%, #f87171 100%)',
    border:   '#f87171',
    text:     '#fee2e2',
    glow:     'rgba(220, 38, 38, 0.7)',
    category: 'good',
  },
  gold:  {
    label: '上上签',
    gradient: 'linear-gradient(160deg, #78350f 0%, #d97706 50%, #fcd34d 100%)',
    border:   '#fcd34d',
    text:     '#fffbeb',
    glow:     'rgba(245,158,11, 0.7)',
    category: 'good',
  },
  blue:  {
    label: '小确幸',
    gradient: 'linear-gradient(160deg, #1e3a8a 0%, #2563eb 55%, #93c5fd 100%)',
    border:   '#60a5fa',
    text:     '#dbeafe',
    glow:     'rgba(37, 99, 235, 0.55)',
    category: 'good',
  },
  black: {
    label: '厄运缠身',
    gradient: 'linear-gradient(160deg, #030712 0%, #111827 55%, #374151 100%)',
    border:   '#475569',
    text:     '#e5e7eb',
    glow:     'rgba(17, 24, 39, 0.75)',
    category: 'bad',
  },
};

/* ================================================================
   卡池定义：共 92 张
     好卡 52 = 红色 8 + 金色 18 + 蓝/紫 26
     坏卡 40 = 黑色 40（好:坏 ≈ 56:44，好卡略多增加"有得选"的快乐感）
   ================================================================ */
export const CHEAT_CARDS: CheatCardDef[] = [
  // ---- 红色（顶级好，3 + 5 = 8）----
  {
    id: 'super_wealthy',
    rarity: 'red',
    name: '豪门之子',
    description: '100% 概率出生在「超级富裕」家庭，父亲母亲职业加权顶级高薪。',
    icon: '💎',
    effect: { familyLevelDelta: 100, parentJobWealthDelta: 40 },
  },
  {
    id: 'max_charm',
    rarity: 'red',
    name: '绝世容颜',
    description: '颜值保底 90、魅力保底 85，出生即顶级流量。',
    icon: '👑',
    effect: { appearanceMin: 90, charismaMin: 85 },
  },
  {
    id: 'born_genius',
    rarity: 'red',
    name: '天降奇才',
    description: '智力下限 92、教育属性 +35，考啥会啥。',
    icon: '🧠',
    effect: { intelligenceMin: 92, attrsDelta: { education: 35 }, luckDelta: 8 },
  },
  {
    id: 'perfect_body_soul',
    rarity: 'red',
    name: '天选之人',
    description: '健康/颜值/魅力/意志/心理 下限 80，五边形战神。',
    icon: '✨',
    effect: {
      healthMin: 80, appearanceMin: 80, charismaMin: 80,
      attrsFloor: { willpower: 80, mental: 80 },
    },
  },
  {
    id: 'singapore_pass',
    rarity: 'red',
    name: '花园之城',
    description: '强制出生在 🇸🇬 新加坡：经济95+医疗92+治安90+寿命84。',
    icon: '🇸🇬',
    effect: { forceCountryId: 'SG' },
  },
  {
    id: 'switzerland_pass',
    rarity: 'red',
    name: '阿尔卑斯山下',
    description: '强制出生在 🇨🇭 瑞士：世界最富之一 + 全球最高医疗水平。',
    icon: '🇨🇭',
    effect: { forceCountryId: 'CH' },
  },
  {
    id: 'gen_z_born',
    rarity: 'red',
    name: '互联网土著',
    description: '强制出生在 2000~2010 年：完整享受移动互联网+AI 时代红利。',
    icon: '📱',
    effect: { birthYearMin: 2000, birthYearMax: 2010, attrsDelta: { education: 15, luck: 8 } },
  },
  {
    id: 'aristocrat_child',
    rarity: 'red',
    name: '书香门第',
    description: '超级富裕 + 父母高薪（教授/医生级）+ 家庭稳定性拉满。',
    icon: '🏮',
    effect: { familyLevelDelta: 85, parentJobWealthDelta: 35, familyStabilityDelta: 45 },
  },

  // ---- 金色（次好，6 + 12 = 18）----
  {
    id: 'born_rich',
    rarity: 'gold',
    name: '含着金汤匙',
    description: '家庭经济 +70，父母高薪职业概率显著提升。',
    icon: '💰',
    effect: { familyLevelDelta: 70, parentJobWealthDelta: 22 },
  },
  {
    id: 'china_pass',
    rarity: 'gold',
    name: '一定要生在中国',
    description: '强制出生地为🇨🇳 中国（优先一线/新一线城市）。',
    icon: '🇨🇳',
    effect: { forceCountryId: 'CN' },
  },
  {
    id: 'us_pass',
    rarity: 'gold',
    name: '美利坚绿卡',
    description: '强制出生地为🇺🇸 美国。',
    icon: '🇺🇸',
    effect: { forceCountryId: 'US' },
  },
  {
    id: 'jk_pass',
    rarity: 'gold',
    name: '樱花之国',
    description: '强制出生地为🇯🇵 日本。',
    icon: '🇯🇵',
    effect: { forceCountryId: 'JP' },
  },
  {
    id: 'strong_body',
    rarity: 'gold',
    name: '天生神力',
    description: '健康下限 80，力量与耐力 +25。',
    icon: '💪',
    effect: { healthMin: 80, attrsDelta: { strength: 25, stamina: 25 } },
  },
  {
    id: 'super_lucky',
    rarity: 'gold',
    name: '锦鲤转世',
    description: '运气 +30，意外好事频频发生。',
    icon: '🐟',
    effect: { luckDelta: 30 },
  },
  // 新金 1：西欧/北欧福利国
  {
    id: 'germany_pass',
    rarity: 'gold', name: '莱茵河畔',
    description: '强制出生在 🇩🇪 德国：欧洲制造强国 + 免费教育。',
    icon: '🇩🇪', effect: { forceCountryId: 'DE' },
  },
  {
    id: 'norway_pass',
    rarity: 'gold', name: '北欧童话',
    description: '强制出生在 🇳🇴 挪威：人类发展指数 TOP + 丰厚石油福利。',
    icon: '🇳🇴', effect: { forceCountryId: 'NO' },
  },
  {
    id: 'canada_pass',
    rarity: 'gold', name: '枫叶之国',
    description: '强制出生在 🇨🇦 加拿大：地广人稀 + 移民友好。',
    icon: '🇨🇦', effect: { forceCountryId: 'CA' },
  },
  {
    id: 'australia_pass',
    rarity: 'gold', name: '阳光海岸',
    description: '强制出生在 🇦🇺 澳大利亚：南半球发达国家。',
    icon: '🇦🇺', effect: { forceCountryId: 'AU' },
  },
  {
    id: 'korea_pass',
    rarity: 'gold', name: '汉江奇迹',
    description: '强制出生在 🇰🇷 韩国：教育 92 + 经济 90。',
    icon: '🇰🇷', effect: { forceCountryId: 'KR' },
  },
  {
    id: 'singapore_gold',
    rarity: 'gold', name: '亚洲小龙',
    description: '强制出生在 🇸🇬 新加坡（金卡版，稀有度比红低）。',
    icon: '🦁', effect: { forceCountryId: 'SG', attrsDelta: { education: 10 } },
    weight: 0.6,
  },
  // 新金 2：非国家类
  {
    id: 'iq_80_floor',
    rarity: 'gold', name: '聪明绝顶',
    description: '智力下限 80，教育 +20，基本考个好大学没问题。',
    icon: '🎓',
    effect: { intelligenceMin: 80, attrsDelta: { education: 20 } },
  },
  {
    id: 'iron_will',
    rarity: 'gold', name: '钢铁意志',
    description: '意志力下限 80，心理下限 75；挫折打不倒你。',
    icon: '🛡️',
    effect: { attrsFloor: { willpower: 80, mental: 75 } },
  },
  {
    id: 'chinese_golden_age',
    rarity: 'gold', name: '改革开放之子',
    description: '1978~1992 年在中国出生（时代红利满满）。',
    icon: '🧧',
    effect: { birthYearMin: 1978, birthYearMax: 1992, forceCountryId: 'CN', luckDelta: 15 },
  },
  {
    id: 'doctor_parents',
    rarity: 'gold', name: '医生世家',
    description: '父母高薪 + 医疗/健康相关职业偏好 + 健康 +20。',
    icon: '🩺',
    effect: { parentJobWealthDelta: 28, attrsDelta: { health: 20, immunity: 15 } },
  },
  {
    id: 'born_beauty',
    rarity: 'gold', name: '颜值天花板',
    description: '颜值下限 75，魅力下限 70。',
    icon: '🌸',
    effect: { appearanceMin: 75, charismaMin: 70 },
  },
  {
    id: 'lucky_streak',
    rarity: 'gold', name: '欧皇附体',
    description: '运气 +20，人缘 +20。',
    icon: '🍀',
    effect: { luckDelta: 20, attrsDelta: { socialConnection: 20 } },
  },

  // ---- 蓝/紫色（普通好，9 + 17 = 26）----
  {
    id: 'wealthy_pick',
    rarity: 'blue',
    name: '富裕之家',
    description: '富裕家庭概率 +30%。',
    icon: '🏦',
    effect: { familyLevelDelta: 30 },
  },
  {
    id: 'looks_floor',
    rarity: 'blue',
    name: '颜值保底',
    description: '颜值下限 +20。',
    icon: '✨',
    effect: { appearanceMin: 20 },
  },
  {
    id: 'iq_floor',
    rarity: 'blue',
    name: '智商下限 +15',
    description: '智力下限 +15，考试不翻车。',
    icon: '📘',
    effect: { intelligenceMin: 15, attrsFloor: { intelligence: 15 } },
  },
  {
    id: 'healthy_family',
    rarity: 'blue',
    name: '和睦家庭',
    description: '家庭稳定性 +30，父母更可能相伴一生。',
    icon: '👨‍👩‍👧',
    effect: { familyStabilityDelta: 30 },
  },
  {
    id: 'rich_region',
    rarity: 'blue',
    name: '一线优先',
    description: '优先出生在东部沿海/高收入地区。',
    icon: '🌆',
    effect: { parentJobWealthDelta: 10, familyLevelDelta: 8 },
  },
  {
    id: 'chad_body',
    rarity: 'blue',
    name: '健康宝宝',
    description: '健康值 +15、心理健康 +10。',
    icon: '🏃',
    effect: { attrsDelta: { health: 15, mental: 10 } },
  },
  {
    id: 'social_butterfly',
    rarity: 'blue',
    name: '人见人爱',
    description: '魅力 +12、人缘 +20。',
    icon: '🤝',
    effect: { attrsDelta: { charisma: 12, socialConnection: 20 } },
  },
  {
    id: 'force_male',
    rarity: 'blue',
    name: '选择男孩',
    description: '出生为 👦 男。',
    icon: '👦',
    effect: { forceGender: '男' },
  },
  {
    id: 'force_female',
    rarity: 'blue',
    name: '选择女孩',
    description: '出生为 👧 女。',
    icon: '👧',
    effect: { forceGender: '女' },
  },
  // 新蓝 1：年份
  {
    id: 'gen_x_born',
    rarity: 'blue', name: '80 后',
    description: '1980~1989 年出生。',
    icon: '📼', effect: { birthYearMin: 1980, birthYearMax: 1989 },
  },
  {
    id: 'millennial_born',
    rarity: 'blue', name: '90 后',
    description: '1990~1999 年出生。',
    icon: '🎮', effect: { birthYearMin: 1990, birthYearMax: 1999 },
  },
  {
    id: 'alpha_born',
    rarity: 'blue', name: '阿尔法一代',
    description: '2010 年后出生（数字原生代）。',
    icon: '🤖', effect: { birthYearMin: 2010, birthYearMax: 2024, attrsDelta: { education: 8 } },
  },
  // 新蓝 2：更多国家（中等发达 / 热门）
  {
    id: 'uk_pass',
    rarity: 'blue', name: '雾都之子',
    description: '强制出生在 🇬🇧 英国。',
    icon: '🇬🇧', effect: { forceCountryId: 'GB' },
  },
  {
    id: 'france_pass',
    rarity: 'blue', name: '浪漫巴黎',
    description: '强制出生在 🇫🇷 法国。',
    icon: '🇫🇷', effect: { forceCountryId: 'FR' },
  },
  {
    id: 'spain_pass',
    rarity: 'blue', name: '热情伊比利亚',
    description: '强制出生在 🇪🇸 西班牙。',
    icon: '🇪🇸', effect: { forceCountryId: 'ES' },
  },
  {
    id: 'italy_pass',
    rarity: 'blue', name: '罗马之子',
    description: '强制出生在 🇮🇹 意大利。',
    icon: '🇮🇹', effect: { forceCountryId: 'IT' },
  },
  {
    id: 'uae_gold_sa',
    rarity: 'blue', name: '石油之家',
    description: '强制出生在 🇸🇦 沙特阿拉伯。',
    icon: '🛢️', effect: { forceCountryId: 'SA', familyLevelDelta: 20 },
  },
  {
    id: 'malaysia_pass',
    rarity: 'blue', name: '南洋度假',
    description: '强制出生在 🇲🇾 马来西亚。',
    icon: '🇲🇾', effect: { forceCountryId: 'MY' },
  },
  {
    id: 'thailand_pass',
    rarity: 'blue', name: '微笑之国',
    description: '强制出生在 🇹🇭 泰国。',
    icon: '🇹🇭', effect: { forceCountryId: 'TH' },
  },
  {
    id: 'russia_pass',
    rarity: 'blue', name: '冰雪俄罗斯',
    description: '强制出生在 🇷🇺 俄罗斯。',
    icon: '🇷🇺', effect: { forceCountryId: 'RU' },
  },
  {
    id: 'brazil_pass',
    rarity: 'blue', name: '桑巴之国',
    description: '强制出生在 🇧🇷 巴西。',
    icon: '🇧🇷', effect: { forceCountryId: 'BR' },
  },
  // 新蓝 3：属性/家境小提升
  {
    id: 'teacher_parents',
    rarity: 'blue', name: '教师子女',
    description: '父母中等声望职业概率提升 + 教育 +12。',
    icon: '📚', effect: { parentJobWealthDelta: 10, attrsDelta: { education: 12 } },
  },
  {
    id: 'civil_servant_fam',
    rarity: 'blue', name: '公务员之家',
    description: '家庭稳定性 +18，父母职业偏好公职。',
    icon: '🏛️', effect: { familyStabilityDelta: 18, parentJobWealthDelta: 12 },
  },
  {
    id: 'programmer_fam',
    rarity: 'blue', name: '程序员后代',
    description: '父母高薪（互联网偏好）+ 智力 +12。',
    icon: '👨‍💻', effect: { parentJobWealthDelta: 16, attrsDelta: { intelligence: 12 } },
  },
  {
    id: 'artistic_gift',
    rarity: 'blue', name: '艺术天赋',
    description: '魅力 +15，颜值 +10。',
    icon: '🎨', effect: { attrsDelta: { charisma: 15, appearance: 10 } },
  },
  {
    id: 'sport_gift',
    rarity: 'blue', name: '运动健将',
    description: '力量 +15、耐力 +15、健康 +10。',
    icon: '⚽', effect: { attrsDelta: { strength: 15, stamina: 15, health: 10 } },
  },

  // ---- 黑色（坏卡，18 + 22 = 40 张对称）----
  {
    id: 'super_poor',
    rarity: 'black',
    name: '家徒四壁',
    description: '家庭经济 -75，几乎必然极度贫困。',
    icon: '🥣',
    effect: { familyLevelDelta: -75, parentJobWealthDelta: -35 },
  },
  {
    id: 'ugly_duckling',
    rarity: 'black',
    name: '长歪了',
    description: '颜值上限 35，魅力 -15。',
    icon: '🦆',
    effect: { appearanceMax: 35, attrsDelta: { charisma: -15 } },
  },
  {
    id: 'smooth_brain',
    rarity: 'black',
    name: '榆木脑袋',
    description: '智力上限 35，学习能力 -25。',
    icon: '🧱',
    effect: { intelligenceMax: 35, attrsDelta: { education: -25 } },
  },
  {
    id: 'war_zone',
    rarity: 'black',
    name: '战乱之地',
    description: '强制出生在 🇸🇾 叙利亚（冲突指数 85）。',
    icon: '⚔️',
    effect: { forceCountryId: 'SY' },
  },
  {
    id: 'cursed_luck',
    rarity: 'black',
    name: '厄运之子',
    description: '运气 -40，大概率多灾多难。',
    icon: '🍂',
    effect: { luckDelta: -40 },
  },
  {
    id: 'sickly_kid',
    rarity: 'black',
    name: '病秧子',
    description: '健康上限 35，耐力 -25，寿命倾向偏短。',
    icon: '🤒',
    effect: { healthMax: 35, attrsDelta: { stamina: -25, immunity: -25 } },
  },

  {
    id: 'poor_luck',
    rarity: 'black',
    name: '屋漏偏逢雨',
    description: '家庭经济 -30，父母低收入职业概率上升。',
    icon: '🏚️',
    effect: { familyLevelDelta: -30, parentJobWealthDelta: -20 },
  },
  {
    id: 'no_looks',
    rarity: 'black',
    name: '平平无奇',
    description: '颜值上限 55，魅力 -10。',
    icon: '🫥',
    effect: { appearanceMax: 55, attrsDelta: { charisma: -10 } },
  },
  {
    id: 'mediocre_iq',
    rarity: 'black',
    name: '不太聪明',
    description: '智力上限 55，教育 -15。',
    icon: '🐷',
    effect: { intelligenceMax: 55, attrsDelta: { education: -15 } },
  },
  {
    id: 'broken_family',
    rarity: 'black',
    name: '支离破碎',
    description: '家庭稳定性 -45，单亲概率高。',
    icon: '💢',
    effect: { familyStabilityDelta: -45 },
  },
  {
    id: 'social_klutz',
    rarity: 'black',
    name: '社恐死宅',
    description: '人缘 -25，魅力 -10。',
    icon: '🧟',
    effect: { attrsDelta: { socialConnection: -25, charisma: -10 } },
  },
  {
    id: 'weak_bones',
    rarity: 'black',
    name: '体弱多病',
    description: '健康 -18、耐力 -20、免疫力 -20。',
    icon: '💊',
    effect: { attrsDelta: { health: -18, stamina: -20, immunity: -20 } },
  },
  {
    id: 'bad_region',
    rarity: 'black',
    name: '山区留守儿童',
    description: '优先出生在欠发达地区，父母外出打工。',
    icon: '🌄',
    effect: { familyLevelDelta: -15, parentJobWealthDelta: -15 },
  },
  {
    id: 'early_birth',
    rarity: 'black',
    name: '生在旧社会',
    description: '优先出生在 1940 ~ 1965 年（早年战乱/饥荒年代）。',
    icon: '📜',
    effect: { birthYearMin: 1940, birthYearMax: 1965 },
  },
  {
    id: 'sibling_swarm',
    rarity: 'black',
    name: '超生家庭',
    description: '兄弟姐妹数 +6，资源被稀释。',
    icon: '👶',
    effect: { familyLevelDelta: -20, familyStabilityDelta: -10 },
  },
  {
    id: 'mental_fragile',
    rarity: 'black',
    name: '玻璃心',
    description: '心理素质 -25，容易抑郁崩溃。',
    icon: '💔',
    effect: { attrsDelta: { mental: -25, willpower: -15 } },
  },
  {
    id: 'poor_parents',
    rarity: 'black',
    name: '父母能力有限',
    description: '父母职业加权低薪职业 +40。',
    icon: '🧹',
    effect: { parentJobWealthDelta: -40 },
  },
  {
    id: 'no_good_deed',
    rarity: 'black',
    name: '祸不单行',
    description: '运气 -20，家庭经济 -15。',
    icon: '💀',
    effect: { luckDelta: -20, familyLevelDelta: -15 },
  },
  // ===== 新增黑卡（22 张） =====
  // 国家类（穷国/战乱）
  {
    id: 'south_sudan_poor',
    rarity: 'black', name: '朱巴街头',
    description: '强制出生在 🇸🇸 南苏丹：全球最贫困国家 + 战乱等级 80。',
    icon: '🇸🇸', effect: { forceCountryId: 'SS' },
  },
  {
    id: 'drc_congo',
    rarity: 'black', name: '金沙萨雨季',
    description: '强制出生在 🇨🇩 刚果（金）：经济 18 + 战乱 45。',
    icon: '🇨🇩', effect: { forceCountryId: 'cd' },
  },
  {
    id: 'ethiopia_born',
    rarity: 'black', name: '东非高原',
    description: '强制出生在 🇪🇹 埃塞俄比亚：经济 20 + 战乱 35。',
    icon: '🇪🇹', effect: { forceCountryId: 'ET' },
  },
  {
    id: 'nigeria_north',
    rarity: 'black', name: '拉各斯艳阳',
    description: '强制出生在 🇳🇬 尼日利亚：经济 30 + 安全 35 + 战乱 25。',
    icon: '🇳🇬', effect: { forceCountryId: 'NG' },
  },
  {
    id: 'sudan_born',
    rarity: 'black', name: '喀土穆风沙',
    description: '强制出生在 🇸🇩 苏丹：战乱 70 + 经济 20。',
    icon: '🇸🇩', effect: { forceCountryId: 'SD' },
  },
  {
    id: 'ukraine_war',
    rarity: 'black', name: '战火乌克兰',
    description: '强制出生在 🇺🇦 乌克兰：战乱等级 85。',
    icon: '🇺🇦', effect: { forceCountryId: 'UA' },
  },
  {
    id: 'iraq_born',
    rarity: 'black', name: '巴格达废墟',
    description: '强制出生在 🇮🇶 伊拉克：战乱 60 + 安全 30。',
    icon: '🇮🇶', effect: { forceCountryId: 'IQ' },
  },
  {
    id: 'myanmar_born',
    rarity: 'black', name: '仰光枪声',
    description: '强制出生在 🇲🇲 缅甸：战乱 40 + 经济 25。',
    icon: '🇲🇲', effect: { forceCountryId: 'mm' },
  },
  // 时代/天灾
  {
    id: 'world_war_ii',
    rarity: 'black', name: '二战遗孤',
    description: '1930~1945 年出生：全球战争 + 饥荒年代。',
    icon: '🕊️', effect: { birthYearMin: 1930, birthYearMax: 1945, luckDelta: -15 },
  },
  {
    id: 'famine_era',
    rarity: 'black', name: '饥荒年代',
    description: '1955~1962 年出生：发展中国家大饥荒概率极高。',
    icon: '🌾', effect: { birthYearMin: 1955, birthYearMax: 1962, healthMax: 55 },
  },
  // 健康/属性
  {
    id: 'immunity_failure',
    rarity: 'black', name: '免疫力缺陷',
    description: '免疫力上限 30，健康上限 40。',
    icon: '🦠', effect: { attrsDelta: { immunity: -30 }, healthMax: 40 },
  },
  {
    id: 'zero_willpower',
    rarity: 'black', name: '烂泥扶不上墙',
    description: '意志力上限 35，心理上限 40。',
    icon: '🥀', effect: { attrsDelta: { willpower: -25, mental: -20 } },
  },
  {
    id: 'charisma_zero',
    rarity: 'black', name: '人人厌恶',
    description: '魅力上限 25，人缘 -30。',
    icon: '💩', effect: { appearanceMax: 35, attrsDelta: { charisma: -25, socialConnection: -30 } },
  },
  {
    id: 'illiterate_kid',
    rarity: 'black', name: '文盲家庭',
    description: '教育 -30，智力上限 45。',
    icon: '📖', effect: { intelligenceMax: 45, attrsDelta: { education: -30 } },
  },
  {
    id: 'orphan_child',
    rarity: 'black', name: '孤儿',
    description: '家庭稳定性 -75，父母职业加权全低。',
    icon: '🧸', effect: { familyStabilityDelta: -75, parentJobWealthDelta: -25, familyLevelDelta: -25 },
  },
  {
    id: 'gambler_parent',
    rarity: 'black', name: '赌鬼父亲',
    description: '家庭经济 -45，家庭稳定性 -40。',
    icon: '🎰', effect: { familyLevelDelta: -45, familyStabilityDelta: -40 },
  },
  {
    id: 'drug_family',
    rarity: 'black', name: '吸毒之家',
    description: '家庭稳定性 -50，经济 -40，心理 -15。',
    icon: '💉', effect: { familyStabilityDelta: -50, familyLevelDelta: -40, attrsDelta: { mental: -15 } },
  },
  {
    id: 'no_friends',
    rarity: 'black', name: '天煞孤星',
    description: '人缘 -35，魅力 -15。',
    icon: '🏜️', effect: { attrsDelta: { socialConnection: -35, charisma: -15 } },
  },
  {
    id: 'born_tired',
    rarity: 'black', name: '早衰儿童',
    description: '耐力上限 35，力量上限 40，健康 -20。',
    icon: '😮‍💨', effect: { attrsDelta: { health: -20, stamina: -25, strength: -20 } },
  },
  {
    id: 'disaster_prone',
    rarity: 'black', name: '灾星',
    description: '运气 -30，家庭经济 -20，健康 -15。',
    icon: '🌪️', effect: { luckDelta: -30, familyLevelDelta: -20, attrsDelta: { health: -15 } },
  },
  {
    id: 'born_ugly',
    rarity: 'black', name: '面目可憎',
    description: '颜值上限 20，魅力上限 30。',
    icon: '🧟‍♂️', effect: { appearanceMax: 20, attrsDelta: { charisma: -20 } },
  },
  {
    id: 'cowardly',
    rarity: 'black', name: '胆小如鼠',
    description: '意志力上限 30，心理上限 35，运气 -10。',
    icon: '🐭', effect: { attrsDelta: { willpower: -25, mental: -20 }, luckDelta: -10 },
  },
];

export const CHEAT_CARD_BY_ID: Record<string, CheatCardDef> = CHEAT_CARDS.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<string, CheatCardDef>,
);

/** 按稀有度分类好卡数量，帮助快速查均衡性 */
export const CARD_COUNT_BY_RARITY = CHEAT_CARDS.reduce<Record<CardRarity, number>>(
  (acc, c) => {
    acc[c.rarity] = (acc[c.rarity] ?? 0) + 1;
    return acc;
  },
  { red: 0, gold: 0, blue: 0, black: 0 },
);
