import ConfidenceBadge from "./ConfidenceBadge.jsx";

export default function AnswerPanel({ result }) {
  if (!result) return null;

  return (
    <article className="nav-assistant__answer-panel">
      <div className="nav-assistant__answer-header">
        <div>
          <p className="nav-assistant__eyebrow">Navigation Result</p>
          <h2>{result.answer}</h2>
        </div>
        <ConfidenceBadge confidence={result.confidence} />
      </div>

      <section>
        <h3>Next Steps</h3>
        <ol className="nav-assistant__step-list">
          {(result.nextSteps || []).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h3>Resources</h3>
        <div className="nav-assistant__resource-list">
          {(result.resources || []).map((resource) => (
            <a href={resource.url} key={`${resource.label}-${resource.url}`} target="_blank" rel="noreferrer">
              <span>{resource.label}</span>
              <small>{resource.url}</small>
            </a>
          ))}
        </div>
      </section>

      {result.escalation && (
        <section className="nav-assistant__escalation">
          <h3>Escalation</h3>
          <p>
            <strong>{result.escalation.contact}</strong>
          </p>
          <p>{result.escalation.reason}</p>
        </section>
      )}

      {result.matchedResources?.length > 0 && (
        <footer className="nav-assistant__matches">
          <span>Matched mock resources:</span>
          {result.matchedResources.slice(0, 3).map((resource) => (
            <span key={resource.id}>{resource.title}</span>
          ))}
        </footer>
      )}
    </article>
  );
}
