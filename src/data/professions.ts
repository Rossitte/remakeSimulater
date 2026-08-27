import type { EducationLevel } from '../models/LifeResult';

export const EDUCATION_LEVELS: EducationLevel[] = ['文盲', '小学', '初中', '高中', '大专', '大学', '硕士', '博士'];

export interface Profession {
  id: string;
  name: string;
  /** 所需最低学历（EDUCATION_LEVELS 下标） */
  minEducation: number;
  /** 智力门槛 0-100 */
  intelligenceReq: number;
  /** 社交门槛 0-100 */
  socialReq: number;
  /** 年收入区间（USD） */
  incomeMin: number;
  incomeMax: number;
  /** 社会声望 0-100 */
  prestige: number;
}

export const PROFESSIONS: Profession[] = [
  { id: 'farmer', name: '农民', minEducation: 0, intelligenceReq: 0, socialReq: 0, incomeMin: 3000, incomeMax: 15000, prestige: 10 },
  { id: 'construction', name: '建筑工人', minEducation: 0, intelligenceReq: 0, socialReq: 0, incomeMin: 8000, incomeMax: 30000, prestige: 15 },
  { id: 'factory', name: '工厂工人', minEducation: 1, intelligenceReq: 0, socialReq: 0, incomeMin: 10000, incomeMax: 35000, prestige: 15 },
  { id: 'waiter', name: '服务员', minEducation: 0, intelligenceReq: 0, socialReq: 10, incomeMin: 5000, incomeMax: 20000, prestige: 12 },
  { id: 'courier', name: '快递员', minEducation: 1, intelligenceReq: 0, socialReq: 0, incomeMin: 10000, incomeMax: 40000, prestige: 15 },
  { id: 'driver', name: '司机', minEducation: 1, intelligenceReq: 0, socialReq: 0, incomeMin: 12000, incomeMax: 50000, prestige: 18 },
  { id: 'barber', name: '手艺人', minEducation: 1, intelligenceReq: 0, socialReq: 20, incomeMin: 10000, incomeMax: 60000, prestige: 20 },
  { id: 'chef', name: '厨师', minEducation: 1, intelligenceReq: 0, socialReq: 15, incomeMin: 15000, incomeMax: 70000, prestige: 25 },
  { id: 'vendor', name: '个体经营者', minEducation: 2, intelligenceReq: 10, socialReq: 30, incomeMin: 20000, incomeMax: 150000, prestige: 25 },
  { id: 'soldier', name: '军人', minEducation: 2, intelligenceReq: 10, socialReq: 20, incomeMin: 20000, incomeMax: 60000, prestige: 40 },
  { id: 'police', name: '警察', minEducation: 3, intelligenceReq: 20, socialReq: 25, incomeMin: 25000, incomeMax: 60000, prestige: 45 },
  { id: 'nurse', name: '护士', minEducation: 3, intelligenceReq: 40, socialReq: 40, incomeMin: 25000, incomeMax: 80000, prestige: 45 },
  { id: 'teacher_primary', name: '小学教师', minEducation: 4, intelligenceReq: 40, socialReq: 30, incomeMin: 20000, incomeMax: 60000, prestige: 45 },
  { id: 'teacher_middle', name: '中学教师', minEducation: 4, intelligenceReq: 55, socialReq: 35, incomeMin: 30000, incomeMax: 80000, prestige: 55 },
  { id: 'teacher_university', name: '大学教师', minEducation: 5, intelligenceReq: 70, socialReq: 40, incomeMin: 50000, incomeMax: 150000, prestige: 75 },
  { id: 'clerk', name: '企业员工', minEducation: 3, intelligenceReq: 30, socialReq: 30, incomeMin: 20000, incomeMax: 80000, prestige: 40 },
  { id: 'manager', name: '中层管理者', minEducation: 4, intelligenceReq: 60, socialReq: 60, incomeMin: 60000, incomeMax: 200000, prestige: 60 },
  { id: 'executive', name: '企业高管', minEducation: 4, intelligenceReq: 75, socialReq: 75, incomeMin: 200000, incomeMax: 800000, prestige: 82 },
  { id: 'civil', name: '公务员', minEducation: 3, intelligenceReq: 45, socialReq: 40, incomeMin: 20000, incomeMax: 100000, prestige: 55 },
  { id: 'programmer', name: '程序员', minEducation: 4, intelligenceReq: 70, socialReq: 25, incomeMin: 50000, incomeMax: 300000, prestige: 65 },
  { id: 'tech_expert', name: '技术专家', minEducation: 5, intelligenceReq: 80, socialReq: 35, incomeMin: 150000, incomeMax: 600000, prestige: 80 },
  { id: 'doctor', name: '医生', minEducation: 5, intelligenceReq: 80, socialReq: 40, incomeMin: 80000, incomeMax: 400000, prestige: 85 },
  { id: 'lawyer', name: '律师', minEducation: 5, intelligenceReq: 80, socialReq: 60, incomeMin: 80000, incomeMax: 500000, prestige: 85 },
  { id: 'finance', name: '金融从业者', minEducation: 4, intelligenceReq: 70, socialReq: 60, incomeMin: 60000, incomeMax: 400000, prestige: 75 },
  { id: 'researcher', name: '科研人员', minEducation: 5, intelligenceReq: 85, socialReq: 30, incomeMin: 50000, incomeMax: 250000, prestige: 80 },
  { id: 'artist', name: '艺术家', minEducation: 3, intelligenceReq: 50, socialReq: 40, incomeMin: 10000, incomeMax: 300000, prestige: 60 },
  { id: 'freelancer', name: '自由职业者', minEducation: 2, intelligenceReq: 30, socialReq: 40, incomeMin: 15000, incomeMax: 200000, prestige: 35 },
  { id: 'athlete', name: '运动员', minEducation: 2, intelligenceReq: 20, socialReq: 50, incomeMin: 30000, incomeMax: 500000, prestige: 65 },
  { id: 'streamer', name: '自媒体博主', minEducation: 2, intelligenceReq: 30, socialReq: 60, incomeMin: 20000, incomeMax: 1000000, prestige: 45 },
  { id: 'entrepreneur', name: '企业家', minEducation: 3, intelligenceReq: 55, socialReq: 60, incomeMin: 100000, incomeMax: 5000000, prestige: 90 },

  // ===== 新增职业 =====

  // 蓝领/技术工人
  { id: 'electrician', name: '电工', minEducation: 1, intelligenceReq: 10, socialReq: 10, incomeMin: 15000, incomeMax: 60000, prestige: 22 },
  { id: 'plumber', name: '水管工', minEducation: 1, intelligenceReq: 10, socialReq: 10, incomeMin: 15000, incomeMax: 55000, prestige: 20 },
  { id: 'mechanic', name: '机械师', minEducation: 2, intelligenceReq: 25, socialReq: 15, incomeMin: 20000, incomeMax: 80000, prestige: 25 },
  { id: 'carpenter', name: '木匠', minEducation: 1, intelligenceReq: 10, socialReq: 10, incomeMin: 12000, incomeMax: 50000, prestige: 18 },
  { id: 'tailor', name: '裁缝', minEducation: 1, intelligenceReq: 5, socialReq: 10, incomeMin: 8000, incomeMax: 35000, prestige: 15 },
  { id: 'painter', name: '油漆工', minEducation: 1, intelligenceReq: 5, socialReq: 10, incomeMin: 10000, incomeMax: 40000, prestige: 15 },
  { id: 'miner', name: '矿工', minEducation: 0, intelligenceReq: 0, socialReq: 0, incomeMin: 15000, incomeMax: 50000, prestige: 12 },
  { id: 'fisherman', name: '渔民', minEducation: 0, intelligenceReq: 0, socialReq: 0, incomeMin: 5000, incomeMax: 25000, prestige: 10 },
  { id: 'lumberjack', name: '伐木工', minEducation: 0, intelligenceReq: 0, socialReq: 0, incomeMin: 8000, incomeMax: 30000, prestige: 10 },

  // 服务业
  { id: 'receptionist', name: '前台接待', minEducation: 2, intelligenceReq: 20, socialReq: 40, incomeMin: 15000, incomeMax: 35000, prestige: 30 },
  { id: 'flight_attendant', name: '空乘人员', minEducation: 3, intelligenceReq: 35, socialReq: 60, incomeMin: 40000, incomeMax: 120000, prestige: 55 },
  { id: 'tour_guide', name: '导游', minEducation: 2, intelligenceReq: 25, socialReq: 60, incomeMin: 20000, incomeMax: 70000, prestige: 35 },
  { id: 'wedding_planner', name: '婚礼策划师', minEducation: 3, intelligenceReq: 30, socialReq: 50, incomeMin: 30000, incomeMax: 100000, prestige: 40 },
  { id: 'hotel_manager', name: '酒店经理', minEducation: 4, intelligenceReq: 50, socialReq: 60, incomeMin: 50000, incomeMax: 200000, prestige: 55 },
  { id: 'beautician', name: '美容师', minEducation: 1, intelligenceReq: 10, socialReq: 30, incomeMin: 15000, incomeMax: 50000, prestige: 25 },
  { id: 'fitness_coach', name: '健身教练', minEducation: 2, intelligenceReq: 15, socialReq: 40, incomeMin: 20000, incomeMax: 80000, prestige: 35 },
  { id: 'yoga_instructor', name: '瑜伽教练', minEducation: 2, intelligenceReq: 20, socialReq: 45, incomeMin: 20000, incomeMax: 70000, prestige: 40 },

  // 创意/自由职业
  { id: 'musician', name: '音乐人', minEducation: 2, intelligenceReq: 35, socialReq: 40, incomeMin: 10000, incomeMax: 300000, prestige: 50 },
  { id: 'photographer', name: '摄影师', minEducation: 2, intelligenceReq: 30, socialReq: 40, incomeMin: 20000, incomeMax: 150000, prestige: 45 },
  { id: 'designer', name: '设计师', minEducation: 4, intelligenceReq: 55, socialReq: 40, incomeMin: 50000, incomeMax: 250000, prestige: 60 },
  { id: 'writer', name: '作家', minEducation: 3, intelligenceReq: 50, socialReq: 35, incomeMin: 15000, incomeMax: 200000, prestige: 55 },
  { id: 'screenwriter', name: '编剧', minEducation: 4, intelligenceReq: 60, socialReq: 40, incomeMin: 40000, incomeMax: 300000, prestige: 60 },
  { id: 'illustrator', name: '插画师', minEducation: 3, intelligenceReq: 40, socialReq: 30, incomeMin: 30000, incomeMax: 150000, prestige: 50 },
  { id: 'dancer', name: '舞蹈演员', minEducation: 2, intelligenceReq: 20, socialReq: 50, incomeMin: 15000, incomeMax: 120000, prestige: 45 },

  // 科技/互联网
  { id: 'data_analyst', name: '数据分析师', minEducation: 4, intelligenceReq: 70, socialReq: 30, incomeMin: 60000, incomeMax: 350000, prestige: 70 },
  { id: 'product_manager', name: '产品经理', minEducation: 4, intelligenceReq: 65, socialReq: 55, incomeMin: 80000, incomeMax: 500000, prestige: 72 },
  { id: 'ui_designer', name: 'UI设计师', minEducation: 4, intelligenceReq: 55, socialReq: 40, incomeMin: 50000, incomeMax: 300000, prestige: 65 },
  { id: 'network_engineer', name: '网络工程师', minEducation: 4, intelligenceReq: 65, socialReq: 25, incomeMin: 55000, incomeMax: 280000, prestige: 65 },
  { id: 'game_developer', name: '游戏开发者', minEducation: 5, intelligenceReq: 75, socialReq: 20, incomeMin: 80000, incomeMax: 600000, prestige: 75 },
  { id: 'digital_marketer', name: '数字营销师', minEducation: 4, intelligenceReq: 50, socialReq: 60, incomeMin: 60000, incomeMax: 350000, prestige: 65 },

  // 医疗/健康
  { id: 'pharmacist', name: '药剂师', minEducation: 5, intelligenceReq: 70, socialReq: 35, incomeMin: 60000, incomeMax: 250000, prestige: 75 },
  { id: 'physiotherapist', name: '物理治疗师', minEducation: 5, intelligenceReq: 65, socialReq: 40, incomeMin: 50000, incomeMax: 220000, prestige: 70 },
  { id: 'midwife', name: '助产士', minEducation: 4, intelligenceReq: 55, socialReq: 50, incomeMin: 35000, incomeMax: 100000, prestige: 60 },
  { id: 'nutritionist', name: '营养师', minEducation: 5, intelligenceReq: 60, socialReq: 40, incomeMin: 40000, incomeMax: 180000, prestige: 65 },
  { id: 'psychologist', name: '心理咨询师', minEducation: 5, intelligenceReq: 65, socialReq: 55, incomeMin: 50000, incomeMax: 250000, prestige: 70 },
  { id: 'dentist', name: '牙医', minEducation: 5, intelligenceReq: 80, socialReq: 40, incomeMin: 100000, incomeMax: 500000, prestige: 82 },
  { id: 'veterinarian', name: '兽医', minEducation: 5, intelligenceReq: 75, socialReq: 35, incomeMin: 40000, incomeMax: 200000, prestige: 70 },

  // 商业/管理
  { id: 'marketing_mgr', name: '市场经理', minEducation: 4, intelligenceReq: 60, socialReq: 70, incomeMin: 70000, incomeMax: 400000, prestige: 68 },
  { id: 'hr_manager', name: '人力资源经理', minEducation: 4, intelligenceReq: 55, socialReq: 65, incomeMin: 60000, incomeMax: 300000, prestige: 60 },
  { id: 'logistics_mgr', name: '物流经理', minEducation: 3, intelligenceReq: 50, socialReq: 50, incomeMin: 50000, incomeMax: 250000, prestige: 50 },
  { id: 'real_estate_agent', name: '房地产经纪', minEducation: 2, intelligenceReq: 30, socialReq: 60, incomeMin: 30000, incomeMax: 300000, prestige: 45 },
  { id: 'insurance_agent', name: '保险经纪', minEducation: 2, intelligenceReq: 35, socialReq: 65, incomeMin: 25000, incomeMax: 250000, prestige: 40 },
  { id: 'investment_banker', name: '投资银行家', minEducation: 5, intelligenceReq: 80, socialReq: 75, incomeMin: 200000, incomeMax: 1500000, prestige: 90 },

  // 公务员/公共服务
  { id: 'judge', name: '法官', minEducation: 5, intelligenceReq: 80, socialReq: 50, incomeMin: 80000, incomeMax: 300000, prestige: 88 },
  { id: 'prosecutor', name: '检察官', minEducation: 5, intelligenceReq: 80, socialReq: 50, incomeMin: 70000, incomeMax: 280000, prestige: 85 },
  { id: 'diplomat', name: '外交官', minEducation: 5, intelligenceReq: 75, socialReq: 80, incomeMin: 100000, incomeMax: 400000, prestige: 85 },
  { id: 'city_planner', name: '城市规划师', minEducation: 5, intelligenceReq: 70, socialReq: 40, incomeMin: 60000, incomeMax: 250000, prestige: 70 },
  { id: 'archivist', name: '档案管理员', minEducation: 3, intelligenceReq: 45, socialReq: 30, incomeMin: 25000, incomeMax: 80000, prestige: 40 },
  { id: 'librarian', name: '图书管理员', minEducation: 3, intelligenceReq: 40, socialReq: 35, incomeMin: 20000, incomeMax: 70000, prestige: 40 },

  // 教育/学术
  { id: 'kindergarten_teacher', name: '幼儿园教师', minEducation: 3, intelligenceReq: 35, socialReq: 55, incomeMin: 18000, incomeMax: 50000, prestige: 40 },
  { id: 'vocational_teacher', name: '职业学校教师', minEducation: 4, intelligenceReq: 50, socialReq: 40, incomeMin: 35000, incomeMax: 100000, prestige: 50 },
  { id: 'tutor', name: '家教', minEducation: 3, intelligenceReq: 40, socialReq: 40, incomeMin: 15000, incomeMax: 80000, prestige: 40 },
  { id: 'translator', name: '翻译', minEducation: 3, intelligenceReq: 50, socialReq: 40, incomeMin: 30000, incomeMax: 150000, prestige: 50 },
  { id: 'interpreter', name: '同传译员', minEducation: 5, intelligenceReq: 70, socialReq: 50, incomeMin: 80000, incomeMax: 400000, prestige: 75 },
  { id: 'historian', name: '历史学家', minEducation: 5, intelligenceReq: 75, socialReq: 30, incomeMin: 50000, incomeMax: 200000, prestige: 75 },
  { id: 'economist', name: '经济学家', minEducation: 5, intelligenceReq: 80, socialReq: 40, incomeMin: 60000, incomeMax: 400000, prestige: 80 },

  // 新兴/小众职业
  { id: 'ai_researcher', name: 'AI研究员', minEducation: 5, intelligenceReq: 90, socialReq: 30, incomeMin: 200000, incomeMax: 1000000, prestige: 90 },
  { id: 'blockchain_dev', name: '区块链开发者', minEducation: 5, intelligenceReq: 85, socialReq: 25, incomeMin: 150000, incomeMax: 800000, prestige: 80 },
  { id: 'esports_player', name: '电竞选手', minEducation: 1, intelligenceReq: 40, socialReq: 45, incomeMin: 30000, incomeMax: 500000, prestige: 50 },
  { id: 'pet_breeder', name: '宠物繁育师', minEducation: 1, intelligenceReq: 15, socialReq: 25, incomeMin: 10000, incomeMax: 60000, prestige: 25 },
  { id: 'fortune_teller', name: '占卜师', minEducation: 0, intelligenceReq: 20, socialReq: 35, incomeMin: 8000, incomeMax: 50000, prestige: 15 },
  { id: 'medium', name: '心理咨询灵修师', minEducation: 2, intelligenceReq: 30, socialReq: 45, incomeMin: 20000, incomeMax: 100000, prestige: 35 },

  // 农业/环境
  { id: 'organic_farmer', name: '有机农场主', minEducation: 2, intelligenceReq: 20, socialReq: 20, incomeMin: 15000, incomeMax: 100000, prestige: 25 },
  { id: 'environmentalist', name: '环保工作者', minEducation: 4, intelligenceReq: 55, socialReq: 50, incomeMin: 30000, incomeMax: 120000, prestige: 55 },
  { id: 'marine_biologist', name: '海洋生物学家', minEducation: 5, intelligenceReq: 80, socialReq: 30, incomeMin: 50000, incomeMax: 250000, prestige: 75 },

  // 交通运输
  { id: 'pilot', name: '飞行员', minEducation: 4, intelligenceReq: 75, socialReq: 40, incomeMin: 150000, incomeMax: 800000, prestige: 85 },
  { id: 'train_driver', name: '火车司机', minEducation: 2, intelligenceReq: 25, socialReq: 15, incomeMin: 25000, incomeMax: 80000, prestige: 30 },
  { id: 'ship_captain', name: '船长', minEducation: 3, intelligenceReq: 55, socialReq: 45, incomeMin: 80000, incomeMax: 400000, prestige: 70 },
  { id: 'trucker', name: '长途卡车司机', minEducation: 1, intelligenceReq: 10, socialReq: 10, incomeMin: 20000, incomeMax: 60000, prestige: 18 },

  // 军警/安保
  { id: 'firefighter', name: '消防员', minEducation: 2, intelligenceReq: 30, socialReq: 30, incomeMin: 30000, incomeMax: 90000, prestige: 50 },
  { id: 'security', name: '保安', minEducation: 0, intelligenceReq: 5, socialReq: 10, incomeMin: 8000, incomeMax: 25000, prestige: 10 },
  { id: 'bodyguard', name: '保镖', minEducation: 1, intelligenceReq: 25, socialReq: 20, incomeMin: 30000, incomeMax: 150000, prestige: 30 },
  { id: 'detective', name: '侦探', minEducation: 4, intelligenceReq: 55, socialReq: 45, incomeMin: 50000, incomeMax: 250000, prestige: 65 },

  // 手工艺/传统
  { id: 'jeweler', name: '珠宝匠', minEducation: 2, intelligenceReq: 25, socialReq: 25, incomeMin: 30000, incomeMax: 200000, prestige: 45 },
  { id: 'potter', name: '陶艺师', minEducation: 1, intelligenceReq: 20, socialReq: 20, incomeMin: 10000, incomeMax: 60000, prestige: 30 },
  { id: 'perfumer', name: '调香师', minEducation: 4, intelligenceReq: 55, socialReq: 35, incomeMin: 50000, incomeMax: 300000, prestige: 65 },
  { id: 'chef_pastry', name: '糕点师', minEducation: 1, intelligenceReq: 20, socialReq: 20, incomeMin: 15000, incomeMax: 60000, prestige: 28 },
  { id: 'bartender', name: '调酒师', minEducation: 1, intelligenceReq: 15, socialReq: 35, incomeMin: 15000, incomeMax: 50000, prestige: 25 },

  // 金融高端
  { id: 'hedge_fund_mgr', name: '对冲基金经理', minEducation: 5, intelligenceReq: 85, socialReq: 70, incomeMin: 500000, incomeMax: 5000000, prestige: 95 },
  { id: 'venture_capitalist', name: '风险投资人', minEducation: 5, intelligenceReq: 85, socialReq: 75, incomeMin: 300000, incomeMax: 3000000, prestige: 92 },
  { id: 'actuary', name: '精算师', minEducation: 5, intelligenceReq: 80, socialReq: 40, incomeMin: 150000, incomeMax: 700000, prestige: 85 },

  // 媒体/娱乐
  { id: 'journalist', name: '记者', minEducation: 4, intelligenceReq: 55, socialReq: 60, incomeMin: 40000, incomeMax: 200000, prestige: 60 },
  { id: 'news_anchor', name: '新闻主播', minEducation: 4, intelligenceReq: 60, socialReq: 70, incomeMin: 80000, incomeMax: 500000, prestige: 75 },
  { id: 'actor', name: '演员', minEducation: 2, intelligenceReq: 30, socialReq: 60, incomeMin: 15000, incomeMax: 1000000, prestige: 55 },
  { id: 'director', name: '导演', minEducation: 5, intelligenceReq: 70, socialReq: 60, incomeMin: 100000, incomeMax: 1000000, prestige: 80 },
  { id: 'producer', name: '制片人', minEducation: 5, intelligenceReq: 70, socialReq: 70, incomeMin: 150000, incomeMax: 800000, prestige: 85 },
];
