import { profile, spokenLanguages, text } from "../content/profile";
import type { Lang } from "../lib/types";

const labels = {
  en: {
    location: "location",
    focus: "focus",
    also: "also",
    languages: "languages",
    files: "list files",
    commands: "list commands",
  },
  pt: {
    location: "local",
    focus: "foco",
    also: "além",
    languages: "idiomas",
    files: "lista os arquivos",
    commands: "lista os comandos",
  },
} as const;

export function Summary({ lang }: { lang: Lang }) {
  const copy = labels[lang];
  const languages = spokenLanguages
    .map((language) => `${text(lang, language.name).toLowerCase()} ${text(lang, language.level)}`)
    .join(" · ");

  return (
    <section className="summary" aria-label={lang === "pt" ? "resumo" : "summary"}>
      <img
        alt={profile.name}
        className="summary-photo"
        height={960}
        src={profile.portrait}
        width={960}
      />
      <div>
        <h1>{profile.name}</h1>
        <p className="tone-muted summary-role">{profile.role}</p>
        <dl>
          <dt>org</dt>
          <dd>{profile.org}</dd>
          <dt>{copy.location}</dt>
          <dd>{text(lang, profile.location)}</dd>
          <dt>{copy.focus}</dt>
          <dd>{profile.focus.join(", ")}</dd>
          <dt>{copy.also}</dt>
          <dd>{profile.also.join(" · ")}</dd>
          <dt>{copy.languages}</dt>
          <dd>{languages}</dd>
          <dt>github</dt>
          <dd>
            <a href={profile.github} rel="noreferrer" target="_blank">
              GabrielRochaFC
            </a>
          </dd>
        </dl>
        <p className="summary-hint">
          <span className="tone-amber">ls</span>
          <span className="tone-muted"> {copy.files} · </span>
          <span className="tone-amber">help</span>
          <span className="tone-muted"> {copy.commands}</span>
        </p>
      </div>
    </section>
  );
}
