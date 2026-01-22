interface MetricValue {
  count: number;
  lastUpdated: string;
}

class Metrics {
  private metrics: Map<string, MetricValue> = new Map();
  private readonly MAX_METRICS = 100;

  increment(key: string, value: number = 1) {
    const existing = this.metrics.get(key);
    if (existing) {
      this.metrics.set(key, {
        count: existing.count + value,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      if (this.metrics.size >= this.MAX_METRICS) {
        const firstKey = this.metrics.keys().next().value;
        if (firstKey) {
          this.metrics.delete(firstKey);
        }
      }
      this.metrics.set(key, {
        count: value,
        lastUpdated: new Date().toISOString(),
      });
    }
  }

  get(key: string): number {
    return this.metrics.get(key)?.count || 0;
  }

  getAll(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value.count;
    });
    return result;
  }

  reset(key?: string) {
    if (key) {
      this.metrics.delete(key);
    } else {
      this.metrics.clear();
    }
  }
}

export const metrics = new Metrics();
