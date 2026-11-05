export const THEMES = ["gruvbox", "kanagawa", "night"] as const;

export type ThemeName = (typeof THEMES)[number];

export const LANGS = ["en", "pt"] as const;

export type Lang = (typeof LANGS)[number];

export type Localized = {
  en: string;
  pt: string;
};

export type Tone = "fg" | "muted" | "amber" | "path" | "green" | "danger";

export type Span = {
  text: string;
  tone?: Tone;
  href?: string;
};

export type Line = Span[];

export type ListingItem = {
  name: string;
  hint: "dir" | "file";
};

export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Block =
  | { kind: "lines"; lines: Line[] }
  | { kind: "listing"; items: ListingItem[] }
  | { kind: "file"; lines: Line[]; image?: Shot }
  | { kind: "image"; image: Shot };

export type CommandResult = {
  blocks: Block[];
  cwd: string;
  clear?: boolean;
  theme?: ThemeName;
  lang?: Lang;
  openUrl?: string;
  ok?: boolean;
};

export type Project = {
  slug: string;
  file: string;
  title: Localized;
  year: string;
  blurb: Localized;
  summary: Localized;
  stack: string[];
  href: string;
  codeHref?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  note?: Localized;
  group: "work" | "studies";
};

export type SkillGroup = {
  file: string;
  title: Localized;
  items: string[];
};
