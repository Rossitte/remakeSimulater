import type { Country } from '../data/countries';

/** 将美元金额格式化为简洁的美元表达 */
export function formatUSD(usd: number): string {
  if (usd >= 1_000_000) {
    return `$${(usd / 1_000_000).toFixed(2)}M`;
  }
  if (usd >= 1_000) {
    return `$${(usd / 1_000).toFixed(1)}K`;
  }
  return `$${Math.round(usd).toLocaleString('zh-CN')}`;
}

/** 将美元金额换算为该国货币并格式化为中文单位 */
export function formatMoney(usd: number, country: Country): string {
  const local = Math.round(usd * country.currencyRate);
  if (local >= 1e8) {
    return `${country.currency}${(local / 1e8).toFixed(1)}亿`;
  }
  if (local >= 1e4) {
    return `${country.currency}${Math.round(local / 1e4)}万`;
  }
  return `${country.currency}${local.toLocaleString('zh-CN')}`;
}

/** 格式化寿命：不足 1 岁显示天数 */
export function formatLifespan(age: number, lifespanDays: number): string {
  if (age <= 0) {
    return `${Math.max(1, lifespanDays)} 天`;
  }
  return `${age} 岁`;
}
