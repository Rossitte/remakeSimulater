import type { EventTemplate } from './events';

/**
 * 事件库扩充包。
 *
 * 原 events.ts 按人生阶段分了四个数组，这里按同样的结构补充，
 * 由 events.ts 在组装 SOCIAL_EVENTS 时拼接进来，保持筛选逻辑不变。
 */

/** 童年（0-15 岁） */
export const EXTRA_CHILDHOOD_EVENTS: EventTemplate[] = [
  { id: 'learn_bike', type: 'other', title: '学骑自行车', description: '你摔了七八次才学会骑车，膝盖上的疤留了很多年。', minAge: 6, maxAge: 12, weight: 5 },
  { id: 'dog_bite', type: 'accident', title: '被狗咬', description: '你在巷口被一条没拴绳的狗咬了，打了半个月的疫苗。', minAge: 4, maxAge: 12, weight: 3 },
  { id: 'grandma_summer', type: 'family', title: '外婆家的夏天', description: '你在外婆家过了一个夏天，捉知了、下河摸鱼，那是你最自由的日子。', minAge: 4, maxAge: 12, weight: 6 },
  { id: 'first_praise', type: 'education', title: '第一次被表扬', description: '老师在班上念了你的作文，你脸红了一整节课。', minAge: 5, maxAge: 10, weight: 5 },
  { id: 'firecracker_injury', type: 'accident', title: '鞭炮炸伤', description: '过年时一枚鞭炮在你手里炸开，手指上留下了一道疤。', minAge: 5, maxAge: 14, weight: 2 },
  { id: 'left_behind_child', type: 'family', title: '留守在家', description: '父母外出打工，你跟着爷爷奶奶长大，一年见他们一次。', minAge: 3, maxAge: 12, weight: 4, maxFamScore: 35 },
  { id: 'new_house', type: 'family', title: '搬进新家', description: '家里终于搬进了有独立卫生间的新房，你第一次有了自己的房间。', minAge: 6, maxAge: 15, weight: 3, minFamScore: 45 },
  { id: 'corporal_punish', type: 'social', title: '挨了一顿打', description: '你因为没交作业被罚站一下午，回家又挨了一顿打。', minAge: 6, maxAge: 13, weight: 4 },
  { id: 'first_sea', type: 'other', title: '第一次看海', description: '你第一次见到海，站在沙滩上愣了很久。', minAge: 5, maxAge: 15, weight: 2, minFamScore: 40 },
  { id: 'new_school_isolated', type: 'social', title: '转学被排挤', description: '转学后你成了班里的“外人”，有大半年没人愿意和你同桌。', minAge: 6, maxAge: 15, weight: 3 },
  { id: 'math_class', type: 'education', title: '被塞进奥数班', description: '父母给你报了奥数班，你在周末的教室里坐了两年。', minAge: 8, maxAge: 14, weight: 3, minFamScore: 35 },
  { id: 'piano_grade', type: 'education', title: '考级', description: '你被逼着练琴考级，考过十级那天你把琴谱撕了。', minAge: 6, maxAge: 14, weight: 3, minFamScore: 45 },
  { id: 'game_console_smashed', type: 'other', title: '游戏机被砸', description: '你攒了半年的钱买的游戏机，被父亲发现后当场砸了。', minAge: 7, maxAge: 15, weight: 4 },
  { id: 'found_wallet', type: 'social', title: '捡到钱包', description: '你在路边捡到一个钱包，交给警察后拿到一张奖状。', minAge: 6, maxAge: 13, weight: 3 },
  { id: 'tree_fall', type: 'accident', title: '从树上摔下来', description: '你从树上摔下来，锁骨骨折，手臂吊了两个月。', minAge: 5, maxAge: 12, weight: 3 },
  { id: 'food_poisoning_child', type: 'health', title: '食堂食物中毒', description: '学校食堂的饭菜出了问题，你上吐下泻了一整夜。', minAge: 4, maxAge: 12, weight: 2 },
  { id: 'earthquake_drill', type: 'other', title: '地震演习', description: '学校组织地震演习，你第一次知道“跑不掉就躲在桌子底下”。', minAge: 6, maxAge: 14, weight: 2 },
  { id: 'son_preference', type: 'family', title: '重男轻女', description: '家里把好东西都留给弟弟，你从小就明白什么叫“让着点”。', minAge: 3, maxAge: 14, weight: 3, gender: '女' },
  { id: 'fostered', type: 'family', title: '寄养在亲戚家', description: '父母把你寄养在亲戚家，你很早就学会了看人脸色。', minAge: 2, maxAge: 10, weight: 2 },
  { id: 'learn_swim', type: 'other', title: '学会游泳', description: '父亲把你扔进河里，你扑腾着学会了游泳。', minAge: 5, maxAge: 12, weight: 4 },
  { id: 'first_lie', type: 'social', title: '第一次撒谎', description: '你打碎了邻居家的玻璃，撒谎说是别人干的，一夜没睡着。', minAge: 5, maxAge: 11, weight: 3 },
  { id: 'family_shop', type: 'family', title: '家里开了小店', description: '父母开了一家小卖部，你放学后就在柜台后面写作业。', minAge: 5, maxAge: 15, weight: 3 },
  { id: 'flag_raiser', type: 'social', title: '当上升旗手', description: '你被选为升旗手，紧张得把旗子抖成了一团。', minAge: 7, maxAge: 14, weight: 3 },
  { id: 'move_to_city', type: 'family', title: '随父母进城', description: '你跟着父母从村里搬到了城里，第一次见到电梯和红绿灯。', minAge: 5, maxAge: 14, weight: 3 },
];

/** 青少年（12-24 岁） */
export const EXTRA_TEEN_EVENTS: EventTemplate[] = [
  { id: 'caught_dating', type: 'social', title: '早恋被抓', description: '你和对象在操场牵手被抓，班主任把双方家长都叫到了学校。', minAge: 14, maxAge: 19, weight: 4 },
  { id: 'all_nighter', type: 'health', title: '通宵打游戏', description: '你和同学翻墙去网吧通宵，天亮时被校长堵在门口。', minAge: 13, maxAge: 20, weight: 5 },
  { id: 'first_flight', type: 'other', title: '第一次坐飞机', description: '你第一次坐飞机，全程盯着舷窗外的云看。', minAge: 13, maxAge: 22, weight: 3, minFamScore: 45 },
  { id: 'myopia', type: 'health', title: '近视加深', description: '体检时你才发现已经近视四百度，黑板上的字全糊了。', minAge: 12, maxAge: 18, weight: 5 },
  { id: 'basketball_injury', type: 'accident', title: '打球扭伤', description: '一场球赛里你扭伤了脚踝，此后每逢阴雨天都会疼。', minAge: 13, maxAge: 22, weight: 4 },
  { id: 'fandom', type: 'other', title: '追星', description: '你省下午饭钱买专辑、打榜，房间墙上贴满了海报。', minAge: 12, maxAge: 20, weight: 5 },
  { id: 'skip_class', type: 'social', title: '逃课', description: '你和几个同学翻墙逃课去看电影，回来时被门卫认了出来。', minAge: 13, maxAge: 19, weight: 4 },
  { id: 'teacher_humiliate', type: 'education', title: '被老师羞辱', description: '你被老师当着全班的面骂“没出息”，那句话你记了很多年。', minAge: 13, maxAge: 18, weight: 3 },
  { id: 'club_join', type: 'social', title: '加入社团', description: '你加入了学校的话剧社，第一次在台上完整说完一段台词。', minAge: 13, maxAge: 20, weight: 4 },
  { id: 'learn_drive', type: 'other', title: '考驾照', description: '你考驾照科目二挂了两次，第三次才颤颤巍巍地过了。', minAge: 17, maxAge: 22, weight: 3 },
  { id: 'part_time_scammed', type: 'wealth', title: '打工被骗', description: '暑假打工的老板卷钱跑了，你白干了一个月。', minAge: 15, maxAge: 20, weight: 3 },
  { id: 'cold_war_parents', type: 'family', title: '和父母冷战', description: '你和父母冷战了半年，吃饭都不在一张桌上。', minAge: 13, maxAge: 19, weight: 4 },
  { id: 'love_letter', type: 'social', title: '收到情书', description: '你在课本里发现一封没署名的信，猜了一个学期是谁写的。', minAge: 13, maxAge: 18, weight: 4 },
  { id: 'school_band', type: 'other', title: '组了支乐队', description: '你和几个朋友组了支乐队，在毕业晚会上唱砸了一首歌。', minAge: 14, maxAge: 22, weight: 2 },
  { id: 'cram_night', type: 'health', title: '熬夜备考', description: '你连着一个月凌晨两点睡，靠咖啡和风油精撑过了考试。', minAge: 15, maxAge: 22, weight: 5 },
  { id: 'fight_suspend', type: 'social', title: '打架被记过', description: '你为朋友出头打了架，被记大过一次，档案里留了记录。', minAge: 13, maxAge: 19, weight: 3 },
  { id: 'phone_taken', type: 'social', title: '手机被没收', description: '你的手机被班主任收走，直到期末才还给你。', minAge: 13, maxAge: 18, weight: 4 },
  { id: 'online_love', type: 'social', title: '网恋', description: '你和屏幕那头的人聊了两年，最后连面都没见过。', minAge: 14, maxAge: 22, weight: 3 },
  { id: 'isolated_by_class', type: 'social', title: '被全班孤立', description: '班里突然没人跟你说话，你不知道自己做错了什么。', minAge: 12, maxAge: 18, weight: 3 },
  { id: 'family_bankrupt_teen', type: 'family', title: '家里生意垮了', description: '家里的生意垮了，你从重点班转到了普通班。', minAge: 13, maxAge: 19, weight: 2 },
  { id: 'study_abroad', type: 'education', title: '出国留学', description: '你一个人拖着两个箱子去了国外，第一顿饭是泡面。', minAge: 17, maxAge: 22, weight: 2, minFamScore: 65, minEconLevel: 60 },
  { id: 'olympiad_camp', type: 'education', title: '进竞赛集训队', description: '你被选进竞赛集训队，半年里做完了三千道题。', minAge: 14, maxAge: 19, weight: 2, minFamScore: 40 },
  { id: 'tattoo', type: 'other', title: '纹身', description: '你在手臂上纹了一个图案，回家被父亲赶出了门。', minAge: 16, maxAge: 22, weight: 2 },
  { id: 'save_drowning', type: 'social', title: '救起落水小孩', description: '你在河边救起一个落水的孩子，上了本地新闻。', minAge: 13, maxAge: 22, weight: 2 },
];

/** 成年（20-60 岁） */
export const EXTRA_ADULT_EVENTS: EventTemplate[] = [
  { id: 'buy_house', type: 'wealth', title: '买房', description: '你掏空积蓄付了首付，签下三十年房贷的那天手一直在抖。', minAge: 25, maxAge: 45, weight: 5, minFamScore: 40 },
  { id: 'mortgage_stress', type: 'wealth', title: '差点断供', description: '收入断了几个月，你差点还不上房贷。', minAge: 28, maxAge: 50, weight: 3 },
  { id: 'overtime_night', type: 'career', title: '连续加班', description: '你连续三个月凌晨下班，有天在地铁上睡过了六站。', minAge: 22, maxAge: 45, weight: 6 },
  { id: 'checkup_abnormal', type: 'health', title: '体检报告报警', description: '体检报告上多了三个箭头，医生说“注意休息”，你笑了笑。', minAge: 30, maxAge: 55, weight: 4 },
  { id: 'gig_rider', type: 'career', title: '跑起了外卖', description: '你注册成了骑手，一天跑四十单，闯过红灯也摔过车。', minAge: 18, maxAge: 45, weight: 4 },
  { id: 'construction_injury', type: 'accident', title: '工地受伤', description: '一根钢管从脚手架上掉下来砸中你的肩膀，你养了三个月。', minAge: 20, maxAge: 50, weight: 3 },
  { id: 'wage_arrears', type: 'career', title: '被欠薪', description: '包工头卷钱跑了，你半年的工资一分没拿到。', minAge: 20, maxAge: 50, weight: 3 },
  { id: 'company_ipo', type: 'wealth', title: '公司上市', description: '你所在的公司敲钟上市，你手里的期权一夜之间变了现。', minAge: 28, maxAge: 50, weight: 1, minFamScore: 45 },
  { id: 'blind_date', type: 'social', title: '相亲', description: '你被家里安排了七次相亲，第七次才勉强加上了微信。', minAge: 24, maxAge: 40, weight: 5 },
  { id: 'adopt_pet', type: 'family', title: '养了一只猫', description: '你养了一只猫，它陪你搬了四次家。', minAge: 22, maxAge: 45, weight: 5 },
  { id: 'exam_civil', type: 'career', title: '考公上岸', description: '你考了三年公务员，第四年终于上岸。', minAge: 22, maxAge: 35, weight: 3 },
  { id: 'self_improve', type: 'education', title: '考证', description: '你下班后自学考了个证，虽然一直没用上。', minAge: 22, maxAge: 45, weight: 4 },
  { id: 'cyberbully', type: 'social', title: '被网暴', description: '你的一条发言被截图传播，评论区骂了你三天。', minAge: 20, maxAge: 45, weight: 2 },
  { id: 'demolition', type: 'wealth', title: '老家拆迁', description: '老家的房子拆迁，你家分了两套房和一笔补偿款。', minAge: 25, maxAge: 55, weight: 2 },
  { id: 'parent_cancer', type: 'family', title: '父母重病', description: '父亲查出癌症，你在医院走廊上签了三次字。', minAge: 25, maxAge: 55, weight: 4 },
  { id: 'lend_money', type: 'wealth', title: '借钱给朋友', description: '你把攒了三年的钱借给朋友，后来连人都联系不上了。', minAge: 24, maxAge: 50, weight: 4 },
  { id: 'job_hop_raise', type: 'career', title: '跳槽涨薪', description: '你跳槽到对家公司，薪水涨了四成。', minAge: 24, maxAge: 45, weight: 5 },
  { id: 'startup_funding', type: 'career', title: '拿到融资', description: '你的项目拿到了第一笔融资，团队从三个人变成二十个。', minAge: 26, maxAge: 45, weight: 2, minFamScore: 45 },
  { id: 'disability', type: 'accident', title: '意外致残', description: '一场事故让你失去了两根手指，从此拿东西总是不太稳。', minAge: 20, maxAge: 60, weight: 2 },
  { id: 'fishing_hobby', type: 'other', title: '迷上钓鱼', description: '你迷上了钓鱼，周末五点就出门，一坐一整天。', minAge: 30, maxAge: 60, weight: 3 },
  { id: 'fitness_change', type: 'health', title: '健身一年', description: '你坚持健身一年，瘦了二十斤，第一次有了腹肌。', minAge: 22, maxAge: 45, weight: 4 },
  { id: 'quit_smoking', type: 'health', title: '戒烟', description: '你抽了十几年的烟，因为孩子一句话戒了。', minAge: 28, maxAge: 55, weight: 3 },
  { id: 'marathon', type: 'other', title: '跑完马拉松', description: '你完成了人生第一个马拉松，最后五公里是靠走的。', minAge: 25, maxAge: 55, weight: 2 },
  { id: 'work_abroad', type: 'career', title: '出国打工', description: '你去国外打了两年工，寄回家的钱盖起了新房。', minAge: 22, maxAge: 45, weight: 2 },
  { id: 'long_unemployed', type: 'career', title: '长期失业', description: '你失业了一年多，投了三百份简历。', minAge: 25, maxAge: 55, weight: 3 },
  { id: 'partner_betray', type: 'career', title: '被合伙人坑', description: '合伙人卷走了公司账户的钱，你背了一身债。', minAge: 26, maxAge: 50, weight: 3 },
  { id: 'caregiver', type: 'family', title: '照顾卧床的老人', description: '母亲卧床三年，你每天下班后去给她翻身、擦洗。', minAge: 30, maxAge: 60, weight: 4 },
  { id: 'night_shift', type: 'career', title: '三班倒', description: '你上了五年夜班，生物钟彻底乱了。', minAge: 22, maxAge: 55, weight: 4 },
];

/** 中老年（55-90 岁） */
export const EXTRA_ELDER_EVENTS: EventTemplate[] = [
  { id: 'rehired', type: 'career', title: '退休返聘', description: '退休半年后，单位把你请回去带新人。', minAge: 58, maxAge: 70, weight: 3 },
  { id: 'remarry_old', type: 'family', title: '老年再婚', description: '你在晚年遇到一个说得上话的人，子女却不太赞成。', minAge: 60, maxAge: 78, weight: 2 },
  { id: 'square_dance', type: 'social', title: '跳广场舞', description: '你加入了小区广场舞队，每天晚上七点准时出现。', minAge: 55, maxAge: 80, weight: 5 },
  { id: 'senior_college', type: 'education', title: '老年大学', description: '你报了老年大学的书法班，第一次拿起了毛笔。', minAge: 58, maxAge: 80, weight: 4 },
  { id: 'raise_grandkid', type: 'family', title: '进城带孙子', description: '你从老家赶到城里带孙子，比上班时还累。', minAge: 55, maxAge: 75, weight: 6 },
  { id: 'child_emigrate', type: 'family', title: '子女定居国外', description: '孩子定居国外，你们只能靠视频见面。', minAge: 55, maxAge: 80, weight: 3 },
  { id: 'cataract', type: 'health', title: '白内障手术', description: '你的眼睛越来越花，做完手术后，世界又清楚了。', minAge: 60, maxAge: 85, weight: 4 },
  { id: 'dementia', type: 'health', title: '记不住路了', description: '你开始记不住回家的路，家人给你衣服上缝了联系方式。', minAge: 70, maxAge: 90, weight: 3 },
  { id: 'inheritance_dispute', type: 'family', title: '遗产纠纷', description: '为了老宅的归属，你和兄弟姐妹闹上了法庭。', minAge: 60, maxAge: 85, weight: 2 },
  { id: 'smartphone_elder', type: 'other', title: '学会用智能手机', description: '孙子教了你三天，你终于学会用手机视频和扫码。', minAge: 55, maxAge: 80, weight: 5 },
  { id: 'solo_travel', type: 'other', title: '一个人旅行', description: '你一个人报了旅行团，去了年轻时想去没去成的地方。', minAge: 58, maxAge: 80, weight: 3 },
  { id: 'community_volunteer', type: 'social', title: '社区志愿者', description: '你成了社区志愿者，每天在门口值班两小时。', minAge: 55, maxAge: 80, weight: 3 },
  { id: 'old_friend_death', type: 'social', title: '老友离世', description: '一起下了三十年棋的老友走了，你此后很少再去那个棋摊。', minAge: 55, maxAge: 85, weight: 4 },
  { id: 'garden_birds', type: 'other', title: '养花养鸟', description: '你在阳台上养了十几盆花和两只画眉。', minAge: 55, maxAge: 85, weight: 4 },
  { id: 'tumor_found', type: 'health', title: '查出阴影', description: '体检发现了一个阴影，等结果的那两周你想了很多。', minAge: 55, maxAge: 80, weight: 3 },
  { id: 'move_in_with_child', type: 'family', title: '搬去和子女住', description: '你卖掉了老房子搬去和子女同住，却总觉得自己是客人。', minAge: 65, maxAge: 85, weight: 3 },
  { id: 'chess_fishing', type: 'other', title: '下棋钓鱼', description: '你把一天分成两半，上午钓鱼，下午下棋。', minAge: 55, maxAge: 85, weight: 4 },
  { id: 'last_wish', type: 'other', title: '最后一个心愿', description: '你说想再去一次年轻时待过的城市，家里人陪你去了。', minAge: 70, maxAge: 90, weight: 2 },
];

/** 财富事件扩充（需要在 eventEngine 里有对应的金额分支） */
export const EXTRA_WEALTH_EVENTS: EventTemplate[] = [
  { id: 'livestream_sell', type: 'wealth', title: '直播卖货', description: '你在镜头前喊了三个小时，卖出了两百单。', minAge: 20, maxAge: 50, weight: 3 },
  { id: 'open_shop_online', type: 'wealth', title: '开网店', description: '你开了家网店，第一个月只卖出三单。', minAge: 22, maxAge: 50, weight: 4 },
  { id: 'street_stall', type: 'wealth', title: '摆地摊', description: '你在夜市摆摊，被城管追过两次。', minAge: 20, maxAge: 55, weight: 4 },
  { id: 'stock_wipeout', type: 'wealth', title: '炒股亏光', description: '你把积蓄全投进了股市，一轮下跌后只剩零头。', minAge: 25, maxAge: 60, weight: 3 },
  { id: 'pyramid_scam', type: 'wealth', title: '被拉进传销', description: '你被拉进一个“项目”，交了钱，也拉了几个亲戚。', minAge: 22, maxAge: 50, weight: 2 },
  { id: 'telecom_fraud', type: 'wealth', title: '电信诈骗', description: '一个电话让你把积蓄转进了“安全账户”。', minAge: 25, maxAge: 70, weight: 4 },
  { id: 'unfinished_house', type: 'wealth', title: '买到烂尾楼', description: '你买的期房停工了，房贷却一分不能少。', minAge: 28, maxAge: 55, weight: 2 },
  { id: 'small_business_boom', type: 'wealth', title: '小店成了网红店', description: '你的小店突然在网上火了，排队能排到路口。', minAge: 25, maxAge: 55, weight: 3, minFamScore: 35 },
  { id: 'borrow_for_medical', type: 'wealth', title: '借钱看病', description: '家里人生病，你借遍了亲戚朋友。', minAge: 30, maxAge: 70, weight: 3 },
  { id: 'pay_off_debt', type: 'wealth', title: '还清债务', description: '你还清了最后一笔债，在银行门口站了很久。', minAge: 30, maxAge: 60, weight: 3 },
  { id: 'gift_from_parents', type: 'wealth', title: '父母资助', description: '父母拿出养老钱帮你付了首付。', minAge: 22, maxAge: 40, weight: 3, minFamScore: 50 },
  { id: 'second_job', type: 'wealth', title: '打第二份工', description: '你白天上班，晚上跑代驾，一天只睡五个小时。', minAge: 22, maxAge: 55, weight: 5 },
];
