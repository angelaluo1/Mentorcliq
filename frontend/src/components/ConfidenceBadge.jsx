export default function ConfidenceBadge({ confidence }) {
  const normalized = confidence || "low";
  return <span className={`nav-assistant__confidence nav-assistant__confidence--${normalized}`}>{normalized}</span>;
}
