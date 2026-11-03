import type { LifeRecord } from '../../models/LifeRecord';
import { buildTitle } from '../../engine/titleEngine';
import {
  rarityOf,
  rarityChanceLabel,
  percentileOf,
} from '../../data/scoreLadder';
import { formatLifespan } from '../../utils/format';
import './LifeHeroCard.css';

interface Props {
  record: LifeRecord;
}

/**
 * 命格卡：开奖结果的第一屏。
 * 抽卡游戏的爽点在「数字出现的那一秒」，所以分数、稀有度、称号必须最先看到，
 * 而不是藏在出生报告和属性表格后面。
 */
export default function LifeHeroCard({ record }: Props) {
  const lr = record.lifeResult;
  const tier = rarityOf(record.score);
  const pct = percentileOf(record.score);
  const title = buildTitle(record);

  return (
    <div className={`hero hero-${tier.key.toLowerCase()}`}>
      <div className="hero-top">
        <span className="hero-rarity" style={{ color: tier.color, borderColor: tier.color }}>
          {tier.label}
        </span>
        <span className="hero-chance">出现概率 {rarityChanceLabel(tier)}</span>
      </div>

      <div className="hero-score" style={{ textShadow: `0 0 42px ${tier.glow}` }}>
        {record.score}
      </div>

      <div className="hero-label" style={{ borderColor: `${tier.color}66` }}>
        {record.label}
      </div>

      <div className="hero-title title-serif">「{title}」</div>

      <div className="hero-meta">
        {record.birthInfo.country.name} · {record.birthInfo.city}
        <br />
        享年 {formatLifespan(lr.age, lr.lifespanDays)} · {lr.deathCause}
      </div>

      <div className="hero-percentile">
        <div className="hero-bar">
          <div className="hero-bar-fill" style={{ width: `${pct}%`, background: tier.color }} />
        </div>
        <div className="hero-percentile-text">
          超过 <strong style={{ color: tier.color }}>{pct}%</strong> 的投胎者
        </div>
      </div>
    </div>
  );
}
