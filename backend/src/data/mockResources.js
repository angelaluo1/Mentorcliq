export const mockResources = [
  {
    id: "onboarding-001",
    category: "Onboarding",
    title: "Complete New Hire Onboarding",
    description: "Core steps for new NBCU employees during their first week.",
    keywords: ["onboarding", "new hire", "first day", "orientation", "workday", "i-9"],
    steps: [
      "Open the Workday onboarding checklist.",
      "Complete identity verification and required HR forms.",
      "Set up payroll, benefits, and emergency contact details.",
      "Finish assigned compliance and security training modules."
    ],
    links: [
      { label: "Workday Portal", url: "https://workday.nbcuni.com" },
      { label: "HR Onboarding Guide", url: "https://hr.nbcuni.com/onboarding" }
    ],
    contacts: [{ role: "HR Support", email: "hr-support@nbcuni.com" }]
  },
  {
    id: "sap-pr-001",
    category: "SAP",
    title: "Submit a Purchase Requisition",
    description: "Create a purchase request for goods or services in SAP.",
    keywords: ["sap", "purchase", "purchase request", "procurement", "requisition", "buy"],
    steps: [
      "Sign in to the SAP portal.",
      "Open the Purchase Requisition workflow.",
      "Enter supplier, material or service details, cost center, and business justification.",
      "Submit the requisition for manager approval."
    ],
    links: [
      { label: "SAP Portal", url: "https://sap.nbcuni.com" },
      { label: "Procurement Guide", url: "https://finance.nbcuni.com/procurement" }
    ],
    contacts: [{ role: "Procurement Team", email: "procurement@nbcuni.com" }]
  },
  {
    id: "sap-expense-002",
    category: "SAP",
    title: "Check SAP Invoice or Expense Status",
    description: "Find payment, invoice, and expense reimbursement status.",
    keywords: ["sap", "invoice", "expense", "reimbursement", "payment", "vendor"],
    steps: [
      "Open SAP and search for the invoice or expense report number.",
      "Confirm the approval status and payment date.",
      "Review any rejection comments or missing receipt alerts.",
      "Contact finance support if the payment is delayed past the expected window."
    ],
    links: [
      { label: "SAP Finance", url: "https://sap.nbcuni.com/finance" },
      { label: "Expense Policy", url: "https://finance.nbcuni.com/expenses" }
    ],
    contacts: [{ role: "Finance Help Desk", email: "finance-support@nbcuni.com" }]
  },
  {
    id: "hr-direct-deposit-001",
    category: "HR",
    title: "Update Direct Deposit",
    description: "Change payroll direct deposit information.",
    keywords: ["direct deposit", "payroll", "bank", "paycheck", "salary", "payment"],
    steps: [
      "Open Workday and go to Pay.",
      "Select Payment Elections.",
      "Add or edit bank account details.",
      "Review effective date and submit changes."
    ],
    links: [
      { label: "Workday Pay", url: "https://workday.nbcuni.com/pay" },
      { label: "Payroll Help", url: "https://hr.nbcuni.com/payroll" }
    ],
    contacts: [{ role: "Payroll Support", email: "payroll@nbcuni.com" }]
  },
  {
    id: "hr-benefits-001",
    category: "HR",
    title: "Review or Change Benefits",
    description: "Access benefits enrollment, life event changes, and plan information.",
    keywords: ["benefits", "health insurance", "medical", "dental", "vision", "life event"],
    steps: [
      "Open the Benefits Center from the HR portal.",
      "Review current plans and coverage details.",
      "Start enrollment or life event change if eligible.",
      "Submit changes before the deadline shown in the portal."
    ],
    links: [
      { label: "Benefits Center", url: "https://benefits.nbcuni.com" },
      { label: "HR Portal", url: "https://hr.nbcuni.com" }
    ],
    contacts: [{ role: "Benefits Team", email: "benefits@nbcuni.com" }]
  },
  {
    id: "it-software-001",
    category: "IT",
    title: "Request Software Access",
    description: "Request access to approved business applications and software.",
    keywords: ["software", "access", "application", "license", "permissions", "request"],
    steps: [
      "Open the IT service catalog.",
      "Search for the application or software name.",
      "Select Request Access and provide a business justification.",
      "Route the request to your manager or system owner for approval."
    ],
    links: [
      { label: "IT Service Catalog", url: "https://it.nbcuni.com/catalog" },
      { label: "Access Request Guide", url: "https://it.nbcuni.com/access" }
    ],
    contacts: [{ role: "IT Service Desk", email: "it-service-desk@nbcuni.com" }]
  },
  {
    id: "it-password-001",
    category: "IT",
    title: "Reset Password or Unlock Account",
    description: "Recover access to NBCU network accounts.",
    keywords: ["password", "reset", "unlock", "login", "account", "mfa"],
    steps: [
      "Open the self-service password portal.",
      "Verify your identity using MFA.",
      "Reset your password or unlock the account.",
      "Try signing in again after a few minutes."
    ],
    links: [
      { label: "Password Portal", url: "https://password.nbcuni.com" },
      { label: "MFA Help", url: "https://it.nbcuni.com/mfa" }
    ],
    contacts: [{ role: "IT Service Desk", email: "it-service-desk@nbcuni.com" }]
  },
  {
    id: "equipment-001",
    category: "Equipment",
    title: "Request Laptop or Equipment",
    description: "Request employee hardware, accessories, or replacement devices.",
    keywords: ["laptop", "equipment", "hardware", "monitor", "keyboard", "device"],
    steps: [
      "Open the IT equipment request form.",
      "Choose the device or accessory category.",
      "Add shipping or pickup details.",
      "Submit for manager approval when required."
    ],
    links: [
      { label: "Equipment Requests", url: "https://it.nbcuni.com/equipment" },
      { label: "Device Standards", url: "https://it.nbcuni.com/devices" }
    ],
    contacts: [{ role: "Workplace Technology", email: "workplace-tech@nbcuni.com" }]
  },
  {
    id: "facilities-001",
    category: "Facilities",
    title: "Report Office or Badge Issue",
    description: "Get help with office access, badges, desks, rooms, and facilities issues.",
    keywords: ["badge", "office", "desk", "facilities", "building", "room", "access"],
    steps: [
      "Open the Facilities portal.",
      "Select Badge, Office Access, Desk, or Room Support.",
      "Describe the issue and include building/location details.",
      "Submit the request and watch for facilities follow-up."
    ],
    links: [
      { label: "Facilities Portal", url: "https://facilities.nbcuni.com" },
      { label: "Office Access Help", url: "https://facilities.nbcuni.com/access" }
    ],
    contacts: [{ role: "Facilities Support", email: "facilities@nbcuni.com" }]
  },
  {
    id: "learning-001",
    category: "Training",
    title: "Complete Required Training",
    description: "Find compliance, security, and role-specific learning assignments.",
    keywords: ["training", "learning", "compliance", "security training", "course", "module"],
    steps: [
      "Open the Learning portal.",
      "Review mandatory assignments and due dates.",
      "Launch each course and complete the final acknowledgement or quiz.",
      "Save completion confirmation if your manager requested it."
    ],
    links: [
      { label: "Learning Portal", url: "https://learning.nbcuni.com" },
      { label: "Compliance Training", url: "https://learning.nbcuni.com/compliance" }
    ],
    contacts: [{ role: "Learning Support", email: "learning-support@nbcuni.com" }]
  },
  {
    id: "manager-approval-001",
    category: "Manager Tools",
    title: "Approve Team Requests",
    description: "Review approvals for access, purchases, expenses, and employee changes.",
    keywords: ["manager", "approval", "approve", "team", "request", "workflow"],
    steps: [
      "Open the Manager Center.",
      "Review pending approvals by priority and due date.",
      "Open each request to inspect details and justification.",
      "Approve, reject, or send back for more information."
    ],
    links: [
      { label: "Manager Center", url: "https://manager.nbcuni.com" },
      { label: "Approval Help", url: "https://manager.nbcuni.com/approvals" }
    ],
    contacts: [{ role: "Manager Support", email: "manager-support@nbcuni.com" }]
  },
  {
    id: "security-001",
    category: "Security",
    title: "Report Phishing or Security Concern",
    description: "Escalate suspicious emails, credential concerns, or security incidents.",
    keywords: ["security", "phishing", "suspicious email", "incident", "cyber", "report"],
    steps: [
      "Do not click suspicious links or download attachments.",
      "Use the Report Phishing button in Outlook when available.",
      "Open a security ticket for urgent concerns.",
      "Call the security hotline for active incidents."
    ],
    links: [
      { label: "Security Center", url: "https://security.nbcuni.com" },
      { label: "Report Incident", url: "https://security.nbcuni.com/report" }
    ],
    contacts: [{ role: "Security Operations", email: "security@nbcuni.com" }]
  }
];
