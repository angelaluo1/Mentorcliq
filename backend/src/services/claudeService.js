import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "../prompts/systemPrompt.js";
import { buildFallbackGuidance } from "./retrievalService.js";

export async function getNavigationGuidance(question, relevantResources) {
  if (!process.env.CLAUDE_API_KEY) {
    return buildFallbackGuidance(question, relevantResources);
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022",
      max_tokens: 900,
      temperature: 0.2,
      system: buildSystemPrompt(relevantResources),
      messages: [{ role: "user", content: question }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return {
      ...parseClaudeJson(text, question, relevantResources),
      source: "claude",
      matchedResources: relevantResources.map(({ id, title, category, score }) => ({
        id,
        title,
        category,
        score,
      })),
    };
  } catch (error) {
    console.error("Claude API failed, using fallback guidance:", error.message);
    return {
      ...buildFallbackGuidance(question, relevantResources),
      source: "fallback-after-claude-error",
    };
  }
}

function parseClaudeJson(text, question, relevantResources) {
  const jsonText = extractJsonObject(text);
  const parsed = JSON.parse(jsonText);

  return {
    answer: assertString(parsed.answer, "I found a likely navigation path."),
    nextSteps: assertStringArray(parsed.nextSteps),
    resources: assertResources(parsed.resources),
    confidence: assertConfidence(parsed.confidence),
    escalation: assertEscalation(parsed.escalation, relevantResources),
    question,
  };
}

function extractJsonObject(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Claude response did not include a JSON object.");
  }

  return trimmed.slice(firstBrace, lastBrace + 1);
}

function assertString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function assertStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function assertResources(value) {
  return Array.isArray(value)
    ? value
        .filter((item) => item && typeof item.label === "string" && typeof item.url === "string")
        .map((item) => ({ label: item.label, url: item.url }))
    : [];
}

function assertConfidence(value) {
  return ["high", "medium", "low"].includes(value) ? value : "medium";
}

function assertEscalation(value, relevantResources) {
  if (value && typeof value.contact === "string" && typeof value.reason === "string") {
    return { contact: value.contact, reason: value.reason };
  }

  const contact = relevantResources[0]?.contacts?.[0];
  return contact
    ? {
        contact: `${contact.role} (${contact.email})`,
        reason: "Escalate if the recommended path does not resolve the request.",
      }
    : {
        contact: "IT Service Desk or HR Support",
        reason: "Escalate when the right system or ownership path is unclear.",
      };
}
