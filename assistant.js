const SUGGESTED_QUESTIONS = [
  "How do I complete onboarding?",
  "Where do I request software access?",
  "How do I update direct deposit?",
  "Who do I contact for equipment issues?",
];

const SUBMIT_ICON = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 19V7" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"/>
    <path d="M7 12l5-5 5 5" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderUserMessage = (text) => `
  <div class="atlas-chat__message atlas-chat__message--user">
    <div class="atlas-chat__bubble">${escapeHtml(text)}</div>
  </div>
`;

const renderAtlasMessage = (result) => {
  const nextSteps = (result.nextSteps || [])
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");

  const resources = (result.resources || [])
    .map(
      (resource) => `
        <a href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">
          ${escapeHtml(resource.label)}
        </a>
      `
    )
    .join("");

  const escalation = result.escalation
    ? `
      <div class="atlas-chat__escalation">
        <strong>${escapeHtml(result.escalation.contact)}</strong>
        <span>${escapeHtml(result.escalation.reason)}</span>
      </div>
    `
    : "";

  return `
    <div class="atlas-chat__message atlas-chat__message--atlas">
      <div class="atlas-chat__bubble">
        <p class="atlas-chat__answer">${escapeHtml(result.answer)}</p>
        ${
          nextSteps
            ? `
          <div class="atlas-chat__section">
            <h4>Next Steps</h4>
            <ol>${nextSteps}</ol>
          </div>
        `
            : ""
        }
        ${
          resources
            ? `
          <div class="atlas-chat__section">
            <h4>Resources</h4>
            <div class="atlas-chat__resources">${resources}</div>
          </div>
        `
            : ""
        }
        ${escalation}
        <span class="atlas-chat__confidence atlas-chat__confidence--${escapeHtml(result.confidence || "low")}">
          ${escapeHtml(result.confidence || "low")} confidence
        </span>
      </div>
    </div>
  `;
};

const renderLoadingMessage = () => `
  <div class="atlas-chat__message atlas-chat__message--atlas" role="status">
    <div class="atlas-chat__bubble atlas-chat__bubble--loading">
      <span class="atlas-chat__typing-dot"></span>
      <span class="atlas-chat__typing-dot"></span>
      <span class="atlas-chat__typing-dot"></span>
    </div>
  </div>
`;

const renderErrorMessage = (message) => `
  <div class="atlas-chat__message atlas-chat__message--atlas">
    <div class="atlas-chat__bubble atlas-chat__bubble--error">${escapeHtml(message)}</div>
  </div>
`;

const initNavigationAssistant = () => {
  const root = document.getElementById("nav-assistant-root");
  if (!root) {
    return;
  }

  let isLoading = false;

  root.innerHTML = `
    <div class="atlas-chat">
      <div class="atlas-chat__box">
        <h2 class="atlas-chat__title">Ask Atlas</h2>
        <p class="atlas-chat__prompt">What do you need help finding?</p>

        <div class="atlas-chat__messages" id="atlas-messages" aria-live="polite"></div>

        <div class="atlas-chat__suggestions" aria-label="Suggested questions">
          ${SUGGESTED_QUESTIONS.map(
            (question) => `
              <button class="atlas-chat__suggestion" type="button" data-question="${escapeHtml(question)}">
                ${escapeHtml(question)}
              </button>
            `
          ).join("")}
        </div>

        <form class="atlas-chat__composer" id="atlas-form">
          <div class="atlas-chat__input-wrap">
            <textarea
              id="atlas-input"
              rows="3"
              placeholder="Type your question here..."
              aria-label="Your question"
            ></textarea>
            <button class="atlas-chat__submit" type="submit" aria-label="Send message" disabled>
              ${SUBMIT_ICON}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = root.querySelector("#atlas-form");
  const input = root.querySelector("#atlas-input");
  const submitButton = root.querySelector(".atlas-chat__submit");
  const messagesPanel = root.querySelector("#atlas-messages");
  const suggestionButtons = Array.from(root.querySelectorAll(".atlas-chat__suggestion"));

  const scrollToBottom = () => {
    messagesPanel.scrollTop = messagesPanel.scrollHeight;
  };

  const setLoading = (loading) => {
    isLoading = loading;
    input.disabled = loading;
    submitButton.disabled = loading || !input.value.trim();
    submitButton.classList.toggle("is-loading", loading);
    suggestionButtons.forEach((button) => {
      button.disabled = loading;
    });
  };

  const askQuestion = async (question) => {
    if (!question || isLoading) {
      return;
    }

    messagesPanel.insertAdjacentHTML("beforeend", renderUserMessage(question));
    messagesPanel.insertAdjacentHTML("beforeend", renderLoadingMessage());
    scrollToBottom();

    input.value = "";
    setLoading(true);

    try {
      const response = await fetch("/api/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "The navigation service is unavailable.");
      }

      messagesPanel.lastElementChild?.remove();
      messagesPanel.insertAdjacentHTML("beforeend", renderAtlasMessage(payload));
    } catch (error) {
      messagesPanel.lastElementChild?.remove();
      messagesPanel.insertAdjacentHTML(
        "beforeend",
        renderErrorMessage(
          error.message ||
            "The navigation service is unavailable. Confirm the server is running."
        )
      );
    } finally {
      isLoading = false;
      input.disabled = false;
      submitButton.disabled = !input.value.trim();
      suggestionButtons.forEach((button) => {
        button.disabled = false;
      });
      scrollToBottom();
      input.focus();
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    askQuestion(input.value.trim());
  });

  input.addEventListener("input", () => {
    submitButton.disabled = isLoading || !input.value.trim();
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!submitButton.disabled) {
        form.requestSubmit();
      }
    }
  });

  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.question;
      input.value = question;
      submitButton.disabled = false;
      askQuestion(question);
    });
  });
};

initNavigationAssistant();
