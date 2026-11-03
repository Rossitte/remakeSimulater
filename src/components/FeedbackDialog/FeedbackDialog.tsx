import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './FeedbackDialog.css';

/** 作者微信号（反馈入口展示用） */
const WECHAT_ID = 'Louis_Liiu';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * 意见反馈弹窗。
 * 挂到 body 上走 createPortal，避免父级 transform / overflow 影响 fixed 遮罩。
 */
export default function FeedbackDialog({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // 关闭后重置「已复制」状态
  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(WECHAT_ID);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = WECHAT_ID;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        textarea.remove();
        if (!ok) throw new Error('copy failed');
      }
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return createPortal(
    <div className="fb-mask" role="dialog" aria-modal="true" aria-labelledby="fb-title" onClick={onClose}>
      <div className="fb-panel" onClick={(e) => e.stopPropagation()}>
        <div className="fb-head">
          <h2 className="fb-title title-serif" id="fb-title">
            意见反馈
          </h2>
          <button className="fb-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <p className="fb-text">
          如果您发现了 bug 或者有好的想法或者建议，欢迎添加作者微信：
        </p>

        <div className="fb-wechat">
          <span className="fb-wechat-label">作者微信</span>
          <span className="fb-wechat-id">{WECHAT_ID}</span>
          <button type="button" className="fb-copy" onClick={handleCopy}>
            {copied ? '已复制' : '复制'}
          </button>
        </div>

        <button type="button" className="btn-primary fb-ok" onClick={onClose}>
          知道了
        </button>
      </div>
    </div>,
    document.body,
  );
}
