import {
  certificates,
  profile,
  schools,
  spokenLanguages,
} from "../content/profile";
import { COMMANDS, type CommandName } from "../lib/shell";
import type { Block, Line, SkillGroup, Tone } from "../lib/types";

type BlockViewProps = {
  block: Block;
  onRun: (command: string) => void;
};

function toneClass(tone: Tone | undefined): string {
  switch (tone) {
    case undefined:
    case "fg":
      return "tone-fg";
    case "muted":
      return "tone-muted";
    case "amber":
      return "tone-amber";
    case "path":
      return "tone-path";
    case "green":
      return "tone-green";
    case "danger":
      return "tone-danger";
    default: {
      const unknown: never = tone;
      return unknown;
    }
  }
}

function LineView({ line, onRun }: { line: Line; onRun: (command: string) => void }) {
  return (
    <div className="line">
      {line.map((span, index) => {
        const className = toneClass(span.tone);
        if (span.run) {
          return (
            <button
              key={index}
              type="button"
              className={`text-button ${className}`}
              onClick={() => onRun(span.run ?? "")}
            >
              {span.text}
            </button>
          );
        }
        if (span.href) {
          return (
            <a key={index} className={className} href={span.href} target="_blank" rel="noreferrer">
              {span.text}
            </a>
          );
        }
        return (
          <span key={index} className={className}>
            {span.text}
          </span>
        );
      })}
    </div>
  );
}

function SkillsView({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="block">
      {groups.map((group) => (
        <section key={group.file}>
          <h2>{group.title}</h2>
          <ul className="skill-list">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function BlockView({ block, onRun }: BlockViewProps) {
  switch (block.kind) {
    case "lines":
      return (
        <div className="block">
          {block.lines.map((line, index) => (
            <LineView key={index} line={line} onRun={onRun} />
          ))}
        </div>
      );
    case "listing":
      return (
        <ul className="listing">
          {block.items.map((item) => (
            <li key={item.run}>
              <button
                type="button"
                className={item.hint === "dir" ? "tone-path" : "tone-fg"}
                onClick={() => onRun(item.run)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      );
    case "neofetch":
      return (
        <section className="fetch block">
          <img src={profile.portrait} alt="Retrato de Gabriel Rocha" width={960} height={960} />
          <div>
            <h1>{profile.name}</h1>
            <p className="tone-muted role">{profile.role}</p>
            <dl>
              <dt>org</dt>
              <dd>{profile.org}</dd>
              <dt>local</dt>
              <dd>{profile.location}</dd>
              <dt>foco</dt>
              <dd>{profile.focus.join(", ")}</dd>
              <dt>além</dt>
              <dd>{profile.also.join(" · ")}</dd>
              <dt>idiomas</dt>
              <dd>português · inglês avançado · espanhol básico</dd>
              <dt>github</dt>
              <dd>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GabrielRochaFC
                </a>
              </dd>
            </dl>
            <div className="hint">
              <button type="button" className="text-button tone-amber" onClick={() => onRun("ls")}>
                ls
              </button>
              <span className="tone-muted"> mostra os arquivos · </span>
              <button type="button" className="text-button tone-amber" onClick={() => onRun("help")}>
                help
              </button>
              <span className="tone-muted"> lista os comandos</span>
            </div>
          </div>
        </section>
      );
    case "project": {
      const { project } = block;
      return (
        <article className={project.image ? "project block has-image" : "project block"}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              width={project.imageWidth}
              height={project.imageHeight}
            />
          ) : null}
          <div>
            <h2>
              <a href={project.href} target="_blank" rel="noreferrer">
                {project.title}
              </a>
            </h2>
            <p className="meta">
              {project.year} · {project.stack.join(" · ")}
            </p>
            <p>{project.summary}</p>
            {project.note ? <p className="tone-muted">{project.note}</p> : null}
            {project.codeHref ? (
              <p>
                <a href={project.codeHref} target="_blank" rel="noreferrer">
                  repositório
                </a>
              </p>
            ) : null}
          </div>
        </article>
      );
    }
    case "skills":
      return <SkillsView groups={block.groups} />;
    case "education":
      return (
        <div className="block">
          <section>
            <h2>faculdade</h2>
            <ul className="records">
              {schools.map((school) => (
                <li key={school.course}>
                  <p>{school.course}</p>
                  <p className="tone-muted">
                    {school.place} · {school.when}
                  </p>
                  {"detail" in school && school.detail ? (
                    <p className="tone-muted">{school.detail}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>certificados</h2>
            <ul className="records">
              {certificates.map((certificate) => (
                <li key={certificate.name}>
                  <p>
                    <a href={certificate.href} target="_blank" rel="noreferrer">
                      {certificate.name}
                    </a>
                  </p>
                  <p className="tone-muted">{certificate.detail}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>idiomas</h2>
            <ul className="records">
              {spokenLanguages.map((language) => (
                <li key={language.name}>
                  <p>
                    {language.name}
                    <span className="tone-muted"> · {language.level}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      );
    case "contact":
      return (
        <div className="block">
          <ul className="records">
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={profile.cv} target="_blank" rel="noreferrer">
                currículo
              </a>
            </li>
          </ul>
        </div>
      );
    case "about":
      return (
        <div className="block">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );
    case "help":
      return (
        <div className="block">
          <ul className="help">
            {(Object.keys(COMMANDS) as CommandName[]).map((name) => (
              <li key={name}>
                <button type="button" className="text-button tone-amber" onClick={() => onRun(name)}>
                  {name}
                </button>
                <span className="tone-muted">{COMMANDS[name]}</span>
              </li>
            ))}
          </ul>
          <p className="hint tone-muted">tab completa · ↑ histórico · ctrl+l limpa</p>
        </div>
      );
    default: {
      const unknown: never = block;
      return unknown;
    }
  }
}

export function commandEcho(cwdLabel: string, command: string) {
  return (
    <p className="echo">
      <span className="tone-amber">{profile.user}</span>
      <span className="tone-muted">@{profile.host}</span>{" "}
      <span className="tone-path">{cwdLabel}</span>{" "}
      <span className="tone-muted">$</span> {command}
    </p>
  );
}
