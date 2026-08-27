import './ScoreCard.css';

interface Props {
  score: number;
  label: string;
}

export default function ScoreCard({ score, label }: Props) {
  const stars = Math.max(1, Math.round(score / 20));
  return (
    <div className="card score">
      <h2 className="score-title title-serif">人生评分</h2>
      <div className="score-num gold">{score}</div>
      <div className="score-stars">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < stars ? 'score-star on' : 'score-star'}>
            {i < stars ? '★' : '☆'}
          </span>
        ))}
      </div>
      <div className="score-label">{label}</div>
    </div>
  );
}
