export interface WeightedItem<T> {
  item: T;
  weight: number;
}

/** 加权随机，权重越高被选中的概率越大 */
export function weightedRandom<T>(items: WeightedItem<T>[]): T {
  if (items.length === 0) {
    throw new Error('weightedRandom: items 不能为空');
  }
  const total = items.reduce((sum, it) => sum + Math.max(0, it.weight), 0);
  if (total <= 0) {
    return items[0].item;
  }
  let r = Math.random() * total;
  for (const it of items) {
    r -= Math.max(0, it.weight);
    if (r <= 0) {
      return it.item;
    }
  }
  return items[items.length - 1].item;
}
