import assert from "node:assert/strict";
import { complete, displayPath, resolvePath, runCommand } from "../lib/shell";

const theme = "gruvbox" as const;

const root = runCommand("ls", "/", theme);
assert.equal(root.ok, true);
const rootListing = root.blocks[0];
assert.equal(rootListing?.kind, "listing");
if (rootListing?.kind === "listing") {
  const names = rootListing.items.map((item) => item.name);
  assert.deepEqual(names, ["projects/", "skills/", "about.md", "contact.md", "education.md"]);
}

const entered = runCommand("cd projects", "/", theme);
assert.equal(entered.cwd, "/projects");
assert.equal(displayPath(entered.cwd), "~/projects");

const missing = runCommand("cd nenhum", "/", theme);
assert.equal(missing.ok, false);

const fileAsDir = runCommand("cd about.md", "/", theme);
assert.equal(fileAsDir.ok, false);

const about = runCommand("cat ~/about.md", "/projects", theme);
assert.equal(about.blocks[0]?.kind, "about");

const directory = runCommand("cat skills", "/", theme);
assert.equal(directory.ok, false);

const project = runCommand("open sghss", "/", theme);
assert.equal(project.blocks[0]?.kind, "project");

const ambiguous = runCommand("open s", "/", theme);
assert.equal(ambiguous.blocks[0]?.kind, "lines");

const themed = runCommand("theme kanagawa", "/", theme);
assert.equal(themed.theme, "kanagawa");

const badTheme = runCommand("theme azul", "/", theme);
assert.equal(badTheme.ok, false);

const unknown = runCommand("sudo", "/", theme);
assert.equal(unknown.ok, false);

const mailed = runCommand("mail Olá", "/", theme);
assert.equal(mailed.openUrl, "mailto:gabriel.rocha20@live.com?subject=Ol%C3%A1");

const cleared = runCommand("clear", "/skills", theme);
assert.equal(cleared.clear, true);
assert.equal(cleared.cwd, "/skills");

assert.equal(complete("he", "/").value, "help ");
assert.equal(complete("cd proj", "/").value, "cd projects/");
assert.equal(complete("theme k", "/").value, "theme kanagawa ");
assert.deepEqual(complete("open s", "/").matches.sort(), ["sghss", "starbucks"]);

const studies = runCommand("ls projects/studies", "/", theme);
assert.equal(studies.ok, true);
if (studies.blocks[0]?.kind === "listing") {
  assert.ok(studies.blocks[0].items.some((item) => item.name === "doce-preco.md"));
}

assert.equal(resolvePath("/projects", "../skills"), "/skills");
assert.equal(resolvePath("/projects/studies", "../.."), "/");

console.log("shell ok");
