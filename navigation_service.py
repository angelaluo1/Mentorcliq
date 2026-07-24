import re

MOCK_RESOURCES = [
    {
        "id": "onboarding-001",
        "category": "Onboarding",
        "title": "Complete New Hire Onboarding",
        "description": "Core steps for new NBCU employees during their first week.",
        "keywords": ["onboarding", "new hire", "first day", "orientation", "workday", "i-9"],
        "steps": [
            "Open the Workday onboarding checklist.",
            "Complete identity verification and required HR forms.",
            "Set up payroll, benefits, and emergency contact details.",
            "Finish assigned compliance and security training modules.",
        ],
        "links": [
            {"label": "Workday Portal", "url": "https://workday.nbcuni.com"},
            {"label": "HR Onboarding Guide", "url": "https://hr.nbcuni.com/onboarding"},
        ],
        "contacts": [{"role": "HR Support", "email": "hr-support@nbcuni.com"}],
    },
    {
        "id": "it-software-001",
        "category": "IT",
        "title": "Request Software Access",
        "description": "Request access to approved business applications and software.",
        "keywords": ["software", "access", "application", "license", "permissions", "request"],
        "steps": [
            "Open the IT service catalog.",
            "Search for the application or software name.",
            "Select Request Access and provide a business justification.",
            "Route the request to your manager or system owner for approval.",
        ],
        "links": [
            {"label": "IT Service Catalog", "url": "https://it.nbcuni.com/catalog"},
            {"label": "Access Request Guide", "url": "https://it.nbcuni.com/access"},
        ],
        "contacts": [{"role": "IT Service Desk", "email": "it-service-desk@nbcuni.com"}],
    },
    {
        "id": "hr-direct-deposit-001",
        "category": "HR",
        "title": "Update Direct Deposit",
        "description": "Change payroll direct deposit information.",
        "keywords": ["direct deposit", "payroll", "bank", "paycheck", "salary", "payment"],
        "steps": [
            "Open Workday and go to Pay.",
            "Select Payment Elections.",
            "Add or edit bank account details.",
            "Review effective date and submit changes.",
        ],
        "links": [
            {"label": "Workday Pay", "url": "https://workday.nbcuni.com/pay"},
            {"label": "Payroll Help", "url": "https://hr.nbcuni.com/payroll"},
        ],
        "contacts": [{"role": "Payroll Support", "email": "payroll@nbcuni.com"}],
    },
    {
        "id": "sap-pr-001",
        "category": "SAP",
        "title": "Submit a Purchase Requisition",
        "description": "Create a purchase request for goods or services in SAP.",
        "keywords": ["sap", "purchase", "purchase request", "procurement", "requisition", "buy"],
        "steps": [
            "Sign in to the SAP portal.",
            "Open the Purchase Requisition workflow.",
            "Enter supplier, material or service details, cost center, and business justification.",
            "Submit the requisition for manager approval.",
        ],
        "links": [
            {"label": "SAP Portal", "url": "https://sap.nbcuni.com"},
            {"label": "Procurement Guide", "url": "https://finance.nbcuni.com/procurement"},
        ],
        "contacts": [{"role": "Procurement Team", "email": "procurement@nbcuni.com"}],
    },
    {
        "id": "equipment-001",
        "category": "Equipment",
        "title": "Request Laptop or Equipment",
        "description": "Request employee hardware, accessories, or replacement devices.",
        "keywords": ["laptop", "equipment", "hardware", "monitor", "keyboard", "device"],
        "steps": [
            "Open the IT equipment request form.",
            "Choose the device or accessory category.",
            "Add shipping or pickup details.",
            "Submit for manager approval when required.",
        ],
        "links": [
            {"label": "Equipment Requests", "url": "https://it.nbcuni.com/equipment"},
            {"label": "Device Standards", "url": "https://it.nbcuni.com/devices"},
        ],
        "contacts": [{"role": "Workplace Technology", "email": "workplace-tech@nbcuni.com"}],
    },
    {
        "id": "security-001",
        "category": "Security",
        "title": "Report Phishing or Security Concern",
        "description": "Escalate suspicious emails, credential concerns, or security incidents.",
        "keywords": ["security", "phishing", "suspicious email", "incident", "cyber", "report"],
        "steps": [
            "Do not click suspicious links or download attachments.",
            "Use the Report Phishing button in Outlook when available.",
            "Open a security ticket for urgent concerns.",
            "Call the security hotline for active incidents.",
        ],
        "links": [
            {"label": "Security Center", "url": "https://security.nbcuni.com"},
            {"label": "Report Incident", "url": "https://security.nbcuni.com/report"},
        ],
        "contacts": [{"role": "Security Operations", "email": "security@nbcuni.com"}],
    },
]


def _normalize(value: str) -> str:
    return re.sub(r"[^\w\s-]", " ", value.lower())


def _calculate_relevance_score(query: str, query_tokens: list[str], resource: dict) -> int:
    searchable_text = _normalize(
        " ".join(
            [
                resource["category"],
                resource["title"],
                resource["description"],
                *resource["keywords"],
                *resource["steps"],
            ]
        )
    )

    score = 0

    for keyword in resource["keywords"]:
        normalized_keyword = _normalize(keyword).strip()
        if normalized_keyword and normalized_keyword in query:
            score += 14 if " " in normalized_keyword else 8

    for token in query_tokens:
        if len(token) > 2 and token in searchable_text:
            score += 2

    if _normalize(resource["title"]) in query:
        score += 10
    if _normalize(resource["category"]) in query:
        score += 6

    return score


def find_relevant_resources(query: str, limit: int = 5) -> list[dict]:
    normalized_query = _normalize(query)
    query_tokens = [token for token in normalized_query.split() if token]

    scored = []
    for resource in MOCK_RESOURCES:
        score = _calculate_relevance_score(normalized_query, query_tokens, resource)
        if score > 0:
            scored.append({**resource, "score": score})

    scored.sort(key=lambda item: item["score"], reverse=True)
    return scored[:limit]


def build_fallback_guidance(question: str, relevant_resources: list[dict]) -> dict:
    top_resource = relevant_resources[0] if relevant_resources else None

    if not top_resource:
        return {
            "answer": (
                "I could not confidently match that request to a mock NBCU resource. "
                "Start with the IT Service Desk or HR Support depending on whether this is a "
                "systems or employee-services question."
            ),
            "nextSteps": [
                "Rephrase the question with the system name, task, or department if you know it.",
                "Check the HR portal for employee policy questions.",
                "Check the IT service catalog for access, software, device, or login issues.",
            ],
            "resources": [
                {"label": "HR Portal", "url": "https://hr.nbcuni.com"},
                {"label": "IT Service Catalog", "url": "https://it.nbcuni.com/catalog"},
            ],
            "confidence": "low",
            "escalation": {
                "contact": "IT Service Desk or HR Support",
                "reason": "The prototype did not find a strong match in the mock resource set.",
            },
            "source": "fallback",
            "matchedResources": [],
            "question": question,
        }

    return {
        "answer": f"{top_resource['title']}: {top_resource['description']}",
        "nextSteps": top_resource["steps"],
        "resources": top_resource["links"],
        "confidence": "high" if top_resource["score"] >= 18 else "medium",
        "escalation": {
            "contact": (
                f"{top_resource['contacts'][0]['role']} "
                f"({top_resource['contacts'][0]['email']})"
            ),
            "reason": "Escalate if you cannot access the linked portal or your request is blocked.",
        },
        "source": "fallback",
        "matchedResources": [
            {
                "id": resource["id"],
                "title": resource["title"],
                "category": resource["category"],
                "score": resource["score"],
            }
            for resource in relevant_resources
        ],
        "question": question,
    }


def get_navigation_guidance(question: str) -> dict:
    relevant_resources = find_relevant_resources(question)
    return build_fallback_guidance(question, relevant_resources)
