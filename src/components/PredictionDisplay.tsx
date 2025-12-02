import { Loader2 } from "lucide-react";

interface PredictionDisplayProps {
  prediction: string | null;
  isLoading: boolean;
  error: string | null;
}

export const PredictionDisplay = ({ prediction, isLoading, error }: PredictionDisplayProps) => {
  return (
    <div className="flex flex-col items-center gap-3 min-h-[140px] justify-center">
      <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
        Prediction
      </span>
      
      {isLoading ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="font-mono text-lg">Analyzing...</span>
        </div>
      ) : error ? (
        <div className="text-destructive font-mono text-sm text-center max-w-xs animate-fade-in">
          {error}
        </div>
      ) : prediction !== null ? (
        <div className="prediction-display animate-fade-in">
          {prediction}
        </div>
      ) : (
        <div className="text-muted-foreground font-mono text-2xl">
          —
        </div>
      )}
    </div>
  );
};
