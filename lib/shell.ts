import {
  certificates,
  profile,
  projects,
  schools,
  skillGroups,
  spokenLanguages,
  text,
} from "../content/profile";
import type { Block, CommandResult, Lang, Line, Project, ThemeName } from "./types";
import { LANGS, THEMES } from "./types";

export const COMMANDS = {
  help: { en: "list commands", pt: "lista os comandos" },
  ls: { en: "list files", pt: "lista os arquivos" },
  cd: { en: "enter a directory", pt: "entra numa pasta" },
  cat: { en: "read a file", pt: "lê um arquivo" },
  pwd: { en: "print the working directory", pt: "mostra onde você está" },
  open: { en: "open a project", pt: "abre um projeto" },
  projects: { en: "list projects", pt: "lista os projetos" },
  skills: { en: "list tools", pt: "mostra as ferramentas" },
  education: { en: "school and certificates", pt: "formação e certificados" },
  contact: { en: "email and profiles", pt: "e-mail e redes" },
  whoami: { en: "print the user", pt: "mostra o usuário" },
  neofetch: { en: "session summary", pt: "resumo da sessão" },
  mail: { en: "open a mail to me", pt: "abre um e-mail para mim" },
  cv: { en: "open the résumé", pt: "abre o currículo" },
  github: { en: "open GitHub", pt: "abre o GitHub" },
  linkedin: { en: "open LinkedIn", pt: "abre o LinkedIn" },
  instagram: { en: "open Instagram", pt: "abre o Instagram" },
  theme: { en: "change colors", pt: "troca as cores" },
  lang: { en: "switch language", pt: "troca o idioma" },
  clear: { en: "clear the screen", pt: "limpa a tela" },
} as const;

export type CommandName = keyof typeof COMMANDS;

const THEME_NOTES: Record<ThemeName, { en: string; pt: string }> = {
  gruvbox: { en: "warm", pt: "quente" },
  kanagawa: { en: "ink", pt: "tinta" },
  night: { en: "cold", pt: "frio" },
};

const DOCUMENTS = ["/about.md", "/education.md", "/contact.md", "/portrait.jpg"] as const;

type Handler = (args: string[], cwd: string, theme: ThemeName, lang: Lang) => CommandResult;

const messages = {
  en: {
    noOptions: (command: string) => `${command}: options are not supported`,
    onePath: (command: string) => `${command}: one path at a time`,
    missing: (command: string, name: string) => `${command}: ${name}: No such file or directory`,
    notDir: (command: string, name: string) => `${command}: ${name}: Not a directory`,
    isDir: (command: string, name: string) => `${command}: ${name}: Is a directory`,
    missingOperand: (command: string) => `${command}: missing operand`,
    notFound: (name: string) => `${name}: command not found`,
    unknownTheme: (name: string) => `theme: ${name}: unknown theme`,
    unknownLang: (name: string) => `lang: ${name}: unknown language`,
    oneName: (command: string) => `${command}: one name at a time`,
    noProject: (name: string) => `open: ${name}: no such project`,
    noFile: (name: string) => `open: ${name}: No such file or directory`,
    current: "current",
    studies: "published coursework",
    opening: "opening",
    resume: "résumé",
    helpHint: "tab completes · ↑ history · ctrl+l clears",
    school: "school",
    certificates: "certificates",
    languages: "languages",
    repo: "repo",
    directory: "directory",
  },
  pt: {
    noOptions: (command: string) => `${command}: este comando não usa opções`,
    onePath: (command: string) => `${command}: um caminho por vez`,
    missing: (command: string, name: string) => `${command}: ${name}: arquivo ou pasta inexistente`,
    notDir: (command: string, name: string) => `${command}: ${name}: não é uma pasta`,
    isDir: (command: string, name: string) => `${command}: ${name}: é uma pasta`,
    missingOperand: (command: string) => `${command}: falta o arquivo`,
    notFound: (name: string) => `${name}: comando não encontrado`,
    unknownTheme: (name: string) => `theme: ${name}: tema desconhecido`,
    unknownLang: (name: string) => `lang: ${name}: idioma desconhecido`,
    oneName: (command: string) => `${command}: um nome por vez`,
    noProject: (name: string) => `open: ${name}: projeto inexistente`,
    noFile: (name: string) => `open: ${name}: arquivo inexistente`,
    current: "atual",
    studies: "páginas de estudo publicadas",
    opening: "abrindo",
    resume: "currículo",
    helpHint: "tab completa · ↑ histórico · ctrl+l limpa",
    school: "faculdade",
    certificates: "certificados",
    languages: "idiomas",
    repo: "repositório",
    directory: "diretório",
  },
} as const;

export function isThemeName(value: string): value is ThemeName {
  return (THEMES as readonly string[]).includes(value);
}

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function isCommandName(value: string): value is CommandName {
  return Object.prototype.hasOwnProperty.call(COMMANDS, value);
}

export function displayPath(cwd: string): string {
  if (cwd === "/") return "~";
  return `~${cwd}`;
}

export function absolutePath(cwd: string): string {
  if (cwd === "/") return "/home/gabriel";
  return `/home/gabriel${cwd}`;
}

export function bootLines(lang: Lang): readonly string[] {
  return ["Linux 6.12.94 (portfolio)", "login: gabriel", `${messages[lang].directory}: ~`];
}

export function motd(lang: Lang): Block[] {
  const other = lang === "en" ? "lang pt  português" : "lang en  english";
  return [
    {
      kind: "lines",
      lines: [
        [{ text: "gabriel@rocha", tone: "amber" }],
        [{ text: "" }],
        [
          { text: "help", tone: "amber" },
          { text: `      ${COMMANDS.help[lang]}` },
        ],
        [
          { text: "ls", tone: "amber" },
          { text: `        ${COMMANDS.ls[lang]}` },
        ],
        [{ text: other, tone: "muted" }],
      ],
    },
  ];
}

export function resolvePath(cwd: string, raw: string): string {
  let source = raw.trim();
  if (source === "~" || source.startsWith("~/")) {
    source = source.slice(1);
  } else if (!source.startsWith("/")) {
    source = `${cwd === "/" ? "" : cwd}/${source}`;
  }

  const stack: string[] = [];
  for (const part of source.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return `/${stack.join("/")}`;
}

function allFiles(): string[] {
  return [
    ...DOCUMENTS,
    ...skillGroups.map((group) => group.file),
    ...projects.map((project) => project.file),
  ];
}

function isFile(path: string): boolean {
  return allFiles().includes(path);
}

function isDir(path: string): boolean {
  if (path === "/") return true;
  const prefix = `${path}/`;
  return allFiles().some((file) => file.startsWith(prefix));
}

function listDir(dir: string): { name: string; type: "dir" | "file"; path: string }[] {
  const prefix = dir === "/" ? "/" : `${dir}/`;
  const entries = new Map<string, { name: string; type: "dir" | "file"; path: string }>();

  for (const file of allFiles()) {
    if (!file.startsWith(prefix)) continue;
    const rest = file.slice(prefix.length);
    const slash = rest.indexOf("/");
    if (slash === -1) {
      entries.set(rest, { name: rest, type: "file", path: file });
      continue;
    }
    const name = rest.slice(0, slash);
    entries.set(name, { name, type: "dir", path: `${prefix}${name}` });
  }

  return [...entries.values()].sort((left, right) => {
    if (left.type !== right.type) return left.type === "dir" ? -1 : 1;
    return left.name.localeCompare(right.name, "en");
  });
}

function fail(cwd: string, message: string): CommandResult {
  return {
    cwd,
    ok: false,
    blocks: [{ kind: "lines", lines: [[{ text: message, tone: "danger" }]] }],
  };
}

function fileName(path: string): string {
  const name = path.split("/").pop();
  return name ?? path;
}

function projectFile(project: Project, lang: Lang): Block {
  const lines: Line[] = [
    [{ text: text(lang, project.title), tone: "amber" }],
    [{ text: `${project.year}  ${project.stack.join(", ")}`, tone: "muted" }],
    [{ text: "" }],
    [{ text: text(lang, project.summary) }],
  ];
  if (project.note) lines.push([{ text: text(lang, project.note), tone: "muted" }]);
  lines.push([{ text: "" }], [{ text: project.href, href: project.href, tone: "path" }]);
  if (project.codeHref) {
    lines.push([
      { text: `${messages[lang].repo}  `, tone: "muted" },
      { text: project.codeHref, href: project.codeHref, tone: "path" },
    ]);
  }
  const image =
    project.image && project.imageWidth && project.imageHeight
      ? {
          src: project.image,
          alt: text(lang, project.title),
          width: project.imageWidth,
          height: project.imageHeight,
        }
      : undefined;
  return { kind: "file", lines, image };
}

function blocksFor(path: string, lang: Lang): Block[] | null {
  if (path === "/portrait.jpg") {
    return [
      {
        kind: "image",
        image: {
          src: profile.portrait,
          alt: profile.name,
          width: 960,
          height: 960,
        },
      },
    ];
  }
  if (path === "/about.md") {
    return [{ kind: "lines", lines: profile.about.map((paragraph) => [{ text: text(lang, paragraph) }]) }];
  }
  if (path === "/education.md") {
    const lines: Line[] = [[{ text: messages[lang].school, tone: "amber" }]];
    for (const school of schools) {
      lines.push([{ text: school.course }]);
      lines.push([{ text: `${school.place}  ${text(lang, school.when)}`, tone: "muted" }]);
      if ("detail" in school && school.detail) {
        lines.push([{ text: text(lang, school.detail), tone: "muted" }]);
      }
      lines.push([{ text: "" }]);
    }
    lines.push([{ text: messages[lang].certificates, tone: "amber" }]);
    for (const certificate of certificates) {
      lines.push([{ text: certificate.name, href: certificate.href, tone: "path" }]);
      lines.push([{ text: text(lang, certificate.detail), tone: "muted" }]);
    }
    lines.push([{ text: "" }], [{ text: messages[lang].languages, tone: "amber" }]);
    for (const language of spokenLanguages) {
      lines.push([{ text: `${text(lang, language.name)}  ${text(lang, language.level)}`, tone: "muted" }]);
    }
    return [{ kind: "lines", lines }];
  }
  if (path === "/contact.md") {
    return [
      {
        kind: "lines",
        lines: [
          [{ text: profile.email, href: `mailto:${profile.email}`, tone: "path" }],
          [{ text: profile.linkedin, href: profile.linkedin, tone: "path" }],
          [{ text: profile.github, href: profile.github, tone: "path" }],
          [{ text: profile.instagram, href: profile.instagram, tone: "path" }],
          [{ text: profile.cv, href: profile.cv, tone: "path" }],
        ],
      },
    ];
  }

  const group = skillGroups.find((item) => item.file === path);
  if (group) {
    return [
      {
        kind: "lines",
        lines: [
          [{ text: text(lang, group.title), tone: "amber" }],
          [{ text: group.items.join("  ") }],
        ],
      },
    ];
  }

  const project = projects.find((item) => item.file === path);
  if (project) return [projectFile(project, lang)];
  return null;
}

function projectLines(items: Project[], lang: Lang): Line[] {
  const lines: Line[] = [];
  for (const project of items) {
    lines.push([{ text: fileName(project.file), tone: "fg" }]);
    lines.push([{ text: `  ${text(lang, project.blurb)}`, tone: "muted" }]);
  }
  return lines;
}

function projectsOverview(cwd: string, lang: Lang): CommandResult {
  const featured = projects.filter((project) => project.group === "work");
  const lines = projectLines(featured, lang);
  lines.push(
    [{ text: "studies/", tone: "path" }],
    [{ text: `  ${messages[lang].studies}`, tone: "muted" }],
  );
  return { cwd, ok: true, blocks: [{ kind: "lines", lines }] };
}

function linkResult(cwd: string, label: string, url: string): CommandResult {
  return {
    cwd,
    ok: true,
    openUrl: url,
    blocks: [
      {
        kind: "lines",
        lines: [
          [
            { text: `${label} `, tone: "muted" },
            { text: url, href: url, tone: "path" },
          ],
        ],
      },
    ],
  };
}

function neofetch(lang: Lang): Block[] {
  const row = (label: string, value: string): Line => [
    { text: label.padEnd(10, " "), tone: "muted" },
    { text: value },
  ];
  return [
    {
      kind: "lines",
      lines: [
        [{ text: `${profile.user}@${profile.host}`, tone: "amber" }],
        [{ text: "----------", tone: "muted" }],
        row("user", profile.name),
        row("role", profile.role),
        row("org", profile.org),
        row("location", text(lang, profile.location)),
        row("focus", profile.focus.join(", ")),
        row("also", profile.also.join(" · ")),
        row(
          "langs",
          spokenLanguages.map((language) => text(lang, language.name).toLowerCase()).join(", "),
        ),
        row("shell", "bash"),
      ],
    },
  ];
}

const handlers: Record<CommandName, Handler> = {
  help: (_args, cwd, _theme, lang) => ({
    cwd,
    ok: true,
    blocks: [
      {
        kind: "lines",
        lines: [
          ...(Object.keys(COMMANDS) as CommandName[]).map(
            (name): Line => [
              { text: name.padEnd(12, " "), tone: "amber" },
              { text: COMMANDS[name][lang], tone: "muted" },
            ],
          ),
          [{ text: "" }],
          [{ text: messages[lang].helpHint, tone: "muted" }],
        ],
      },
    ],
  }),
  ls: (args, cwd, _theme, lang) => {
    const copy = messages[lang];
    const target = args[0];
    if (target?.startsWith("-")) return fail(cwd, copy.noOptions("ls"));
    if (args.length > 1) return fail(cwd, copy.onePath("ls"));
    const path = target === undefined ? cwd : resolvePath(cwd, target);
    if (isFile(path)) {
      return {
        cwd,
        ok: true,
        blocks: [{ kind: "listing", items: [{ name: fileName(path), hint: "file" }] }],
      };
    }
    if (!isDir(path)) return fail(cwd, copy.missing("ls", target ?? path));
    return {
      cwd,
      ok: true,
      blocks: [
        {
          kind: "listing",
          items: listDir(path).map((entry) => ({
            name: entry.type === "dir" ? `${entry.name}/` : entry.name,
            hint: entry.type,
          })),
        },
      ],
    };
  },
  cd: (args, cwd, _theme, lang) => {
    const copy = messages[lang];
    const target = args[0];
    if (target === undefined) return { cwd: "/", ok: true, blocks: [] };
    if (target.startsWith("-")) return fail(cwd, copy.noOptions("cd"));
    if (args.length > 1) return fail(cwd, copy.onePath("cd"));
    const path = resolvePath(cwd, target);
    if (isFile(path)) return fail(cwd, copy.notDir("cd", target));
    if (!isDir(path)) return fail(cwd, copy.missing("cd", target));
    return { cwd: path, ok: true, blocks: [] };
  },
  cat: (args, cwd, _theme, lang) => {
    const copy = messages[lang];
    const target = args[0];
    if (target === undefined) return fail(cwd, copy.missingOperand("cat"));
    if (target.startsWith("-")) return fail(cwd, copy.noOptions("cat"));
    if (args.length > 1) return fail(cwd, copy.onePath("cat"));
    const path = resolvePath(cwd, target);
    if (isDir(path)) return fail(cwd, copy.isDir("cat", target));
    const blocks = blocksFor(path, lang);
    if (!blocks) return fail(cwd, copy.missing("cat", target));
    return { cwd, ok: true, blocks };
  },
  pwd: (_args, cwd) => ({
    cwd,
    ok: true,
    blocks: [{ kind: "lines", lines: [[{ text: absolutePath(cwd), tone: "path" }]] }],
  }),
  open: (args, cwd, _theme, lang) => {
    const copy = messages[lang];
    const target = args[0];
    if (target === undefined) return projectsOverview(cwd, lang);
    if (args.length > 1) return fail(cwd, copy.oneName("open"));
    if (target.includes("/") || target.endsWith(".md") || target.endsWith(".txt") || target.endsWith(".jpg")) {
      const path = resolvePath(cwd, target);
      const blocks = blocksFor(path, lang);
      if (!blocks) return fail(cwd, copy.noFile(target));
      return { cwd, ok: true, blocks };
    }
    const exact = projects.find((project) => project.slug === target);
    const matches = exact ? [exact] : projects.filter((project) => project.slug.startsWith(target));
    if (matches.length === 1) {
      const project = matches[0];
      if (!project) return fail(cwd, copy.noProject(target));
      return { cwd, ok: true, blocks: [projectFile(project, lang)] };
    }
    if (matches.length > 1) {
      return { cwd, ok: true, blocks: [{ kind: "lines", lines: projectLines(matches, lang) }] };
    }
    return fail(cwd, copy.noProject(target));
  },
  projects: (_args, cwd, _theme, lang) => projectsOverview(cwd, lang),
  skills: (_args, cwd, _theme, lang) => ({
    cwd,
    ok: true,
    blocks: [
      {
        kind: "lines",
        lines: skillGroups.flatMap((group) => [
          [{ text: text(lang, group.title), tone: "amber" as const }],
          [{ text: group.items.join("  ") }],
          [{ text: "" }],
        ]),
      },
    ],
  }),
  education: (_args, cwd, _theme, lang) => {
    const blocks = blocksFor("/education.md", lang);
    return { cwd, ok: true, blocks: blocks ?? [] };
  },
  contact: (_args, cwd, _theme, lang) => {
    const blocks = blocksFor("/contact.md", lang);
    return { cwd, ok: true, blocks: blocks ?? [] };
  },
  whoami: (_args, cwd) => ({
    cwd,
    ok: true,
    blocks: [{ kind: "lines", lines: [[{ text: profile.user }]] }],
  }),
  neofetch: (_args, cwd, _theme, lang) => ({ cwd, ok: true, blocks: neofetch(lang) }),
  mail: (args, cwd, _theme, lang) => {
    const subject = args.join(" ").trim();
    const href = subject
      ? `mailto:${profile.email}?subject=${encodeURIComponent(subject)}`
      : `mailto:${profile.email}`;
    return linkResult(cwd, messages[lang].opening, href);
  },
  cv: (_args, cwd, _theme, lang) => linkResult(cwd, messages[lang].resume, profile.cv),
  github: (_args, cwd, _theme, lang) => linkResult(cwd, "github", profile.github),
  linkedin: (_args, cwd, _theme, lang) => linkResult(cwd, "linkedin", profile.linkedin),
  instagram: (_args, cwd, _theme, lang) => linkResult(cwd, "instagram", profile.instagram),
  theme: (args, cwd, theme, lang) => {
    const copy = messages[lang];
    const name = args[0];
    if (name === undefined) {
      const lines: Line[] = [
        [
          { text: `${copy.current} `, tone: "muted" },
          { text: theme, tone: "amber" },
        ],
      ];
      for (const item of THEMES) {
        lines.push([
          { text: item.padEnd(10, " "), tone: item === theme ? "amber" : "fg" },
          { text: THEME_NOTES[item][lang], tone: "muted" },
        ]);
      }
      return { cwd, ok: true, blocks: [{ kind: "lines", lines }] };
    }
    if (args.length > 1) return fail(cwd, copy.oneName("theme"));
    if (!isThemeName(name)) return fail(cwd, copy.unknownTheme(name));
    return {
      cwd,
      ok: true,
      theme: name,
      blocks: [{ kind: "lines", lines: [[{ text: name, tone: "amber" }]] }],
    };
  },
  lang: (args, cwd, _theme, lang) => {
    const copy = messages[lang];
    const name = args[0];
    if (name === undefined) {
      return {
        cwd,
        ok: true,
        blocks: [
          {
            kind: "lines",
            lines: [
              [
                { text: `${copy.current} `, tone: "muted" },
                { text: lang, tone: "amber" },
              ],
              [{ text: "en        english" }],
              [{ text: "pt        português" }],
            ],
          },
        ],
      };
    }
    if (args.length > 1) return fail(cwd, copy.oneName("lang"));
    if (!isLang(name)) return fail(cwd, copy.unknownLang(name));
    return {
      cwd,
      ok: true,
      lang: name,
      blocks: [{ kind: "lines", lines: [[{ text: name, tone: "amber" }]] }],
    };
  },
  clear: (_args, cwd) => ({ cwd, ok: true, clear: true, blocks: [] }),
};

export function runCommand(
  input: string,
  cwd: string,
  theme: ThemeName,
  lang: Lang = "en",
): CommandResult {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  const name = parts[0];
  if (name === undefined) return { cwd, ok: true, blocks: [] };
  if (!isCommandName(name)) {
    return fail(cwd, messages[lang].notFound(name));
  }
  return handlers[name](parts.slice(1), cwd, theme, lang);
}

export type Completion = {
  value: string;
  matches: string[];
};

function sharedPrefix(values: readonly string[]): string {
  const first = values[0];
  if (first === undefined) return "";
  let prefix = first;
  for (const value of values) {
    while (!value.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}

function applyMatches(before: string, partial: string, matches: readonly string[]): Completion {
  if (matches.length === 0) return { value: before + partial, matches: [] };
  if (matches.length === 1) {
    const only = matches[0] ?? "";
    const spacer = only.endsWith("/") ? "" : " ";
    return { value: before + only + spacer, matches: [] };
  }
  const common = sharedPrefix(matches);
  if (common.length > partial.length) return { value: before + common, matches: [] };
  return { value: before + partial, matches: [...matches] };
}

function completePath(before: string, partial: string, cwd: string): Completion {
  const slash = partial.lastIndexOf("/");
  const dirPart = slash === -1 ? "" : partial.slice(0, slash + 1);
  const namePart = slash === -1 ? partial : partial.slice(slash + 1);
  const base = resolvePath(cwd, dirPart === "" ? "." : dirPart);
  if (!isDir(base)) return { value: before + partial, matches: [] };

  const rendered = listDir(base)
    .filter((entry) => entry.name.startsWith(namePart))
    .map((entry) => `${dirPart}${entry.name}${entry.type === "dir" ? "/" : ""}`);

  return applyMatches(before, partial, rendered);
}

export function complete(input: string, cwd: string): Completion {
  const endsWithSpace = /\s$/.test(input);
  const tokens = input.trim().split(/\s+/).filter(Boolean);

  if (!endsWithSpace && tokens.length <= 1) {
    const partial = tokens[0] ?? "";
    const matches = (Object.keys(COMMANDS) as CommandName[]).filter((name) => name.startsWith(partial));
    return applyMatches("", partial, matches);
  }

  const command = tokens[0];
  if (command === undefined) return { value: input, matches: [] };
  const partial = endsWithSpace ? "" : (tokens[tokens.length - 1] ?? "");
  const before = endsWithSpace ? input : input.slice(0, input.length - partial.length);

  if (command === "theme") {
    return applyMatches(
      before,
      partial,
      THEMES.filter((theme) => theme.startsWith(partial)),
    );
  }

  if (command === "lang") {
    return applyMatches(
      before,
      partial,
      LANGS.filter((language) => language.startsWith(partial)),
    );
  }

  if (command === "open") {
    return applyMatches(
      before,
      partial,
      projects.map((project) => project.slug).filter((slug) => slug.startsWith(partial)),
    );
  }

  if (command === "ls" || command === "cd" || command === "cat") {
    return completePath(before, partial, cwd);
  }

  return { value: input, matches: [] };
}
