import type { Country } from '../data/countries';

export type FamilyLevel = '极度贫困' | '贫困' | '普通' | '中产' | '富裕' | '非常富裕' | '超级富裕';

export interface ParentInfo {
  age: number;
  job: string;
  education: string;
}

export interface FamilyInfo {
  level: FamilyLevel;
  /** 简化展示描述，如“中产阶级” */
  levelDescription: string;
  /** 内部经济评分 0-100 */
  economicScore: number;
  /** 家庭经济描述，如“中等偏上” */
  economicDescription: string;
  /** 家庭稳定度 0-100 */
  stability: number;
  /** 家庭健康水平 0-100 */
  healthLevel: number;
  father: ParentInfo;
  mother: ParentInfo;
  /** 兄弟姐妹数量 */
  childrenCount: number;
}

export interface BirthInfo {
  countryId: string;
  country: Country;
  /** 所在地区（省 / 州 / 邦 等） */
  region: string;
  city: string;
  year: number;
  gender: '男' | '女';
  family: FamilyInfo;
}
