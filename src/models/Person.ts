export interface PersonAttributes {
  /** 健康 0-100 */
  health: number;
  /** 智力 0-100 */
  intelligence: number;
  /** 外貌 0-100 */
  appearance: number;
  /** 体力 0-100 */
  strength: number;
  /** 耐力/精力 0-100（扩展属性，供作弊卡使用） */
  stamina: number;
  /** 免疫力 0-100（扩展属性） */
  immunity: number;
  /** 意志力 0-100（扩展属性） */
  willpower: number;
  /** 心理承受力 0-100 */
  mental: number;
  /** 魅力 0-100 */
  charisma: number;
  /** 运气 0-100 */
  luck: number;
  /** 初始财富（USD） */
  wealth: number;
  /** 教育倾向 0-100 */
  education: number;
  /** 社会关系 0-100 */
  socialConnection: number;
}

export interface PersonRisks {
  /** 患病风险 0-100，越高越危险 */
  diseaseRisk: number;
  /** 意外风险 0-100 */
  accidentRisk: number;
  /** 犯罪/卷入危险风险 0-100 */
  crimeRisk: number;
  /** 成瘾风险 0-100 */
  addictionRisk: number;
}

export interface PersonPotential {
  careerPotential: number;
  financialPotential: number;
}

export interface Person {
  attributes: PersonAttributes;
  risks: PersonRisks;
  potential: PersonPotential;
}
