import { profile, projects } from "../content/profile";
import { Terminal } from "../components/terminal";

export default function Page() {
  const featured = projects.filter((project) => project.group === "work");

  return (
    <>
      <Terminal />
      <noscript>
        <style>{`.session{display:none}html,body{overflow:auto;height:auto}`}</style>
        <article className="fallback">
          <h1>{profile.name}</h1>
          {profile.about.map((paragraph) => (
            <p key={paragraph.en}>{paragraph.en}</p>
          ))}
          <ul>
            {featured.map((project) => (
              <li key={project.slug}>
                <a href={project.href}>{project.title.en}</a>
              </li>
            ))}
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.github}>GitHub</a>
            </li>
          </ul>
        </article>
      </noscript>
    </>
  );
}
