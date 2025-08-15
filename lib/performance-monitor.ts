export interface PerformanceMetrics {
  avg: number;
  min: number;
  max: number;
  count: number;
  p95: number;
  p99: number;
}

export interface SlowOperationLog {
  operation: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  private static slowOperations: SlowOperationLog[] = [];
  private static readonly MAX_SLOW_OPERATIONS = 100;
  private static readonly SLOW_THRESHOLD = 1000; // 1 second

  /**
   * Start timing an operation
   */
  static startTimer(operation: string): () => void {
    const start = performance.now();
    return (metadata?: Record<string, any>) => {
      const duration = performance.now() - start;
      this.recordOperation(operation, duration, metadata);
    };
  }

  /**
   * Record operation duration
   */
  private static recordOperation(operation: string, duration: number, metadata?: Record<string, any>): void {
    // Store metrics
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);

    // Log slow operations
    if (duration > this.SLOW_THRESHOLD) {
      this.logSlowOperation(operation, duration, metadata);
    }
  }

  /**
   * Log slow operations for analysis
   */
  private static logSlowOperation(operation: string, duration: number, metadata?: Record<string, any>): void {
    const log: SlowOperationLog = {
      operation,
      duration,
      timestamp: new Date(),
      metadata,
    };

    this.slowOperations.push(log);

    // Keep only the latest slow operations
    if (this.slowOperations.length > this.MAX_SLOW_OPERATIONS) {
      this.slowOperations = this.slowOperations.slice(-this.MAX_SLOW_OPERATIONS);
    }

    // Console warning for immediate attention
    console.warn(`🐌 Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`, metadata);
  }

  /**
   * Get performance metrics for an operation
   */
  static getMetrics(operation: string): PerformanceMetrics | null {
    const times = this.metrics.get(operation);
    if (!times || times.length === 0) return null;

    const sorted = [...times].sort((a, b) => a - b);
    const count = times.length;
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = sum / count;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95 = sorted[Math.floor(count * 0.95)];
    const p99 = sorted[Math.floor(count * 0.99)];

    return { avg, min, max, count, p95, p99 };
  }

  /**
   * Get all performance metrics
   */
  static getAllMetrics(): Record<string, PerformanceMetrics> {
    const result: Record<string, PerformanceMetrics> = {};
    
    for (const [operation] of this.metrics) {
      const metrics = this.getMetrics(operation);
      if (metrics) {
        result[operation] = metrics;
      }
    }

    return result;
  }

  /**
   * Get slow operation logs
   */
  static getSlowOperations(): SlowOperationLog[] {
    return [...this.slowOperations];
  }

  /**
   * Clear metrics for an operation
   */
  static clearMetrics(operation: string): void {
    this.metrics.delete(operation);
  }

  /**
   * Clear all metrics
   */
  static clearAllMetrics(): void {
    this.metrics.clear();
    this.slowOperations.length = 0;
  }

  /**
   * Get performance summary
   */
  static getPerformanceSummary(): {
    totalOperations: number;
    slowOperations: number;
    averageResponseTime: number;
    operations: string[];
  } {
    let totalOperations = 0;
    let totalDuration = 0;
    const operations: string[] = [];

    for (const [operation, times] of this.metrics) {
      operations.push(operation);
      totalOperations += times.length;
      totalDuration += times.reduce((a, b) => a + b, 0);
    }

    return {
      totalOperations,
      slowOperations: this.slowOperations.length,
      averageResponseTime: totalOperations > 0 ? totalDuration / totalOperations : 0,
      operations,
    };
  }

  /**
   * Export metrics for external monitoring
   */
  static exportMetrics(): {
    timestamp: Date;
    summary: ReturnType<typeof this.getPerformanceSummary>;
    metrics: Record<string, PerformanceMetrics>;
    slowOperations: SlowOperationLog[];
  } {
    return {
      timestamp: new Date(),
      summary: this.getPerformanceSummary(),
      metrics: this.getAllMetrics(),
      slowOperations: this.getSlowOperations(),
    };
  }
}

// Database-specific performance monitoring
export class DatabasePerformanceMonitor {
  private static queryMetrics: Map<string, PerformanceMetrics> = new Map();
  private static connectionMetrics: Map<string, number> = new Map();

  /**
   * Monitor database query performance
   */
  static monitorQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const endTimer = PerformanceMonitor.startTimer(`db_query:${queryName}`);
    
    return queryFn()
      .then((result) => {
        endTimer(metadata);
        return result;
      })
      .catch((error) => {
        endTimer({ ...metadata, error: error.message });
        throw error;
      });
  }

  /**
   * Monitor database connection performance
   */
  static monitorConnection<T>(
    operation: string,
    connectionFn: () => Promise<T>
  ): Promise<T> {
    const endTimer = PerformanceMonitor.startTimer(`db_connection:${operation}`);
    
    return connectionFn()
      .then((result) => {
        endTimer();
        return result;
      })
      .catch((error) => {
        endTimer({ error: error.message });
        throw error;
      });
  }

  /**
   * Get database performance metrics
   */
  static getDatabaseMetrics(): {
    queries: Record<string, PerformanceMetrics>;
    connections: Record<string, number>;
  } {
    const queries: Record<string, PerformanceMetrics> = {};
    const connections: Record<string, number> = {};

    // Get query metrics
    for (const [operation] of PerformanceMonitor.getAllMetrics()) {
      if (operation.startsWith('db_query:')) {
        const queryName = operation.replace('db_query:', '');
        const metrics = PerformanceMonitor.getMetrics(operation);
        if (metrics) {
          queries[queryName] = metrics;
        }
      }
    }

    // Get connection metrics
    for (const [operation, count] of this.connectionMetrics) {
      connections[operation] = count;
    }

    return { queries, connections };
  }
}

// HTTP request performance monitoring
export class HTTPPerformanceMonitor {
  /**
   * Monitor HTTP request performance
   */
  static monitorRequest<T>(
    url: string,
    method: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const operation = `http_${method.toLowerCase()}:${url}`;
    const endTimer = PerformanceMonitor.startTimer(operation);
    
    return requestFn()
      .then((result) => {
        endTimer();
        return result;
      })
      .catch((error) => {
        endTimer({ error: error.message });
        throw error;
      });
  }

  /**
   * Get HTTP performance metrics
   */
  static getHTTPMetrics(): Record<string, PerformanceMetrics> {
    const httpMetrics: Record<string, PerformanceMetrics> = {};

    for (const [operation, metrics] of Object.entries(PerformanceMonitor.getAllMetrics())) {
      if (operation.startsWith('http_')) {
        httpMetrics[operation] = metrics;
      }
    }

    return httpMetrics;
  }
}
