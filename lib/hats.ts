export const HAT_IDS = ["blue", "white", "red", "black", "yellow", "green"] as const;

export type HatId = (typeof HAT_IDS)[number];

export type HatEntries = Record<HatId, string[]>;

export type HatConfig = {
  id: HatId;
  name: string;
  color: string;
  rawColor: string;
  altColor?: string;
  iconSrc: string;
  purpose: string;
  title: string[];
  prompt: string;
  hint: string;
  placeholder: string;
};

export const HATS: HatConfig[] = [
  {
    id: "blue",
    name: "Blue",
    color: "var(--hat-blue)",
    rawColor: "#2D6CDF",
    iconSrc: "/assets/BlueHat.svg",
    purpose: "Sharpen the decision",
    title: ["Sharpen", "the exact", "decision."],
    prompt:
      "Use the title as a starting point. What exact version are you deciding now, and what is out of scope?",
    hint:
      "Keep it narrow. Name the decision, the boundary, and what you are not deciding yet.",
    placeholder:
      "e.g. Decide whether to run a 10-day LinkedIn test, not whether LinkedIn is our whole growth strategy.",
  },
  {
    id: "white",
    name: "White",
    color: "var(--hat-white)",
    rawColor: "#f1f1f1",
    iconSrc: "/assets/WhiteHat.svg",
    purpose: "Facts on the table",
    title: ["What's", "actually true", "about this?"],
    prompt:
      "Just the facts. What do you know, what don't you know, and what would you need to find out?",
    hint: "No opinions yet. No feelings. Just what's verifiably the case.",
    placeholder: "e.g. We ship one project per day in May. We have ~800 LinkedIn followers.",
  },
  {
    id: "red",
    name: "Red",
    color: "var(--hat-red)",
    rawColor: "#e21c39",
    iconSrc: "/assets/RedHat.svg",
    purpose: "Gut reactions",
    title: ["How do you", "actually feel", "about it?"],
    prompt: "Feelings, hunches, intuitions. No justifying. Whatever comes up.",
    hint: "Excited, dreading it, suspicious, fired up. Name it without explaining it.",
    placeholder: "e.g. Excited but tired. Slight dread about the writing.",
  },
  {
    id: "black",
    name: "Black",
    color: "var(--hat-black)",
    rawColor: "#0a0a0a",
    altColor: "#5a5a5a",
    iconSrc: "/assets/BlackHat.svg",
    purpose: "Critical risks",
    title: ["What could", "go wrong?"],
    prompt:
      "Threats, weaknesses, ways this fails. Be ruthless. The point of this hat is to look for trouble.",
    hint: "Don't soften. If it could flop, say so. If it could backfire, say so.",
    placeholder:
      "e.g. Nobody engages. Competitors steal the idea. We burn out by week two.",
  },
  {
    id: "yellow",
    name: "Yellow",
    color: "var(--hat-yellow)",
    rawColor: "#F0B429",
    iconSrc: "/assets/YellowHat.svg",
    purpose: "Best case",
    title: ["What could", "go right?"],
    prompt:
      "Benefits, upside, and the version where this works. Same energy as the black hat, opposite direction.",
    hint: "Be greedy. What's the dream scenario?",
    placeholder:
      "e.g. We land 3 inbound leads. Posts compound; by week 4 we're known for shipping.",
  },
  {
    id: "green",
    name: "Green",
    color: "var(--hat-green)",
    rawColor: "#2EA86B",
    iconSrc: "/assets/GreenHat.svg",
    purpose: "Alternatives & creativity",
    title: ["What else", "could you do?"],
    prompt:
      "Other approaches. Variations. The version of this that isn't obvious. Don't filter.",
    hint: "Bad ideas welcome. The goal is options, not commitments.",
    placeholder:
      "e.g. Blog instead. YouTube. One thumbnail per project, posted as a carousel on day 31.",
  },
];

export const EXAMPLE_SESSION = {
  topic: "Should we post daily on LinkedIn during our May project sprint?",
  entries: {
    blue: ["Decide whether to commit to a daily LinkedIn post for each project we ship in May."],
    white: [
      "We ship one project per day for all of May.",
      "We have a small but active LinkedIn following.",
      "Daily posting requires consistent writing; we've never done it.",
      "Goal is indirect business generation, not direct sales.",
    ],
    red: [
      "Excited about the visibility.",
      "Tired; May is already a heavy month.",
      "Confused; none of us really get LinkedIn.",
      "Mild dread about the writing volume.",
    ],
    black: [
      "Nobody engages and the silence is demoralizing.",
      "Posts flop and become evidence the work was weak.",
      "Competitors lift our ideas without crediting us.",
      "We get publicly accountable to a pace we can't sustain.",
      "It quietly eats hours that should go into the projects themselves.",
    ],
    yellow: [
      "Compound visibility; by week four people associate us with shipping.",
      "Inbound leads from people who like the work.",
      "Conversations open up that we can't predict in advance.",
      "Credibility: 'they actually do the thing' beats any case study.",
      "A small chance we stumble into a much bigger idea by doing it in public.",
    ],
    green: [
      "Skip LinkedIn; publish a blog with one post per project instead.",
      "Record a 60-second YouTube walkthrough per project.",
      "Build a 31-day countdown site that reveals one project a day.",
      "Use a different medium per project; match the work to the channel.",
      "Batch into a single end-of-month carousel post instead of daily.",
    ],
  } satisfies HatEntries,
};

export function createEmptyEntries(): HatEntries {
  return HAT_IDS.reduce((entries, hatId) => {
    entries[hatId] = [];
    return entries;
  }, {} as HatEntries);
}

export function hasEntryContent(entries: HatEntries, hatId: HatId): boolean {
  return entries[hatId].some((entry) => entry.trim().length > 0);
}
