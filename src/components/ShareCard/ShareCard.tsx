import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LifeRecord } from '../../models/LifeRecord';
import { renderShareCard } from './shareCardRenderer';
import { formatLifespan } from '../../utils/format';
import './ShareCard.css';

interface Props {
  record: LifeRecord;
  onClose: () => void;
}

type Status = 'idle' | 'saving' | 'sharing' | 'copying';

/** 发笔记时预填的标题 */
function buildNoteTitle(record: LifeRecord): string {
  const b = record.birthInfo;
  return '我出生在' + b.city + '的这一世，' + record.score + '分';
}

/** 发笔记时预填的正文 */
function buildNoteContent(record: LifeRecord): string {
  const r = record.lifeResult;
  const b = record.birthInfo;
  const lines = [
    '用「投胎模拟器」抽到的第 ' + record.index + ' 世：',
    b.country.name + ' · ' + b.city + ' · 享年 ' + formatLifespan(r.age, r.lifespanDays) + ' · ' + record.label,
    '',
    record.evaluation,
    '',
    '#投胎模拟器 #人生体验卡',
  ];
  return lines.join('\n');
}

function fileNameFor(record: LifeRecord): string {
  return `投胎模拟器-第${record.index}世-${record.score}分.png`;
}

/** data URL → Blob，用于系统分享 */
function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(',');
  const header = dataUrl.slice(0, comma);
  const mimeMatch = /data:([^;]+)/.exec(header);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(dataUrl.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** 当前浏览器是否支持「带文件」的系统分享 */
function detectNativeShare(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  if (typeof File === 'undefined' || typeof navigator.canShare !== 'function') return false;
  try {
    const probe = new File([], 'probe.png', { type: 'image/png' });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/** 复制文案：优先 Clipboard API，失败时退回 execCommand */
async function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  textarea.remove();
  if (!ok) throw new Error('复制失败，请手动选择文本复制');
}

export default function ShareCard({ record, onClose }: Props) {
  const [dataUrl, setDataUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState('');
  const [shareSupported] = useState(detectNativeShare);

  const busy = status !== 'idle';

  useEffect(() => {
    let cancelled = false;
    // 放到下一帧画，避免弹层动画和 canvas 渲染抢同一帧
    const timer = window.setTimeout(() => {
      try {
        const canvas = renderShareCard(record);
        const url = canvas.toDataURL('image/png');
        if (!cancelled) setDataUrl(url);
      } catch (error) {
        if (!cancelled) setFailed(error instanceof Error ? error.message : '人生卡生成失败');
      }
    }, 40);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [record]);

  const handleSave = async () => {
    if (!dataUrl || busy) return;
    setStatus('saving');
    setMessage('');
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileNameFor(record);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('图片已开始下载。手机端也可以长按上方图片保存到相册。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败，请长按图片手动保存');
    } finally {
      setStatus('idle');
    }
  };

  const handleShare = async () => {
    if (!dataUrl || busy) return;
    setStatus('sharing');
    setMessage('');
    try {
      const blob = dataUrlToBlob(dataUrl);
      const file = new File([blob], fileNameFor(record), { type: blob.type });
      await navigator.share({
        files: [file],
        title: buildNoteTitle(record),
        text: buildNoteContent(record),
      });
      setMessage('已唤起系统分享');
    } catch (error) {
      // 用户取消分享（AbortError）不算失败，不打扰
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setMessage('分享没有完成，可以改为保存图片');
      }
    } finally {
      setStatus('idle');
    }
  };

  const handleCopy = async () => {
    if (busy) return;
    setStatus('copying');
    setMessage('');
    try {
      await copyText(buildNoteTitle(record) + '\n\n' + buildNoteContent(record));
      setMessage('配文已复制，去粘贴发布吧');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '复制失败，请手动选择文本复制');
    } finally {
      setStatus('idle');
    }
  };

  // 挂到 body 上：弹层是 position: fixed，留在页面容器里会被祖先的
  // transform / overflow 影响，导致没滚动到对应位置时看不到
  return createPortal(
    <div className="share-mask" role="dialog" aria-modal="true" aria-label="人生卡">
      <div className="share-backdrop" onClick={onClose} />

      <div className="share-sheet">
        <div className="share-head">
          <span className="share-title">人生卡</span>
          <button className="share-close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>

        <div className="share-preview">
          {dataUrl ? (
            <img className="share-image" src={dataUrl} alt="人生卡预览" />
          ) : (
            <div className="share-loading">{failed ? failed : '正在生成人生卡…'}</div>
          )}
        </div>

        {message && <p className="share-message">{message}</p>}

        {dataUrl && (
          <p className="share-hint">
            3:4 竖版卡片，适合发小红书 / 朋友圈；手机端也可以长按图片保存。
          </p>
        )}

        <div className="share-actions">
          <button
            className="share-btn share-btn-primary"
            onClick={handleSave}
            disabled={!dataUrl || busy}
          >
            {status === 'saving' ? '保存中…' : '保存图片'}
          </button>

          {shareSupported ? (
            <button
              className="share-btn share-btn-ghost"
              onClick={handleShare}
              disabled={!dataUrl || busy}
            >
              {status === 'sharing' ? '分享中…' : '系统分享'}
            </button>
          ) : (
            <button
              className="share-btn share-btn-ghost"
              onClick={handleCopy}
              disabled={busy}
            >
              {status === 'copying' ? '复制中…' : '复制配文'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
