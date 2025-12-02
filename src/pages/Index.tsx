import { useRef, useState, useCallback } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { PredictionDisplay } from "@/components/PredictionDisplay";
import { Button } from "@/components/ui/button";
import { Eraser, Send, Pencil } from "lucide-react";
import { toast } from "sonner";

const API_ENDPOINT = "https://your-backend-endpoint.com/predict";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
    setError(null);
    toast.success("Canvas cleared");
  }, []);

  const submitDrawing = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert canvas to base64
      const base64Image = canvas.toDataURL("image/png");

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction?.toString() ?? data.digit?.toString() ?? "?");
      toast.success("Prediction received!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get prediction";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Pencil className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Digit Recognizer
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Draw a digit (0-9) and let the AI predict it
          </p>
        </div>

        {/* Canvas Area */}
        <div className="flex justify-center">
          <DrawingCanvas canvasRef={canvasRef} onClear={clearCanvas} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="canvas"
            size="lg"
            onClick={clearCanvas}
            disabled={isLoading}
          >
            <Eraser className="w-5 h-5" />
            Clear
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={submitDrawing}
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
            Submit
          </Button>
        </div>

        {/* Prediction Result */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <PredictionDisplay
            prediction={prediction}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground font-mono">
          API: {API_ENDPOINT.replace("https://", "")}
        </p>
      </div>
    </div>
  );
};

export default Index;
