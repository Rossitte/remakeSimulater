/**
 * 死亡方式数据库。
 *
 * 分两类：
 * 1. 通用死因（按事故/疾病/灾难/犯罪/战争分类，带年龄与性别筛选）
 * 2. 职业伤害死因（电工触电、矿工瓦斯爆炸……），只在死因类型匹配时改写文案
 *
 * 这里只负责「怎么死」的文案，概率仍由 healthEngine 决定，
 * 所以扩充数据不会改变各死法的大致比例。
 */

export type DeathCategory = 'traffic' | 'accident' | 'disaster' | 'crime' | 'war';

export interface DeathCauseEntry {
  /** 死因（展示在「死因」一栏） */
  cause: string;
  /** 事件标题 */
  title: string;
  /** 事件描述 */
  description: string;
  weight: number;
  minAge?: number;
  maxAge?: number;
  gender?: '男' | '女';
  category: DeathCategory;
}

const e = (
  category: DeathCategory,
  cause: string,
  title: string,
  description: string,
  weight = 1,
  extra: Partial<DeathCauseEntry> = {},
): DeathCauseEntry => ({ category, cause, title, description, weight, ...extra });

/** 交通事故 */
export const TRAFFIC_DEATHS: DeathCauseEntry[] = [
  e('traffic', '卷入货车盲区', '卷入货车盲区', '你在路口被一辆右转的货车卷进车底，当场没了呼吸。', 3),
  e('traffic', '深夜追尾', '深夜追尾', '凌晨三点，你追尾了一辆停在应急车道的大货车。', 3, { minAge: 18 }),
  e('traffic', '雨天打滑', '雨天打滑', '雨天路滑，你的车失控冲出了护栏。', 3, { minAge: 18 }),
  e('traffic', '酒驾事故', '酒驾事故', '你喝了酒还是上了车，最后一段路是撞在桥墩上结束的。', 3, { minAge: 18 }),
  e('traffic', '被酒驾车撞', '被酒驾车撞', '一辆闯红灯的醉驾车从侧面撞上了你。', 2),
  e('traffic', '疲劳驾驶', '疲劳驾驶', '你连续开了十四个小时，在一个弯道上睡着了。', 3, { minAge: 20 }),
  e('traffic', '高速爆胎', '高速爆胎', '高速上轮胎突然爆了，车翻了三个跟头。', 2, { minAge: 20 }),
  e('traffic', '闯红灯', '闯红灯', '你赶时间闯了红灯，另一侧的卡车正好起步。', 2),
  e('traffic', '电动车事故', '电动车事故', '你骑电动车穿过路口时被撞飞，头盔甩出去十几米。', 4, { minAge: 14 }),
  e('traffic', '摩托车事故', '摩托车事故', '你骑着摩托车压过一片沙子，人甩出去撞在护栏上。', 4, { minAge: 16 }),
  e('traffic', '山路会车', '山路会车', '山路会车时对方占道，你的车翻下了坡。', 2, { minAge: 20 }),
  e('traffic', '隧道追尾', '隧道追尾', '隧道里前车急刹，你来不及反应，后面的车又撞了上来。', 2, { minAge: 20 }),
  e('traffic', '大巴侧翻', '大巴侧翻', '长途大巴在高速上侧翻，你被压在行李架下面。', 2),
  e('traffic', '渡轮倾覆', '渡轮倾覆', '渡轮在江心倾覆，你不会游泳。', 1),
  e('traffic', '站台跌落', '站台跌落', '你在站台上被人群挤下了轨道。', 1),
  e('traffic', '校车事故', '校车事故', '校车在转弯时被撞翻，你没能出来。', 1, { maxAge: 16 }),
  e('traffic', '倒车碾压', '倒车碾压', '一辆车倒车时没有看见蹲在车后的你。', 2, { maxAge: 8 }),
  e('traffic', '骑车摔进沟里', '骑车摔进沟里', '你骑车下坡时刹车失灵，连人带车栽进了路边的水沟。', 2),
  e('traffic', '无证驾驶', '无证驾驶', '你借了辆车偷偷上路，在一个转弯处没能拐过来。', 2, { minAge: 16, maxAge: 30 }),
  e('traffic', '醉驾逆行', '醉驾逆行', '你醉酒后逆行上了高架，迎面撞上了一辆网约车。', 2, { minAge: 20 }),
  e('traffic', '行人被撞', '行人被撞', '你低头看手机过马路，没有注意到那辆疾驰而来的车。', 3),
  e('traffic', '空难', '空难', '你乘坐的航班在降落前失去控制。', 1, { minAge: 12 }),
  e('traffic', '列车脱轨', '列车脱轨', '列车在暴雨中脱轨，你所在的这节车厢翻下了路基。', 1),
  e('traffic', '骑车被开车门撞倒', '开门杀', '路边一辆车突然开门，你连人带车摔进了车流里。', 2, { minAge: 14 }),
];

/** 意外事故 */
export const ACCIDENT_DEATHS: DeathCauseEntry[] = [
  e('accident', '触电身亡', '触电身亡', '你伸手去拉一根漏电的电线，身体一下就僵住了。', 4),
  e('accident', '高空坠落', '高空坠落', '你脚下的踏板突然断裂，人直接坠了下去。', 4, { minAge: 16, maxAge: 62 }),
  e('accident', '脚手架坍塌', '脚手架坍塌', '整排脚手架在你身边塌了下来。', 3, { minAge: 16, maxAge: 62 }),
  e('accident', '塔吊倒塌', '塔吊倒塌', '塔吊在吊装时突然倾覆，砸穿了你所在的工棚。', 2, { minAge: 18, maxAge: 60 }),
  e('accident', '机械卷入', '机械卷入', '你的衣袖被卷入运转的机器，人也被带了进去。', 3, { minAge: 16, maxAge: 62 }),
  e('accident', '切割机伤及动脉', '切割机伤及动脉', '角磨机反弹切开了你的大腿动脉，血流得太快。', 2, { minAge: 16 }),
  e('accident', '煤气中毒', '煤气中毒', '那天夜里煤气泄漏，你在睡梦中再也没有醒来。', 3),
  e('accident', '一氧化碳中毒', '一氧化碳中毒', '冬天你把炭盆搬进了屋里，门窗关得严严实实。', 3),
  e('accident', '热水器漏电', '热水器漏电', '洗澡时热水器漏电，你倒在浴室地砖上。', 2),
  e('accident', '误食毒蘑菇', '误食毒蘑菇', '你在山上采了一篮蘑菇，其中有一朵是要命的。', 2),
  e('accident', '酒精中毒', '酒精中毒', '一场酒局上你被灌了太多，夜里再没醒过来。', 2, { minAge: 18 }),
  e('accident', '药物过量', '药物过量', '你吃下了远超剂量的药，等家人发现时已经晚了。', 2, { minAge: 16 }),
  e('accident', '蜂蜇过敏', '蜂蜇过敏', '一只马蜂蜇在你脖子上，你出现了严重的过敏反应。', 2),
  e('accident', '狂犬病发作', '狂犬病发作', '多年前被狗咬的伤口早已愈合，病毒却一直潜伏着。', 1),
  e('accident', '高空坠物', '高空坠物', '一块从二十楼掉下来的玻璃砸中了你。', 2),
  e('accident', '电梯坠落', '电梯坠落', '电梯在十七楼突然失控下坠。', 1, { minAge: 10 }),
  e('accident', '烟花爆竹爆炸', '烟花爆竹爆炸', '一箱还没燃尽的烟花突然炸开。', 2),
  e('accident', '溺水', '溺水', '你在水库边下水，脚下一滑就再没上来。', 4),
  e('accident', '冰面破裂', '冰面破裂', '你踩上结冰的湖面，冰层在你脚下裂开。', 2),
  e('accident', '滑翔伞失控', '滑翔伞失控', '滑翔伞在气流里失去控制，你连人带伞砸向山壁。', 1, { minAge: 18, maxAge: 55 }),
  e('accident', '攀岩坠落', '攀岩坠落', '你解开保护绳去摸下一个岩点，手滑了。', 2, { minAge: 18, maxAge: 60 }),
  e('accident', '潜水意外', '潜水意外', '你在水下发现气瓶读数不对，但已经来不及上浮。', 2, { minAge: 18, maxAge: 60 }),
  e('accident', '滑雪撞树', '滑雪撞树', '你冲下雪道时失控，撞在了一棵松树上。', 2, { minAge: 14, maxAge: 60 }),
  e('accident', '雷击', '雷击', '雷雨天你还在山顶上没下来。', 1),
  e('accident', '噎住窒息', '噎住窒息', '一块肉卡在气管里，身边的人都不会急救。', 2),
  e('accident', '火灾遇难', '火灾遇难', '凌晨的大火烧起来时，防盗窗挡住了唯一的出口。', 3),
  e('accident', '化工厂爆炸', '化工厂爆炸', '工厂的储罐发生了连环爆炸。', 1, { minAge: 18 }),
  e('accident', '矿井瓦斯爆炸', '矿井瓦斯爆炸', '井下瓦斯浓度超标，一簇火花点燃了整条巷道。', 2, { minAge: 18 }),
  e('accident', '隧道塌方', '隧道塌方', '掘进面突然涌水塌方，你没来得及退出来。', 2, { minAge: 18 }),
  e('accident', '沼气池中毒', '沼气池中毒', '你下池清淤时吸入了硫化氢，几秒钟就倒下了。', 2, { minAge: 16 }),
  e('accident', '海钓落水', '海钓落水', '你在礁石上钓鱼，一个浪头把你卷进了海里。', 2),
  e('accident', '醉酒失足', '醉酒失足', '你喝多了走夜路，一脚踩空掉进了河里。', 3, { minAge: 18 }),
  e('accident', '密闭空间窒息', '密闭空间窒息', '你钻进废弃的油罐里干活，再也没有爬出来。', 2, { minAge: 18 }),
  e('accident', '失温', '失温', '你在野外迷了路，那一夜的温度降到了零下。', 2),
  e('accident', '热射病', '热射病', '四十度的高温里你还在户外干活，倒下时体温超过四十一度。', 2),
  e('accident', '被马蜂群攻', '被马蜂群攻', '你捅了树上的马蜂窝，几百只马蜂追了你半里地。', 1),
  e('accident', '毒蛇咬伤', '毒蛇咬伤', '你在田埂上被一条毒蛇咬了小腿。', 1),
  e('accident', '异物卡喉', '异物卡喉', '一颗果冻卡住了你的气管。', 1, { maxAge: 10 }),
  e('accident', '坠井', '坠井', '你踩空的是一口没有盖子的废井。', 1),
  e('accident', '被重物压住', '被重物压住', '堆在墙边的钢板倒了下来。', 2, { minAge: 16 }),
  e('accident', '电鱼事故', '电鱼事故', '你背着电瓶下河电鱼，自己先倒在了水里。', 1, { minAge: 18 }),
  e('accident', '高空清洗坠落', '高空清洗坠落', '你吊在大楼外墙上清洗玻璃，安全绳的扣子松了。', 1, { minAge: 18, maxAge: 58 }),
  e('accident', '煤气罐爆炸', '煤气罐爆炸', '小吃摊的煤气罐在你身边炸开。', 2, { minAge: 16 }),
  e('accident', '被撞的环卫工', '凌晨的清扫', '天还没亮，你在马路上清扫，一辆车没有减速。', 1, { minAge: 30 }),
  e('accident', '浴室滑倒', '浴室滑倒', '你洗完澡起身时滑倒，后脑磕在了瓷砖上。', 3, { minAge: 65 }),
  e('accident', '骨折并发症', '卧床不起', '你摔断髋骨后卧床不起，并发症来得比预想快。', 3, { minAge: 70 }),
  e('accident', '噎食窒息', '噎食窒息', '一口饭卡在喉咙里，等家人发现时已经晚了。', 2, { minAge: 65 }),
  e('accident', '夜间失足', '夜里失足', '你起夜时没开灯，一脚踩空摔下了楼梯。', 2, { minAge: 60 }),
  e('accident', '下水道中毒', '下水道中毒', '你下井疏通管道，井下的气体让你当场倒下。', 1, { minAge: 18 }),
];

/** 自然灾害 */
export const DISASTER_DEATHS: DeathCauseEntry[] = [
  e('disaster', '地震遇难', '地震遇难', '地震来袭时，你所在的楼塌了。', 2),
  e('disaster', '海啸吞没', '海啸吞没', '海啸来的时候，你还在沙滩上收拾东西。', 1),
  e('disaster', '台风遇难', '台风遇难', '台风掀翻了屋顶，飞起的铁皮削中了你的脖子。', 1),
  e('disaster', '洪水冲走', '洪水冲走', '夜里的洪水漫过堤坝，你被冲出了十几里。', 1),
  e('disaster', '泥石流掩埋', '泥石流掩埋', '暴雨后的泥石流冲进了村子。', 1),
  e('disaster', '山体滑坡', '山体滑坡', '你开车经过的山路整段塌了下来。', 1),
  e('disaster', '雪崩掩埋', '雪崩掩埋', '山顶的积雪整片滑落，把你埋在了下面。', 1),
  e('disaster', '龙卷风', '龙卷风', '龙卷风把你的房子整个掀了起来。', 1),
  e('disaster', '火山喷发', '火山喷发', '火山灰和岩浆吞没了你所在的村子。', 1),
  e('disaster', '山火围困', '山火围困', '大火借着风势封住了唯一的退路。', 1),
  e('disaster', '极寒冻死', '极寒冻死', '那年的寒潮冻裂了水管，也冻僵了露宿街头的你。', 1),
  e('disaster', '热浪致死', '热浪致死', '连续四十天的高温里，你独自在家，再没醒来。', 1, { minAge: 55 }),
  e('disaster', '沙尘暴', '沙尘暴', '能见度不到五米的沙尘暴里，你被卷进了车流。', 1),
  e('disaster', '冰雹', '冰雹', '鸡蛋大的冰雹砸下来时，你还在田里。', 1),
  e('disaster', '雷暴', '雷暴', '雷暴天你在大树下躲雨。', 1),
];

/** 刑事案件 */
export const CRIME_DEATHS: DeathCauseEntry[] = [
  e('crime', '凶杀案', '凶杀案', '你成了一桩凶杀案的受害者。', 2),
  e('crime', '抢劫遇害', '抢劫遇害', '你在深夜的巷子里遇上了抢劫，反抗时被捅了一刀。', 2, { minAge: 16 }),
  e('crime', '入室盗窃被发现', '入室盗窃', '小偷翻进你家，你正好起夜。', 1),
  e('crime', '街头斗殴', '街头斗殴', '一场口角升级成群殴，你被打倒在地后再没起来。', 2, { minAge: 16 }),
  e('crime', '帮派火并', '帮派火并', '两伙人在夜市动了刀。', 1, { minAge: 16 }),
  e('crime', '恐怖袭击', '恐怖袭击', '爆炸发生的时候，你正好经过那个路口。', 1),
  e('crime', '绑架撕票', '绑架撕票', '你被绑架后，家属没能凑齐赎金。', 1, { maxAge: 60 }),
  e('crime', '枪击', '枪击', '一颗流弹击中了正在回家的你。', 1),
  e('crime', '投毒', '投毒', '你喝下了被人动过手脚的水。', 1),
  e('crime', '家暴致死', '家暴致死', '长期的家庭暴力在那天失控了。', 1, { minAge: 18 }),
  e('crime', '见义勇为被刺', '见义勇为被刺', '你冲上去制止一场抢劫，被对方捅中了心脏。', 1, { minAge: 18 }),
  e('crime', '遭遇随机袭击', '遭遇随机袭击', '一个精神异常的人持刀冲进了人群。', 1),
  e('crime', '诈骗团伙灭口', '诈骗团伙灭口', '你发现被骗后上门讨说法，再也没能出来。', 1, { minAge: 20 }),
  e('crime', '逃逸车祸', '逃逸车祸', '撞你的那辆车没有停下来。', 1, { minAge: 10 }),
];

/** 战争 */
export const WAR_DEATHS: DeathCauseEntry[] = [
  e('war', '炮击身亡', '炮击身亡', '炮弹落在你躲藏的楼里。', 2),
  e('war', '空袭遇难', '空袭遇难', '空袭警报响起时，你已经来不及进防空洞。', 2),
  e('war', '地雷爆炸', '地雷爆炸', '你在田里踩到了一颗埋了多年的地雷。', 2),
  e('war', '狙击手射杀', '狙击手射杀', '你只是想去街角打一桶水。', 1),
  e('war', '巷战阵亡', '巷战阵亡', '巷战打到了你家门口。', 1, { minAge: 16 }),
  e('war', '化学武器', '化学武器', '空气里的味道不对时，已经来不及了。', 1),
  e('war', '无人机袭击', '无人机袭击', '一架无人机在你头顶投下了炸弹。', 1),
  e('war', '围城饿死', '围城饿死', '城市被围了半年，最后饿死的人比炸死的还多。', 1),
  e('war', '战地医疗缺失', '得不到救治', '你受了伤，但医院已经没有药了。', 2),
  e('war', '误伤', '误伤', '一枚打偏的炮弹落在了居民区。', 1),
  e('war', '强制征兵阵亡', '强制征兵', '你被拉上了前线，两个月后就没了消息。', 1, { minAge: 16 }),
  e('war', '难民营疾病', '难民营疾病', '难民营里爆发了霍乱。', 1),
];

/** 疾病类死因（healthEngine 从里面抽，图鉴也从这里取） */
export const ILLNESS_DEATHS: string[] = [
  '癌症', '心脏病', '中风', '严重肺炎', '肝硬化', '肾病', '白血病', '尿毒症', '肺纤维化',
];

export const ALL_DEATH_CAUSES: DeathCauseEntry[] = [
  ...TRAFFIC_DEATHS,
  ...ACCIDENT_DEATHS,
  ...DISASTER_DEATHS,
  ...CRIME_DEATHS,
  ...WAR_DEATHS,
];

// ==========================================================================
// 职业伤害死因
// ==========================================================================

export interface OccupationalDeath {
  cause: string;
  title: string;
  description: string;
}

export interface OccupationalHazard {
  /** 对应的职业 id */
  professionIds: string[];
  /** 只有这些死亡类型会被改写 */
  deathTypes: Array<'accident' | 'illness' | 'crime' | 'war'>;
  /** 命中概率（已经确定这类死亡，只是把原因说得更具体） */
  probability: number;
  deaths: OccupationalDeath[];
}

export const OCCUPATIONAL_HAZARDS: OccupationalHazard[] = [
  {
    professionIds: ['electrician', 'power_line_worker', 'welder'],
    deathTypes: ['accident'],
    probability: 0.62,
    deaths: [
      { cause: '触电身亡', title: '检修时触电', description: '你在带电作业时碰到了裸露的线头，人当场就倒了。' },
      { cause: '高压电弧灼伤', title: '高压电弧', description: '合闸的瞬间起了一道电弧，你被掀出去两米远。' },
      { cause: '变压器爆炸', title: '变压器爆炸', description: '你正在检修的变压器突然炸开，油火扑了你一身。' },
      { cause: '从电线杆坠落', title: '从电线杆坠落', description: '安全带没有扣牢，你从十二米高的电线杆上摔了下来。' },
    ],
  },
  {
    professionIds: ['miner', 'tunnel_worker', 'blaster', 'oil_worker'],
    deathTypes: ['accident', 'illness'],
    probability: 0.6,
    deaths: [
      { cause: '瓦斯爆炸', title: '瓦斯爆炸', description: '井下的瓦斯浓度超标，一簇火花点燃了整条巷道。' },
      { cause: '矿井塌方', title: '矿井塌方', description: '顶板突然塌了下来，你被埋在了巷道深处。' },
      { cause: '哑炮爆炸', title: '哑炮爆炸', description: '一枚没响的炸药在你走近时突然炸了。' },
      { cause: '尘肺病', title: '确诊尘肺病', description: '在矿上干了二十年，你的肺已经像石头一样硬了。' },
    ],
  },
  {
    professionIds: ['construction', 'highrise_worker', 'crane_operator', 'painter', 'mover'],
    deathTypes: ['accident'],
    probability: 0.58,
    deaths: [
      { cause: '高处坠落', title: '脚手架踩空', description: '你踩上了一块没有固定的踏板，人直接掉了下去。' },
      { cause: '脚手架坍塌', title: '脚手架坍塌', description: '整排脚手架在浇筑时塌了，你被埋在钢管下面。' },
      { cause: '塔吊倾覆', title: '塔吊倾覆', description: '塔吊在吊装时突然失去平衡，砸向了你所在的楼层。' },
      { cause: '被坠物砸中', title: '被坠物砸中', description: '一捆钢筋从十六楼掉下来，安全帽没能救你。' },
    ],
  },
  {
    professionIds: ['chemical_worker', 'fireworks_maker'],
    deathTypes: ['accident', 'illness'],
    probability: 0.6,
    deaths: [
      { cause: '有毒气体泄漏', title: '有毒气体泄漏', description: '车间的阀门崩开，你在几秒钟内吸入了过量毒气。' },
      { cause: '反应釜爆炸', title: '反应釜爆炸', description: '压力表早已失灵，反应釜在你巡检时炸了。' },
      { cause: '化学品灼伤', title: '化学品灼伤', description: '一桶强酸从架子上倾倒下来，泼了你半身。' },
      { cause: '职业性中毒', title: '确诊职业性中毒', description: '你在厂里干了十几年，体内的苯含量是正常值的几十倍。' },
    ],
  },
  {
    professionIds: ['firefighter'],
    deathTypes: ['accident', 'illness'],
    probability: 0.6,
    deaths: [
      { cause: '火场殉职', title: '火场殉职', description: '你第三次冲进那栋楼，这次没有再出来。' },
      { cause: '浓烟窒息', title: '浓烟窒息', description: '面罩的滤芯用完了，你在楼梯间里倒了下去。' },
      { cause: '建筑倒塌', title: '建筑倒塌', description: '你正在搜救，楼板塌了下来。' },
      { cause: '吸入性损伤', title: '吸入性损伤', description: '那次大火后你的肺一直不好，几年后彻底衰竭了。' },
    ],
  },
  {
    professionIds: ['delivery_rider', 'courier', 'sorter', 'metro_driver', 'street_cleaner'],
    deathTypes: ['accident'],
    probability: 0.55,
    deaths: [
      { cause: '送餐途中车祸', title: '送餐途中', description: '为了赶时间，你闯了红灯，一辆右转的渣土车没有减速。' },
      { cause: '雨天侧滑', title: '雨天侧滑', description: '雨天路滑，你连人带车滑进了对向车道。' },
      { cause: '被货车卷入', title: '被货车卷入', description: '你贴着大货车骑行，司机根本没看见你。' },
      { cause: '凌晨作业被撞', title: '凌晨的清扫', description: '天还没亮，一辆疲劳驾驶的轿车冲上了人行道。' },
    ],
  },
  {
    professionIds: ['driver', 'trucker', 'ride_hailing_driver', 'bus_driver'],
    deathTypes: ['accident'],
    probability: 0.55,
    deaths: [
      { cause: '疲劳驾驶', title: '疲劳驾驶', description: '你连续开了十几个小时，在高速上闭上了眼。' },
      { cause: '追尾事故', title: '追尾事故', description: '前车突然爆胎停在路中间，你踩刹车时已经太晚。' },
      { cause: '被乘客袭击', title: '被乘客袭击', description: '一个喝醉的乘客在后座动了刀。' },
      { cause: '车辆失控', title: '车辆失控', description: '刹车失灵，你开着车冲下了山路。' },
    ],
  },
  {
    professionIds: ['fisherman', 'seafarer', 'ship_captain', 'diver', 'surf_instructor'],
    deathTypes: ['accident'],
    probability: 0.58,
    deaths: [
      { cause: '落海身亡', title: '落海身亡', description: '风浪里你被甩下了甲板，船上的人没能把你捞回来。' },
      { cause: '渔网缠住', title: '渔网缠住', description: '你的腿被渔网缠住，拖进了水下。' },
      { cause: '减压病', title: '减压病', description: '上浮得太快，氮气在你的血液里沸腾了。' },
      { cause: '设备供气故障', title: '供气故障', description: '水下十二米，你的呼吸器突然断了气。' },
    ],
  },
  {
    professionIds: ['programmer', 'game_developer', 'blockchain_dev', 'ai_researcher', 'esports_player', 'live_stream_seller', 'short_video_creator'],
    deathTypes: ['illness'],
    probability: 0.5,
    deaths: [
      { cause: '过劳猝死', title: '过劳猝死', description: '你连续熬了三个月，倒在工位上时屏幕还亮着。' },
      { cause: '突发心梗', title: '突发心梗', description: '凌晨两点你还在改需求，胸口突然一阵剧痛。' },
      { cause: '脑出血', title: '脑出血', description: '你已经分不清白天黑夜，直到在直播间里倒下。' },
    ],
  },
  {
    professionIds: ['er_doctor', 'rural_doctor', 'nurse', 'midwife'],
    deathTypes: ['illness', 'accident'],
    probability: 0.4,
    deaths: [
      { cause: '过劳猝死', title: '值完夜班', description: '你连着值了三个夜班，倒在了更衣室里。' },
      { cause: '院内感染', title: '院内感染', description: '你在抢救病人时被针刺伤，几个月后确诊了。' },
      { cause: '医闹遇害', title: '医闹遇害', description: '一名情绪失控的家属在诊室里挥了刀。' },
    ],
  },
  {
    professionIds: ['police', 'detective', 'soldier', 'bodyguard', 'security', 'war_reporter'],
    deathTypes: ['accident', 'crime', 'war'],
    probability: 0.55,
    deaths: [
      { cause: '出警遇袭', title: '出警遇袭', description: '你推开房门的那一刻，对方的刀已经挥了过来。' },
      { cause: '追捕车祸', title: '追捕车祸', description: '追捕途中，你的车在对向车道上翻了。' },
      { cause: '训练事故', title: '训练事故', description: '演习时一枚未爆弹在你脚边响了。' },
      { cause: '战地遇袭', title: '战地遇袭', description: '你正在拍摄，迫击炮弹落在了同一栋楼里。' },
    ],
  },
  {
    professionIds: ['pilot', 'flight_attendant'],
    deathTypes: ['accident'],
    probability: 0.35,
    deaths: [
      { cause: '空难', title: '空难', description: '航班在雷暴区失去了控制。' },
      { cause: '起飞事故', title: '起飞事故', description: '起飞时发动机起火，飞机冲出了跑道。' },
    ],
  },
  {
    professionIds: ['mountain_guide', 'ski_instructor', 'forest_ranger', 'lumberjack'],
    deathTypes: ['accident'],
    probability: 0.55,
    deaths: [
      { cause: '坠崖', title: '坠崖', description: '你在带路时踩空，滑下了冰坡。' },
      { cause: '雪崩掩埋', title: '雪崩掩埋', description: '整片雪坡在你身后塌了下来。' },
      { cause: '被大树砸中', title: '被大树砸中', description: '锯断的树没有按预想的方向倒下。' },
      { cause: '山火围困', title: '山火围困', description: '风向突变，火从三个方向烧了过来。' },
    ],
  },
  {
    professionIds: ['chef', 'chef_pastry', 'butcher', 'carpenter', 'mechanic', 'plumber'],
    deathTypes: ['accident', 'illness'],
    probability: 0.42,
    deaths: [
      { cause: '切割伤感染', title: '伤口感染', description: '手上的刀伤没当回事，后来发展成了败血症。' },
      { cause: '机械卷入', title: '机械卷入', description: '你的手套被卷进了机器。' },
      { cause: '烧伤并发症', title: '烧伤并发症', description: '后厨的油锅翻倒，你全身三度烧伤。' },
    ],
  },
];

/** 职业名 → id（避免每次查找都线性扫描） */
const PROFESSION_ID_BY_NAME: Record<string, string> = {
  外卖骑手: 'delivery_rider',
  网约车司机: 'ride_hailing_driver',
  高空作业工人: 'highrise_worker',
  塔吊司机: 'crane_operator',
  隧道工: 'tunnel_worker',
  爆破工: 'blaster',
  焊工: 'welder',
  高压电检修工: 'power_line_worker',
  化工厂操作工: 'chemical_worker',
  烟花制作工: 'fireworks_maker',
  屠宰工: 'butcher',
  远洋船员: 'seafarer',
  职业潜水员: 'diver',
  护林员: 'forest_ranger',
  环卫工人: 'street_cleaner',
  搬家工: 'mover',
  快递分拣员: 'sorter',
  石油工人: 'oil_worker',
  地铁司机: 'metro_driver',
  急诊医生: 'er_doctor',
  乡村医生: 'rural_doctor',
  登山向导: 'mountain_guide',
  滑雪教练: 'ski_instructor',
  冲浪教练: 'surf_instructor',
  战地记者: 'war_reporter',
  电工: 'electrician',
  水管工: 'plumber',
  机械师: 'mechanic',
  木匠: 'carpenter',
  矿工: 'miner',
  渔民: 'fisherman',
  伐木工: 'lumberjack',
  厨师: 'chef',
  糕点师: 'chef_pastry',
  消防员: 'firefighter',
  警察: 'police',
  侦探: 'detective',
  军人: 'soldier',
  保镖: 'bodyguard',
  保安: 'security',
  飞行员: 'pilot',
  空乘人员: 'flight_attendant',
  船长: 'ship_captain',
  长途卡车司机: 'trucker',
  司机: 'driver',
  护士: 'nurse',
  助产士: 'midwife',
  程序员: 'programmer',
  游戏开发者: 'game_developer',
  区块链开发者: 'blockchain_dev',
  AI研究员: 'ai_researcher',
  电竞选手: 'esports_player',
  直播带货主播: 'live_stream_seller',
  短视频创作者: 'short_video_creator',
  快递员: 'courier',
  建筑工人: 'construction',
  粉刷工: 'painter',
};

export function getProfessionIdByName(name: string): string | undefined {
  return PROFESSION_ID_BY_NAME[name];
}
