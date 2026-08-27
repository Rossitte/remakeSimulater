import type { BirthInfo } from './BirthInfo';

export type EducationLevel = '文盲' | '小学' | '初中' | '高中' | '大专' | '大学' | '硕士' | '博士';

export type LifeEventType = 'education' | 'career' | 'marriage' | 'family' | 'wealth' | 'health' | 'accident' | 'social' | 'other';

export interface LifeEvent {
  age: number;
  type: LifeEventType;
  title: string;
  description: string;
}

export interface CareerStage {
  title: string;
  fromAge: number;
  toAge: number;
  /** 该阶段的年均收入（USD） */
  annualIncome: number;
}

export interface MarriageInfo {
  count: number;
  everMarried: boolean;
  firstMarriageAge?: number;
  spouseJob?: string;
}

export interface LifeResult {
  birthInfo: BirthInfo;
  /** 享年（0 表示不足 1 岁，用 lifespanDays 表示天数） */
  age: number;
  lifespanDays: number;
  deathCause: string;
  deathType: 'natural' | 'illness' | 'accident' | 'infant' | 'childhood' | 'war' | 'disaster' | 'crime';
  education: EducationLevel;
  careerStages: CareerStage[];
  mainCareer: string;
  highestPrestige: number;
  marriage: MarriageInfo;
  children: number;
  /** 一生总收入（USD） */
  lifetimeIncome: number;
  /** 最高资产（USD） */
  peakAssets: number;
  /** 最终资产（USD） */
  finalAssets: number;
  majorEvents: LifeEvent[];
  hadMajorIllness: boolean;
  hadAccident: boolean;
  luckyEvents: number;
  regrets: string[];
}
