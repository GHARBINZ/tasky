// The categories your app supports, with the keywords that map to each.
// "Personal" is the fallback when nothing matches.
const CATEGORY_RULES = [
  {
    category: "Work",
    keywords: ["meeting", "deadline", "report", "email", "client", "project", "presentation"],
  },
  {
    category: "Errands",
    keywords: ["buy", "market", "grocery", "groceries", "shop", "shopping", "pick up", "store", "pharmacy"],
  },
  {
    category: "Urgent",
    keywords: ["urgent", "asap", "immediately", "important", "critical", "now"],
  },
];

export const CATEGORIES = ["Work", "Errands", "Personal", "Urgent"];

export const suggestCategory = (title = "") => {
  const text = title.toLowerCase();

  const urgentRule = CATEGORY_RULES.find((rule) => rule.category === "Urgent");
  if (urgentRule && urgentRule.keywords.some((keyword) => text.includes(keyword))) {
    return "Urgent";
  }

  for (const rule of CATEGORY_RULES) {
    if (rule.category === "Urgent") continue;
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.category;
    }
  }

  return "Personal";
};
