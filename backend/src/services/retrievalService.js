import { mockResources } from "../data/mockResources.js";

const normalize = (value) => value.toLowerCase().replace(/[^\w\s-]/g, " ");

export function findRelevantResources(query, limit = 5) {
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return mockResources
    .map((resource) => ({
      ...resource,
      score: calculateRelevanceScore(normalizedQuery, queryTokens, resource),
    }))
    .filter((resource) => resource.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function calculateRelevanceScore(query, queryTokens, resource) {
  const searchableText = normalize(
    [
      resource.category,
      resource.title,
      resource.description,
      ...resource.keywords,
      ...resource.steps,
    ].join(" ")
  );

  let score = 0;

  for (const keyword of resource.keywords) {
    const normalizedKeyword = normalize(keyword).trim();
    if (normalizedKeyword && query.includes(normalizedKeyword)) {
      score += normalizedKeyword.includes(" ") ? 14 : 8;
    }
  }

  for (const token of queryTokens) {
    if (token.length > 2 && searchableText.includes(token)) {
      score += 2;
    }
  }

  if (normalize(resource.title).includes(query)) score += 10;
  if (normalize(resource.category).includes(query)) score += 6;

  return score;
}

export function buildFallbackGuidance(question, relevantResources) {
  const topResource = relevantResources[0];

  if (!topResource) {
    return {
      answer:
        "I could not confidently match that request to a mock NBCU resource. Start with the IT Service Desk or HR Support depending on whether this is a systems or employee-services question.",
      nextSteps: [
        "Rephrase the question with the system name, task, or department if you know it.",
        "Check the HR portal for employee policy questions.",
        "Check the IT service catalog for access, software, device, or login issues.",
      ],
      resources: [
        { label: "HR Portal", url: "https://hr.nbcuni.com" },
        { label: "IT Service Catalog", url: "https://it.nbcuni.com/catalog" },
      ],
      confidence: "low",
      escalation: {
        contact: "IT Service Desk or HR Support",
        reason: "The prototype did not find a strong match in the mock resource set.",
      },
      source: "fallback",
      matchedResources: [],
    };
  }

  return {
    answer: `${topResource.title}: ${topResource.description}`,
    nextSteps: topResource.steps,
    resources: topResource.links,
    confidence: topResource.score >= 18 ? "high" : "medium",
    escalation: {
      contact: `${topResource.contacts[0].role} (${topResource.contacts[0].email})`,
      reason: "Escalate if you cannot access the linked portal or your request is blocked.",
    },
    source: "fallback",
    matchedResources: relevantResources.map(({ id, title, category, score }) => ({
      id,
      title,
      category,
      score,
    })),
    question,
  };
}
