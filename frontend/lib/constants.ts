export const INDUSTRIES = [
  "FMCG / Food & Beverage",
  "Telecommunications",
  "Banking & Finance",
  "Real Estate & Property",
  "Retail & E-Commerce",
  "Automotive",
  "Healthcare & Pharma",
  "Government & Public Sector",
  "Education",
  "Travel & Tourism",
  "Other",
] as const;

export const OBJECTIVES = [
  "National brand awareness",
  "Regional market penetration",
  "Product launch",
  "Lead generation",
  "Sales conversion & promotions",
  "Community engagement & CSR",
  "Employer branding",
] as const;

export const SBU_OPTIONS = [
  {
    value: "MBC Radio (DZRH, Love Radio, Yes FM, Easy Rock, Radyo Natin, Aksyon Radyo)",
    label: "Radio",
    icon: "📻",
  },
  {
    value: "MBC Digital (branded content, display, programmatic)",
    label: "Digital",
    icon: "💻",
  },
  {
    value: "MBC TV (news, public affairs, made-for-TV content)",
    label: "TV",
    icon: "📺",
  },
  {
    value: "MBC Events (on-ground activations, community events)",
    label: "Events",
    icon: "🎪",
  },
  {
    value: "MBC Promos (multi-platform promos, raffle draws, gamified campaigns)",
    label: "Promos",
    icon: "🎯",
  },
  {
    value: "MBC Talents (talent management and endorsements)",
    label: "Talents",
    icon: "⭐",
  },
] as const;

export const BUDGET_VALUES = [
  "₱500,000",
  "₱750,000",
  "₱1,000,000",
  "₱2,000,000",
  "₱3,000,000",
  "₱5,000,000",
  "₱7,000,000",
  "₱10,000,000",
  "₱15,000,000",
  "₱20,000,000",
  "₱20,000,000+",
] as const;

export const BUDGET_LABELS = ["₱500K", "₱1M", "₱2M", "₱5M", "₱10M+"] as const;

export const LOADING_MESSAGES = [
  "Analyzing client brief…",
  "Selecting optimal SBUs…",
  "Writing tailored copy…",
  "Building campaign concept…",
  "Finalizing kit content…",
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    num: "1",
    title: "Sales rep fills form",
    desc: "client details, goals, and budget in under 2 minutes.",
  },
  {
    num: "2",
    title: "MMG AI generates content",
    desc: "tailored copy, SBU selection, and campaign concept via API.",
  },
  {
    num: "3",
    title: "python-pptx fills the deck",
    desc: "placeholders in the master PPTX are replaced surgically.",
  },
  {
    num: "4",
    title: "Rep reviews + sends",
    desc: "download the finished .pptx, no design work needed.",
  },
] as const;
