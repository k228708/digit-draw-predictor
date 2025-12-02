import { useRef, useEffect, useState, useCallback } from "react";

interface DrawingCanvasProps {
  onClear: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const DrawingCanvas = ({ onClear, canvasRef }: DrawingCanvasProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 280;
    canvas.height = 280;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set up drawing style
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
    context.lineWidth = 15;
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;
  }, [canvasRef]);

  const getCoordinates = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in event) {
      const touch = event.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
    setIsDrawing(true);
  }, [getCoordinates]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing || !contextRef.current) return;

    const { x, y } = getCoordinates(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  }, [isDrawing, getCoordinates]);

  const stopDrawing = useCallback(() => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  }, []);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="w-[280px] h-[280px] cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};
