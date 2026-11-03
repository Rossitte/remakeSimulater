import type { LifeRecord } from '../../models/LifeRecord';
import { formatLifespan } from '../../utils/format';

/**
 * 3:4 竖版人生卡（小红书笔记首图比例）。
 *
 * 只用 Chrome 61 就有的 canvas API：没有 roundRect、没有 letterSpacing、
 * 不用 ctx.filter，圆角和字间距都手动画。
 */

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1440;

const SANS =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
const SERIF = 'Georgia, "Songti SC", "SimSun", "Noto Serif CJK SC", serif';

const GOLD_BRIGHT = '#f0d488';
const TEXT = '#e8e6e0';
const TEXT_DIM = '#9794a3';
const QUOTE = '#d8d4c8';

const PAD_X = 110;
const CONTENT_WIDTH = CARD_WIDTH - PAD_X * 2;
/** 评价最多占几行（字号会自适应，行数超过就截断加省略号） */
const QUOTE_MAX_LINES = 7;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/** 手动字间距：canvas 的 letterSpacing 属于 Chrome 99+，不能用 */
function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baseline: number,
  spacing: number,
): void {
  const chars = text.split('');
  let width = 0;
  for (let i = 0; i < chars.length; i++) width += ctx.measureText(chars[i]).width + spacing;
  width -= spacing;

  let x = centerX - width / 2;
  ctx.textAlign = 'left';
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], x, baseline);
    x += ctx.measureText(chars[i]).width + spacing;
  }
  ctx.textAlign = 'center';
}

/** 单行裁切：超宽时截断并加省略号 */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(cut + '…').width > maxWidth) {
    cut = cut.slice(0, cut.length - 1);
  }
  return cut + '…';
}

/** 截断并保证结尾只有一个省略号（避免出现「……」，中文句末本来就可能带省略号） */
function truncateEllipsis(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  let cut = text.replace(/…+$/, '');
  while (cut.length > 0 && ctx.measureText(cut + '…').width > maxWidth) {
    cut = cut.slice(0, cut.length - 1);
  }
  return cut + '…';
}

/** 按字符换行（中文为主，逐字测量比按空格切更可靠） */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  const chars = text.replace(/\s+/g, ' ').split('');
  let line = '';

  for (let i = 0; i < chars.length; i++) {
    const next = line + chars[i];
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = chars[i] === ' ' ? '' : chars[i];
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * 评价段落的版式：字号从大到小试，选第一个能塞进 maxLines 行的；
 * 都不行就按最小字号截断加省略号。这样长评价也不会溢出卡片底部。
 */
function layoutQuote(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): { size: number; lines: string[] } {
  const sizes = [34, 32, 30, 28];
  let lines: string[] = [];
  for (let i = 0; i < sizes.length; i++) {
    ctx.font = '400 ' + sizes[i] + 'px ' + SERIF;
    lines = wrapText(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { size: sizes[i], lines };
  }
  const size = sizes[sizes.length - 1];
  ctx.font = '400 ' + size + 'px ' + SERIF;
  const cut = lines.slice(0, maxLines);
  cut[maxLines - 1] = truncateEllipsis(ctx, cut[maxLines - 1], maxWidth);
  return { size, lines: cut };
}

/** 摘出适合放在卡片上的评价段落：跳过开场的定性和出身介绍，只留判断句 */
function quotableEvaluation(evaluation: string): string {
  const sentences = evaluation
    .split('。')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const kept = sentences.filter((s) => !/^你?这一世/.test(s) && s.indexOf('生在') !== 0);
  if (kept.length === 0) return evaluation;
  return kept.join('。') + '。';
}

/** 卡片主标题下的那行职业描述 */
function careerLine(record: LifeRecord): string {
  const stages = record.lifeResult.careerStages || [];
  if (stages.length === 0) return '职业 ｜ 无业';
  const titles: string[] = [];
  for (let i = 0; i < stages.length; i++) {
    if (titles.indexOf(stages[i].title) === -1) titles.push(stages[i].title);
  }
  return '职业 ｜ ' + titles.slice(0, 3).join(' → ');
}

export function renderShareCard(record: LifeRecord): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('当前环境不支持 Canvas，无法生成人生卡');

  const r = record.lifeResult;
  const b = record.birthInfo;

  // ---------- 背景 ----------
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  bg.addColorStop(0, '#0a0a0f');
  bg.addColorStop(0.55, '#101018');
  bg.addColorStop(1, '#0a0a0f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const glow = ctx.createRadialGradient(CARD_WIDTH / 2, 40, 0, CARD_WIDTH / 2, 40, 820);
  glow.addColorStop(0, 'rgba(212, 178, 94, 0.16)');
  glow.addColorStop(0.45, 'rgba(212, 178, 94, 0.05)');
  glow.addColorStop(1, 'rgba(212, 178, 94, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_WIDTH, 860);

  // ---------- 外框 ----------
  ctx.strokeStyle = 'rgba(212, 178, 94, 0.20)';
  ctx.lineWidth = 2;
  roundRect(ctx, 36, 36, CARD_WIDTH - 72, CARD_HEIGHT - 72, 34);
  ctx.stroke();

  // ---------- 顶部：品牌 + 第几世 ----------
  ctx.textBaseline = 'alphabetic';
  ctx.font = '500 30px ' + SANS;
  ctx.fillStyle = 'rgba(212, 178, 94, 0.82)';
  drawSpacedText(ctx, '投胎模拟器', CARD_WIDTH / 2, 124, 14);

  ctx.font = '400 24px ' + SANS;
  ctx.fillStyle = 'rgba(151, 148, 163, 0.75)';
  ctx.textAlign = 'right';
  ctx.fillText('第 ' + record.index + ' 世', CARD_WIDTH - 78, 124);
  ctx.textAlign = 'center';

  ctx.strokeStyle = 'rgba(212, 178, 94, 0.30)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH / 2 - 46, 168);
  ctx.lineTo(CARD_WIDTH / 2 + 46, 168);
  ctx.stroke();

  // ---------- 出生地 / 出生信息 / 职业 ----------
  ctx.fillStyle = TEXT;
  ctx.font = '600 60px ' + SANS;
  ctx.textAlign = 'center';
  const place = fitText(ctx, b.country.name + ' · ' + b.city, CARD_WIDTH - PAD_X * 2);
  ctx.fillText(place, CARD_WIDTH / 2, 282);

  ctx.font = '400 28px ' + SANS;
  ctx.fillStyle = TEXT_DIM;
  ctx.fillText(b.year + ' 年 · ' + b.gender + ' · ' + b.family.levelDescription, CARD_WIDTH / 2, 338);

  ctx.font = '400 28px ' + SANS;
  ctx.fillStyle = 'rgba(151, 148, 163, 0.88)';
  ctx.fillText(fitText(ctx, careerLine(record), CONTENT_WIDTH), CARD_WIDTH / 2, 386);

  // ---------- 评分 ----------
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '700 200px ' + SERIF;
  ctx.shadowColor = 'rgba(212, 178, 94, 0.45)';
  ctx.shadowBlur = 48;
  const scoreGrad = ctx.createLinearGradient(0, 420, 0, 600);
  scoreGrad.addColorStop(0, '#f7e6b4');
  scoreGrad.addColorStop(0.55, GOLD_BRIGHT);
  scoreGrad.addColorStop(1, '#c8a24a');
  ctx.fillStyle = scoreGrad;
  ctx.fillText(String(record.score), CARD_WIDTH / 2, 588);
  ctx.restore();

  // ---------- 标签胶囊 ----------
  const labelText = record.label;
  ctx.font = '600 32px ' + SANS;
  const labelWidth = Math.max(220, ctx.measureText(labelText).width + 88);
  const pillTop = 622;
  const pillHeight = 64;
  roundRect(ctx, CARD_WIDTH / 2 - labelWidth / 2, pillTop, labelWidth, pillHeight, pillHeight / 2);
  ctx.fillStyle = 'rgba(212, 178, 94, 0.10)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 178, 94, 0.42)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = GOLD_BRIGHT;
  ctx.textBaseline = 'middle';
  drawSpacedText(ctx, labelText, CARD_WIDTH / 2, pillTop + pillHeight / 2 + 2, 4);
  ctx.textBaseline = 'alphabetic';

  // ---------- 星级 ----------
  const stars = Math.max(1, Math.min(5, Math.round(record.score / 20)));
  const starSize = 42;
  const starGap = 18;
  const starWidth = starSize * 5 + starGap * 4;
  let starX = CARD_WIDTH / 2 - starWidth / 2;
  ctx.font = '400 ' + starSize + 'px ' + SANS;
  ctx.textAlign = 'center';
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i < stars ? '#e8c66a' : 'rgba(255, 255, 255, 0.13)';
    ctx.fillText('★', starX + starSize / 2, 758);
    starX += starSize + starGap;
  }

  // ---------- 享年 / 死因 ----------
  ctx.font = '400 30px ' + SANS;
  ctx.fillStyle = 'rgba(232, 230, 224, 0.9)';
  const lifespan = formatLifespan(r.age, r.lifespanDays);
  ctx.fillText('享年 ' + lifespan + ' · ' + r.deathCause, CARD_WIDTH / 2, 824);

  // ---------- 分隔线 ----------
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD_X, 880);
  ctx.lineTo(CARD_WIDTH - PAD_X, 880);
  ctx.stroke();

  // ---------- 人生概括 ----------
  // 不再逐条列「xx 岁遭遇了什么」：卡片只保留一段高度概括的评价。
  // 评价第一句通常是出身简介（卡片上方已经写过），这里从第二句开始摘。
  const quoteSource = quotableEvaluation(record.evaluation);
  const quoteMaxWidth = CONTENT_WIDTH - 40;
  const quote = layoutQuote(ctx, quoteSource, quoteMaxWidth, QUOTE_MAX_LINES);

  const quoteFirstBaseline = 952;
  const quoteLineHeight = 52;
  const quoteLastBaseline = quoteFirstBaseline + (quote.lines.length - 1) * quoteLineHeight;

  if (quote.lines.length > 0) {
    // 左侧竖线跟着实际行数走，行数少时不会拖一截空线
    ctx.strokeStyle = 'rgba(212, 178, 94, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(PAD_X, quoteFirstBaseline - Math.round(quote.size * 0.85));
    ctx.lineTo(PAD_X, quoteLastBaseline + Math.round(quote.size * 0.35));
    ctx.stroke();

    ctx.font = '400 ' + quote.size + 'px ' + SERIF;
    ctx.fillStyle = QUOTE;
    ctx.textAlign = 'left';
    for (let i = 0; i < quote.lines.length; i++) {
      ctx.fillText(quote.lines[i], PAD_X + 36, quoteFirstBaseline + i * quoteLineHeight);
    }
  }

  // ---------- 底部 ----------
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD_X, 1318);
  ctx.lineTo(CARD_WIDTH - PAD_X, 1318);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '400 22px ' + SANS;
  ctx.fillStyle = 'rgba(151, 148, 163, 0.7)';
  ctx.fillText('投胎模拟器 · 每一世都是一次抽卡', CARD_WIDTH / 2, 1364);

  return canvas;
}
