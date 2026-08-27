export interface City {
  name: string;
  /** 城市人口（万人） */
  population: number;
  /** 所在地区（省 / 州 / 邦 / 府 等），用于国家 → 地区 → 城市的逐级定位 */
  region: string;
}

export interface Country {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  /** 国家人口（万人） */
  population: number;
  /** 出生率（每千人） */
  birthRate: number;
  /** 经济水平 0-100 */
  economicLevel: number;
  /** 教育水平 0-100 */
  educationLevel: number;
  /** 医疗水平 0-100 */
  healthcareLevel: number;
  /** 安全水平 0-100 */
  safetyLevel: number;
  /** 平均预期寿命 */
  lifeExpectancy: number;
  /** 货币符号 */
  currency: string;
  /** 1 USD = currencyRate 该国货币 */
  currencyRate: number;
  /** 战乱等级 0-100，影响战争死亡概率 */
  warLevel: number;
  cities: City[];
}

/**
 * 国家出生权重 = 人口 × 出生率
 * 数值基于真实世界数据做了简化，不追求绝对精确。
 */
export const COUNTRIES: Country[] = [
  {
    id: 'cn', name: '中国', nameEn: 'China', flag: '🇨🇳',
    population: 140900, birthRate: 8.6, economicLevel: 70, educationLevel: 72,
    healthcareLevel: 78, safetyLevel: 85, lifeExpectancy: 77, currency: '¥', currencyRate: 7.1,
    warLevel: 0,
    cities: [
      { name: '上海', population: 2487, region: '上海' },
      { name: '北京', population: 2189, region: '北京' },
      { name: '重庆', population: 3212, region: '重庆' },
      { name: '成都', population: 2126, region: '四川' },
      { name: '广州', population: 1874, region: '广东' },
      { name: '深圳', population: 1768, region: '广东' },
      { name: '天津', population: 1364, region: '天津' },
      { name: '武汉', population: 1373, region: '湖北' },
      { name: '西安', population: 1296, region: '陕西' },
      { name: '苏州', population: 1275, region: '江苏' },
      { name: '郑州', population: 1283, region: '河南' },
      { name: '杭州', population: 1237, region: '浙江' },
      { name: '长沙', population: 1042, region: '湖南' },
      { name: '东莞', population: 1047, region: '广东' },
      { name: '青岛', population: 1034, region: '山东' },
      { name: '哈尔滨', population: 1000, region: '黑龙江' },
      { name: '佛山', population: 955, region: '广东' },
      { name: '温州', population: 967, region: '浙江' },
      { name: '昆明', population: 860, region: '云南' },
      { name: '大连', population: 745, region: '辽宁' },
      { name: '贵阳', population: 598, region: '贵州' },
      { name: '兰州', population: 436, region: '甘肃' },
      { name: '乌鲁木齐', population: 408, region: '新疆' },
      { name: '拉萨', population: 90, region: '西藏' },
      { name: '曲阜', population: 90, region: '山东' },
    ],
  },
  {
    id: 'in', name: '印度', nameEn: 'India', flag: '🇮🇳',
    population: 142800, birthRate: 18.2, economicLevel: 45, educationLevel: 55,
    healthcareLevel: 50, safetyLevel: 55, lifeExpectancy: 67, currency: '₹', currencyRate: 83,
    warLevel: 0,
    cities: [
      { name: '孟买', population: 2067, region: '马哈拉施特拉邦' },
      { name: '德里', population: 3029, region: '德里' },
      { name: '班加罗尔', population: 1361, region: '卡纳塔克邦' },
      { name: '海得拉巴', population: 1104, region: '特伦甘纳邦' },
      { name: '艾哈迈达巴德', population: 827, region: '古吉拉特邦' },
      { name: '金奈', population: 1086, region: '泰米尔纳德邦' },
      { name: '加尔各答', population: 1490, region: '西孟加拉邦' },
      { name: '浦那', population: 754, region: '马哈拉施特拉邦' },
      { name: '斋浦尔', population: 400, region: '拉贾斯坦邦' },
      { name: '勒克瑙', population: 400, region: '北方邦' },
      { name: '巴特那', population: 220, region: '比哈尔邦' },
      { name: '焦特布尔', population: 120, region: '拉贾斯坦邦' },
    ],
  },
  {
    id: 'us', name: '美国', nameEn: 'USA', flag: '🇺🇸',
    population: 33500, birthRate: 12.1, economicLevel: 95, educationLevel: 90,
    healthcareLevel: 88, safetyLevel: 70, lifeExpectancy: 79, currency: '$', currencyRate: 1,
    warLevel: 0,
    cities: [
      { name: '纽约', population: 833, region: '纽约州' },
      { name: '洛杉矶', population: 390, region: '加利福尼亚州' },
      { name: '芝加哥', population: 269, region: '伊利诺伊州' },
      { name: '休斯顿', population: 231, region: '得克萨斯州' },
      { name: '凤凰城', population: 160, region: '亚利桑那州' },
      { name: '费城', population: 158, region: '宾夕法尼亚州' },
      { name: '圣安东尼奥', population: 155, region: '得克萨斯州' },
      { name: '圣迭戈', population: 140, region: '加利福尼亚州' },
      { name: '达拉斯', population: 130, region: '得克萨斯州' },
      { name: '西雅图', population: 73, region: '华盛顿州' },
      { name: '波士顿', population: 68, region: '马萨诸塞州' },
      { name: '拉斯维加斯', population: 66, region: '内华达州' },
    ],
  },
  {
    id: 'id', name: '印度尼西亚', nameEn: 'Indonesia', flag: '🇮🇩',
    population: 27800, birthRate: 16.5, economicLevel: 45, educationLevel: 55,
    healthcareLevel: 52, safetyLevel: 60, lifeExpectancy: 71, currency: 'Rp', currencyRate: 15500,
    warLevel: 0,
    cities: [
      { name: '雅加达', population: 1056, region: '雅加达首都特区' },
      { name: '泗水', population: 296, region: '东爪哇省' },
      { name: '万隆', population: 251, region: '西爪哇省' },
      { name: '棉兰', population: 223, region: '北苏门答腊省' },
      { name: '三宝垄', population: 168, region: '中爪哇省' },
      { name: '望加锡', population: 143, region: '南苏拉威西省' },
      { name: '日惹', population: 42, region: '日惹特区' },
    ],
  },
  {
    id: 'pk', name: '巴基斯坦', nameEn: 'Pakistan', flag: '🇵🇰',
    population: 23100, birthRate: 27.8, economicLevel: 35, educationLevel: 40,
    healthcareLevel: 42, safetyLevel: 45, lifeExpectancy: 65, currency: '₨', currencyRate: 280,
    warLevel: 0,
    cities: [
      { name: '卡拉奇', population: 1646, region: '信德省' },
      { name: '拉合尔', population: 1211, region: '旁遮普省' },
      { name: '费萨拉巴德', population: 321, region: '旁遮普省' },
      { name: '拉瓦尔品第', population: 220, region: '旁遮普省' },
      { name: '伊斯兰堡', population: 109, region: '伊斯兰堡首都区' },
      { name: '木尔坦', population: 188, region: '旁遮普省' },
    ],
  },
  {
    id: 'ng', name: '尼日利亚', nameEn: 'Nigeria', flag: '🇳🇬',
    population: 21900, birthRate: 37.4, economicLevel: 30, educationLevel: 35,
    healthcareLevel: 35, safetyLevel: 35, lifeExpectancy: 55, currency: '₦', currencyRate: 780,
    warLevel: 25,
    cities: [
      { name: '拉各斯', population: 1540, region: '拉各斯州' },
      { name: '卡诺', population: 414, region: '卡诺州' },
      { name: '伊巴丹', population: 365, region: '奥约州' },
      { name: '阿布贾', population: 160, region: '联邦首都区' },
      { name: '哈科特港', population: 115, region: '河流州' },
      { name: '贝宁城', population: 150, region: '埃多州' },
    ],
  },
  {
    id: 'br', name: '巴西', nameEn: 'Brazil', flag: '🇧🇷',
    population: 21600, birthRate: 14.1, economicLevel: 55, educationLevel: 60,
    healthcareLevel: 60, safetyLevel: 45, lifeExpectancy: 76, currency: 'R$', currencyRate: 5.1,
    warLevel: 10,
    cities: [
      { name: '圣保罗', population: 1230, region: '圣保罗州' },
      { name: '里约热内卢', population: 675, region: '里约热内卢州' },
      { name: '巴西利亚', population: 305, region: '联邦区' },
      { name: '萨尔瓦多', population: 289, region: '巴伊亚州' },
      { name: '福塔莱萨', population: 269, region: '塞阿拉州' },
      { name: '贝洛奥里藏特', population: 253, region: '米纳斯吉拉斯州' },
      { name: '马瑙斯', population: 220, region: '亚马孙州' },
    ],
  },
  {
    id: 'bd', name: '孟加拉国', nameEn: 'Bangladesh', flag: '🇧🇩',
    population: 16900, birthRate: 18.2, economicLevel: 35, educationLevel: 45,
    healthcareLevel: 45, safetyLevel: 50, lifeExpectancy: 72, currency: '৳', currencyRate: 110,
    warLevel: 0,
    cities: [
      { name: '达卡', population: 2200, region: '达卡专区' },
      { name: '吉大港', population: 290, region: '吉大港专区' },
      { name: '库尔纳', population: 150, region: '库尔纳专区' },
      { name: '拉杰沙希', population: 80, region: '拉杰沙希专区' },
    ],
  },
  {
    id: 'ru', name: '俄罗斯', nameEn: 'Russia', flag: '🇷🇺',
    population: 14400, birthRate: 10.8, economicLevel: 60, educationLevel: 80,
    healthcareLevel: 62, safetyLevel: 55, lifeExpectancy: 70, currency: '₽', currencyRate: 90,
    warLevel: 40,
    cities: [
      { name: '莫斯科', population: 1300, region: '莫斯科' },
      { name: '圣彼得堡', population: 538, region: '圣彼得堡' },
      { name: '新西伯利亚', population: 162, region: '新西伯利亚州' },
      { name: '叶卡捷琳堡', population: 149, region: '斯维尔德洛夫斯克州' },
      { name: '喀山', population: 125, region: '鞑靼斯坦共和国' },
      { name: '下诺夫哥罗德', population: 124, region: '下诺夫哥罗德州' },
      { name: '海参崴', population: 60, region: '滨海边疆区' },
    ],
  },
  {
    id: 'mx', name: '墨西哥', nameEn: 'Mexico', flag: '🇲🇽',
    population: 12800, birthRate: 16.5, economicLevel: 50, educationLevel: 60,
    healthcareLevel: 55, safetyLevel: 40, lifeExpectancy: 75, currency: 'MX$', currencyRate: 17,
    warLevel: 20,
    cities: [
      { name: '墨西哥城', population: 2200, region: '墨西哥城' },
      { name: '瓜达拉哈拉', population: 510, region: '哈利斯科州' },
      { name: '蒙特雷', population: 114, region: '新莱昂州' },
      { name: '普埃布拉', population: 320, region: '普埃布拉州' },
      { name: '蒂华纳', population: 180, region: '下加利福尼亚州' },
      { name: '坎昆', population: 80, region: '金塔纳罗奥州' },
    ],
  },
  {
    id: 'jp', name: '日本', nameEn: 'Japan', flag: '🇯🇵',
    population: 12400, birthRate: 7.7, economicLevel: 88, educationLevel: 88,
    healthcareLevel: 92, safetyLevel: 92, lifeExpectancy: 85, currency: '¥', currencyRate: 145,
    warLevel: 0,
    cities: [
      { name: '东京', population: 1400, region: '东京都' },
      { name: '大阪', population: 269, region: '大阪府' },
      { name: '名古屋', population: 232, region: '爱知县' },
      { name: '横滨', population: 377, region: '神奈川县' },
      { name: '福冈', population: 160, region: '福冈县' },
      { name: '札幌', population: 197, region: '北海道' },
      { name: '京都', population: 146, region: '京都府' },
      { name: '仙台', population: 109, region: '宫城县' },
    ],
  },
  {
    id: 'et', name: '埃塞俄比亚', nameEn: 'Ethiopia', flag: '🇪🇹',
    population: 12400, birthRate: 32.3, economicLevel: 20, educationLevel: 30,
    healthcareLevel: 28, safetyLevel: 40, lifeExpectancy: 65, currency: 'Br', currencyRate: 56,
    warLevel: 35,
    cities: [
      { name: '亚的斯亚贝巴', population: 384, region: '亚的斯亚贝巴' },
      { name: '阿达马', population: 32, region: '奥罗米亚州' },
      { name: '贡德尔', population: 30, region: '阿姆哈拉州' },
      { name: '梅克勒', population: 50, region: '提格雷州' },
    ],
  },
  {
    id: 'ph', name: '菲律宾', nameEn: 'Philippines', flag: '🇵🇭',
    population: 11400, birthRate: 20.1, economicLevel: 42, educationLevel: 55,
    healthcareLevel: 48, safetyLevel: 50, lifeExpectancy: 71, currency: '₱', currencyRate: 56,
    warLevel: 20,
    cities: [
      { name: '马尼拉', population: 1800, region: '国家首都区' },
      { name: '奎松市', population: 296, region: '国家首都区' },
      { name: '宿务市', population: 96, region: '宿务省' },
      { name: '达沃市', population: 164, region: '达沃省' },
    ],
  },
  {
    id: 'eg', name: '埃及', nameEn: 'Egypt', flag: '🇪🇬',
    population: 10900, birthRate: 21.7, economicLevel: 40, educationLevel: 50,
    healthcareLevel: 48, safetyLevel: 45, lifeExpectancy: 70, currency: 'E£', currencyRate: 30,
    warLevel: 0,
    cities: [
      { name: '开罗', population: 960, region: '开罗省' },
      { name: '亚历山大', population: 550, region: '亚历山大省' },
      { name: '吉萨', population: 900, region: '吉萨省' },
      { name: '卢克索', population: 50, region: '卢克索省' },
      { name: '阿斯旺', population: 29, region: '阿斯旺省' },
    ],
  },
  {
    id: 'vn', name: '越南', nameEn: 'Vietnam', flag: '🇻🇳',
    population: 9900, birthRate: 15.6, economicLevel: 45, educationLevel: 58,
    healthcareLevel: 55, safetyLevel: 70, lifeExpectancy: 75, currency: '₫', currencyRate: 24000,
    warLevel: 0,
    cities: [
      { name: '胡志明市', population: 900, region: '胡志明市' },
      { name: '河内', population: 800, region: '河内' },
      { name: '岘港', population: 110, region: '岘港' },
      { name: '海防', population: 110, region: '海防' },
    ],
  },
  {
    id: 'cd', name: '刚果（金）', nameEn: 'DR Congo', flag: '🇨🇩',
    population: 9600, birthRate: 41.7, economicLevel: 18, educationLevel: 25,
    healthcareLevel: 25, safetyLevel: 30, lifeExpectancy: 59, currency: 'FC', currencyRate: 2700,
    warLevel: 45,
    cities: [
      { name: '金沙萨', population: 1500, region: '金沙萨' },
      { name: '卢本巴希', population: 200, region: '上加丹加省' },
      { name: '姆布吉马伊', population: 200, region: '东开赛省' },
      { name: '基桑加尼', population: 100, region: '乔波省' },
    ],
  },
  {
    id: 'tr', name: '土耳其', nameEn: 'Turkey', flag: '🇹🇷',
    population: 8500, birthRate: 14.8, economicLevel: 55, educationLevel: 62,
    healthcareLevel: 58, safetyLevel: 50, lifeExpectancy: 77, currency: '₺', currencyRate: 28,
    warLevel: 0,
    cities: [
      { name: '伊斯坦布尔', population: 1550, region: '伊斯坦布尔省' },
      { name: '安卡拉', population: 560, region: '安卡拉省' },
      { name: '伊兹密尔', population: 440, region: '伊兹密尔省' },
      { name: '安塔利亚', population: 130, region: '安塔利亚省' },
    ],
  },
  {
    id: 'ir', name: '伊朗', nameEn: 'Iran', flag: '🇮🇷',
    population: 8400, birthRate: 14.1, economicLevel: 48, educationLevel: 65,
    healthcareLevel: 55, safetyLevel: 45, lifeExpectancy: 76, currency: '﷼', currencyRate: 42000,
    warLevel: 0,
    cities: [
      { name: '德黑兰', population: 900, region: '德黑兰省' },
      { name: '马什哈德', population: 330, region: '拉扎维呼罗珊省' },
      { name: '伊斯法罕', population: 200, region: '伊斯法罕省' },
      { name: '设拉子', population: 160, region: '法尔斯省' },
    ],
  },
  {
    id: 'de', name: '德国', nameEn: 'Germany', flag: '🇩🇪',
    population: 8400, birthRate: 9.6, economicLevel: 92, educationLevel: 90,
    healthcareLevel: 90, safetyLevel: 85, lifeExpectancy: 81, currency: '€', currencyRate: 0.92,
    warLevel: 0,
    cities: [
      { name: '柏林', population: 370, region: '柏林' },
      { name: '汉堡', population: 185, region: '汉堡' },
      { name: '慕尼黑', population: 148, region: '巴伐利亚州' },
      { name: '科隆', population: 108, region: '北莱茵-威斯特法伦州' },
      { name: '法兰克福', population: 76, region: '黑森州' },
    ],
  },
  {
    id: 'th', name: '泰国', nameEn: 'Thailand', flag: '🇹🇭',
    population: 7200, birthRate: 11.2, economicLevel: 52, educationLevel: 60,
    healthcareLevel: 58, safetyLevel: 60, lifeExpectancy: 77, currency: '฿', currencyRate: 36,
    warLevel: 0,
    cities: [
      { name: '曼谷', population: 1050, region: '曼谷' },
      { name: '清迈', population: 130, region: '清迈府' },
      { name: '普吉', population: 40, region: '普吉府' },
      { name: '芭堤雅', population: 12, region: '春武里府' },
    ],
  },
  {
    id: 'gb', name: '英国', nameEn: 'UK', flag: '🇬🇧',
    population: 6700, birthRate: 11.6, economicLevel: 90, educationLevel: 88,
    healthcareLevel: 86, safetyLevel: 75, lifeExpectancy: 81, currency: '£', currencyRate: 0.79,
    warLevel: 0,
    cities: [
      { name: '伦敦', population: 900, region: '伦敦' },
      { name: '伯明翰', population: 114, region: '西米德兰兹' },
      { name: '曼彻斯特', population: 55, region: '大曼彻斯特' },
      { name: '利物浦', population: 50, region: '默西塞德郡' },
      { name: '爱丁堡', population: 53, region: '苏格兰' },
    ],
  },
  {
    id: 'fr', name: '法国', nameEn: 'France', flag: '🇫🇷',
    population: 6500, birthRate: 11.9, economicLevel: 88, educationLevel: 86,
    healthcareLevel: 88, safetyLevel: 70, lifeExpectancy: 82, currency: '€', currencyRate: 0.92,
    warLevel: 0,
    cities: [
      { name: '巴黎', population: 220, region: '法兰西岛大区' },
      { name: '马赛', population: 87, region: '普罗旺斯-阿尔卑斯-蓝色海岸大区' },
      { name: '里昂', population: 51, region: '奥弗涅-罗讷-阿尔卑斯大区' },
      { name: '尼斯', population: 34, region: '普罗旺斯-阿尔卑斯-蓝色海岸大区' },
      { name: '波尔多', population: 25, region: '新阿基坦大区' },
    ],
  },
  {
    id: 'it', name: '意大利', nameEn: 'Italy', flag: '🇮🇹',
    population: 5900, birthRate: 7.6, economicLevel: 82, educationLevel: 80,
    healthcareLevel: 85, safetyLevel: 70, lifeExpectancy: 83, currency: '€', currencyRate: 0.92,
    warLevel: 0,
    cities: [
      { name: '罗马', population: 280, region: '拉齐奥大区' },
      { name: '米兰', population: 140, region: '伦巴第大区' },
      { name: '那不勒斯', population: 96, region: '坎帕尼亚大区' },
      { name: '都灵', population: 87, region: '皮埃蒙特大区' },
      { name: '佛罗伦萨', population: 38, region: '托斯卡纳大区' },
    ],
  },
  {
    id: 'za', name: '南非', nameEn: 'South Africa', flag: '🇿🇦',
    population: 6000, birthRate: 20.1, economicLevel: 48, educationLevel: 55,
    healthcareLevel: 45, safetyLevel: 35, lifeExpectancy: 65, currency: 'R', currencyRate: 18,
    warLevel: 10,
    cities: [
      { name: '约翰内斯堡', population: 600, region: '豪登省' },
      { name: '开普敦', population: 470, region: '西开普省' },
      { name: '德班', population: 350, region: '夸祖鲁-纳塔尔省' },
      { name: '比勒陀利亚', population: 74, region: '豪登省' },
    ],
  },
  {
    id: 'tz', name: '坦桑尼亚', nameEn: 'Tanzania', flag: '🇹🇿',
    population: 6400, birthRate: 36.4, economicLevel: 22, educationLevel: 30,
    healthcareLevel: 30, safetyLevel: 45, lifeExpectancy: 66, currency: 'TSh', currencyRate: 2400,
    warLevel: 0,
    cities: [
      { name: '达累斯萨拉姆', population: 700, region: '达累斯萨拉姆区' },
      { name: '多多马', population: 20, region: '多多马区' },
      { name: '阿鲁沙', population: 40, region: '阿鲁沙区' },
    ],
  },
  {
    id: 'mm', name: '缅甸', nameEn: 'Myanmar', flag: '🇲🇲',
    population: 5400, birthRate: 17.3, economicLevel: 25, educationLevel: 40,
    healthcareLevel: 38, safetyLevel: 40, lifeExpectancy: 67, currency: 'K', currencyRate: 2100,
    warLevel: 40,
    cities: [
      { name: '仰光', population: 520, region: '仰光省' },
      { name: '曼德勒', population: 120, region: '曼德勒省' },
      { name: '内比都', population: 92, region: '内比都联邦区' },
    ],
  },
  {
    id: 'ke', name: '肯尼亚', nameEn: 'Kenya', flag: '🇰🇪',
    population: 5500, birthRate: 28.4, economicLevel: 30, educationLevel: 45,
    healthcareLevel: 40, safetyLevel: 40, lifeExpectancy: 66, currency: 'KSh', currencyRate: 130,
    warLevel: 15,
    cities: [
      { name: '内罗毕', population: 470, region: '内罗毕郡' },
      { name: '蒙巴萨', population: 120, region: '蒙巴萨郡' },
      { name: '基苏木', population: 100, region: '基苏木郡' },
    ],
  },
  {
    id: 'kr', name: '韩国', nameEn: 'South Korea', flag: '🇰🇷',
    population: 5200, birthRate: 6.9, economicLevel: 90, educationLevel: 92,
    healthcareLevel: 90, safetyLevel: 85, lifeExpectancy: 83, currency: '₩', currencyRate: 1330,
    warLevel: 0,
    cities: [
      { name: '首尔', population: 950, region: '首尔特别市' },
      { name: '釜山', population: 340, region: '釜山广域市' },
      { name: '仁川', population: 295, region: '仁川广域市' },
      { name: '大邱', population: 240, region: '大邱广域市' },
      { name: '大田', population: 150, region: '大田广域市' },
      { name: '光州', population: 145, region: '光州广域市' },
    ],
  },
  {
    id: 'co', name: '哥伦比亚', nameEn: 'Colombia', flag: '🇨🇴',
    population: 5100, birthRate: 14.7, economicLevel: 48, educationLevel: 58,
    healthcareLevel: 55, safetyLevel: 42, lifeExpectancy: 77, currency: 'COP', currencyRate: 4000,
    warLevel: 15,
    cities: [
      { name: '波哥大', population: 1100, region: '波哥大首都区' },
      { name: '麦德林', population: 250, region: '安蒂奥基亚省' },
      { name: '卡利', population: 220, region: '考卡山谷省' },
      { name: '卡塔赫纳', population: 100, region: '玻利瓦尔省' },
    ],
  },
  {
    id: 'es', name: '西班牙', nameEn: 'Spain', flag: '🇪🇸',
    population: 4700, birthRate: 8.4, economicLevel: 85, educationLevel: 84,
    healthcareLevel: 86, safetyLevel: 75, lifeExpectancy: 83, currency: '€', currencyRate: 0.92,
    warLevel: 0,
    cities: [
      { name: '马德里', population: 330, region: '马德里自治区' },
      { name: '巴塞罗那', population: 160, region: '加泰罗尼亚' },
      { name: '瓦伦西亚', population: 79, region: '巴伦西亚自治区' },
      { name: '塞维利亚', population: 68, region: '安达卢西亚' },
    ],
  },
  {
    id: 'ar', name: '阿根廷', nameEn: 'Argentina', flag: '🇦🇷',
    population: 4600, birthRate: 16.4, economicLevel: 55, educationLevel: 65,
    healthcareLevel: 62, safetyLevel: 45, lifeExpectancy: 76, currency: 'AR$', currencyRate: 900,
    warLevel: 5,
    cities: [
      { name: '布宜诺斯艾利斯', population: 1500, region: '布宜诺斯艾利斯省' },
      { name: '科尔多瓦', population: 160, region: '科尔多瓦省' },
      { name: '罗萨里奥', population: 120, region: '圣菲省' },
      { name: '门多萨', population: 110, region: '门多萨省' },
    ],
  },
  {
    id: 'ua', name: '乌克兰', nameEn: 'Ukraine', flag: '🇺🇦',
    population: 4000, birthRate: 10.5, economicLevel: 45, educationLevel: 75,
    healthcareLevel: 55, safetyLevel: 45, lifeExpectancy: 72, currency: '₴', currencyRate: 38,
    warLevel: 85,
    cities: [
      { name: '基辅', population: 290, region: '基辅' },
      { name: '哈尔科夫', population: 140, region: '哈尔科夫州' },
      { name: '敖德萨', population: 100, region: '敖德萨州' },
      { name: '利沃夫', population: 72, region: '利沃夫州' },
    ],
  },
  {
    id: 'dz', name: '阿尔及利亚', nameEn: 'Algeria', flag: '🇩🇿',
    population: 4500, birthRate: 22.4, economicLevel: 42, educationLevel: 55,
    healthcareLevel: 52, safetyLevel: 50, lifeExpectancy: 77, currency: 'DA', currencyRate: 135,
    warLevel: 0,
    cities: [
      { name: '阿尔及尔', population: 300, region: '阿尔及尔省' },
      { name: '奥兰', population: 160, region: '奥兰省' },
      { name: '君士坦丁', population: 90, region: '君士坦丁省' },
    ],
  },
  {
    id: 'sd', name: '苏丹', nameEn: 'Sudan', flag: '🇸🇩',
    population: 4800, birthRate: 32.0, economicLevel: 20, educationLevel: 30,
    healthcareLevel: 28, safetyLevel: 30, lifeExpectancy: 65, currency: 'SDG', currencyRate: 600,
    warLevel: 70,
    cities: [
      { name: '喀土穆', population: 500, region: '喀土穆州' },
      { name: '恩图曼', population: 250, region: '喀土穆州' },
      { name: '苏丹港', population: 50, region: '红海州' },
    ],
  },
  {
    id: 'iq', name: '伊拉克', nameEn: 'Iraq', flag: '🇮🇶',
    population: 4400, birthRate: 26.2, economicLevel: 38, educationLevel: 45,
    healthcareLevel: 45, safetyLevel: 30, lifeExpectancy: 71, currency: 'IQD', currencyRate: 1300,
    warLevel: 60,
    cities: [
      { name: '巴格达', population: 750, region: '巴格达省' },
      { name: '巴士拉', population: 280, region: '巴士拉省' },
      { name: '摩苏尔', population: 180, region: '尼尼微省' },
      { name: '埃尔比勒', population: 110, region: '埃尔比勒省' },
    ],
  },
  {
    id: 'pl', name: '波兰', nameEn: 'Poland', flag: '🇵🇱',
    population: 3800, birthRate: 9.8, economicLevel: 70, educationLevel: 80,
    healthcareLevel: 75, safetyLevel: 75, lifeExpectancy: 78, currency: 'zł', currencyRate: 4.0,
    warLevel: 0,
    cities: [
      { name: '华沙', population: 180, region: '马佐夫舍省' },
      { name: '克拉科夫', population: 77, region: '小波兰省' },
      { name: '罗兹', population: 68, region: '罗兹省' },
      { name: '格但斯克', population: 46, region: '滨海省' },
    ],
  },
  {
    id: 'ca', name: '加拿大', nameEn: 'Canada', flag: '🇨🇦',
    population: 3900, birthRate: 10.5, economicLevel: 92, educationLevel: 90,
    healthcareLevel: 88, safetyLevel: 85, lifeExpectancy: 82, currency: 'C$', currencyRate: 1.35,
    warLevel: 0,
    cities: [
      { name: '多伦多', population: 620, region: '安大略省' },
      { name: '蒙特利尔', population: 420, region: '魁北克省' },
      { name: '温哥华', population: 260, region: '不列颠哥伦比亚省' },
      { name: '卡尔加里', population: 160, region: '艾伯塔省' },
      { name: '渥太华', population: 100, region: '安大略省' },
    ],
  },
  {
    id: 'ma', name: '摩洛哥', nameEn: 'Morocco', flag: '🇲🇦',
    population: 3700, birthRate: 18.1, economicLevel: 40, educationLevel: 50,
    healthcareLevel: 48, safetyLevel: 55, lifeExpectancy: 76, currency: 'MAD', currencyRate: 10,
    warLevel: 0,
    cities: [
      { name: '卡萨布兰卡', population: 360, region: '卡萨布兰卡-塞塔特大区' },
      { name: '拉巴特', population: 58, region: '拉巴特-萨累-凯尼特拉大区' },
      { name: '马拉喀什', population: 90, region: '马拉喀什-萨菲大区' },
      { name: '非斯', population: 110, region: '非斯-梅克内斯大区' },
    ],
  },
  {
    id: 'sa', name: '沙特阿拉伯', nameEn: 'Saudi Arabia', flag: '🇸🇦',
    population: 3600, birthRate: 16.8, economicLevel: 75, educationLevel: 70,
    healthcareLevel: 70, safetyLevel: 75, lifeExpectancy: 76, currency: 'SR', currencyRate: 3.75,
    warLevel: 0,
    cities: [
      { name: '利雅得', population: 750, region: '利雅得省' },
      { name: '吉达', population: 400, region: '麦加省' },
      { name: '麦加', population: 170, region: '麦加省' },
      { name: '麦地那', population: 120, region: '麦地那省' },
    ],
  },
  {
    id: 'uz', name: '乌兹别克斯坦', nameEn: 'Uzbekistan', flag: '🇺🇿',
    population: 3500, birthRate: 23.6, economicLevel: 35, educationLevel: 55,
    healthcareLevel: 50, safetyLevel: 50, lifeExpectancy: 71, currency: 'UZS', currencyRate: 12500,
    warLevel: 0,
    cities: [
      { name: '塔什干', population: 260, region: '塔什干' },
      { name: '撒马尔罕', population: 55, region: '撒马尔罕州' },
      { name: '布哈拉', population: 28, region: '布哈拉州' },
    ],
  },
  {
    id: 'pe', name: '秘鲁', nameEn: 'Peru', flag: '🇵🇪',
    population: 3400, birthRate: 17.6, economicLevel: 45, educationLevel: 58,
    healthcareLevel: 52, safetyLevel: 42, lifeExpectancy: 77, currency: 'S/', currencyRate: 3.8,
    warLevel: 0,
    cities: [
      { name: '利马', population: 1100, region: '利马省' },
      { name: '阿雷基帕', population: 100, region: '阿雷基帕大区' },
      { name: '库斯科', population: 50, region: '库斯科大区' },
      { name: '特鲁希略', population: 80, region: '拉利伯塔德大区' },
    ],
  },
  {
    id: 'ao', name: '安哥拉', nameEn: 'Angola', flag: '🇦🇴',
    population: 3500, birthRate: 38.1, economicLevel: 28, educationLevel: 30,
    healthcareLevel: 30, safetyLevel: 32, lifeExpectancy: 61, currency: 'Kz', currencyRate: 830,
    warLevel: 0,
    cities: [
      { name: '罗安达', population: 900, region: '罗安达省' },
      { name: '万博', population: 60, region: '万博省' },
      { name: '卢班戈', population: 30, region: '威拉省' },
    ],
  },
  {
    id: 'my', name: '马来西亚', nameEn: 'Malaysia', flag: '🇲🇾',
    population: 3300, birthRate: 16.2, economicLevel: 60, educationLevel: 65,
    healthcareLevel: 62, safetyLevel: 65, lifeExpectancy: 76, currency: 'RM', currencyRate: 4.6,
    warLevel: 0,
    cities: [
      { name: '吉隆坡', population: 180, region: '吉隆坡联邦直辖区' },
      { name: '乔治市', population: 70, region: '槟城州' },
      { name: '新山', population: 160, region: '柔佛州' },
      { name: '亚庇', population: 45, region: '沙巴州' },
    ],
  },
  {
    id: 'gh', name: '加纳', nameEn: 'Ghana', flag: '🇬🇭',
    population: 3300, birthRate: 29.2, economicLevel: 30, educationLevel: 40,
    healthcareLevel: 36, safetyLevel: 45, lifeExpectancy: 64, currency: 'GH₵', currencyRate: 15,
    warLevel: 0,
    cities: [
      { name: '阿克拉', population: 250, region: '大阿克拉地区' },
      { name: '库马西', population: 200, region: '阿散蒂地区' },
      { name: '塔马利', population: 40, region: '北部地区' },
    ],
  },
  {
    id: 'au', name: '澳大利亚', nameEn: 'Australia', flag: '🇦🇺',
    population: 2600, birthRate: 12.1, economicLevel: 92, educationLevel: 90,
    healthcareLevel: 88, safetyLevel: 85, lifeExpectancy: 83, currency: 'A$', currencyRate: 1.5,
    warLevel: 0,
    cities: [
      { name: '悉尼', population: 530, region: '新南威尔士州' },
      { name: '墨尔本', population: 500, region: '维多利亚州' },
      { name: '布里斯班', population: 250, region: '昆士兰州' },
      { name: '珀斯', population: 210, region: '西澳大利亚州' },
      { name: '阿德莱德', population: 140, region: '南澳大利亚州' },
    ],
  },
  {
    id: 'nl', name: '荷兰', nameEn: 'Netherlands', flag: '🇳🇱',
    population: 1800, birthRate: 10.6, economicLevel: 92, educationLevel: 90,
    healthcareLevel: 90, safetyLevel: 85, lifeExpectancy: 82, currency: '€', currencyRate: 0.92,
    warLevel: 0,
    cities: [
      { name: '阿姆斯特丹', population: 90, region: '北荷兰省' },
      { name: '鹿特丹', population: 65, region: '南荷兰省' },
      { name: '海牙', population: 55, region: '南荷兰省' },
      { name: '乌得勒支', population: 36, region: '乌得勒支省' },
    ],
  },
  {
    id: 'se', name: '瑞典', nameEn: 'Sweden', flag: '🇸🇪',
    population: 1050, birthRate: 10.8, economicLevel: 92, educationLevel: 90,
    healthcareLevel: 90, safetyLevel: 85, lifeExpectancy: 83, currency: 'kr', currencyRate: 10.5,
    warLevel: 0,
    cities: [
      { name: '斯德哥尔摩', population: 98, region: '斯德哥尔摩省' },
      { name: '哥德堡', population: 60, region: '西约塔兰省' },
      { name: '马尔默', population: 35, region: '斯科讷省' },
    ],
  },
  {
    id: 'ch', name: '瑞士', nameEn: 'Switzerland', flag: '🇨🇭',
    population: 880, birthRate: 10.2, economicLevel: 95, educationLevel: 92,
    healthcareLevel: 92, safetyLevel: 88, lifeExpectancy: 84, currency: 'CHF', currencyRate: 0.9,
    warLevel: 0,
    cities: [
      { name: '苏黎世', population: 42, region: '苏黎世州' },
      { name: '日内瓦', population: 20, region: '日内瓦州' },
      { name: '巴塞尔', population: 17, region: '巴塞尔城市州' },
    ],
  },
  {
    id: 'sg', name: '新加坡', nameEn: 'Singapore', flag: '🇸🇬',
    population: 590, birthRate: 8.8, economicLevel: 95, educationLevel: 92,
    healthcareLevel: 92, safetyLevel: 90, lifeExpectancy: 84, currency: 'S$', currencyRate: 1.35,
    warLevel: 0,
    cities: [{ name: '新加坡市', population: 590, region: '新加坡' }],
  },
  {
    id: 'no', name: '挪威', nameEn: 'Norway', flag: '🇳🇴',
    population: 550, birthRate: 11.3, economicLevel: 94, educationLevel: 90,
    healthcareLevel: 90, safetyLevel: 88, lifeExpectancy: 83, currency: 'kr', currencyRate: 10.7,
    warLevel: 0,
    cities: [
      { name: '奥斯陆', population: 70, region: '奥斯陆郡' },
      { name: '卑尔根', population: 29, region: '韦斯特兰郡' },
      { name: '特隆赫姆', population: 20, region: '特伦德拉格郡' },
    ],
  },
  {
    id: 'ss', name: '南苏丹', nameEn: 'South Sudan', flag: '🇸🇸',
    population: 1100, birthRate: 35.5, economicLevel: 15, educationLevel: 20,
    healthcareLevel: 20, safetyLevel: 25, lifeExpectancy: 55, currency: 'SSP', currencyRate: 130,
    warLevel: 80,
    cities: [
      { name: '朱巴', population: 80, region: '中赤道州' },
      { name: '拉多', population: 20, region: '西加扎勒河州' },
    ],
  },
];
