import type { Resource } from "@/lib/supabase/types";

/**
 * Seeded resource catalog — programs, scholarships, and guides. These are
 * illustrative entries for the demo, pointed at safe, well-known URLs.
 */

export const demoResources: Resource[] = [
  {
    id: "res-questbridge",
    title: "QuestBridge College Prep Scholars",
    type: "program",
    tags: ["low-income", "college-prep", "summer"],
    description:
      "A free program connecting high-achieving, low-income high school juniors to college-prep support, campus events, and a path to the National College Match.",
    url: "https://www.questbridge.org/high-school-students/college-prep-scholars",
    organization: "QuestBridge",
    region: "National",
  },
  {
    id: "res-research",
    title: "Research Science Institute (RSI)",
    type: "program",
    tags: ["research", "stem", "summer"],
    description:
      "A six-week summer program at MIT where students complete a full research project on the leading edge of science and engineering.",
    url: "https://www.cee.org/programs/research-science-institute",
    organization: "CEE",
    region: "Northeast",
  },
  {
    id: "res-nobel",
    title: "MIT THINK Scholars",
    type: "program",
    tags: ["stem", "project-grant", "high-school"],
    description:
      "An MIT program that funds and mentors high school students with ambitious, feasible project ideas in science, technology, engineering, and math.",
    url: "https://think.mit.edu",
    organization: "MIT",
    region: "National",
  },
  {
    id: "res-jack-kent-cooke",
    title: "Jack Kent Cooke Young Scholars",
    type: "program",
    tags: ["low-income", "academic-support", "summer"],
    description:
      "A selective program that supports exceptional 8th graders from low-income families with coaching, summer enrichment, and college guidance.",
    url: "https://www.jkcf.org/our-scholarships/jack-kent-cooke-foundation-young-scholars-program/",
    organization: "Jack Kent Cooke Foundation",
    region: "National",
  },
  {
    id: "res-terry",
    title: "Terry Foundation Scholarship (Texas)",
    type: "scholarship",
    tags: ["texas", "need-based", "four-year"],
    description:
      "A four-year scholarship for Texas high school graduates attending a participating Texas public university, covering tuition and fees plus a stipend.",
    url: "https://terryfoundation.org",
    organization: "Terry Foundation",
    region: "Southwest",
  },
  {
    id: "res-gates",
    title: "Gates Scholarship",
    type: "scholarship",
    tags: ["low-income", "full-ride", "minority"],
    description:
      "A last-dollar, full-cost scholarship for exceptional, Pell-eligible minority students from low-income households pursuing a bachelor's degree.",
    url: "https://www.thegatesscholarship.org",
    organization: "Bill & Melinda Gates Foundation",
    region: "National",
  },
  {
    id: "res-national-merit",
    title: "National Merit Scholarship Program",
    type: "scholarship",
    tags: ["test-based", "merit", "psat"],
    description:
      "Recognition and scholarship competition based on PSAT/NMSQT performance, with some corporate and college-sponsored awards.",
    url: "https://www.nationalmerit.org",
    organization: "National Merit Scholarship Corporation",
    region: "National",
  },
  {
    id: "res-fafsa-guide",
    title: "The Complete FAFSA Walkthrough",
    type: "guide",
    tags: ["financial-aid", "fafsa", "how-to"],
    description:
      "Step-by-step walkthrough of the FAFSA: which documents to gather, how the FAFSA-to-income ratio works, and how aid estimates are calculated.",
    url: "https://studentaid.gov/h/apply-for-aid/fafsa",
    organization: "U.S. Department of Education",
    region: "National",
  },
  {
    id: "res-essay-guide",
    title: "How to Write a Personal Statement",
    type: "guide",
    tags: ["essay", "personal-statement", "tips"],
    description:
      "A research-backed structure for the Common App essay: hooks, scene-setting, reflection, and a closing that echoes the opening.",
    url: "https://www.commonapp.org/blog/common-app-essay",
    organization: "Common App",
    region: "National",
  },
  {
    id: "res-css-guide",
    title: "CSS Profile & Institutional Aid",
    type: "guide",
    tags: ["financial-aid", "css-profile", "private-colleges"],
    description:
      "What the CSS Profile covers beyond the FAFSA, which schools require it, and why your answers can unlock need-based institutional grants.",
    url: "https://cssprofile.collegeboard.org",
    organization: "College Board",
    region: "National",
  },
  {
    id: "res-uw-youth",
    title: "UW Youth & Teen Programs",
    type: "program",
    tags: ["washinton", "summer", "academic"],
    description:
      "University of Washington's summer and academic-year programs for teens — from computer science camps to pre-college seminars.",
    url: "https://www.washington.edu/youth/",
    organization: "University of Washington",
    region: "West",
  },
  {
    id: "res-georgia-goal",
    title: "Georgia HOPE & Zell Miller",
    type: "scholarship",
    tags: ["georgia", "merit", "in-state"],
    description:
      "Georgia's merit-based aid covering full or partial tuition at eligible Georgia colleges based on HOPE GPA and test thresholds.",
    url: "https://www.gafutures.org/hope-state-aid-programs/",
    organization: "Georgia Student Finance Commission",
    region: "South",
  },
];

export function getDemoResources(): Resource[] {
  return demoResources;
}
