import { useEffect, useRef, useState } from "react";
import {
  Circle,
  Eraser,
  Minus,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  Undo2,
} from "lucide-react";
import {
  createEmptyDrawing,
  type NotebookDrawing,
  type NotebookPoint,
  type NotebookShape,
  type NotebookStroke,
} from "../../types/notebookDocument";

type DrawingCanvasProps = {
  value: NotebookDrawing;
  disabled?: boolean;
  onChange: (drawing: NotebookDrawing) => void;
};

const colors = ["#111827", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed", "#db2777"];

function distance(a: NotebookPoint, b: NotebookPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distanceToSegment(point: NotebookPoint, a: NotebookPoint, b: NotebookPoint) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 0 && dy === 0) return distance(point, a);

  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy)));
  return distance(point, { x: a.x + t * dx, y: a.y + t * dy });
}

function drawArrow(ctx: CanvasRenderingContext2D, start: NotebookPoint, end: NotebookPoint) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const size = 12;
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - size * Math.cos(angle - Math.PI / 6), end.y - size * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - size * Math.cos(angle + Math.PI / 6), end.y - size * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function renderDrawing(canvas: HTMLCanvasElement, drawing: NotebookDrawing) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || drawing.width;
  const height = rect.height || drawing.height;

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform((width / drawing.width) * ratio, 0, 0, (height / drawing.height) * ratio, 0, 0);
  ctx.clearRect(0, 0, drawing.width, drawing.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of drawing.strokes) {
    if (stroke.points.length < 1) continue;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.globalCompositeOperation = stroke.tool === "eraser" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (const point of stroke.points.slice(1)) {
      ctx.lineTo(point.x, point.y);
    }
    if (stroke.points.length === 1) ctx.lineTo(stroke.points[0].x + 0.1, stroke.points[0].y + 0.1);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";

  for (const shape of drawing.shapes) {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;
    ctx.beginPath();

    if (shape.type === "rectangle") {
      ctx.strokeRect(
        shape.start.x,
        shape.start.y,
        shape.end.x - shape.start.x,
        shape.end.y - shape.start.y,
      );
    } else if (shape.type === "circle") {
      const radiusX = Math.abs(shape.end.x - shape.start.x) / 2;
      const radiusY = Math.abs(shape.end.y - shape.start.y) / 2;
      const centerX = (shape.start.x + shape.end.x) / 2;
      const centerY = (shape.start.y + shape.end.y) / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.moveTo(shape.start.x, shape.start.y);
      ctx.lineTo(shape.end.x, shape.end.y);
      ctx.stroke();
      if (shape.type === "arrow") drawArrow(ctx, shape.start, shape.end);
    }
  }
}

export function DrawingCanvas({ value, disabled = false, onChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef<NotebookDrawing>(value);
  const activeStrokeRef = useRef<NotebookStroke | null>(null);
  const startPointRef = useRef<NotebookPoint | null>(null);
  const [tool, setTool] = useState<"pen" | "eraser" | "rectangle" | "circle" | "line" | "arrow">("pen");
  const [color, setColor] = useState(colors[0]);
  const [width, setWidth] = useState(4);
  const [history, setHistory] = useState<NotebookDrawing[]>([]);
  const [future, setFuture] = useState<NotebookDrawing[]>([]);

  useEffect(() => {
    drawingRef.current = value;
    const canvas = canvasRef.current;
    if (canvas) renderDrawing(canvas, value);
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => renderDrawing(canvas, drawingRef.current);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>): NotebookPoint {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(value.width, ((event.clientX - rect.left) / rect.width) * value.width)),
      y: Math.max(0, Math.min(value.height, ((event.clientY - rect.top) / rect.height) * value.height)),
    };
  }

  function commit(next: NotebookDrawing) {
    setHistory((items) => [...items.slice(-39), drawingRef.current]);
    setFuture([]);
    drawingRef.current = next;
    onChange(next);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    startPointRef.current = point;

    if (tool === "pen") {
      activeStrokeRef.current = {
        id: crypto.randomUUID(),
        points: [point],
        color,
        width,
        tool: "pen",
      };
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    const point = pointFromEvent(event);

    if (activeStrokeRef.current) {
      activeStrokeRef.current.points.push(point);
      renderDrawing(canvasRef.current!, {
        ...drawingRef.current,
        strokes: [...drawingRef.current.strokes, activeStrokeRef.current],
      });
      return;
    }

    if (startPointRef.current && tool !== "pen" && tool !== "eraser") {
      renderDrawing(canvasRef.current!, {
        ...drawingRef.current,
        shapes: [
          ...drawingRef.current.shapes,
          {
            id: "preview",
            type: tool,
            start: startPointRef.current,
            end: point,
            color,
            width,
          },
        ],
      });
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    const point = pointFromEvent(event);

    if (activeStrokeRef.current) {
      const stroke = activeStrokeRef.current;
      activeStrokeRef.current = null;
      if (stroke.points.length > 1 || distance(stroke.points[0], point) > 1) {
        commit({
          ...drawingRef.current,
          strokes: [...drawingRef.current.strokes, stroke],
        });
      }
    } else if (startPointRef.current && tool !== "pen" && tool !== "eraser") {
      const start = startPointRef.current;
      startPointRef.current = null;
      if (distance(start, point) > 3) {
        const shape: NotebookShape = {
          id: crypto.randomUUID(),
          type: tool,
          start,
          end: point,
          color,
          width,
        };
        commit({
          ...drawingRef.current,
          shapes: [...drawingRef.current.shapes, shape],
        });
      }
    }

    startPointRef.current = null;
    activeStrokeRef.current = null;
    renderDrawing(canvasRef.current!, drawingRef.current);
  }

  function eraseAt(point: NotebookPoint) {
    const threshold = Math.max(width * 2, 18);
    const nextStrokes = drawingRef.current.strokes.filter((stroke) => {
      if (stroke.points.length < 2) return distance(stroke.points[0], point) > threshold;
      return !stroke.points.some((p, index) => {
        const next = stroke.points[index + 1];
        return distance(p, point) <= threshold || (next ? distanceToSegment(point, p, next) <= threshold : false);
      });
    });

    const nextShapes = drawingRef.current.shapes.filter((shape) => {
      const left = Math.min(shape.start.x, shape.end.x) - threshold;
      const right = Math.max(shape.start.x, shape.end.x) + threshold;
      const top = Math.min(shape.start.y, shape.end.y) - threshold;
      const bottom = Math.max(shape.start.y, shape.end.y) + threshold;
      return point.x < left || point.x > right || point.y < top || point.y > bottom;
    });

    if (nextStrokes.length !== drawingRef.current.strokes.length || nextShapes.length !== drawingRef.current.shapes.length) {
      commit({ ...drawingRef.current, strokes: nextStrokes, shapes: nextShapes });
    }
  }

  function handlePointerCancel() {
    activeStrokeRef.current = null;
    startPointRef.current = null;
    renderDrawing(canvasRef.current!, drawingRef.current);
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [...items, drawingRef.current]);
    setHistory((items) => items.slice(0, -1));
    drawingRef.current = previous;
    onChange(previous);
  }

  function redo() {
    const next = future.at(-1);
    if (!next) return;
    setHistory((items) => [...items, drawingRef.current]);
    setFuture((items) => items.slice(0, -1));
    drawingRef.current = next;
    onChange(next);
  }

  function clear() {
    if (!drawingRef.current.strokes.length && !drawingRef.current.shapes.length) return;
    commit(createEmptyDrawing());
  }

  return (
    <div className="notebook-drawing">
      <div className="notebook-drawing__toolbar">
        <button type="button" className={tool === "pen" ? "is-active" : ""} onClick={() => setTool("pen")} disabled={disabled} title="Pen"><Pencil size={15} /></button>
        <button type="button" className={tool === "eraser" ? "is-active" : ""} onClick={() => setTool("eraser")} disabled={disabled} title="Eraser"><Eraser size={15} /></button>
        <button type="button" className={tool === "rectangle" ? "is-active" : ""} onClick={() => setTool("rectangle")} disabled={disabled} title="Rectangle"><Square size={15} /></button>
        <button type="button" className={tool === "circle" ? "is-active" : ""} onClick={() => setTool("circle")} disabled={disabled} title="Ellipse"><Circle size={15} /></button>
        <button type="button" className={tool === "line" ? "is-active" : ""} onClick={() => setTool("line")} disabled={disabled} title="Line"><Minus size={15} /></button>
        <button type="button" className={tool === "arrow" ? "is-active" : ""} onClick={() => setTool("arrow")} disabled={disabled} title="Arrow"><MousePointer2 size={15} /></button>

        <label className="notebook-drawing__field">
          Color
          <select value={color} onChange={(event) => setColor(event.target.value)} disabled={disabled}>
            {colors.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="notebook-drawing__field">
          Size
          <input type="range" min="1" max="18" value={width} onChange={(event) => setWidth(Number(event.target.value))} disabled={disabled} />
          <span>{width}px</span>
        </label>

        <div className="notebook-drawing__spacer" />
        <button type="button" onClick={undo} disabled={disabled || history.length === 0} title="Undo drawing"><Undo2 size={15} /></button>
        <button type="button" onClick={redo} disabled={disabled || future.length === 0} title="Redo drawing"><Redo2 size={15} /></button>
        <button type="button" onClick={clear} disabled={disabled} title="Clear drawing">Clear</button>
      </div>

      <canvas
        ref={canvasRef}
        className="notebook-drawing__canvas"
        width={value.width}
        height={value.height}
        onPointerDown={handlePointerDown}
        onPointerMove={(event) => {
          if (tool === "eraser" && event.buttons === 1) eraseAt(pointFromEvent(event));
          else handlePointerMove(event);
        }}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={(event) => {
          if (event.buttons === 0) handlePointerCancel();
        }}
        aria-label="Notebook drawing canvas"
      />
    </div>
  );
}
