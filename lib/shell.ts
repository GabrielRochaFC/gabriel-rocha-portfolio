import { profile, projects, skillGroups } from "../content/profile";
import type {
  Block,
  CommandResult,
  Line,
  Project,
  ThemeName,
} from "./types";
import { THEMES } from "./types";

export const BOOT_LINES = [
  "portfolio 6.12.94",
  "login: gabriel",
  "diretório: ~",
  "help lista os comandos",
] as const;

export const COMMANDS = {
  help: "mostra esta lista",
  ls: "lista o que tem na pasta",
  cd: "entra numa pasta",
  cat: "lê um arquivo",
  pwd: "mostra onde você está",
  open: "abre um projeto",
  projects: "lista os projetos",
  skills: "mostra as ferramentas",
  education: "formação e certificados",
  contact: "e-mail e redes",
  whoami: "quem está logado",
  neofetch: "resumo da sessão",
  mail: "abre um e-mail para mim",
  cv: "abre o currículo",
  github: "abre o GitHub",
  linkedin: "abre o LinkedIn",
  instagram: "abre o Instagram",
  theme: "troca as cores",
  clear: "limpa a tela",
} as const;

export type CommandName = keyof typeof COMMANDS;

const THEME_NOTES: Record<ThemeName, string> = {
  gruvbox: "quente",
  kanagawa: "tinta",
  night: "frio",
};

const DOCUMENTS = ["/about.md", "/education.md", "/contact.md"] as const;

type Handler = (args: string[], cwd: string, theme: ThemeName) => CommandResult;

export function isThemeName(value: string): value is ThemeName {
  return (THEMES as readonly string[]).includes(value);
}

export function isCommandName(value: string): value is CommandName {
  return Object.prototype.hasOwnProperty.call(COMMANDS, value);
}

export function displayPath(cwd: string): string {
  if (cwd === "/") return "~";
  return `~${cwd}`;
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
    return left.name.localeCompare(right.name, "pt");
  });
}

function blocksFor(path: string): Block[] | null {
  if (path === "/about.md") return [{ kind: "about" }];
  if (path === "/education.md") return [{ kind: "education" }];
  if (path === "/contact.md") return [{ kind: "contact" }];

  const group = skillGroups.find((item) => item.file === path);
  if (group) return [{ kind: "skills", groups: [group] }];

  const project = projects.find((item) => item.file === path);
  if (project) return [{ kind: "project", project }];

  return null;
}

function fail(cwd: string, command: string, message: string): CommandResult {
  return {
    cwd,
    ok: false,
    blocks: [
      {
        kind: "lines",
        lines: [[{ text: `${command}: ${message}`, tone: "danger" }]],
      },
    ],
  };
}

function fileName(path: string): string {
  const name = path.split("/").pop();
  return name ?? path;
}

function projectLines(items: Project[]): Line[] {
  const lines: Line[] = [];
  for (const project of items) {
    lines.push([
      {
        text: fileName(project.file),
        tone: "amber",
        run: `cat ${project.file}`,
      },
    ]);
    lines.push([{ text: project.blurb, tone: "muted" }]);
  }
  return lines;
}

function projectsOverview(cwd: string): CommandResult {
  const featured = projects.filter((project) => project.group === "work");
  const lines = projectLines(featured);
  lines.push([
    { text: "studies/", tone: "path", run: "cd /projects/studies" },
    { text: "  páginas de estudo publicadas", tone: "muted" },
  ]);
  return { cwd, ok: true, blocks: [{ kind: "lines", lines }] };
}

function linkResult(cwd: string, label: string, url: string): CommandResult {
  const visible = url.replace(/^https:\/\//, "").replace(/^mailto:/, "");
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
            { text: visible, href: url, tone: "amber" },
          ],
        ],
      },
    ],
  };
}

const handlers: Record<CommandName, Handler> = {
  help: (_args, cwd) => ({ cwd, ok: true, blocks: [{ kind: "help" }] }),
  ls: (args, cwd) => {
    const target = args[0];
    if (target?.startsWith("-")) return fail(cwd, "ls", "este ls não usa opções");
    if (args.length > 1) return fail(cwd, "ls", "um caminho por vez");
    const path = target === undefined ? cwd : resolvePath(cwd, target);
    if (isFile(path)) {
      return {
        cwd,
        ok: true,
        blocks: [
          {
            kind: "listing",
            items: [{ name: fileName(path), hint: "file", run: `cat ${path}` }],
          },
        ],
      };
    }
    if (!isDir(path)) {
      return fail(cwd, "ls", `${target ?? path}: arquivo ou pasta inexistente`);
    }
    return {
      cwd,
      ok: true,
      blocks: [
        {
          kind: "listing",
          items: listDir(path).map((entry) => ({
            name: entry.type === "dir" ? `${entry.name}/` : entry.name,
            hint: entry.type,
            run: entry.type === "dir" ? `cd ${entry.path}` : `cat ${entry.path}`,
          })),
        },
      ],
    };
  },
  cd: (args, cwd) => {
    const target = args[0];
    if (target === undefined) return { cwd: "/", ok: true, blocks: [] };
    if (target.startsWith("-")) return fail(cwd, "cd", "este cd não usa opções");
    if (args.length > 1) return fail(cwd, "cd", "um caminho por vez");
    const path = resolvePath(cwd, target);
    if (isFile(path)) return fail(cwd, "cd", `${target}: não é uma pasta`);
    if (!isDir(path)) return fail(cwd, "cd", `${target}: arquivo ou pasta inexistente`);
    return { cwd: path, ok: true, blocks: [] };
  },
  cat: (args, cwd) => {
    const target = args[0];
    if (target === undefined) return fail(cwd, "cat", "falta o arquivo");
    if (target.startsWith("-")) return fail(cwd, "cat", "este cat não usa opções");
    if (args.length > 1) return fail(cwd, "cat", "um arquivo por vez");
    const path = resolvePath(cwd, target);
    if (isDir(path)) return fail(cwd, "cat", `${target}: é uma pasta`);
    const blocks = blocksFor(path);
    if (!blocks) return fail(cwd, "cat", `${target}: arquivo ou pasta inexistente`);
    return { cwd, ok: true, blocks };
  },
  pwd: (_args, cwd) => ({
    cwd,
    ok: true,
    blocks: [{ kind: "lines", lines: [[{ text: displayPath(cwd), tone: "path" }]] }],
  }),
  open: (args, cwd) => {
    const target = args[0];
    if (target === undefined) return projectsOverview(cwd);
    if (args.length > 1) return fail(cwd, "open", "um nome por vez");
    if (target.includes("/") || target.endsWith(".md") || target.endsWith(".txt")) {
      const path = resolvePath(cwd, target);
      const blocks = blocksFor(path);
      if (!blocks) return fail(cwd, "open", `${target}: arquivo inexistente`);
      return { cwd, ok: true, blocks };
    }
    const exact = projects.find((project) => project.slug === target);
    const matches = exact
      ? [exact]
      : projects.filter((project) => project.slug.startsWith(target));
    if (matches.length === 1) {
      const project = matches[0];
      if (!project) return fail(cwd, "open", `${target}: projeto inexistente`);
      return { cwd, ok: true, blocks: [{ kind: "project", project }] };
    }
    if (matches.length > 1) {
      return { cwd, ok: true, blocks: [{ kind: "lines", lines: projectLines(matches) }] };
    }
    return fail(cwd, "open", `${target}: projeto inexistente`);
  },
  projects: (_args, cwd) => projectsOverview(cwd),
  skills: (_args, cwd) => ({
    cwd,
    ok: true,
    blocks: [{ kind: "skills", groups: skillGroups }],
  }),
  education: (_args, cwd) => ({ cwd, ok: true, blocks: [{ kind: "education" }] }),
  contact: (_args, cwd) => ({ cwd, ok: true, blocks: [{ kind: "contact" }] }),
  whoami: (_args, cwd) => ({
    cwd,
    ok: true,
    blocks: [
      {
        kind: "lines",
        lines: [
          [{ text: profile.name }],
          [{ text: `${profile.role} · ${profile.location}`, tone: "muted" }],
        ],
      },
    ],
  }),
  neofetch: (_args, cwd) => ({ cwd, ok: true, blocks: [{ kind: "neofetch" }] }),
  mail: (args, cwd) => {
    const subject = args.join(" ").trim();
    const href = subject
      ? `mailto:${profile.email}?subject=${encodeURIComponent(subject)}`
      : `mailto:${profile.email}`;
    return linkResult(cwd, "abrindo", href);
  },
  cv: (_args, cwd) => linkResult(cwd, "currículo", profile.cv),
  github: (_args, cwd) => linkResult(cwd, "github", profile.github),
  linkedin: (_args, cwd) => linkResult(cwd, "linkedin", profile.linkedin),
  instagram: (_args, cwd) => linkResult(cwd, "instagram", profile.instagram),
  theme: (args, cwd, theme) => {
    const name = args[0];
    if (name === undefined) {
      const lines: Line[] = [
        [
          { text: "atual ", tone: "muted" },
          { text: theme, tone: "amber" },
        ],
      ];
      for (const item of THEMES) {
        lines.push([
          {
            text: item,
            tone: item === theme ? "amber" : "fg",
            run: `theme ${item}`,
          },
          { text: `  ${THEME_NOTES[item]}`, tone: "muted" },
        ]);
      }
      return { cwd, ok: true, blocks: [{ kind: "lines", lines }] };
    }
    if (args.length > 1) return fail(cwd, "theme", "um nome por vez");
    if (!isThemeName(name)) return fail(cwd, "theme", `${name}: tema desconhecido`);
    return {
      cwd,
      ok: true,
      theme: name,
      blocks: [{ kind: "lines", lines: [[{ text: name, tone: "amber" }]] }],
    };
  },
  clear: (_args, cwd) => ({ cwd, ok: true, clear: true, blocks: [] }),
};

export function runCommand(input: string, cwd: string, theme: ThemeName): CommandResult {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  const name = parts[0];
  if (name === undefined) return { cwd, ok: true, blocks: [] };
  if (!isCommandName(name)) {
    return {
      cwd,
      ok: false,
      blocks: [
        {
          kind: "lines",
          lines: [
            [{ text: `${name}: comando não encontrado`, tone: "danger" }],
            [
              { text: "help", tone: "amber", run: "help" },
              { text: " lista os comandos", tone: "muted" },
            ],
          ],
        },
      ],
    };
  }
  return handlers[name](parts.slice(1), cwd, theme);
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

function applyMatches(
  before: string,
  partial: string,
  matches: readonly string[],
): Completion {
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
    const matches = (Object.keys(COMMANDS) as CommandName[]).filter((name) =>
      name.startsWith(partial),
    );
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
