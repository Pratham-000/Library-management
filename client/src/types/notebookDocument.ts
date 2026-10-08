export type NotebookBlockType = "paragraph" | "heading" | "bullet" | "checklist" | "quote" | "code";

export type NotebookTextColor = "default" | "red" | "orange" | "green" | "blue" | "purple";

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
    content,
    checked: type === "checklist" ? false : undefined,
    important: false,
    color: "default",
    highlight: "none",
    language: type === "code" ? "csharp" : undefined,
  };
}

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

export function notebookDocumentToPlainText(document: NotebookDocument): string {
  return document.blocks
    .map((block) => {
      if (block.type === "checklist") return `${block.checked ? "[x]" : "[ ]"} ${block.content}`;
      if (block.type === "bullet") return `• ${block.content}`;
      if (block.type === "code") return block.content;
      return block.content;
    })
    .filter(Boolean)
    .join("\n");
}
