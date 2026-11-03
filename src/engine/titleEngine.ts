import type { LifeRecord } from '../models/LifeRecord';

/**
 * 命格称号：给这一世起个外号，比「平凡人生」这种标签更像人。
 *
 * 规则是确定性的——同一个记录永远得到同一个称号，
 * 截图分享之后别人再点进来看到的还是同一句，不会「变卦」。
 * 规则按「越具体越优先」排序，最后才落到「普普通通的 X」。
 */
const EDU_INDEX: Record<string, number> = {
  文盲: 0, 小学: 1, 初中: 2, 高中: 3, 大专: 4, 大学: 5, 硕士: 6, 博士: 7,
};

const CN_NUM = ['', '一', '两', '三', '四', '五', '六', '七', '八', '九'];

export function buildTitle(record: LifeRecord): string {
  const r = record.lifeResult;
  const stages = r.careerStages || [];
  const job = stages.length > 0 ? stages[stages.length - 1].title : r.mainCareer;
  const hasJob = !!job && job !== '无';
  const who = hasJob ? job : '人';

  const age = r.age;
  const peak = r.peakAssets;
  const final = r.finalAssets;
  const edu = EDU_INDEX[r.education] ?? 2;

  // 1. 没活成
  if (r.deathType === 'infant') return '没睁眼几次的孩子';
  if (r.deathType === 'childhood' || age < 12) return '没来得及长大的孩子';
  if (age < 22) return hasJob ? `还没熬出头的${job}` : '还没来得及开始的人';

  // 2. 职业死（电工触电、矿工瓦斯……）
  if (r.deathJob) return `${r.deathJob}干到最后一刻的人`;

  // 3. 人生的形状
  if (stages.length >= 3) {
    const times = CN_NUM[Math.min(9, stages.length - 1)] || String(stages.length - 1);
    return `换过${times}次行当的${who}`;
  }
  if (peak >= 1_000_000 && peak > final * 3) return `富过又跌回去的${who}`;
  if (final >= 10_000_000) return `身家过亿的${who}`;
  if (r.children >= 4) return `儿孙一屋子的${who}`;
  if (age >= 90) return `活到${age}岁的${who}`;

  // 4. 事业与学问（比家庭更能定义一个人）
  if (r.highestPrestige >= 85) return `做到行业顶上的${who}`;
  if (edu >= 6) return `读到${r.education}的${who}`;
  if (r.marriage.count >= 2) return `结过${CN_NUM[Math.min(9, r.marriage.count)] || r.marriage.count}次婚的${who}`;

  // 5. 身体（意外太常见，留到最后再兜底，否则一半人都叫「捡回一条命」）
  if (r.hadMajorIllness && age >= 65) return `从大病里走回来的${who}`;

  // 6. 独身与晚景
  if (!r.marriage.everMarried && r.children === 0 && age >= 55) return `一个人过完一生的${who}`;

  // 7. 家境余量
  if (r.children >= 3) return `拉扯大${CN_NUM[Math.min(9, r.children)] || r.children}个孩子的${who}`;
  // 高分人生不该被叫「两手空空」，这是评价口径和称号口径打架
  if (final < 5000 && age >= 50 && record.score < 70) return `两手空空的${who}`;
  if (edu <= 2) return `没念几年书就出来讨生活的${who}`;
  if (r.hadAccident) return `捡回一条命的${who}`;

  if (!hasJob) return age >= 55 ? '一辈子没进过单位的人' : '没正经上过班的人';

  return `普普通通的${job}`;
}
