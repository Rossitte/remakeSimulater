import type { BirthInfo } from './BirthInfo';
import type { LifeResult } from './LifeResult';
import type { Person } from './Person';

export interface LifeRecord {
  id: string;
  /** 第几世 */
  index: number;
  birthInfo: BirthInfo;
  lifeResult: LifeResult;
  /** 出生时属性快照（用于雷达图等可视化） */
  person: Person;
  /** 人生评分 0-100 */
  score: number;
  /** 人生标签 */
  label: string;
  /** 人生评价文字 */
  evaluation: string;
  createdAt: number;
}
