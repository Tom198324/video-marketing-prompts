import { Award, Medal, Trophy } from "lucide-react";

interface QualityBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function QualityBadge({ score, size = "md", showLabel = true }: QualityBadgeProps) {
  if (score === null || score === undefined) {
    return null;
  }

  const getBadgeConfig = (score: number) => {
    if (score >= 9) {
      return {
        label: "Gold",
        icon: Trophy,
        bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
        textColor: "text-yellow-900",
        borderColor: "border-yellow-500",
        description: "Exceptional Quality"
      };
    } else if (score >= 7) {
      return {
        label: "Silver",
        icon: Medal,
        bgColor: "bg-gradient-to-br from-gray-300 to-gray-500",
        textColor: "text-gray-900",
        borderColor: "border-gray-400",
        description: "High Quality"
      };
    } else if (score >= 5) {
      return {
        label: "Bronze",
        icon: Award,
        bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
        textColor: "text-orange-900",
        borderColor: "border-orange-500",
        description: "Good Quality"
      };
    } else {
      return null;
    }
  };

  const config = getBadgeConfig(score);

  if (!config) {
    return null; // Don't show badge for scores below 5
  }

  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: "px-2 py-1 text-xs gap-1",
      icon: "w-3 h-3",
      badge: "text-[10px]"
    },
    md: {
      container: "px-3 py-1.5 text-sm gap-1.5",
      icon: "w-4 h-4",
      badge: "text-xs"
    },
    lg: {
      container: "px-4 py-2 text-base gap-2",
      icon: "w-5 h-5",
      badge: "text-sm"
    }
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center ${classes.container} ${config.bgColor} ${config.textColor} rounded-full font-semibold border-2 ${config.borderColor} shadow-md`}
      title={`${config.description} - Score: ${score}/10`}
    >
      <Icon className={classes.icon} />
      {showLabel && (
        <>
          <span>{config.label}</span>
          <span className={`${classes.badge} opacity-80`}>({score}/10)</span>
        </>
      )}
    </div>
  );
}

// Badge legend component for explaining the system
export function QualityBadgeLegend() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-sm text-card-foreground">Quality Badge System</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <QualityBadge score={10} size="sm" showLabel={false} />
          <div>
            <span className="font-medium">Gold (9-10/10)</span>
            <p className="text-muted-foreground text-xs">Exceptional coherence and technical quality</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <QualityBadge score={8} size="sm" showLabel={false} />
          <div>
            <span className="font-medium">Silver (7-8/10)</span>
            <p className="text-muted-foreground text-xs">High quality with minor improvements possible</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <QualityBadge score={6} size="sm" showLabel={false} />
          <div>
            <span className="font-medium">Bronze (5-6/10)</span>
            <p className="text-muted-foreground text-xs">Good foundation, optimization recommended</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Scores below 5/10 don't display badges and should be optimized using the Optimizer tool.
      </p>
    </div>
  );
}
