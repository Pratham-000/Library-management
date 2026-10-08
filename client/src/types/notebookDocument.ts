export type NotebookBlockType =
  | "paragraph"
  | "heading"
  | "bullet"
  | "checklist"
  | "quote"
  | "code"
  | "drawing";

export type NotebookTextColor =
  | "default"
  | "red"
  | "orange"
  | "green"
  | "blue"
  | "purple";

export type NotebookPoint = {
  x: number;
  y: number;
};

export type NotebookStroke = {
  id: string;
  points: NotebookPoint[];
  color: string;
  width: number;
  tool: "pen" | "eraser";
};

export type NotebookShape = {
  id: string;
  type: "rectangle" | "circle" | "line" | "arrow";
  start: NotebookPoint;
  end: NotebookPoint;
  color: string;
  width: number;
};

export type NotebookDrawing = {
  version: 1;
  width: number;
  height: number;
  strokes: NotebookStroke[];
  shapes: NotebookShape[];
};

export type NotebookBlock = {
  id: string;
  type: NotebookBlockType;
  content: string;
  checked?: boolean;
  important?: boolean;
  color?: NotebookTextColor;
  highlight?: string;
  language?: string;
};

export type NotebookDocument = {
  version: 1;
  blocks: NotebookBlock[];
};

export const createEmptyDrawing = (): NotebookDrawing => ({
  version: 1,
  width: 1200,
  height: 700,
  strokes: [],
  shapes: [],
});

export function serializeDrawing(drawing: NotebookDrawing): string {
  return JSON.stringify(drawing);
}

export function parseDrawing(content: string): NotebookDrawing {
  try {
    const parsed: unknown = JSON.parse(content);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed as NotebookDrawing).version === 1 &&
      Array.isArray((parsed as NotebookDrawing).strokes) &&
      Array.isArray((parsed as NotebookDrawing).shapes)
    ) {
      return parsed as NotebookDrawing;
    }
  } catch {
    // Fall through to an empty drawing for malformed legacy data.
  }

  return createEmptyDrawing();
}

const isDocument = (value: unknown): value is NotebookDocument => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as NotebookDocument;
  return candidate.version === 1 && Array.isArray(candidate.blocks);
};

export function createBlock(
  type: NotebookBlockType = "paragraph",
  content = "",
): NotebookBlock {
  return {
    id: crypto.randomUUID(),
    type,
    content:
      type === "drawing"
        ? serializeDrawing(createEmptyDrawing())
        : content,
    checked: type === "checklist" ? false : undefined,
    important: false,
    color: "default",
    highlight: "none",
    language: type === "code" ? "csharp" : undefined,
  };
};

export function parseNotebookContent(content: string): NotebookDocument {
  try {
    const parsed: unknown = JSON.parse(content);
    if (isDocument(parsed)) {
      return {
        version: 1,
        blocks: parsed.blocks.length
          ? parsed.blocks.map((block) => ({
              ...block,
              id: block.id || crypto.randomUUID(),
            }))
          : [createBlock()],
      };
    }
  } catch {
    // Existing notes are plain text; preserve them as a paragraph.
  }

  return {
    version: 1,
    blocks: [createBlock("paragraph", content)],
  };
}

export function serializeNotebookDocument(document: NotebookDocument): string {
  return JSON.stringify(document);
}

function htmlToPlainText(value: string): string {
  if (!value.includes("<")) return value;
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");
  return doc.body.textContent ?? "";
}

export function notebookDocumentToPlainText(document: NotebookDocument): string {
  return document.blocks
    .map((block) => {
      if (block.type === "checklist") return `${block.checked ? "[x]" : "[ ]"} ${htmlToPlainText(block.content)}`;
      if (block.type === "bullet") return `• ${htmlToPlainText(block.content)}`;
      if (block.type === "code") return block.content;
      if (block.type === "drawing") return "[Drawing / diagram]";
      return htmlToPlainText(block.content);
    })
    .filter(Boolean)
    .join("\n");
}

export function sanitizeNotebookHtml(value: string): string {
  if (!value.includes("<")) return value.replace(/\n/g, "<br />");

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");
  const allowed = new Set(["B", "STRONG", "I", "EM", "U", "BR", "S", "MARK", "SPAN"]);

  const walk = (element: Element) => {
    for (const child of Array.from(element.children)) {
      if (!allowed.has(child.tagName)) {
        const text = doc.createTextNode(child.textContent ?? "");
        child.replaceWith(text);
        continue;
      }

      for (const attribute of Array.from(child.attributes)) {
        if (attribute.name !== "style") {
          child.removeAttribute(attribute.name);
        }
      }

      if (child.hasAttribute("style")) {
        const style = child.getAttribute("style") ?? "";
        const safeStyle = style
          .split(";")
          .filter((rule) => /^(font-weight|font-style|text-decoration|background-color|color)\s*:/i.test(rule))
          .join(";");
        if (safeStyle) child.setAttribute("style", safeStyle);
        else child.removeAttribute("style");
      }

      walk(child);
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
}
