import { Fragment, ReactNode } from "react";

type FormatChatTextProps = {
  text: string;
  className?: string;
};

function renderInlineFormatting(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`strong-${index}`} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <Fragment key={`text-${index}`}>{part}</Fragment>;
    });
}

export default function FormatChatText({ text, className = "" }: FormatChatTextProps) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    const items = [...listItems];
    listItems = [];

    blocks.push(
      <ul key={`list-${blocks.length}`} className="space-y-1 pl-5 text-sm leading-6 text-white/90 list-disc">
        {items.map((item, index) => (
          <li key={`item-${index}`}>{renderInlineFormatting(item)}</li>
        ))}
      </ul>,
    );
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/);

    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
      return;
    }

    flushList();

    if (line.trim().length === 0) {
      blocks.push(<div key={`spacer-${blocks.length}`} className="h-2" aria-hidden="true" />);
      return;
    }

    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="text-sm leading-6 text-white/90">
        {renderInlineFormatting(line)}
      </p>,
    );
  });

  flushList();

  return <div className={`space-y-3 ${className}`}>{blocks}</div>;
}
