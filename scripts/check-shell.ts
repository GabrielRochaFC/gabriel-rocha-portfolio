import assert from "node:assert/strict";
import { complete, displayPath, resolvePath, runCommand } from "../lib/shell";

const theme = "gruvbox" as const;

const root = runCommand("ls", "/", theme, "en");
assert.equal(root.ok, true);
const rootListing = root.blocks[0];
assert.equal(rootListing?.kind, "listing");
if (rootListing?.kind === "listing") {
  const names = rootListing.items.map((item) => item.name);
  assert.deepEqual(names, [
    "projects/",
    "skills/",
    "about.md",
    "contact.md",
    "education.md",
    "portrait.jpg",
  ]);
  assert.equal(rootListing.items.every((item) => !("run" in item)), true);
}

const entered = runCommand("cd projects", "/", theme, "en");
assert.equal(entered.cwd, "/projects");
assert.equal(displayPath(entered.cwd), "~/projects");

const here = runCommand("pwd", "/projects", theme, "en");
assert.equal(here.blocks[0]?.kind, "lines");
if (here.blocks[0]?.kind === "lines") {
  assert.equal(here.blocks[0].lines[0]?.[0]?.text, "/home/gabriel/projects");
}

const who = runCommand("whoami", "/", theme, "en");
if (who.blocks[0]?.kind === "lines") {
  assert.equal(who.blocks[0].lines[0]?.[0]?.text, "gabriel");
}

const missing = runCommand("cd nenhum", "/", theme, "en");
assert.equal(missing.ok, false);

const fileAsDir = runCommand("cd about.md", "/", theme, "en");
assert.equal(fileAsDir.ok, false);

const about = runCommand("cat ~/about.md", "/projects", theme, "en");
assert.equal(about.blocks[0]?.kind, "lines");
if (about.blocks[0]?.kind === "lines") {
  assert.match(about.blocks[0].lines[0]?.[0]?.text ?? "", /Full stack/);
}

const aboutPt = runCommand("cat ~/about.md", "/", theme, "pt");
if (aboutPt.blocks[0]?.kind === "lines") {
  assert.match(aboutPt.blocks[0].lines[0]?.[0]?.text ?? "", /Desenvolvedor full stack/);
}

const directory = runCommand("cat skills", "/", theme, "en");
assert.equal(directory.ok, false);

const project = runCommand("open sghss", "/", theme, "en");
assert.equal(project.blocks[0]?.kind, "file");
if (project.blocks[0]?.kind === "file") {
  assert.match(project.blocks[0].lines[0]?.[0]?.text ?? "", /Hospital management/);
  assert.equal(project.blocks[0].image, undefined);
}

const study = runCommand("cat projects/studies/starbucks.md", "/", theme, "en");
assert.equal(study.blocks[0]?.kind, "file");
if (study.blocks[0]?.kind === "file") {
  assert.equal(study.blocks[0].image?.src, "/studies/starbucks.png");
}

const portrait = runCommand("cat portrait.jpg", "/", theme, "en");
assert.equal(portrait.blocks[0]?.kind, "image");

const ambiguous = runCommand("open s", "/", theme, "en");
assert.equal(ambiguous.blocks[0]?.kind, "lines");

const themed = runCommand("theme kanagawa", "/", theme, "en");
assert.equal(themed.theme, "kanagawa");

const badTheme = runCommand("theme azul", "/", theme, "en");
assert.equal(badTheme.ok, false);

const portuguese = runCommand("lang pt", "/", theme, "en");
assert.equal(portuguese.lang, "pt");

const helpPt = runCommand("help", "/", theme, "pt");
if (helpPt.blocks[0]?.kind === "lines") {
  const joined = helpPt.blocks[0].lines.map((line) => line.map((span) => span.text).join("")).join("\n");
  assert.match(joined, /lista os comandos/);
}

const helpEn = runCommand("help", "/", theme, "en");
if (helpEn.blocks[0]?.kind === "lines") {
  const joined = helpEn.blocks[0].lines.map((line) => line.map((span) => span.text).join("")).join("\n");
  assert.match(joined, /list commands/);
}

const unknown = runCommand("sudo", "/", theme, "en");
assert.equal(unknown.ok, false);
if (unknown.blocks[0]?.kind === "lines") {
  assert.equal(unknown.blocks[0].lines[0]?.[0]?.text, "sudo: command not found");
}

const mailed = runCommand("mail Olá", "/", theme, "en");
assert.equal(mailed.openUrl, "mailto:gabriel.rocha20@live.com?subject=Ol%C3%A1");

const cleared = runCommand("clear", "/skills", theme, "en");
assert.equal(cleared.clear, true);
assert.equal(cleared.cwd, "/skills");

assert.equal(complete("he", "/").value, "help ");
assert.equal(complete("cd proj", "/").value, "cd projects/");
assert.equal(complete("theme k", "/").value, "theme kanagawa ");
assert.equal(complete("lang p", "/").value, "lang pt ");
assert.deepEqual(complete("open s", "/").matches.sort(), ["sghss", "starbucks"]);

const studies = runCommand("ls projects/studies", "/", theme, "en");
assert.equal(studies.ok, true);
if (studies.blocks[0]?.kind === "listing") {
  assert.ok(studies.blocks[0].items.some((item) => item.name === "doce-preco.md"));
}

const skills = runCommand("ls skills", "/", theme, "en");
if (skills.blocks[0]?.kind === "listing") {
  assert.deepEqual(
    skills.blocks[0].items.map((item) => item.name),
    ["backend.txt", "databases.txt", "frontend.txt", "languages.txt", "tools.txt"],
  );
}

assert.equal(resolvePath("/projects", "../skills"), "/skills");
assert.equal(resolvePath("/projects/studies", "../.."), "/");

console.log("shell ok");
