import { useEffect, useState } from "react";
import Icon from "../common/Icon";

type MetricStatus = "success" | "warning" | "error";

interface PerformanceMetrics {
  ttfb: number;
  tfp: number;
  timestamp: number;
}

const STATUS_COLOR_MAP: Record<MetricStatus, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

const PerformanceMonitor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => ({
    ttfb: 0,
    tfp: 0,
    timestamp: Date.now(),
  }));

  useEffect(() => {
    const measurePerformance = () => {
      // ---- Modern Navigation Timing API ----
      const navEntries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];

      if (!navEntries.length) return;

      const nav = navEntries[0];

      const ttfb = nav.responseStart - nav.requestStart;

      // ---- Paint Timing ----
      const paintEntries = performance.getEntriesByType("paint");

      const firstPaint = paintEntries.find(
        (entry) => entry.name === "first-paint"
      );

      const tfp = firstPaint ? firstPaint.startTime : 0;

      setMetrics({
        ttfb: Math.round(ttfb),
        tfp: Math.round(tfp),
        timestamp: Date.now(),
      });
    };

    measurePerformance();

    const interval = window.setInterval(measurePerformance, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const getMetricStatus = (
    value: number,
    thresholds: { good: number; moderate: number }
  ): MetricStatus => {
    if (value <= thresholds.good) return "success";
    if (value <= thresholds.moderate) return "warning";
    return "error";
  };

  const ttfbStatus = getMetricStatus(metrics.ttfb, {
    good: 100,
    moderate: 300,
  });

  const tfpStatus = getMetricStatus(metrics.tfp, {
    good: 1000,
    moderate: 2500,
  });

  return (
    <div className="fixed top-[76px] right-6 z-[1100]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md
          bg-card border border-border shadow-md
          transition-all duration-250 ease-smooth
          hover:shadow-lg hover:scale-[0.98]
          ${isExpanded ? "bg-muted" : ""}
        `}
        aria-label="Toggle performance monitor"
      >
        <Icon name="Activity" size={18} color="var(--color-accent)" />

        <span className="hidden sm:inline text-sm font-medium text-foreground">
          Performance
        </span>

        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={16}
          color="var(--color-muted-foreground)"
        />
      </button>

      {/* Panel */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-md shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground font-mono">
              Performance Metrics
            </h3>

            <span className="text-xs text-muted-foreground font-caption">
              Live
            </span>
          </div>

          <div className="space-y-3">
            {/* TTFB */}
            <MetricRow
              label="TTFB"
              value={`${metrics.ttfb}ms`}
              status={ttfbStatus}
            />

            {/* TFP */}
            <MetricRow
              label="TFP"
              value={`${metrics.tfp}ms`}
              status={tfpStatus}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Info" size={14} />

              <span className="font-caption">
                Metrics update every 5 seconds
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;

/* ---------------------------
   SUB COMPONENT
---------------------------- */

interface MetricRowProps {
  label: string;
  value: string;
  status: MetricStatus;
}

const MetricRow = ({ label, value, status }: MetricRowProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${STATUS_COLOR_MAP[status]}`} />

        <span className="text-sm text-foreground font-medium">{label}</span>
      </div>

      <span className="text-sm font-mono text-foreground">{value}</span>
    </div>
  );
};
