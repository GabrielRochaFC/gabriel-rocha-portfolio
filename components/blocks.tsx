import type { Block, Line } from "../lib/types";

function Lines({ lines }: { lines: Line[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <p className="line" key={index}>
          {line.length === 0 ? (
            "\u00a0"
          ) : (
            line.map((span, spanIndex) =>
              span.href ? (
                <a
                  className="tone-path"
                  href={span.href}
                  key={spanIndex}
                  rel="noreferrer"
                  target="_blank"
                >
                  {span.text}
                </a>
              ) : (
                <span className={`tone-${span.tone ?? "fg"}`} key={spanIndex}>
                  {span.text}
                </span>
              ),
            )
          )}
        </p>
      ))}
    </>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "lines") {
          return (
            <div className="block" key={index}>
              <Lines lines={block.lines} />
            </div>
          );
        }
        if (block.kind === "listing") {
          return (
            <p className="line listing" key={index}>
              {block.items.map((item) => (
                <span className={item.hint === "dir" ? "tone-path" : "tone-fg"} key={item.name}>
                  {item.name}
                </span>
              ))}
            </p>
          );
        }
        if (block.kind === "file") {
          return (
            <div className="block" key={index}>
              <Lines lines={block.lines} />
              {block.image ? (
                <img
                  alt={block.image.alt}
                  className="shot"
                  height={block.image.height}
                  src={block.image.src}
                  width={block.image.width}
                />
              ) : null}
            </div>
          );
        }
        if (block.kind === "image") {
          return (
            <div className="block" key={index}>
              <img
                alt={block.image.alt}
                className="portrait"
                height={block.image.height}
                src={block.image.src}
                width={block.image.width}
              />
            </div>
          );
        }
        const unreachable: never = block;
        return unreachable;
      })}
    </>
  );
}
