import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A small, dependency-free markdown renderer.
 * Produces React elements only — raw HTML from source is never rendered,
 * so stored markdown cannot inject scripts.
 */

const INLINE_RE =
  /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|!\[[^\]]*\]\([^)\s]+(?:\s+"[^"]*")?\)|\[[^\]]+\]\([^)\s]+(?:\s+"[^"]*")?\))/g;

/**
 * Allow only safe URL schemes. Anything else (javascript:, data:, vbscript:,
 * file:, etc.) is dropped so stored markdown cannot inject executable URLs.
 */
function safeUrl(url: string, imagesOnly = false): string | null {
  const value = url.trim();
  if (!value) return null;
  if (imagesOnly && /^(?:data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(value)) {
    return value;
  }
  if (/^(?:https?:|mailto:|tel:|\/|\.\/|\.\.\/|#)/i.test(value)) return value;
  return null;
}

function inline(text: string, keyBase: number): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = text.split(INLINE_RE);
  let k = 0;
  for (const part of parts) {
    if (!part) continue;
    k += 1;
    const mk = `${keyBase}-${k}`;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      nodes.push(
        <code key={mk} className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      nodes.push(<strong key={mk}>{inline(part.slice(2, -2), k)}</strong>);
    } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      nodes.push(<em key={mk}>{inline(part.slice(1, -1), k)}</em>);
    } else if (part.startsWith("![") && part.includes("](")) {
      const close = part.indexOf("](");
      const alt = part.slice(2, close);
      const url = safeUrl(part.slice(close + 2, -1).split(/\s+/)[0], true);
      if (url) {
        nodes.push(
          <img
            key={mk}
            src={url}
            alt={alt || "Embedded image"}
            loading="lazy"
            className="my-4 h-auto max-w-full rounded-lg border"
          />
        );
      } else {
        nodes.push(inline(alt || "Embedded image", k));
      }
    } else if (part.startsWith("[") && part.includes("](")) {
      const close = part.indexOf("](");
      const label = part.slice(1, close);
      const url = safeUrl(part.slice(close + 2, -1).split(/\s+/)[0]);
      if (url) {
        const external = /^https?:\/\//i.test(url);
        nodes.push(
          <a
            key={mk}
            href={url}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {inline(label, k)}
          </a>
        );
      } else {
        nodes.push(inline(label, k));
      }
    } else {
      nodes.push(part);
    }
  }
  return nodes;
}

export function Markdown({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 [&_li]:my-1.5", className)}>
      {markdownBlocks(source)}
    </div>
  );
}

function markdownBlocks(source: string): ReactNode[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let k = 0;

  const pushParagraph = (buffer: string[]) => {
    if (buffer.length === 0) return;
    k += 1;
    blocks.push(
      <p key={k} className="leading-7">
        {inline(buffer.join(" "), k)}
      </p>
    );
  };

  const pushList = (items: { ordered: boolean; text: string }[]) => {
    if (items.length === 0) return;
    k += 1;
    const Tag = items[0].ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={k} className={items[0].ordered ? "list-decimal" : "list-disc"} style={{ paddingInlineStart: "1.25rem" }}>
        {items.map((item, i) => (
          <li key={`${k}-${i}`} className="leading-7">
            {inline(item.text, k * 100 + i)}
          </li>
        ))}
      </Tag>
    );
  };

  const buffer: string[] = [];
  const list: { ordered: boolean; text: string }[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let quoteBuffer: string[] = [];

  const flushQuote = () => {
    if (quoteBuffer.length === 0) return;
    k += 1;
    blocks.push(
      <blockquote key={k} className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
        {inline(quoteBuffer.join(" "), k)}
      </blockquote>
    );
    quoteBuffer = [];
  };

  const flushAll = () => {
    pushParagraph(buffer);
    buffer.length = 0;
    pushList(list);
    list.length = 0;
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (inCode) {
      if (line.trim().startsWith("```")) {
        inCode = false;
        k += 1;
        blocks.push(
          <pre key={k} className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono">
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (line.trim().startsWith("```")) {
      flushAll();
      inCode = true;
      codeBuffer = [];
      continue;
    }

    if (line.startsWith("> ")) {
      flushAll();
      quoteBuffer.push(line.slice(2));
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushAll();
      k += 1;
      const level = Math.min(heading[1].length, 4) as 1 | 2 | 3 | 4;
      const cls =
        level === 1
          ? "mt-2 text-2xl font-bold tracking-tight"
          : level === 2
            ? "mt-4 text-xl font-semibold tracking-tight"
            : level === 3
              ? "mt-3 text-lg font-semibold tracking-tight"
              : "mt-3 text-base font-semibold";
      const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5";
      blocks.push(
        <Tag key={k} className={cls}>
          {inline(heading[2], k)}
        </Tag>
      );
      continue;
    }

    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      if (buffer.length || quoteBuffer.length) flushAll();
      const ordered = /^\s*\d+\.\s+/.test(line);
      const itemText = line.replace(/^\s*([-*+]|\d+\.)\s+/, "");
      if (list.length && list[list.length - 1].ordered !== ordered) {
        pushList(list);
        list.length = 0;
      }
      list.push({ ordered, text: itemText });
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushAll();
      k += 1;
      blocks.push(<hr key={k} className="my-6 border-border" />);
      continue;
    }

    if (list.length) {
      pushList(list);
      list.length = 0;
    }
    if (line.trim() === "") {
      pushParagraph(buffer);
      buffer.length = 0;
      continue;
    }
    buffer.push(line);
  }

  if (inCode) {
    k += 1;
    blocks.push(
      <pre key={k} className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono">
        <code>{codeBuffer.join("\n")}</code>
      </pre>
    );
  }
  flushAll();
  return blocks;
}