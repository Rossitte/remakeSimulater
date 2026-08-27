import type { BirthInfo } from '../models/BirthInfo';
import type { Person } from '../models/Person';
import type { CareerStage, LifeEvent } from '../models/LifeResult';
import { PROFESSIONS, type Profession } from '../data/professions';
import { weightedRandom } from '../utils/weightedRandom';
import { careerPerformance } from './personEngine';
import { chance, clamp, gaussian, randomInt } from '../utils/random';

export interface CareerResult {
  stages: CareerStage[];
  mainCareer: string;
  highestPrestige: number;
  retireAge: number;
  events: LifeEvent[];
}

/** 同职业族内的晋升链（按职业 id） */
const PROMOTION: Record<string, string> = {
  clerk: 'manager',
  manager: 'executive',
  programmer: 'tech_expert',
  teacher_primary: 'teacher_middle',
  teacher_middle: 'teacher_university',
  designer: 'manager',
  data_analyst: 'manager',
  ui_designer: 'designer',
  marketing_mgr: 'manager',
  hr_manager: 'manager',
  product_manager: 'executive',
  network_engineer: 'tech_expert',
  game_developer: 'tech_expert',
  digital_marketer: 'marketing_mgr',
  psychologist: 'teacher_university',
  pharmacist: 'doctor',
  historian: 'researcher',
  economist: 'researcher',
  interpreter: 'teacher_university',
  finance: 'investment_banker',
  lawyer: 'executive',
};

/** 自动模拟职业发展 */
export function simulateCareer(
  birth: BirthInfo,
  person: Person,
  education: { levelIndex: number; graduateAge: number },
  maxAge?: number,
): CareerResult {
  const { intelligence, socialConnection } = person.attributes;
  const { careerPotential, financialPotential } = person.potential;
  const econ = birth.country.economicLevel;
  const famScore = birth.family.economicScore;

  const startAge = Math.max(14, education.graduateAge + randomInt(0, 2));
  const retireAge = clamp(
    Math.round(58 + (intelligence - 50) * 0.08 + (birth.family.healthLevel - 50) * 0.05 - (econ > 80 ? 2 : 0) + gaussian(0, 3)),
    55,
    70,
  );

  // 如果在开始工作前就去世了，返回空职业
  const effectiveRetire = maxAge !== undefined ? Math.min(retireAge, maxAge) : retireAge;
  if (startAge > effectiveRetire) {
    return { stages: [], mainCareer: '无', highestPrestige: 0, retireAge: effectiveRetire, events: [] };
  }

  const eligible = PROFESSIONS.filter((p) => education.levelIndex >= p.minEducation);

  // 超级富裕家庭（economicScore >= 85）：直接排除所有低声望蓝领职业
  // 非常富裕家庭（economicScore >= 70）：大幅降低蓝领职业权重
  const filtered = famScore >= 85
    ? eligible.filter((p) => p.prestige >= 35 || p.minEducation >= 3)
    : eligible;

  const scored = filtered.map((p) => {
    const iqFit = Math.max(0, intelligence - p.intelligenceReq);
    const socFit = Math.max(0, socialConnection - p.socialReq);

    // 家庭背景对职业选择的影响（大幅增强）
    let famBias: number;
    if (famScore >= 65) {
      // 富裕家庭：偏好高声望职业，排斥蓝领
      if (p.prestige >= 60) {
        famBias = (famScore - 50) * 0.8;
      } else if (p.prestige >= 40) {
        famBias = (famScore - 50) * 0.3;
      } else {
        famBias = -(famScore - 50) * 0.5;
      }
    } else if (famScore >= 45) {
      // 中等家庭：轻微偏好中高声望
      famBias = p.prestige >= 40 ? (famScore - 50) * 0.4 : -(famScore - 50) * 0.15;
    } else {
      // 贫困家庭：倾向低门槛职业
      famBias = p.prestige < 30 ? (50 - famScore) * 0.2 : -(50 - famScore) * 0.1;
    }

    // 父母职业对子女的影响
    const parentInfluence = parentProfessionAffinity(p, birth.family.father.job)
      + parentProfessionAffinity(p, birth.family.mother.job);

    const weight = (iqFit + socFit + p.prestige * 0.15 + famBias + parentInfluence + 10) * (0.6 + econ / 110);
    return { item: p, weight: Math.max(1, weight) };
  });
  const main = weightedRandom(scored);

  const stages: CareerStage[] = [];
  const events: LifeEvent[] = [];

  let current = main;
  let fromAge = startAge;
  let highestPrestige = current.prestige;
  let willEntrepreneur = chance(0.04 + financialPotential * 0.001 + famScore * 0.0004) && careerPotential >= 55;
  const entreAge = startAge + randomInt(4, 12);

  events.push({
    age: startAge,
    type: 'career',
    title: `成为${current.name}`,
    description: `你开始从事${current.name}的工作，人生就此翻开新的一页。`,
  });

  for (let age = startAge; age <= effectiveRetire; age++) {
    const next = PROMOTION[current.id];
    if (next && age - fromAge >= randomInt(4, 8) && careerPotential >= 55 && chance(0.35)) {
      stages.push(makeStage(current, fromAge, age, birth, person));
      current = PROFESSIONS.find((p) => p.id === next)!;
      fromAge = age;
      highestPrestige = Math.max(highestPrestige, current.prestige);
      events.push({
        age,
        type: 'career',
        title: `升任${current.name}`,
        description: `凭借出色的表现，你升任${current.name}。`,
      });
    } else if (willEntrepreneur && age >= entreAge && chance(0.25)) {
      const success = chance(0.38 + financialPotential * 0.004);
      stages.push(makeStage(current, fromAge, age, birth, person));
      current = PROFESSIONS.find((p) => p.id === 'entrepreneur')!;
      fromAge = age;
      willEntrepreneur = false;
      if (success) {
        highestPrestige = Math.max(highestPrestige, 95);
        events.push({
          age,
          type: 'career',
          title: '创业成功',
          description: '你创办的公司站稳了脚跟，事业走向巅峰。',
        });
      } else {
        events.push({
          age,
          type: 'career',
          title: '创业失败',
          description: '你的创业最终失败，赔上了不少积蓄。',
        });
      }
    } else if (chance(0.008) && filtered.length > 1) {
      const candidates = filtered.filter((p) => p.id !== current.id);
      if (candidates.length > 0) {
        const alt = weightedRandom(
          candidates.map((p) => ({ item: p, weight: 1 })),
        );
        if (alt) {
          stages.push(makeStage(current, fromAge, age, birth, person));
          current = alt;
          fromAge = age;
          highestPrestige = Math.max(highestPrestige, current.prestige);
          events.push({
            age,
            type: 'career',
            title: '跳槽转行',
            description: `你转行成为${current.name}，开始一段新的职业生涯。`,
          });
        }
      }
    }
  }

  stages.push(makeStage(current, fromAge, effectiveRetire, birth, person));

  return { stages, mainCareer: main.name, highestPrestige, retireAge: effectiveRetire, events };
}

/** 父母职业与子女职业的关联度（名字匹配） */
const PARENT_JOB_MAP: Record<string, string[]> = {
  '律师': ['lawyer', 'civil', 'judge', 'prosecutor'],
  '法官': ['lawyer', 'civil', 'judge'],
  '检察官': ['lawyer', 'civil', 'prosecutor'],
  '金融从业者': ['finance', 'entrepreneur', 'clerk', 'investment_banker'],
  '银行家': ['finance', 'entrepreneur', 'investment_banker'],
  '会计师': ['finance', 'clerk', 'actuary'],
  '医生': ['doctor', 'nurse', 'researcher', 'pharmacist', 'dentist'],
  '护士': ['nurse', 'doctor', 'midwife'],
  '教师': ['teacher_primary', 'teacher_middle', 'teacher_university', 'researcher', 'kindergarten_teacher', 'tutor'],
  '教授': ['teacher_university', 'researcher', 'historian', 'economist'],
  '工程师': ['programmer', 'tech_expert', 'researcher', 'network_engineer'],
  '程序员': ['programmer', 'tech_expert', 'game_developer', 'blockchain_dev'],
  '科学家': ['researcher', 'tech_expert', 'ai_researcher'],
  '艺术家': ['artist', 'musician', 'dancer'],
  '画家': ['artist', 'illustrator'],
  '作家': ['artist', 'teacher_university', 'writer', 'screenwriter'],
  '警察': ['police', 'soldier', 'civil', 'detective'],
  '军人': ['soldier', 'police', 'security', 'bodyguard'],
  '公务员': ['civil', 'clerk', 'archivist', 'librarian'],
  '企业高管': ['executive', 'entrepreneur', 'manager', 'hedge_fund_mgr'],
  '企业家': ['entrepreneur', 'venture_capitalist'],
  '经理': ['manager', 'executive', 'marketing_mgr', 'hr_manager'],
  '销售人员': ['vendor', 'clerk', 'streamer', 'real_estate_agent', 'insurance_agent'],
  '农民': ['farmer', 'vendor', 'organic_farmer', 'fisherman'],
  '建筑工人': ['construction', 'farmer', 'carpenter', 'painter'],
  '工厂工人': ['factory', 'construction', 'mechanic', 'electrician'],
  '工人': ['factory', 'construction'],
  '司机': ['driver', 'courier', 'trucker', 'train_driver'],
  '快递员': ['courier', 'driver'],
  '服务员': ['waiter', 'chef', 'bartender', 'receptionist'],
  '厨师': ['chef', 'waiter', 'chef_pastry'],
  '手艺人': ['barber', 'freelancer', 'jeweler', 'potter'],
  '个体经营者': ['vendor', 'entrepreneur', 'freelancer'],
  '自由职业者': ['freelancer', 'artist', 'photographer', 'illustrator'],
  '运动员': ['athlete', 'fitness_coach', 'yoga_instructor', 'dancer'],
  '自媒体博主': ['streamer', 'digital_marketer'],
  '学生': [],
  '无业': [],
  '失业': [],
  // 新增映射
  '电工': ['electrician', 'mechanic'],
  '水管工': ['plumber', 'construction'],
  '机械师': ['mechanic', 'electrician'],
  '木匠': ['carpenter', 'construction'],
  '裁缝': ['tailor', 'freelancer'],
  '矿工': ['miner', 'farmer'],
  '渔民': ['fisherman', 'farmer'],
  '伐木工': ['lumberjack', 'farmer'],
  '前台接待': ['receptionist', 'hotel_manager'],
  '空乘人员': ['flight_attendant', 'pilot'],
  '导游': ['tour_guide', 'hotel_manager'],
  '婚礼策划师': ['wedding_planner', 'freelancer'],
  '酒店经理': ['hotel_manager', 'receptionist'],
  '美容师': ['beautician', 'barber'],
  '健身教练': ['fitness_coach', 'yoga_instructor', 'athlete'],
  '瑜伽教练': ['yoga_instructor', 'fitness_coach'],
  '音乐人': ['musician', 'artist'],
  '摄影师': ['photographer', 'freelancer', 'artist'],
  '设计师': ['designer', 'ui_designer', 'illustrator'],
  '编剧': ['screenwriter', 'writer', 'artist'],
  '插画师': ['illustrator', 'designer', 'artist'],
  '舞蹈演员': ['dancer', 'athlete'],
  '数据分析师': ['data_analyst', 'finance', 'researcher'],
  '产品经理': ['product_manager', 'manager', 'executive'],
  'UI设计师': ['ui_designer', 'designer'],
  '网络工程师': ['network_engineer', 'tech_expert', 'programmer'],
  '游戏开发者': ['game_developer', 'programmer', 'tech_expert'],
  '数字营销师': ['digital_marketer', 'marketing_mgr'],
  '药剂师': ['pharmacist', 'doctor', 'researcher'],
  '物理治疗师': ['physiotherapist', 'nurse', 'doctor'],
  '助产士': ['midwife', 'nurse'],
  '营养师': ['nutritionist', 'doctor', 'researcher'],
  '心理咨询师': ['psychologist', 'teacher_university'],
  '牙医': ['dentist', 'doctor'],
  '兽医': ['veterinarian', 'researcher'],
  '市场经理': ['marketing_mgr', 'manager'],
  '人力资源经理': ['hr_manager', 'manager', 'civil'],
  '物流经理': ['logistics_mgr', 'manager'],
  '房地产经纪': ['real_estate_agent', 'vendor'],
  '保险经纪': ['insurance_agent', 'finance'],
  '投资银行家': ['investment_banker', 'finance', 'hedge_fund_mgr'],
  '外交官': ['diplomat', 'civil'],
  '城市规划师': ['city_planner', 'researcher'],
  '档案管理员': ['archivist', 'civil'],
  '图书管理员': ['librarian', 'civil', 'archivist'],
  '幼儿园教师': ['kindergarten_teacher', 'teacher_primary'],
  '职业学校教师': ['vocational_teacher', 'teacher_middle'],
  '家教': ['tutor', 'teacher_primary', 'teacher_middle'],
  '翻译': ['translator', 'interpreter'],
  '同传译员': ['interpreter', 'translator'],
  '历史学家': ['historian', 'researcher'],
  '经济学家': ['economist', 'researcher', 'finance'],
  'AI研究员': ['ai_researcher', 'researcher', 'tech_expert'],
  '区块链开发者': ['blockchain_dev', 'programmer', 'tech_expert'],
  '电竞选手': ['esports_player', 'athlete'],
  '宠物繁育师': ['pet_breeder', 'veterinarian'],
  '占卜师': ['fortune_teller', 'medium'],
  '有机农场主': ['organic_farmer', 'farmer'],
  '环保工作者': ['environmentalist', 'researcher'],
  '海洋生物学家': ['marine_biologist', 'researcher'],
  '飞行员': ['pilot', 'flight_attendant'],
  '火车司机': ['train_driver', 'driver'],
  '船长': ['ship_captain', 'driver'],
  '长途卡车司机': ['trucker', 'driver', 'courier'],
  '消防员': ['firefighter', 'police', 'security'],
  '保安': ['security', 'police', 'bodyguard'],
  '保镖': ['bodyguard', 'police', 'soldier'],
  '侦探': ['detective', 'police'],
  '珠宝匠': ['jeweler', 'artist'],
  '陶艺师': ['potter', 'artist', 'freelancer'],
  '调香师': ['perfumer', 'freelancer'],
  '糕点师': ['chef_pastry', 'chef'],
  '调酒师': ['bartender', 'waiter'],
  '对冲基金经理': ['hedge_fund_mgr', 'investment_banker'],
  '风险投资人': ['venture_capitalist', 'investment_banker', 'entrepreneur'],
  '精算师': ['actuary', 'finance', 'researcher'],
  '记者': ['journalist', 'news_anchor'],
  '新闻主播': ['news_anchor', 'journalist'],
  '演员': ['actor', 'dancer'],
  '导演': ['director', 'producer'],
  '制片人': ['producer', 'director', 'executive'],
  '心理咨询灵修师': ['medium', 'fortune_teller'],
};

function parentProfessionAffinity(p: Profession, parentJob: string): number {
  const ids = PARENT_JOB_MAP[parentJob];
  if (!ids) return 0;
  return ids.includes(p.id) ? 8 : 0;
}

function makeStage(p: Profession, fromAge: number, toAge: number, birth: BirthInfo, person: Person): CareerStage {
  const perf = careerPerformance(person);
  const mid = (p.incomeMin + p.incomeMax) / 2;
  const span = (p.incomeMax - p.incomeMin) / 2;

  // 国家经济水平 -> 以「美国/瑞士」(economicLevel=95) 作为 1.0 的基准薪资系数
  // 这样对欠发达国家会显著压低：
  //   美国(95)=1.00   中国(70)=0.38   印度(45)=0.14   巴基斯坦(35)=0.09   南苏丹(15)=0.035
  const econ = birth.country.economicLevel;
  let countryWageFactor: number;
  if (econ >= 90) countryWageFactor = 0.95 + (econ - 90) * 0.01;           // 90-95 : 0.95~1.00
  else if (econ >= 70) countryWageFactor = 0.42 + (econ - 70) * 0.0265;      // 70-89 : 0.42~0.92
  else if (econ >= 50) countryWageFactor = 0.20 + (econ - 50) * 0.0110;      // 50-69 : 0.20~0.40
  else if (econ >= 30) countryWageFactor = 0.09 + (econ - 30) * 0.0055;      // 30-49 : 0.09~0.19
  else                  countryWageFactor = 0.025 + (econ - 15) * 0.0043;    // 15-29 : 0.025~0.085

  // 家庭对收入上限的影响（防止穷人家随机到特别离谱的高薪）
  const famScore = birth.family.economicScore;
  const famCapMultiplier = 0.6 + famScore / 140; // 穷 0.6 ~ 富裕 1.3+

  const rawIncome = Math.max(300, (mid + span * perf) * countryWageFactor);
  const annualIncome = Math.min(rawIncome, (p.incomeMin + span * (0.55 + famScore / 167)) * countryWageFactor * famCapMultiplier);
  return { title: p.name, fromAge, toAge, annualIncome: Math.round(annualIncome) };
}
