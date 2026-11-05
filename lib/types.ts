export const THEMES = ["gruvbox", "kanagawa", "night"] as const;

export type ThemeName = (typeof THEMES)[number];

export type Tone = "fg" | "muted" | "amber" | "path" | "green" | "danger";

export type Span = {
  text: string;
  tone?: Tone;
  run?: string;
  href?: string;
};

export type Line = Span[];

export type ListingItem = {
  name: string;
  hint: "dir" | "file";
  run: string;
};

export type Block =
  | { kind: "lines"; lines: Line[] }
  | { kind: "listing"; items: ListingItem[] }
  | { kind: "neofetch" }
  | { kind: "project"; project: Project }
  | { kind: "skills"; groups: SkillGroup[] }
  | { kind: "education" }
  | { kind: "contact" }
  | { kind: "about" }
  | { kind: "help" };

export type CommandResult = {
  blocks: Block[];
  cwd: string;
  clear?: boolean;
  theme?: ThemeName;
  openUrl?: string;
  ok?: boolean;
};

export type Project = {
  slug: string;
  file: string;
  title: string;
  year: string;
  blurb: string;
  summary: string;
  stack: string[];
  href: string;
  codeHref?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  note?: string;
  group: "work" | "studies";
};

export type SkillGroup = {
  file: string;
  title: string;
  items: string[];
};
