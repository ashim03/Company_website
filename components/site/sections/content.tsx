import { Inner, text, asRecord } from "@/lib/types";
import { Markdown } from "@/lib/markdown";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

/**
 * Flexible rich-content section. Supports either a single markdown
 * `body` string, or an array of `blocks` each with `heading` + `body`.
 */
export function ContentSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const blocks = Array.isArray(c.blocks) ? c.blocks.map((b) => asRecord(b)) : [];
  const body = c.body ? text(c.body) : "";

  if (!body && blocks.length === 0) return null;

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <div className="prose-content">
          {body ? (
            <Reveal>
              <Markdown source={body} />
            </Reveal>
          ) : (
            <div className="flex flex-col gap-10">
              {blocks.map((block, i) => (
                <Reveal key={i}>
                  {block.heading ? (
                    <h2 className="text-title mb-4 font-semibold">
                      {text(block.heading)}
                    </h2>
                  ) : null}
                  {block.body ? <Markdown source={text(block.body)} /> : null}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}