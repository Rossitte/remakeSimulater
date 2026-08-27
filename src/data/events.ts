import type { LifeEventType } from '../models/LifeResult';

export interface EventTemplate {
  id: string;
  type: LifeEventType;
  title: string;
  description: string;
  minAge: number;
  maxAge: number;
  weight: number;
  /** 需要的家庭经济条件（可选），低于此值权重降低 */
  minFamScore?: number;
  /** 家庭经济条件上限（可选），高于此值权重降低 */
  maxFamScore?: number;
  /** 需要的国家经济条件（可选） */
  minEconLevel?: number;
  /** 仅限特定性别？默认不限 */
  gender?: '男' | '女';
  /** 事件最早可能发生的年份（可选），用于时间合理性检查 */
  minYear?: number;
}

/** 童年事件（5-15岁） */
export const CHILDHOOD_EVENTS: EventTemplate[] = [
  { id: 'bully', type: 'social', title: '校园霸凌', description: '你在学校遭受了霸凌，那段日子成了童年的阴影。', minAge: 6, maxAge: 15, weight: 5 },
  { id: 'bully_other', type: 'social', title: '目睹霸凌', description: '你看到同学被欺负，却不敢站出来，这件事一直萦绕在你心头。', minAge: 7, maxAge: 15, weight: 4 },
  { id: 'talent_art', type: 'other', title: '展露艺术天赋', description: '一位老师发现了你的绘画天赋，鼓励你走上艺术之路。', minAge: 6, maxAge: 14, weight: 3 },
  { id: 'talent_math', type: 'other', title: '数学天才', description: '你在数学竞赛中脱颖而出，被誉为"小数学家"。', minAge: 8, maxAge: 15, weight: 3 },
  { id: 'talent_sport', type: 'other', title: '体育苗子', description: '你在运动会上大放异彩，被教练看中进入了校队。', minAge: 7, maxAge: 15, weight: 4 },
  { id: 'child_illness', type: 'health', title: '童年大病', description: '一场重病让你在医院度过了大半个学期，落下了不少功课。', minAge: 3, maxAge: 14, weight: 4 },
  { id: 'child_injury', type: 'accident', title: '童年受伤', description: '玩耍时摔断了手臂，你第一次体会到了疼痛的滋味。', minAge: 4, maxAge: 14, weight: 5 },
  { id: 'pet_child', type: 'family', title: '捡到流浪动物', description: '你在路边捡到一只流浪小猫，偷偷养了起来，它成了你最好的朋友。', minAge: 5, maxAge: 15, weight: 4 },
  { id: 'parent_quarrel', type: 'family', title: '父母争吵', description: '父母经常为钱吵架，你躲在被窝里默默流泪。', minAge: 5, maxAge: 16, weight: 5 },
  { id: 'parent_divorce', type: 'family', title: '父母离异', description: '父母最终离婚了，你跟随其中一方生活。', minAge: 5, maxAge: 18, weight: 3 },
  { id: 'move_school', type: 'social', title: '转学', description: '因为家庭搬迁，你转到了新学校，一切都要重新开始。', minAge: 6, maxAge: 16, weight: 4 },
  { id: 'best_friend', type: 'social', title: '结识发小', description: '你遇到了一个形影不离的伙伴，你们成了无话不谈的发小。', minAge: 5, maxAge: 15, weight: 6 },
  { id: 'teacher_encourage', type: 'education', title: '恩师鼓励', description: '一位老师的一句话改变了你，让你对未来充满了希望。', minAge: 7, maxAge: 16, weight: 5 },
  { id: 'school_play', type: 'other', title: '登台演出', description: '你在学校的文艺汇演中登台演出，收获了人生第一次掌声。', minAge: 6, maxAge: 15, weight: 3 },
  { id: 'first_money', type: 'wealth', title: '第一笔零花钱', description: '你第一次拥有了自己的零花钱，小心翼翼地攒了起来。', minAge: 6, maxAge: 14, weight: 4 },
  { id: 'child_labour', type: 'social', title: '被迫帮工', description: '家境困难，你从小就要帮家里干活，错过了很多玩耍的时光。', minAge: 8, maxAge: 15, weight: 3, maxFamScore: 30 },
  { id: 'near_drown', type: 'accident', title: '溺水险情', description: '你在河边玩耍时差点溺水，幸亏被路人救起。', minAge: 4, maxAge: 14, weight: 3 },
  { id: 'lost', type: 'accident', title: '走失', description: '你在街头迷了路，被好心人送回了家，吓得大哭一场。', minAge: 3, maxAge: 10, weight: 3 },
  { id: 'gifted_program', type: 'education', title: '进入特长班', description: '你以优异的成绩被选入了学校的特长培养计划。', minAge: 8, maxAge: 15, weight: 3, minFamScore: 30 },
  { id: 'child_competition', type: 'education', title: '参加竞赛', description: '你代表学校参加了学科竞赛，获得了名次。', minAge: 8, maxAge: 15, weight: 4 },

  // 新增童年事件
  { id: 'fire_accident', type: 'accident', title: '火灾惊魂', description: '家里差点发生火灾，你在千钧一发之际被救出。', minAge: 4, maxAge: 15, weight: 2 },
  { id: 'kidnap_scare', type: 'accident', title: '差点被拐', description: '你差点被陌生人带走，幸好路人警觉救下了你。', minAge: 3, maxAge: 12, weight: 2 },
  { id: 'candy_love', type: 'social', title: '童年挚友', description: '你和邻居家的小朋友成了最好的伙伴，一起度过了无数个下午。', minAge: 5, maxAge: 12, weight: 5 },
  { id: 'first_school_day', type: 'education', title: '第一天上幼儿园', description: '你第一次离开父母去上幼儿园，哭得撕心裂肺。', minAge: 3, maxAge: 6, weight: 3 },
  { id: 'bedwetting', type: 'health', title: '童年遗尿', description: '你有尿床的毛病，被同学嘲笑了很久。', minAge: 4, maxAge: 10, weight: 3 },
  { id: 'dyslexia', type: 'education', title: '阅读障碍', description: '你被诊断出有阅读障碍，学习比别人更加吃力。', minAge: 6, maxAge: 12, weight: 2 },
  { id: 'parent_sick', type: 'family', title: '家人生病', description: '父亲/母亲生了一场大病，你第一次感受到了家庭的脆弱。', minAge: 5, maxAge: 15, weight: 4 },
  { id: 'new_sibling', type: 'family', title: '弟弟/妹妹出生', description: '家里新添了一个成员，你既兴奋又有些嫉妒。', minAge: 3, maxAge: 14, weight: 5 },
  { id: 'child_talent_music', type: 'other', title: '音乐天赋', description: '你在音乐课上展现出惊人的天赋，被老师推荐去学钢琴。', minAge: 5, maxAge: 14, weight: 3 },
  { id: 'child_fall_hero', type: 'social', title: '见义勇为', description: '你看到小弟弟被欺负，勇敢地站了出来，受到了表扬。', minAge: 6, maxAge: 14, weight: 3 },
  { id: 'child_theft', type: 'social', title: '偷拿东西', description: '你因为一时贪念偷拿了商店的东西，被发现后羞愧难当。', minAge: 6, maxAge: 13, weight: 2 },
  { id: 'child_adopted', type: 'family', title: '被领养', description: '你被一对好心的夫妇收养，终于有了一个温暖的家。', minAge: 0, maxAge: 6, weight: 2 },
  { id: 'child_witness_crime', type: 'social', title: '目击犯罪', description: '你无意中目击了一场犯罪，幼小的心灵受到了巨大冲击。', minAge: 5, maxAge: 15, weight: 2 },
];

/** 青少年事件（12-22岁） */
export const TEEN_EVENTS: EventTemplate[] = [
  { id: 'first_love', type: 'social', title: '初恋', description: '你体验了人生中第一次心动，那是一段青涩而美好的回忆。', minAge: 13, maxAge: 22, weight: 7 },
  { id: 'first_breakup', type: 'social', title: '失恋', description: '你的第一段感情结束了，你在深夜里哭了很久。', minAge: 14, maxAge: 24, weight: 5 },
  { id: 'rebellion', type: 'social', title: '叛逆期', description: '你和父母大吵了一架，摔门而出，在外游荡了一整夜。', minAge: 13, maxAge: 19, weight: 6 },
  { id: 'exam_pressure', type: 'education', title: '考试焦虑', description: '升学压力让你喘不过气，你开始失眠、焦虑。', minAge: 14, maxAge: 22, weight: 6 },
  { id: 'exam_success', type: 'education', title: '考试超常发挥', description: '关键考试中你超常发挥，考出了远超预期的成绩。', minAge: 15, maxAge: 22, weight: 4 },
  { id: 'exam_fail', type: 'education', title: '考试失利', description: '一次重要考试你名落孙山，遭受了巨大的打击。', minAge: 14, maxAge: 22, weight: 5 },
  { id: 'part_time', type: 'wealth', title: '兼职打工', description: '你找了一份兼职，第一次靠自己的双手挣到了钱。', minAge: 15, maxAge: 22, weight: 6 },
  { id: 'fight', type: 'accident', title: '打架斗殴', description: '你和别人起了冲突，打了一架，被带去了派出所。', minAge: 14, maxAge: 22, weight: 4 },
  { id: 'bad_habit', type: 'health', title: '沾染不良习惯', description: '你交了不好的朋友，开始抽烟、酗酒。', minAge: 14, maxAge: 22, weight: 4 },
  { id: 'online_addiction', type: 'health', title: '沉迷网络', description: '你沉迷于网络游戏，成绩一落千丈。', minAge: 12, maxAge: 20, weight: 5 },
  { id: 'team_leader', type: 'social', title: '成为学生干部', description: '你被选为班长/学生会干部，开始锻炼领导能力。', minAge: 14, maxAge: 22, weight: 4 },
  { id: 'scholarship', type: 'wealth', title: '获得奖学金', description: '你凭借优异成绩获得了奖学金，为家里减轻了负担。', minAge: 15, maxAge: 25, weight: 4, minFamScore: 20 },
  { id: 'dropout', type: 'education', title: '辍学念头', description: '你一度想辍学，但最终在老师的劝说下坚持了下来。', minAge: 14, maxAge: 19, weight: 3, maxFamScore: 40 },
  { id: 'first_job', type: 'career', title: '第一份正式工作', description: '你拿到了人生第一份正式工作，虽然薪水微薄，但意义非凡。', minAge: 16, maxAge: 23, weight: 5 },
  { id: 'debut_stage', type: 'other', title: '才艺表演', description: '你参加了一场才艺表演，获得了观众的欢呼。', minAge: 13, maxAge: 22, weight: 3 },
  { id: 'religious', type: 'other', title: '宗教信仰', description: '你开始接触宗教，找到了内心的平静。', minAge: 15, maxAge: 22, weight: 3 },
  { id: 'political_awaken', type: 'social', title: '政治觉醒', description: '你开始关注社会议题，形成了自己的政治观点。', minAge: 16, maxAge: 22, weight: 3 },
  { id: 'volunteer_teen', type: 'social', title: '参加志愿活动', description: '你加入了志愿者队伍，第一次感受到帮助他人的快乐。', minAge: 14, maxAge: 22, weight: 4 },

  // 新增青少年事件
  { id: 'peer_pressure', type: 'social', title: '同伴压力', description: '你被迫做了一些自己不想做的事，只为了融入同龄人的圈子。', minAge: 13, maxAge: 20, weight: 5 },
  { id: 'puppy_love_end', type: 'social', title: '青梅竹马分手', description: '你和从小一起长大的朋友分了手，童年挚友变成了陌路人。', minAge: 14, maxAge: 20, weight: 3 },
  { id: 'teen_pregnancy', type: 'family', title: '意外怀孕', description: '你在青春期意外怀孕，不得不面对人生的重大抉择。', minAge: 15, maxAge: 19, weight: 2, gender: '女' },
  { id: 'teen_depression', type: 'health', title: '青春期抑郁', description: '你陷入了深深的抑郁，对一切都失去了兴趣。', minAge: 13, maxAge: 22, weight: 3 },
  { id: 'teen_identity', type: 'other', title: '身份困惑', description: '你开始思考自己是谁，想要什么，陷入了身份认同的困惑中。', minAge: 14, maxAge: 22, weight: 4 },
  { id: 'high_school_clique', type: 'social', title: '小圈子', description: '你加入了学校里的某个小圈子，开始有了归属感。', minAge: 13, maxAge: 18, weight: 5 },
  { id: 'teen_betrayal', type: 'social', title: '闺蜜/兄弟背叛', description: '你最好的朋友背叛了你，你再也不相信任何人。', minAge: 13, maxAge: 22, weight: 4 },
  { id: 'teen_burnout', type: 'health', title: '学业倦怠', description: '长时间的学习压力让你精疲力尽，产生了厌学情绪。', minAge: 15, maxAge: 22, weight: 4 },
  { id: 'first_girlfriend_boyfriend', type: 'social', title: '第一次心动', description: '你第一次对异性产生了朦胧的好感。', minAge: 13, maxAge: 18, weight: 6 },
  { id: 'teen_crime', type: 'social', title: '误入歧途', description: '你因为交友不慎而卷入了一些麻烦事，差点走上歧途。', minAge: 14, maxAge: 20, weight: 2 },
  { id: 'first_crush_reject', type: 'social', title: '表白被拒', description: '你鼓起勇气向暗恋的人表白，却遭到了拒绝。', minAge: 14, maxAge: 22, weight: 4 },
  { id: 'teen_move', type: 'family', title: '家庭搬迁', description: '因为父母工作调动，你不得不转学，离开熟悉的一切。', minAge: 13, maxAge: 20, weight: 3 },
  { id: 'first_drunk', type: 'health', title: '第一次喝醉', description: '你在聚会上第一次喝得烂醉，断片了一整晚。', minAge: 15, maxAge: 22, weight: 4 },
  { id: 'teen_protest', type: 'social', title: '学生运动', description: '你参与了一场学生运动，为自己的权益发声。', minAge: 15, maxAge: 22, weight: 3 },
  { id: 'college_prep_stress', type: 'education', title: '高考/升学压力', description: '你承受着巨大的升学压力，每天学习到深夜。', minAge: 16, maxAge: 22, weight: 5 },
];

/** 成年事件（20-50岁） */
export const ADULT_EVENTS: EventTemplate[] = [
  { id: 'mentor', type: 'social', title: '遇到贵人', description: '一位关键人物在你最需要的时候出现，改变了你的人生轨迹。', minAge: 20, maxAge: 60, weight: 5 },
  { id: 'backstab', type: 'social', title: '遭到背叛', description: '你信任的同事在背后捅了你一刀，让你学会了职场残酷。', minAge: 22, maxAge: 55, weight: 4 },
  { id: 'lawsuit', type: 'wealth', title: '卷入诉讼', description: '你被迫卷入一场官司，耗费了大量精力和金钱。', minAge: 25, maxAge: 60, weight: 3 },
  { id: 'promotion_missed', type: 'career', title: '错失晋升', description: '你本该到手的升职被别人抢走，你愤愤不平。', minAge: 25, maxAge: 50, weight: 5 },
  { id: 'midlife_crisis', type: 'social', title: '中年危机', description: '你开始质疑人生的意义，陷入了深深的中年危机。', minAge: 38, maxAge: 55, weight: 5 },
  { id: 'parent_pass', type: 'family', title: '亲人离世', description: '你的父亲/母亲因病去世，你第一次直面生离死别。', minAge: 25, maxAge: 60, weight: 6 },
  { id: 'parent_pass_early', type: 'family', title: '至亲早逝', description: '你的父亲/母亲在你还年轻时就突然离世，留下了无尽的遗憾。', minAge: 18, maxAge: 35, weight: 3 },
  { id: 'travel_abroad', type: 'social', title: '环游世界', description: '你踏上了环游世界的旅程，见识了不同文化和风土人情。', minAge: 22, maxAge: 60, weight: 4, minFamScore: 40, minEconLevel: 50 },
  { id: 'startup', type: 'career', title: '副业创业', description: '你利用业余时间开启了自己的小事业，虽然辛苦但充实。', minAge: 25, maxAge: 50, weight: 4 },
  { id: 'career_switch', type: 'career', title: '毅然转行', description: '你放弃了稳定的工作，投身一个全新的领域。', minAge: 25, maxAge: 45, weight: 4 },
  { id: 'publish_book', type: 'other', title: '出版著作', description: '你写的书终于出版了，虽然销量平平，但圆了自己的作家梦。', minAge: 28, maxAge: 65, weight: 3 },
  { id: 'public_scandal', type: 'social', title: '名誉风波', description: '一场误会让你成了舆论焦点，你花了很久才走出阴影。', minAge: 22, maxAge: 55, weight: 2 },
  { id: 'community_leader', type: 'social', title: '社区领袖', description: '你被推选为社区代表，开始参与公共事务。', minAge: 30, maxAge: 65, weight: 3 },
  { id: 'health_scare', type: 'health', title: '健康警钟', description: '一次体检发现了异常指标，你被吓出了一身冷汗，所幸虚惊一场。', minAge: 30, maxAge: 60, weight: 4 },
  { id: 'infertility', type: 'family', title: '生育困难', description: '你和伴侣一直没能怀上孩子，辗转求医问药。', minAge: 28, maxAge: 40, weight: 3, gender: '女' },
  { id: 'miscarriage', type: 'family', title: '流产', description: '你经历了一次流产，那是一段极其痛苦的回忆。', minAge: 25, maxAge: 40, weight: 3, gender: '女' },
  { id: 'adopt_child', type: 'family', title: '收养孩子', description: '你决定收养一个孩子，给了他一个温暖的家。', minAge: 30, maxAge: 50, weight: 2 },
  { id: 'affair', type: 'family', title: '婚外情', description: '你没能抵挡住诱惑，有了一段婚外情。', minAge: 28, maxAge: 55, weight: 3 },
  { id: 'reconcile', type: 'family', title: '家庭和解', description: '经过多年冷战，你终于和家人冰释前嫌，抱头痛哭。', minAge: 30, maxAge: 60, weight: 4 },
  { id: 'retrain', type: 'education', title: '重返校园', description: '你决定重返校园充电，和年轻人一起坐在教室里。', minAge: 30, maxAge: 50, weight: 3 },
  { id: 'lottery_small', type: 'wealth', title: '小奖惊喜', description: '你中了一笔小奖，虽然不多，但足以让你开心好几天。', minAge: 20, maxAge: 70, weight: 3 },
  { id: 'debt_crisis', type: 'wealth', title: '债务危机', description: '你因为过度借贷陷入了债务危机，焦头烂额。', minAge: 25, maxAge: 55, weight: 4 },
  { id: 'help_relative', type: 'wealth', title: '接济亲友', description: '亲友遇到困难，你慷慨解囊帮他们渡过难关。', minAge: 28, maxAge: 60, weight: 4 },
  { id: 'natural_disaster_survive', type: 'accident', title: '劫后余生', description: '你经历了一场自然灾害，虽然失去了一些财产，但保住了性命。', minAge: 15, maxAge: 70, weight: 2 },
  { id: 'robbery', type: 'accident', title: '遭遇抢劫', description: '你在街头遭遇了抢劫，损失了一些财物，受到了惊吓。', minAge: 18, maxAge: 60, weight: 3 },
  { id: 'near_miss', type: 'accident', title: '与死神擦肩', description: '一次意外中你与死神擦肩而过，事后想想仍心有余悸。', minAge: 18, maxAge: 70, weight: 4 },
  { id: 'blood_donor', type: 'social', title: '无偿献血', description: '你参加了无偿献血，用自己的血液挽救了陌生人的生命。', minAge: 18, maxAge: 55, weight: 3 },
  { id: 'protest', type: 'social', title: '参与抗议', description: '你走上街头参与了抗议活动，为自己的信念发声。', minAge: 18, maxAge: 50, weight: 2 },
  { id: 'addiction_gambling', type: 'health', title: '染上赌瘾', description: '你迷上了赌博，一度输掉了大半积蓄。', minAge: 22, maxAge: 55, weight: 2 },
  { id: 'addiction_recover', type: 'health', title: '戒除恶习', description: '你下定决心戒掉了不良嗜好，重新掌控了自己的人生。', minAge: 25, maxAge: 55, weight: 3 },

  // 新增成年事件
  { id: 'midlife_career_crisis', type: 'career', title: '职业瓶颈', description: '你在职业发展上遇到了瓶颈，思考着要不要换一条路走。', minAge: 30, maxAge: 50, weight: 5 },
  { id: 'workplace_bully', type: 'social', title: '职场霸凌', description: '你在工作中遭遇了职场霸凌，一度想要辞职。', minAge: 22, maxAge: 50, weight: 3 },
  { id: 'promotion_earned', type: 'career', title: '获得晋升', description: '经过多年努力，你终于获得了梦寐以求的晋升。', minAge: 25, maxAge: 55, weight: 6 },
  { id: 'child_illness_adult', type: 'family', title: '孩子重病', description: '你的孩子生了一场重病，你日夜守在病床前。', minAge: 28, maxAge: 55, weight: 3 },
  { id: 'spouse_infidelity', type: 'family', title: '伴侣不忠', description: '你发现了伴侣的不忠，这段婚姻走到了尽头。', minAge: 25, maxAge: 55, weight: 3 },
  { id: 'car_accident', type: 'accident', title: '车祸惊魂', description: '你遭遇了一场严重的车祸，所幸性命无大碍。', minAge: 18, maxAge: 65, weight: 3 },
  { id: 'natural_disaster', type: 'accident', title: '自然灾害', description: '你经历了一场严重的自然灾害，财产损失严重。', minAge: 20, maxAge: 70, weight: 2 },
  { id: 'imprisonment', type: 'social', title: '身陷囹圄', description: '你因为一时糊涂而锒铛入狱，人生留下了污点。', minAge: 18, maxAge: 55, weight: 1 },
  { id: 'new_city', type: 'social', title: '移居新城市', description: '你搬到了一个新的城市，开始了全新的生活。', minAge: 22, maxAge: 50, weight: 4 },
  { id: 'found_npo', type: 'social', title: '创立公益组织', description: '你创立了一个公益组织，帮助了许多需要帮助的人。', minAge: 30, maxAge: 55, weight: 2, minFamScore: 50 },
  { id: 'art_exhibition', type: 'other', title: '作品展览', description: '你的作品被选中参加展览，获得了业内的认可。', minAge: 25, maxAge: 55, weight: 3 },
  { id: 'invention', type: 'career', title: '获得专利', description: '你的一项发明获得了专利，为你带来了声誉和财富。', minAge: 28, maxAge: 55, weight: 2 },
  { id: 'mentor_role', type: 'social', title: '成为导师', description: '你成为了年轻人的导师，帮助他们少走弯路。', minAge: 30, maxAge: 60, weight: 4 },
  { id: 'real_estate_invest', type: 'wealth', title: '房产投资', description: '你抓住了房地产红利，投资房产获得了丰厚回报。', minAge: 28, maxAge: 55, weight: 4, minFamScore: 40 },
  { id: 'crypto_swing', type: 'wealth', title: '币圈大波动', description: '你在加密货币市场经历了一场大波动，亏了不少钱。', minAge: 22, maxAge: 50, weight: 3 },
  { id: 'business_failure', type: 'career', title: '创业失败', description: '你的创业最终失败了，欠下了一大笔债。', minAge: 25, maxAge: 50, weight: 3 },
  { id: 'business_success', type: 'career', title: '创业成功', description: '你的事业步入正轨，获得了第一桶金。', minAge: 25, maxAge: 50, weight: 3, minFamScore: 35 },
  { id: 'health_scare_serious', type: 'health', title: '重病警报', description: '一次体检发现了严重问题，你被吓出了一身冷汗。', minAge: 25, maxAge: 60, weight: 3 },
  { id: 'therapy', type: 'health', title: '接受心理治疗', description: '你因为心理问题接受了长期的心理治疗。', minAge: 20, maxAge: 55, weight: 3 },
  { id: 'boss_fire', type: 'career', title: '被解雇', description: '你不幸被公司裁员，多年的努力付诸东流。', minAge: 22, maxAge: 50, weight: 4 },
  { id: 'boss_offer', type: 'career', title: '获得Offer', description: '你收到了一家梦寐以求的公司的Offer。', minAge: 22, maxAge: 45, weight: 3 },
  { id: 'family_secret', type: 'family', title: '家族秘密', description: '你发现了一个隐藏多年的家族秘密，颠覆了你的世界观。', minAge: 20, maxAge: 50, weight: 2 },
  { id: 'surprise_inherit', type: 'wealth', title: '意外之财', description: '一位远房亲戚去世，为你留下了一笔意想不到的遗产。', minAge: 25, maxAge: 60, weight: 2 },
  { id: 'charity_scandal', type: 'social', title: '慈善丑闻', description: '你卷入了一场慈善丑闻，声誉受到了严重影响。', minAge: 30, maxAge: 55, weight: 1 },
  { id: 'political_career', type: 'social', title: '投身政治', description: '你决定投身政治，竞选公职。', minAge: 25, maxAge: 55, weight: 2 },
  { id: 'religious_conversion', type: 'other', title: '改变信仰', description: '你经历了信仰的转变，人生哲学发生了根本变化。', minAge: 20, maxAge: 55, weight: 2 },
  { id: 'sports_achievement', type: 'other', title: '运动成就', description: '你在某个运动项目上取得了不错的成绩。', minAge: 20, maxAge: 50, weight: 3 },
];

/** 中老年事件（45-80岁） */
export const ELDER_EVENTS: EventTemplate[] = [
  { id: 'grandchild', type: 'family', title: '含饴弄孙', description: '你的第一个孙辈出生了，你抱着小家伙笑得合不拢嘴。', minAge: 45, maxAge: 70, weight: 6 },
  { id: 'retire_plan', type: 'career', title: '规划退休', description: '你开始认真规划退休后的生活，期待着闲适的日子。', minAge: 50, maxAge: 65, weight: 4 },
  { id: 'retire', type: 'career', title: '光荣退休', description: '你正式退休了，同事为你举办了欢送会。', minAge: 55, maxAge: 70, weight: 5 },
  { id: 'second_career', type: 'career', title: '第二事业', description: '退休后你开启了第二事业，做着真正热爱的事。', minAge: 55, maxAge: 75, weight: 3 },
  { id: 'chronic_illness', type: 'health', title: '慢性病', description: '你被诊断出慢性病，需要长期服药控制。', minAge: 45, maxAge: 75, weight: 5 },
  { id: 'surgery', type: 'health', title: '接受手术', description: '你接受了一次大手术，在医院躺了整整两周。', minAge: 45, maxAge: 80, weight: 4 },
  { id: 'fall_elderly', type: 'accident', title: '意外摔倒', description: '你在家里摔了一跤，骨折住院了好一阵子。', minAge: 60, maxAge: 85, weight: 4 },
  { id: 'memory_decline', type: 'health', title: '记忆力衰退', description: '你开始频繁忘记事情，不得不开始写备忘录。', minAge: 60, maxAge: 85, weight: 4 },
  { id: 'spouse_pass', type: 'family', title: '伴侣离世', description: '相伴一生的爱人先你而去，你第一次感到了真正的孤独。', minAge: 55, maxAge: 85, weight: 4 },
  { id: 'old_friend_reunion', type: 'social', title: '老友重逢', description: '你和失散多年的老友重逢了，你们聊了一整夜。', minAge: 50, maxAge: 80, weight: 4 },
  { id: 'write_memoir', type: 'other', title: '撰写回忆录', description: '你开始写回忆录，回顾自己跌宕起伏的一生。', minAge: 60, maxAge: 85, weight: 3 },
  { id: 'return_hometown', type: 'social', title: '叶落归根', description: '你回到了阔别多年的故乡，物是人非，感慨万千。', minAge: 55, maxAge: 80, weight: 4 },
  { id: 'philanthropy', type: 'wealth', title: '慈善捐赠', description: '你决定把一部分财产捐给慈善机构，回报社会。', minAge: 50, maxAge: 80, weight: 3, minFamScore: 55 },
  { id: 'estranged_child', type: 'family', title: '子女疏远', description: '你的子女很少来看你了，你常常独自坐在窗前发呆。', minAge: 60, maxAge: 85, weight: 3 },
  { id: 'nursing_home', type: 'family', title: '入住养老院', description: '由于身体每况愈下，你不得不住进了养老院。', minAge: 70, maxAge: 90, weight: 3 },
  { id: 'hobby_elder', type: 'other', title: '培养新爱好', description: '你开始学习书法/园艺/摄影，退休生活变得丰富多彩。', minAge: 55, maxAge: 80, weight: 5 },
  { id: 'veteran_reunion', type: 'social', title: '战友/同事聚会', description: '你参加了一场老同事/战友的聚会，大家回忆往昔，感慨万千。', minAge: 55, maxAge: 80, weight: 4 },
];

/** 社交 / 生活类随机事件（兼容原有接口） */
export const SOCIAL_EVENTS: EventTemplate[] = [
  ...CHILDHOOD_EVENTS,
  ...TEEN_EVENTS,
  ...ADULT_EVENTS,
  ...ELDER_EVENTS,
];

/** 财富类随机事件 */
export const WEALTH_EVENTS: EventTemplate[] = [
  { id: 'lottery', type: 'wealth', title: '彩票中奖', description: '一张彩票改变了你的财务状况。', minAge: 20, maxAge: 80, weight: 1 },
  { id: 'inherit', type: 'wealth', title: '获得遗产', description: '一位亲友的离世为你留下了一笔遗产。', minAge: 30, maxAge: 75, weight: 3 },
  { id: 'investWin', type: 'wealth', title: '投资大赚', description: '一次成功的投资让你的资产大幅增长。', minAge: 25, maxAge: 75, weight: 4 },
  { id: 'investLose', type: 'wealth', title: '投资失利', description: '一次失败的投资让你损失惨重。', minAge: 25, maxAge: 75, weight: 4 },
  { id: 'fraud', type: 'wealth', title: '遭遇诈骗', description: '你辛苦攒下的钱被一场骗局卷走。', minAge: 25, maxAge: 80, weight: 3 },
  { id: 'business_opp', type: 'wealth', title: '商业机会', description: '一个难得的商业机会出现在你面前，你抓住了它。', minAge: 25, maxAge: 55, weight: 3, minFamScore: 40 },
  { id: 'stock_crash', type: 'wealth', title: '股市暴跌', description: '一场股灾让你的投资组合大幅缩水。', minAge: 28, maxAge: 70, weight: 3 },
  { id: 'realestate_win', type: 'wealth', title: '房产升值', description: '你早年购入的房产大幅升值，让你喜出望外。', minAge: 30, maxAge: 65, weight: 3, minFamScore: 35 },
  { id: 'side_hustle', type: 'wealth', title: '副业收入', description: '你的副业开始产生不错的收入，比工资还高。', minAge: 22, maxAge: 55, weight: 4 },
  { id: 'bankruptcy', type: 'wealth', title: '濒临破产', description: '一次失败的商业冒险让你濒临破产边缘。', minAge: 28, maxAge: 60, weight: 2 },
  { id: 'insurance_payout', type: 'wealth', title: '保险理赔', description: '你之前购买的保险派上了用场，获得了一笔理赔金。', minAge: 25, maxAge: 70, weight: 2 },

  // 新增财富事件
  { id: 'crypto_swing_ev', type: 'wealth', title: '币圈大赚', description: '你在加密货币的上涨行情中大赚了一笔。', minAge: 22, maxAge: 45, weight: 2, minYear: 2014 },
  { id: 'crypto_crash_ev', type: 'wealth', title: '币圈暴跌', description: '你持有的加密货币暴跌，资产大幅缩水。', minAge: 22, maxAge: 45, weight: 3, minYear: 2014 },
  { id: 'angel_invest', type: 'wealth', title: '天使投资', description: '你对一个初创项目进行了投资，后来获得了丰厚回报。', minAge: 28, maxAge: 50, weight: 1, minFamScore: 55 },
  { id: 'tax_audit', type: 'wealth', title: '税务审查', description: '你被税务部门审查，不得不补缴一大笔税款。', minAge: 30, maxAge: 65, weight: 2 },
  { id: 'bonus_ev', type: 'wealth', title: '年度奖金', description: '你收到了一笔丰厚的年度奖金。', minAge: 22, maxAge: 60, weight: 6 },
  { id: 'severance', type: 'wealth', title: '离职补偿', description: '你被裁员，获得了一笔不错的离职补偿金。', minAge: 22, maxAge: 55, weight: 2 },
  { id: 'debt_forgive', type: 'wealth', title: '债务免除', description: '一笔多年前的旧债被免除了，你如释重负。', minAge: 25, maxAge: 60, weight: 1 },
  { id: 'crowdfund', type: 'wealth', title: '众筹成功', description: '你的项目在众筹平台上大获成功，获得了大量支持。', minAge: 22, maxAge: 45, weight: 2, minYear: 2012 },
  { id: 'inherit_early', type: 'wealth', title: '提前继承', description: '一位长辈提前将一笔财产过户给了你。', minAge: 25, maxAge: 50, weight: 2 },
  { id: 'royalty', type: 'wealth', title: '版税收入', description: '你的作品产生了持续的版税收入。', minAge: 25, maxAge: 60, weight: 2 },
  { id: 'gamble_win', type: 'wealth', title: '赌博赢钱', description: '你在一次赌博中赢了不少钱，但这也让你上瘾了。', minAge: 18, maxAge: 50, weight: 1 },
  { id: 'gamble_lose', type: 'wealth', title: '赌博输钱', description: '你在赌博中输了很多钱，家人都为你担心。', minAge: 18, maxAge: 50, weight: 2 },
];
