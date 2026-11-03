import type { Person } from '../models/Person';
import type { LifeEvent, LifeResult } from '../models/LifeResult';
import { randomInt } from '../utils/random';

/**
 * 人生评价生成器（评传体）。
 *
 * 这里的任务不是把一生按年份念一遍，而是回答一个问题：
 * 「这个人这一辈子，到底是怎么回事？」
 *
 * 所以：
 * - 事件只用来佐证判断，一篇里最多点两件，每件后面必须跟一句「所以呢」
 * - 数字（钱、岁数）是论据，不是主语
 * - 每句话都要有态度：要么是评价，要么是因果，不能只是复述
 */

interface Ctx {
  age: number;
  lifespanDays: number;
  cause: string;
  deathType: string;
  deathJob?: string;
  country: string;
  city: string;
  year: number;
  gender: string;
  familyLevel: string;
  fatherJob: string;
  motherJob: string;
  siblings: number;
  education: string;
  eduIndex: number;
  stages: { title: string; fromAge: number }[];
  mainCareer: string;
  prestige: number;
  married: boolean;
  marriageCount: number;
  marryAge?: number;
  spouseJob?: string;
  children: number;
  income: number;
  peak: number;
  finalAssets: number;
  events: LifeEvent[];
  intel: number;
  health: number;
  luck: number;
  charisma: number;
  mental: number;
  hadIllness: boolean;
}

const EDUCATION_INDEX: Record<string, number> = {
  文盲: 0, 小学: 1, 初中: 2, 高中: 3, 大专: 4, 大学: 5, 硕士: 6, 博士: 7,
};

function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/** 金额口语化 */
function money(usd: number): string {
  if (!isFinite(usd) || usd <= 0) return '一分钱';
  if (usd >= 1e8) return `${(usd / 1e8).toFixed(1)}亿美元`;
  if (usd >= 1e4) return `${Math.round(usd / 1e4)}万美元`;
  return `${Math.round(usd)}美元`;
}

/** 家境的口语说法 */
function familyShort(level: string): string {
  if (/极度贫困|贫困/.test(level)) return '家里不宽裕';
  if (/普通/.test(level)) return '家境普通';
  if (/中产/.test(level)) return '家里还算过得去';
  return '家里不缺钱';
}

/** 学历的口语说法 */
function eduShort(c: Ctx): string {
  // 早逝的人来不及念完，学历描述要按年龄兜底
  if (c.age < 6) return '';
  if (c.age < 12) return '书还没念完';
  if (c.age < 15) return '还在念书';
  if (c.age < 18 && c.eduIndex > 3) return '书还没念完';

  switch (c.eduIndex) {
    case 0: return '没正经上过学';
    case 1: return '小学都没念完';
    case 2: return '书念到初中';
    case 3: return '念到高中';
    case 4: return '读了大专';
    case 5: return '念完了大学';
    case 6: return '读到硕士';
    default: return '一路读到博士';
  }
}

/** 职业经历压成一句，最多出现一个年龄 */
function careerShort(c: Ctx, beforeAge?: number): string {
  if (c.stages.length === 0) {
    return c.age >= 25 ? '一辈子没进过正式单位' : '还没到能工作的年纪';
  }
  const first = c.stages[0];
  const last = c.stages[c.stages.length - 1];
  // 后面要讲的那件事比上班还早，这里就别报年龄了，否则读起来是倒装的
  const ageOk = beforeAge === undefined || first.fromAge <= beforeAge;

  if (c.stages.length === 1) {
    const years = Math.max(0, c.age - first.fromAge);
    if (!ageOk) return `${first.title}这行从年轻干到老`;
    return years >= 2
      ? `${first.fromAge}岁进了${first.title}这行，一干就是${years}年`
      : `${first.fromAge}岁干了${first.title}`;
  }
  if (c.stages.length <= 3) {
    return ageOk
      ? `${first.fromAge}岁从${first.title}干起，后来转到${last.title}`
      : `从${first.title}做到${last.title}`;
  }
  return `换过好几份工，从${first.title}做到${last.title}`;
}

/** 开头定性：这一世大概是什么成色 */
const FRAME: Record<string, string[]> = {
  极度不幸: ['你这一世，从落地起就没打算让你好过。', '这一世是硬熬过来的。'],
  悲惨人生: ['你这一世走得吃力，几乎每一步都在跟命较劲。', '你这一世没少吃苦。'],
  坎坷人生: ['你这一世走得磕磕绊绊，好歹挪到了终点。', '你这一世不算顺，但也没被彻底撂倒。'],
  平凡人生: ['你这一世走的是大多数人走的那条路。', '你这一世没什么戏剧性，按部就班走完了。'],
  普通人生: ['你这一世放在人堆里，一眼认不出来。', '你这一世过得平常，平常得没什么好说。'],
  幸福人生: ['你这一世，是少数人才抽得到的那副牌。', '你这一世走得顺，运气和本事都在你这边。'],
  成功人生: ['你这一世，走得比大多数人都远。', '你这一世拿到了很多人一辈子够不着的东西。'],
  传奇人生: ['你这一世，是会被后人拿来讲的那一种。', '你这一世活得像个传说，连你自己都未必信。'],
};

type EventKind =
  | 'loss'
  | 'gain'
  | 'recovery'
  | 'illness'
  | 'accident'
  | 'family'
  | 'career'
  | 'crime'
  | 'other';

function classify(e: LifeEvent): EventKind {
  const t = e.title + e.description;
  // 「父母重病」「孩子重病」讲的是别人，不能当成本人的病史
  if (/^(父母|孩子|家人|伴侣|亲人|至亲)/.test(e.title) || /父亲|母亲|孩子|家人|伴侣/.test(e.title)) {
    return 'family';
  }
  // 「错失晋升」「创业失败」这类先归到损失，不能因为带了「晋升」「成功」就判成好事
  if (/还清|还上|填平|还完/.test(t)) return 'recovery';
  if (/错失|破产|失败|亏|债|诈骗|骗|烂尾|被坑|赔钱|赔光|赔了|落空|没拿到/.test(t)) return 'loss';
  if (/中奖|彩票|大赚|融资|上市|晋升|涨薪|遗产|升值/.test(t)) return 'gain';
  if (/确诊|重病|癌|病|肿瘤|手术/.test(t)) return 'illness';
  if (/事故|车祸|受伤|致残|工伤|坠|烧伤|淹/.test(t)) return 'accident';
  if (/离婚|丧偶|去世|离世|分手|背叛|不忠|流产/.test(t)) return 'family';
  if (/转行|跳槽|创业|解雇|裁员|失业|退休|入职/.test(t)) return 'career';
  if (/入狱|判刑|牢|拘留/.test(t)) return 'crime';
  return 'other';
}

/** 这些事件已经在别处被概括过，引用它们只会变成流水账 */
const NOISY = ['成为', '升任', '开始从事', '结婚', '再婚', '离婚', '毕业'];

function isNoisy(e: LifeEvent, deathAge: number): boolean {
  if (e.age === deathAge) return true;
  if (e.description && e.description.indexOf('结为夫妻') >= 0) return true;
  return NOISY.some((k) => e.title.indexOf(k) >= 0);
}

/** 挑一件最能解释这一生的事（只挑一件，避免变成事件清单） */
function decisiveEvent(c: Ctx): LifeEvent | null {
  const pool = c.events.filter((e) => e.age >= 16 && e.age < c.age && !isNoisy(e, c.age));
  if (pool.length === 0) return null;

  const score = (e: LifeEvent) => {
    const kind = classify(e);
    let s = 1;
    if (kind === 'loss' || kind === 'gain' || kind === 'crime' || kind === 'recovery') s = 5;
    if (kind === 'illness' || kind === 'accident') s = 4;
    if (kind === 'career' || kind === 'family') s = 3;

    // 和结局对得上的，才是真正解释了这一生的事
    if (kind === 'illness' && c.deathType === 'illness') s += 5;
    if (kind === 'accident' && (c.deathType === 'accident' || c.deathType === 'crime')) s += 3;
    if (kind === 'loss' && c.finalAssets < c.peak * 0.3) s += 4;
    if (kind === 'gain' && c.finalAssets >= c.peak * 0.7) s += 2;
    if (kind === 'crime' && c.prestige < 30) s += 3;
    return s;
  };

  const best = pool.reduce((a, e) => (score(e) > score(a) ? e : a), pool[0]);
  // 分值太低说明只是件小事（摆摊、考证之类），不值得拿来解释一生
  return score(best) >= 4 ? best : null;
}

/** 对一件事的判词——这才是评价的主体 */
function judgement(e: LifeEvent, c: Ctx): string {
  switch (classify(e)) {
    case 'loss':
      if (c.age >= 60) return '那笔钱到走都没能追回来';
      return c.finalAssets < c.peak * 0.3
        ? '那是你最后一次手里有钱，之后就没能缓过来'
        : '你后来算是爬起来了，可有些东西从那天起就没补回来';
    case 'gain':
      // 升职和天降横财不是一回事，判词不能共用
      if (/晋升|涨薪|升任/.test(e.title)) {
        return '位置往上挪了一格，可日子还是照原样过';
      }
      return c.finalAssets >= c.peak * 0.7
        ? '那是你这一生最高的一次水位，你居然守住了'
        : '那笔钱来了又走，你此后再没碰上同样的运气';
    case 'recovery':
      return '窟窿终于填上了，你也就松了那几年'
    case 'illness':
      return c.deathType === 'illness'
        ? '这场病就是结局的开始，只是当时谁都没往那上面想'
        : '你熬过来了，但身体从那天起就一直在走下坡';
    case 'accident':
      return c.deathType === 'accident'
        ? '你从那一回里活了下来，但不是每次都有这种运气'
        : '你被从鬼门关前拽了回来，往后多活的每一天都像捡的';
    case 'family':
      return '这件事之后，家里的日子就变了味道';
    case 'career':
      return '那次转身之后，你就再没回过头';
    case 'crime':
      return '那几年把你和外面的世界隔断了，出来时什么都变了';
    default:
      return '说不上好坏，但确实把你往另一条路上推了一把';
  }
}

/** 首句：定性 + 出身与经历，一句话交代完 */
function opening(c: Ctx, label: string, beforeAge?: number): string {
  const frame = pick(FRAME[label] || FRAME['平凡人生']);
  // 城邦国家（新加坡之类）不要写成「生在新加坡的新加坡」
  const where = c.city === c.country ? `生在${c.country}` : `生在${c.country}的${c.city}`;
  const bits: string[] = [where, familyShort(c.familyLevel)];

  const edu = eduShort(c);
  if (edu) bits.push(edu);

  if (c.stages.length > 0) {
    bits.push(careerShort(c, beforeAge));
  } else if (c.age >= 25) {
    bits.push('一辈子没进过正式单位');
  }

  return `${frame}${bits.join('，')}。`;
}

/** 第二句：一件决定性的事 + 它意味着什么 */
function turn(c: Ctx, ev: LifeEvent): string {
  return `${ev.age}岁那年，${ev.title}——${judgement(ev, c)}。`;
}

/** 第三句：钱和家，合成一句判断，不分开记账 */
function ledger(c: Ctx): string | null {
  if (c.age < 18) return null;

  let cash: string;
  if (c.income < 3000) {
    cash = '几乎没挣到过什么钱';
  } else if (c.income > 0 && c.finalAssets <= 0) {
    cash = `挣过${money(c.income)}，走的时候一分没剩`;
  } else if (c.finalAssets >= c.income * 0.8) {
    cash = `挣了${money(c.income)}，几乎一分没动`;
  } else if (c.peak > c.finalAssets * 4 && c.peak >= 50000) {
    cash = `挣过${money(c.peak)}，走的时候账上是${money(c.finalAssets)}`;
  } else {
    cash = `挣了${money(c.income)}，最后剩下${money(c.finalAssets)}`;
  }

  let home: string;
  if (c.married && c.children > 0) home = `${c.children}个孩子，一段婚姻`;
  else if (c.married) home = '结了婚，没要孩子';
  else if (c.children > 0) home = `没结婚，却有${c.children}个孩子`;
  else home = '到走都是一个人';

  let verdictText: string;
  const alone = !c.married && c.children === 0;
  if (alone && c.finalAssets >= 100000) {
    verdictText = '钱是攒下了，可屋里始终只有你一个人';
  } else if (alone) {
    verdictText = '钱没留住，人也一直是自己一个';
  } else if (c.finalAssets < 5000) {
    verdictText = '钱没留住，好在身边一直有人';
  } else if (c.finalAssets >= c.income * 0.8) {
    verdictText = '你这辈子在钱上没吃什么亏';
  } else {
    verdictText = '这些就是你这辈子攒下的全部';
  }

  return `${cash}；${home}——${verdictText}。`;
}

/** 死亡当岁的事件描述，往往比死因本身更具体 */
function deathScene(c: Ctx): string | null {
  for (let i = c.events.length - 1; i >= 0; i--) {
    const e = c.events[i];
    if (e.age === c.age && (e.type === 'accident' || e.type === 'health')) {
      return e.description || null;
    }
  }
  return null;
}

/** 第四句：怎么走的 + 它和这一生的关系 */
function ending(c: Ctx): string {
  if (c.age <= 1) {
    return `你只在这个世界待了${Math.max(1, c.lifespanDays)}天，${c.cause}，什么都没来得及。`;
  }
  if (c.age < 12) {
    return `你只活到${c.age}岁，${c.cause}。人生太短，短到只够记几件事。`;
  }
  const scene = deathScene(c);

  if (c.deathJob) {
    return `${c.deathJob}这行给了你饭吃，最后也把你收了回去——${c.age}岁，${c.cause}。`;
  }
  if (c.deathType === 'illness') {
    return scene
      ? `${c.age}岁那年，${scene}`
      : `${c.cause}拖了几年，${c.age}岁那年还是把你带走了。`;
  }
  if (c.deathType === 'accident' || c.deathType === 'crime' || c.deathType === 'war' || c.deathType === 'disaster') {
    return scene
      ? `${c.age}岁那年，${scene}`
      : `${c.age}岁那年，${c.cause}。你走得没有预兆，也没留下什么交代。`;
  }
  const painless = c.hadIllness ? '病痛缠了几年，最后没再折腾' : '没病没灾，就是时候到了';
  return c.age >= 80
    ? `${c.age}岁，你在睡梦里走了，没遭什么罪——在这世上，这已经算善终。`
    : `${c.age}岁，你走了。${painless}。`;
}

/** 收尾：一句判断，不喊口号 */
function verdict(c: Ctx, label: string, regrets: string[]): string {
  // 夭折的人生不需要总结陈词，ending 已经说完了
  if (c.age < 12) return '';

  if (regrets.length > 0 && c.age >= 18) {
    // 结局已经说过病痛/短命，遗憾就别再说一遍
    const usable = regrets.filter((r) => {
      if (c.hadIllness && /健康|病/.test(r)) return false;
      if (c.age < 60 && /晚年|老来|膝下/.test(r)) return false;
      return true;
    });
    const regret = usable.length > 0 ? usable[0] : regrets[0];
    return /没能|没有|错过|错失|欠|不敢|空有|始终没能/.test(regret)
      ? `这辈子没做成的事，大概就是${regret}。`
      : `这辈子最大的遗憾，是${regret}。`;
  }

  const byLabel: Record<string, string[]> = {
    极度不幸: ['命没给你什么，你也没欠命什么。', '你活得辛苦，但每一关都是自己扛过来的。'],
    悲惨人生: ['你吃过的苦比尝过的甜多，可你从没撂挑子。', '这一世待你不算好，你也没对它服过软。'],
    坎坷人生: ['你走的不是路，是一道道坎，好在你都迈过去了。', '这一世不顺，但你把该扛的都扛了。'],
    平凡人生: ['没什么可夸的，也没什么可悔的，这样的一生其实不多。', '你把日子过稳了，这本身就很难。'],
    普通人生: ['你没什么故事，可大多数人本来就没什么故事。', '平常人有平常人的活法，你也算活明白了。'],
    幸福人生: ['你这一世，赢在身边有人，也赢在没把自己弄丢。', '这样的运气，不是谁都接得住。'],
    成功人生: ['别人记得你做到了什么，你自己记得的，大概是那些没做成的。', '你活成了别人的榜样，只有你知道代价是什么。'],
    传奇人生: ['你这一世被写进了别人的嘴里，真伪已经不重要了。', '这样的运气和这样的狠劲，落在同一个人身上，很少见。'],
  };

  return pick(byLabel[label] || byLabel['平凡人生']);
}

function makeCtx(life: LifeResult, person: Person): Ctx {
  const b = life.birthInfo;
  return {
    age: life.age,
    lifespanDays: life.lifespanDays,
    cause: life.deathCause,
    deathType: life.deathType,
    deathJob: life.deathJob,
    country: b.country.name,
    city: b.city,
    year: b.year,
    gender: b.gender,
    familyLevel: b.family.levelDescription,
    fatherJob: b.family.father.job,
    motherJob: b.family.mother.job,
    siblings: b.family.childrenCount,
    education: life.education,
    eduIndex: EDUCATION_INDEX[life.education] ?? 2,
    stages: (life.careerStages || []).map((s) => ({ title: s.title, fromAge: s.fromAge })),
    mainCareer: life.mainCareer,
    prestige: life.highestPrestige,
    married: !!life.marriage.everMarried,
    marriageCount: life.marriage.count,
    marryAge: life.marriage.firstMarriageAge,
    spouseJob: life.marriage.spouseJob,
    children: life.children,
    income: life.lifetimeIncome,
    peak: life.peakAssets,
    finalAssets: life.finalAssets,
    events: life.majorEvents || [],
    intel: person.attributes.intelligence,
    health: person.attributes.health,
    luck: person.attributes.luck,
    charisma: person.attributes.charisma,
    mental: person.attributes.mental,
    hadIllness: life.hadMajorIllness,
  };
}

export function buildEvaluation(
  life: LifeResult,
  person: Person,
  _score: number,
  label: string,
  regrets: string[],
): string {
  const c = makeCtx(life, person);
  const parts: string[] = [];

  // 先挑出要讲的那件事，好让开头的职业句避开时间倒装
  const pivot = c.age >= 18 ? decisiveEvent(c) : null;

  parts.push(opening(c, label, pivot ? pivot.age : undefined));

  if (pivot) parts.push(turn(c, pivot));

  const l = ledger(c);
  if (l) parts.push(l);

  parts.push(ending(c));

  const v = verdict(c, label, regrets);
  if (v) parts.push(v);

  return parts.join('');
}
