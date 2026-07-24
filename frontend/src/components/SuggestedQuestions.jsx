const questions = [
  "How do I complete onboarding?",
  "Where do I request software access?",
  "How do I update direct deposit?",
  "Which SAP workflow should I use for a purchase request?",
  "Who do I contact for equipment issues?",
  "How do I report a suspicious email?",
];

export default function SuggestedQuestions({ onSelect, isLoading }) {
  return (
    <section className="nav-assistant__suggestions" aria-label="Suggested questions">
      {questions.map((question) => (
        <button
          className="nav-assistant__suggestion-chip"
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          disabled={isLoading}
        >
          {question}
        </button>
      ))}
    </section>
  );
}
