"use client";

import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { profile } from "../content/profile";
import type { Block, Lang, ThemeName } from "../lib/types";
import {
  bootLines,
  complete,
  displayPath,
  isLang,
  isThemeName,
  motd,
  runCommand,
} from "../lib/shell";
import { Blocks } from "./blocks";

const THEME_KEY = "gr-theme";
const LANG_KEY = "gr-lang";
const BOOT_KEY = "gr-booted";

type Entry = {
  id: string;
  cwd: string;
  command?: string;
  blocks: Block[];
};

function readStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && isThemeName(stored)) return stored;
  } catch {
    return "gruvbox";
  }
  return "gruvbox";
}

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && isLang(stored)) return stored;
  } catch {
    return "en";
  }
  return "en";
}

function htmlLang(lang: Lang): string {
  return lang === "pt" ? "pt-BR" : "en";
}

function openExternal(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  if (!url.startsWith("mailto:")) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
  anchor.click();
}

function Echo({ cwd, command }: { cwd: string; command: string }) {
  return (
    <p className="echo">
      <span className="tone-amber">{profile.user}</span>
      <span className="tone-muted">@{profile.host}</span>{" "}
      <span className="tone-path">{displayPath(cwd)}</span>{" "}
      <span className="tone-amber">$</span> {command}
    </p>
  );
}

export function Terminal() {
  const [phase, setPhase] = useState<"boot" | "ready">("boot");
  const [bootShown, setBootShown] = useState<readonly string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cwd, setCwd] = useState("/");
  const [lang, setLang] = useState<Lang>("en");
  const [input, setInput] = useState("");
  const [ok, setOk] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const draftRef = useRef("");
  const skipBootRef = useRef<(pending?: string) => void>(() => {});
  const cwdRef = useRef(cwd);
  const themeRef = useRef<ThemeName>("gruvbox");
  const langRef = useRef(lang);
  const phaseRef = useRef(phase);

  cwdRef.current = cwd;
  langRef.current = lang;
  phaseRef.current = phase;

  function nextId(): string {
    idRef.current += 1;
    return String(idRef.current);
  }

  useEffect(() => {
    const storedTheme = readStoredTheme();
    const storedLang = readStoredLang();
    setLang(storedLang);
    themeRef.current = storedTheme;
    langRef.current = storedLang;
    document.documentElement.dataset.theme = storedTheme;
    document.documentElement.lang = htmlLang(storedLang);
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const sync = () => {
      document.documentElement.style.setProperty("--vvh", `${viewport.height}px`);
      document.documentElement.style.setProperty("--vv-offset", `${viewport.offsetTop}px`);
    };
    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(BOOT_KEY) === "1";
    } catch {
      seen = false;
    }

    const sessionLang = readStoredLang();
    langRef.current = sessionLang;
    setLang(sessionLang);
    const script = bootLines(sessionLang);

    let cancelled = false;
    let done = false;
    let timer = 0;

    const startReady = (pending?: string) => {
      if (done || cancelled) return;
      done = true;
      window.clearInterval(timer);
      window.removeEventListener("keydown", onKey, true);
      try {
        sessionStorage.setItem(BOOT_KEY, "1");
      } catch {
        // private mode
      }
      setPhase("ready");
      setEntries([
        {
          id: String(++idRef.current),
          cwd: "/",
          blocks: motd(langRef.current),
        },
      ]);
      if (pending && inputRef.current) {
        inputRef.current.value = pending;
        setInput(pending);
      }
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      if (pending || finePointer) inputRef.current?.focus();
    };

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const pending = event.key.length === 1 ? event.key : undefined;
      event.preventDefault();
      startReady(pending);
    };

    skipBootRef.current = startReady;

    if (reduce || seen) {
      startReady();
      return () => {
        cancelled = true;
      };
    }

    let count = 0;
    timer = window.setInterval(() => {
      count += 1;
      setBootShown(script.slice(0, count));
      if (count >= script.length) startReady();
    }, 160);
    window.addEventListener("keydown", onKey, true);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);

  useLayoutEffect(() => {
    const buffer = bufferRef.current;
    if (!buffer) return;
    buffer.scrollTop = buffer.scrollHeight;
  }, [entries, bootShown, phase]);

  function execute(command: string, duringBoot: boolean) {
    const ranAt = cwdRef.current;
    const langAt = langRef.current;
    const result = runCommand(command, ranAt, themeRef.current, langAt);
    if (result.theme) {
      document.documentElement.dataset.theme = result.theme;
      try {
        localStorage.setItem(THEME_KEY, result.theme);
      } catch {
        // private mode
      }
      themeRef.current = result.theme;
    }
    if (result.lang) {
      document.documentElement.lang = htmlLang(result.lang);
      try {
        localStorage.setItem(LANG_KEY, result.lang);
      } catch {
        // private mode
      }
      langRef.current = result.lang;
      setLang(result.lang);
    }
    const commandId = nextId();
    const homeId = duringBoot ? nextId() : "";
    setEntries((previous) => {
      if (result.clear) return [];
      const base = duringBoot
        ? [{ id: homeId, cwd: "/", blocks: motd(langAt) }]
        : previous;
      return [...base, { id: commandId, cwd: ranAt, command, blocks: result.blocks }];
    });
    setCwd(result.cwd);
    setOk(result.ok !== false);
    if (result.openUrl) openExternal(result.openUrl);
    setHistory((previous) =>
      previous[previous.length - 1] === command ? previous : [...previous, command],
    );
    setHistoryIndex(-1);
    draftRef.current = "";
  }

  function submitCommand(command: string) {
    const trimmed = command.trim();
    const duringBoot = phaseRef.current === "boot";
    if (duringBoot) skipBootRef.current();
    setInput("");
    if (!trimmed) return;
    execute(trimmed, duringBoot);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitCommand(input);
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (phaseRef.current === "boot") return;

    if (event.key === "Tab") {
      event.preventDefault();
      const result = complete(input, cwdRef.current);
      setInput(result.value);
      if (result.matches.length > 1) {
        setEntries((previous) => [
          ...previous,
          {
            id: nextId(),
            cwd: cwdRef.current,
            blocks: [
              {
                kind: "lines",
                lines: [
                  result.matches.flatMap((match, index) => {
                    const item = { text: match, tone: "muted" as const };
                    return index === 0 ? [item] : [{ text: "  " }, item];
                  }),
                ],
              },
            ],
          },
        ]);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      if (historyIndex === -1) draftRef.current = input;
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      const remembered = history[next];
      setHistoryIndex(next);
      if (remembered !== undefined) setInput(remembered);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex >= history.length - 1) {
        setHistoryIndex(-1);
        setInput(draftRef.current);
        return;
      }
      const next = historyIndex + 1;
      const remembered = history[next];
      setHistoryIndex(next);
      if (remembered !== undefined) setInput(remembered);
      return;
    }

    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
      return;
    }

    if (event.key === "c" && event.ctrlKey) {
      event.preventDefault();
      setInput("");
      setHistoryIndex(-1);
    }
  }

  return (
    <main className="session">
      <h1 className="sr-only">Gabriel Rocha</h1>
      <div className="buffer" ref={bufferRef} role="log" aria-live="polite" aria-relevant="additions">
        {phase === "boot" ? (
          <div className="entry">
            {bootShown.map((line) => (
              <p key={line} className="line tone-muted">
                {line}
              </p>
            ))}
          </div>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="entry">
              {entry.command !== undefined ? <Echo command={entry.command} cwd={entry.cwd} /> : null}
              <Blocks blocks={entry.blocks} />
            </article>
          ))
        )}
      </div>

      <form className="prompt" onSubmit={onSubmit} aria-label={lang === "pt" ? "linha de comando" : "command line"}>
        <p className="prompt-label">
          <span className="tone-amber">{profile.user}</span>
          <span className="tone-muted">@{profile.host}</span>{" "}
          <span className="tone-path">{displayPath(cwd)}</span>{" "}
          <span className={ok ? "tone-amber" : "tone-danger"}>$</span>
        </p>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setHistoryIndex(-1);
          }}
          onKeyDown={onKeyDown}
          aria-label={lang === "pt" ? "Comando" : "Command"}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          inputMode="text"
        />
      </form>
    </main>
  );
}
