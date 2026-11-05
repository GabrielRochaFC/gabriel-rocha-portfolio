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
import type { Block, ThemeName } from "../lib/types";
import {
  BOOT_LINES,
  complete,
  displayPath,
  isThemeName,
  runCommand,
} from "../lib/shell";
import { BlockView, commandEcho } from "./blocks";

const THEME_KEY = "gr-theme";
const BOOT_KEY = "gr-booted";

type Entry = {
  id: string;
  cwd: string;
  command?: string;
  blocks: Block[];
};

const SHORTCUTS = ["help", "projects", "skills", "contact"] as const;

function readStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && isThemeName(stored)) return stored;
  } catch {
    return "gruvbox";
  }
  return "gruvbox";
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

export function Terminal() {
  const [phase, setPhase] = useState<"boot" | "ready">("boot");
  const [bootLines, setBootLines] = useState<readonly string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cwd, setCwd] = useState("/");
  const [theme, setTheme] = useState<ThemeName>("gruvbox");
  const [input, setInput] = useState("");
  const [ok, setOk] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clock, setClock] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const draftRef = useRef("");
  const skipBootRef = useRef<(pending?: string) => void>(() => {});
  const cwdRef = useRef(cwd);
  const themeRef = useRef(theme);
  const phaseRef = useRef(phase);

  cwdRef.current = cwd;
  themeRef.current = theme;
  phaseRef.current = phase;

  function nextId(): string {
    idRef.current += 1;
    return String(idRef.current);
  }

  useEffect(() => {
    const stored = readStoredTheme();
    setTheme(stored);
    document.documentElement.dataset.theme = stored;
  }, []);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
        hourCycle: "h23",
      }).format(new Date());
    setClock(format());
    const timer = window.setInterval(() => setClock(format()), 30_000);
    return () => window.clearInterval(timer);
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
        // sessão privada
      }
      setPhase("ready");
      setEntries([
        {
          id: String(++idRef.current),
          cwd: "/",
          blocks: [{ kind: "neofetch" }],
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
      setBootLines(BOOT_LINES.slice(0, count));
      if (count >= BOOT_LINES.length) startReady();
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
  }, [entries, bootLines, phase]);

  function execute(command: string, duringBoot: boolean) {
    const ranAt = cwdRef.current;
    const result = runCommand(command, ranAt, themeRef.current);
    if (result.theme) {
      document.documentElement.dataset.theme = result.theme;
      try {
        localStorage.setItem(THEME_KEY, result.theme);
      } catch {
        // sessão privada
      }
      setTheme(result.theme);
    }
    setEntries((previous) => {
      if (result.clear) return [];
      const home: Entry = {
        id: nextId(),
        cwd: "/",
        blocks: [{ kind: "neofetch" }],
      };
      const base = duringBoot ? [home] : previous;
      return [...base, { id: nextId(), cwd: ranAt, command, blocks: result.blocks }];
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
      <header className="status">
        <p className="sr-only">Gabriel Rocha, desenvolvedor full stack</p>
        <p className="status-id">
          <span className="tone-amber">{profile.user}</span>
          <span className="tone-muted">@{profile.host}</span>
        </p>
        <p className="status-path tone-path">{displayPath(cwd)}</p>
        <p className="time">{clock}</p>
      </header>

      <div className="buffer" ref={bufferRef} role="log" aria-live="polite" aria-relevant="additions">
        {phase === "boot" ? (
          <div className="entry">
            {bootLines.map((line) => (
              <p key={line} className="line tone-muted">
                {line}
              </p>
            ))}
          </div>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="entry">
              {entry.command !== undefined ? commandEcho(displayPath(entry.cwd), entry.command) : null}
              {entry.blocks.map((block, index) => (
                <BlockView key={`${entry.id}-${index}`} block={block} onRun={submitCommand} />
              ))}
            </article>
          ))
        )}
      </div>

      <nav className="shortcuts" aria-label="atalhos">
        {SHORTCUTS.map((command) => (
          <button key={command} type="button" className="chip" onClick={() => submitCommand(command)}>
            {command}
          </button>
        ))}
      </nav>

      <form className="prompt" onSubmit={onSubmit} aria-label="linha de comando">
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
          aria-label="Comando"
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
