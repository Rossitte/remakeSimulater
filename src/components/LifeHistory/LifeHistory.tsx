import type { LifeRecord } from '../../models/LifeRecord';
import { formatLifespan } from '../../utils/format';
import './LifeHistory.css';

interface Props {
  lives: LifeRecord[];
  onSelect: (rec: LifeRecord) => void;
  onClear: () => void;
}

export default function LifeHistory({ lives, onSelect, onClear }: Props) {
  return (
    <div className="card history">
      <div className="history-head">
        <h2 className="history-title title-serif">我的历史人生</h2>
        {lives.length > 0 && (
          <button className="btn-link" onClick={onClear}>
            清空记录
          </button>
        )}
      </div>

      {lives.length === 0 ? (
        <p className="history-empty">
          还没有任何人生记录。
          <br />
          点击「开始投胎」，开启你的第一世。
        </p>
      ) : (
        <ul className="history-list">
          {lives.map((l) => (
            <li key={l.id}>
              <button className="history-item" onClick={() => onSelect(l)}>
                <span className="history-index">第 {l.index} 世</span>
                <span className="history-place">
                  {l.birthInfo.country.flag} {l.birthInfo.country.name} · {l.birthInfo.city}
                </span>
                <span className="history-meta">
                  <span className="history-age">{formatLifespan(l.lifeResult.age, l.lifeResult.lifespanDays)}</span>
                  <span className="history-score gold">{l.score} 分</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
