export default function LoadingState() {
  return (
    <div className="nav-assistant__state-card" role="status">
      <div className="nav-assistant__pulse-line nav-assistant__pulse-line--wide" />
      <div className="nav-assistant__pulse-line" />
      <div className="nav-assistant__pulse-line nav-assistant__pulse-line--short" />
    </div>
  );
}
