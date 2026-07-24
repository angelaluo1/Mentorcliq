import { useState } from "react";
import AnswerPanel from "./components/AnswerPanel.jsx";
import EmptyState from "./components/EmptyState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import SearchInput from "./components/SearchInput.jsx";
import SuggestedQuestions from "./components/SuggestedQuestions.jsx";
import { requestNavigationGuidance } from "./services/navigationAPI.js";

export default function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleQuestion(question) {
    setIsLoading(true);
    setError("");

    try {
      const guidance = await requestNavigationGuidance(question);
      setResult(guidance);
    } catch (requestError) {
      setResult(null);
      setError(
        requestError.response?.data?.error ||
          "The navigation service is unavailable. Confirm the backend is running on port 3000."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="nav-assistant">
      <div className="nav-assistant__workspace">
        <div className="nav-assistant__left-panel">
          <SearchInput onSubmit={handleQuestion} isLoading={isLoading} />
          <SuggestedQuestions onSelect={handleQuestion} isLoading={isLoading} />
        </div>

        <div className="nav-assistant__right-panel">
          {error && <div className="nav-assistant__error-banner">{error}</div>}
          {isLoading ? <LoadingState /> : result ? <AnswerPanel result={result} /> : <EmptyState />}
        </div>
      </div>
    </div>
  );
}
