import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Check,
  CheckSquare,
  Code2,
  Copy,
  Highlighter,
  Italic,
  ListChecks,
  Palette,
  Plus,
  Quote,
  Redo2,
  Star,
  Trash2,
  Type,
  Undo2,
  Underline,
} from "lucide-react";
import {
  createBlock,
  type NotebookBlock,
  type NotebookBlockType,
  type NotebookDocument,
  type NotebookTextColor,
} from "../../types/notebookDocument";

type RichNotebookEditorProps = {
  initialDocument: NotebookDocument;
  disabled?: boolean;
  onDocumentChange?: (document: NotebookDocument) => void;
};

const textColors: NotebookTextColor[] = ["default", "red", "orange", "green", "blue", "purple"];
const highlights = ["none", "yellow", "green", "blue", "pink", "orange"];

function cloneDocument(document: NotebookDocument): NotebookDocument {
  return JSON.parse(JSON.stringify(document)) as NotebookDocument;
}

export function RichNotebookEditor({
  initialDocument,
  disabled = false,
  onDocumentChange,
}: RichNotebookEditorProps) {
  const [document, setDocument] = useState(() => cloneDocument(initialDocument));
  const [activeBlockId, setActiveBlockId] = useState<string | null>(
    initialDocument.blocks[0]?.id ?? null,
  );
  const [history, setHistory] = useState<NotebookDocument[]>([]);
  const [future, setFuture] = useState<NotebookDocument[]>([]);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setDocument(cloneDocument(initialDocument));
    setHistory([]);
    setFuture([]);
  }, [initialDocument]);

  const plainLength = useMemo(
    () => document.blocks.reduce((total, block) => total + block.content.length, 0),
    [document],
  );

  function commit(next: NotebookDocument) {
    setHistory((items) => [...items.slice(-39), cloneDocument(document)]);
    setFuture([]);
    setDocument(next);
    onDocumentChange?.(next);
  }

  function updateBlock(id: string, patch: Partial<NotebookBlock>) {
    commit({
      ...document,
      blocks: document.blocks.map((block) =>
        block.id === id ? { ...block, ...patch } : block,
      ),
    });
  }

  function addBlock(type: NotebookBlockType = "paragraph", afterId?: string) {
    const block = createBlock(type);
    const index = afterId
      ? document.blocks.findIndex((item) => item.id === afterId)
      : document.blocks.length - 1;
    const insertAt = index < 0 ? document.blocks.length : index + 1;
    const next = {
      ...document,
      blocks: [
        ...document.blocks.slice(0, insertAt),
        block,
        ...document.blocks.slice(insertAt),
      ],
    };
    commit(next);
    setActiveBlockId(block.id);
    requestAnimationFrame(() => refs.current[block.id]?.focus());
  }

  function removeBlock(id: string) {
    if (document.blocks.length === 1) {
      updateBlock(id, { content: "" });
      return;
    }
    commit({
      ...document,
      blocks: document.blocks.filter((block) => block.id !== id),
    });
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [...items, cloneDocument(document)]);
    setHistory((items) => items.slice(0, -1));
    setDocument(previous);
    onDocumentChange?.(previous);
  }

  function redo() {
    const next = future.at(-1);
    if (!next) return;
    setHistory((items) => [...items, cloneDocument(document)]);
    setFuture((items) => items.slice(0, -1));
    setDocument(next);
    onDocumentChange?.(next);
  }

  function format(command: string, value?: string) {
    window.document.execCommand(command, false, value);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLElement>,
    block: NotebookBlock,
  ) {
    if ((event.metaKey || event.ctrlKey) && ["b", "i", "u"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      format(
        event.key.toLowerCase() === "b"
          ? "bold"
          : event.key.toLowerCase() === "i"
            ? "italic"
            : "underline",
      );
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && block.type !== "code") {
      event.preventDefault();
      addBlock("paragraph", block.id);
    }

    if (event.key === "Backspace" && block.content === "" && document.blocks.length > 1) {
      event.preventDefault();
      removeBlock(block.id);
    }
  }

  function handleContentInput(id: string, element: HTMLElement) {
    const content = element.innerText.replace(/\u00a0/g, " ");
    const next = {
      ...document,
      blocks: document.blocks.map((block) =>
        block.id === id ? { ...block, content } : block,
      ),
    };
    setDocument(next);
    onDocumentChange?.(next);
  }

  function copyCode(content: string) {
    void navigator.clipboard.writeText(content);
  }

  return (
    <div className="real-notebook">
      <div className="real-notebook__toolbar">
        <div className="real-notebook__toolbar-group">
          <button type="button" title="Undo" onClick={undo} disabled={disabled || history.length === 0}><Undo2 size={17} /></button>
          <button type="button" title="Redo" onClick={redo} disabled={disabled || future.length === 0}><Redo2 size={17} /></button>
        </div>

        <div className="real-notebook__toolbar-divider" />

        <div className="real-notebook__toolbar-group">
          <button type="button" title="Bold" onMouseDown={(e) => { e.preventDefault(); format("bold"); }} disabled={disabled}><Bold size={17} /></button>
          <button type="button" title="Italic" onMouseDown={(e) => { e.preventDefault(); format("italic"); }} disabled={disabled}><Italic size={17} /></button>
          <button type="button" title="Underline" onMouseDown={(e) => { e.preventDefault(); format("underline"); }} disabled={disabled}><Underline size={17} /></button>
        </div>

        <div className="real-notebook__toolbar-divider" />

        <div className="real-notebook__toolbar-group real-notebook__select-group">
          <Type size={16} />
          <select
            value={document.blocks.find((block) => block.id === activeBlockId)?.type ?? "paragraph"}
            onChange={(event) => {
              const type = event.target.value as NotebookBlockType;
              if (activeBlockId) updateBlock(activeBlockId, { type, language: type === "code" ? "csharp" : undefined });
            }}
            disabled={disabled || !activeBlockId}
            aria-label="Block type"
          >
            <option value="paragraph">Text</option>
            <option value="heading">Heading</option>
            <option value="bullet">Bullet list</option>
            <option value="checklist">Checklist</option>
            <option value="quote">Quote</option>
            <option value="code">Code</option>
          </select>
        </div>

        <div className="real-notebook__toolbar-group">
          <label title="Text color" className="real-notebook__color-picker">
            <Palette size={17} />
            <select
              value={document.blocks.find((block) => block.id === activeBlockId)?.color ?? "default"}
              onChange={(event) => activeBlockId && updateBlock(activeBlockId, { color: event.target.value as NotebookTextColor })}
              disabled={disabled || !activeBlockId}
              aria-label="Text color"
            >
              {textColors.map((color) => <option key={color} value={color}>{color}</option>)}
            </select>
          </label>
          <label title="Highlight" className="real-notebook__color-picker">
            <Highlighter size={17} />
            <select
              value={document.blocks.find((block) => block.id === activeBlockId)?.highlight ?? "none"}
              onChange={(event) => activeBlockId && updateBlock(activeBlockId, { highlight: event.target.value })}
              disabled={disabled || !activeBlockId}
              aria-label="Highlight color"
            >
              {highlights.map((color) => <option key={color} value={color}>{color}</option>)}
            </select>
          </label>
          <button
            type="button"
            className={document.blocks.find((block) => block.id === activeBlockId)?.important ? "is-active" : ""}
            title="Mark important"
            onClick={() => {
              const block = document.blocks.find((item) => item.id === activeBlockId);
              if (block) updateBlock(block.id, { important: !block.important });
            }}
            disabled={disabled || !activeBlockId}
          >
            <Star size={17} />
          </button>
        </div>

        <div className="real-notebook__toolbar-divider" />

        <div className="real-notebook__toolbar-group">
          <button type="button" title="Add text block" onClick={() => addBlock("paragraph")} disabled={disabled}><Plus size={17} /></button>
          <button type="button" title="Add checklist" onClick={() => addBlock("checklist", activeBlockId ?? undefined)} disabled={disabled}><ListChecks size={17} /></button>
          <button type="button" title="Add code block" onClick={() => addBlock("code", activeBlockId ?? undefined)} disabled={disabled}><Code2 size={17} /></button>
          <button type="button" title="Add quote" onClick={() => addBlock("quote", activeBlockId ?? undefined)} disabled={disabled}><Quote size={17} /></button>
        </div>
      </div>

      <div className="real-notebook__paper">
        <div className="real-notebook__paper-header">
          <span>Study notebook</span>
          <span>{plainLength} characters</span>
        </div>

        {document.blocks.map((block) => (
          <article
            key={block.id}
            className={[
              "real-notebook__block",
              `real-notebook__block--${block.type}`,
              block.important ? "is-important" : "",
            ].join(" ")}
          >
            <div className="real-notebook__block-gutter">
              <button
                type="button"
                title="Delete block"
                onClick={() => removeBlock(block.id)}
                disabled={disabled || document.blocks.length === 1}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {block.type === "code" ? (
              <div className="real-notebook__code">
                <div className="real-notebook__code-header">
                  <select
                    value={block.language ?? "csharp"}
                    onChange={(event) => updateBlock(block.id, { language: event.target.value })}
                    disabled={disabled}
                    aria-label="Code language"
                  >
                    <option value="csharp">C#</option>
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="sql">SQL</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="json">JSON</option>
                    <option value="bash">Bash</option>
                  </select>
                  <button type="button" onClick={() => copyCode(block.content)} title="Copy code" disabled={disabled}><Copy size={15} /> Copy</button>
                </div>
                <textarea
                  ref={(element) => { refs.current[block.id] = element; }}
                  value={block.content}
                  onFocus={() => setActiveBlockId(block.id)}
                  onChange={(event) => {
                    const value = event.target.value;
                    const next = {
                      ...document,
                      blocks: document.blocks.map((item) => item.id === block.id ? { ...item, content: value } : item),
                    };
                    setDocument(next);
                    onDocumentChange?.(next);
                  }}
                  className="real-notebook__code-input"
                  placeholder="Write code here..."
                  spellCheck={false}
                  disabled={disabled}
                />
              </div>
            ) : (
              <div
                ref={(element) => { refs.current[block.id] = element; }}
                className={[
                  "real-notebook__content",
                  `real-notebook__content--${block.color ?? "default"}`,
                  `real-notebook__highlight--${block.highlight ?? "none"}`,
                ].join(" ")}
                contentEditable={!disabled}
                suppressContentEditableWarning
                role="textbox"
                aria-label={block.type === "heading" ? "Notebook heading" : "Notebook text"}
                onFocus={() => setActiveBlockId(block.id)}
                onInput={(event) => handleContentInput(block.id, event.currentTarget)}
                onKeyDown={(event) => handleKeyDown(event, block)}
              >
                {block.content}
              </div>
            )}

            {block.type === "checklist" ? (
              <button
                type="button"
                className="real-notebook__check"
                onClick={() => updateBlock(block.id, { checked: !block.checked })}
                disabled={disabled}
                aria-label={block.checked ? "Mark unchecked" : "Mark complete"}
              >
                {block.checked ? <CheckSquare size={19} /> : <Check size={19} />}
              </button>
            ) : null}

            {block.important ? <span className="real-notebook__important"><Star size={13} /> Important</span> : null}
          </article>
        ))}

        <button
          type="button"
          className="real-notebook__add-block"
          onClick={() => addBlock("paragraph")}
          disabled={disabled}
        >
          <Plus size={17} /> Add another block
        </button>
      </div>

      <div className="real-notebook__hint">
        Enter creates a new block · ⌘/Ctrl+B, I, U for formatting · use Code for developer notes
      </div>
    </div>
  );
}
