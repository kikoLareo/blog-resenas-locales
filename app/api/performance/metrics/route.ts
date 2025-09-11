import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  
  // Enhanced RUM data
  sessionId?: string;
  timestamp?: number;
  url?: string;
  userAgent?: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  
  // Navigation timing
  domContentLoaded?: number;
  loadComplete?: number;
  firstByte?: number;
  domInteractive?: number;
  resourceCount?: number;
}

// Simple in-memory store (in production, use Redis or database)
const performanceStore = new Map<string, PerformanceMetrics[]>();

export async function POST(request: NextRequest) {
  try {
    const metrics: PerformanceMetrics = await request.json();
    
    // Validate required fields
    if (!metrics.sessionId || !metrics.timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limiting: max 100 metrics per session
    const sessionMetrics = performanceStore.get(metrics.sessionId) || [];
    if (sessionMetrics.length >= 100) {
      return NextResponse.json({ error: 'Session limit exceeded' }, { status: 429 });
    }

    // Store the metrics
    sessionMetrics.push({
      ...metrics,
      timestamp: Date.now(), // Use server timestamp for consistency
    });
    performanceStore.set(metrics.sessionId, sessionMetrics);

    // Clean up old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [sessionId, sessionData] of performanceStore.entries()) {
      const lastMetric = sessionData[sessionData.length - 1];
      if (lastMetric && lastMetric.timestamp && lastMetric.timestamp < oneHourAgo) {
        performanceStore.delete(sessionId);
      }
    }

    return NextResponse.json({ success: true, sessionId: metrics.sessionId });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error storing performance metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const hours = parseInt(url.searchParams.get('hours') || '1');
    
    if (sessionId) {
      // Get metrics for a specific session
      const sessionMetrics = performanceStore.get(sessionId) || [];
      return NextResponse.json({ metrics: sessionMetrics });
    } else {
      // Get aggregated metrics for the last N hours
      const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
      const allMetrics: PerformanceMetrics[] = [];
      
      for (const sessionMetrics of performanceStore.values()) {
        const recentMetrics = sessionMetrics.filter(
          metric => metric.timestamp && metric.timestamp >= cutoffTime
        );
        allMetrics.push(...recentMetrics);
      }
      
      // Calculate aggregated statistics
      const stats = calculateAggregatedStats(allMetrics);
      
      return NextResponse.json({
        totalSessions: performanceStore.size,
        totalMetrics: allMetrics.length,
        timeframe: `${hours} hour(s)`,
        aggregatedStats: stats,
        rawMetrics: allMetrics.slice(0, 100), // Return first 100 for security
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving performance metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateAggregatedStats(metrics: PerformanceMetrics[]) {
  if (metrics.length === 0) {
    return null;
  }

  const validMetrics = metrics.filter(m => 
    m.lcp && m.cls !== undefined && m.fcp && m.ttfb && m.loadComplete
  );

  if (validMetrics.length === 0) {
    return null;
  }

  // Calculate percentiles
  const calculatePercentile = (values: number[], percentile: number): number => {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  };

  const lcpValues = validMetrics.map(m => m.lcp!);
  const clsValues = validMetrics.map(m => m.cls!);
  const fcpValues = validMetrics.map(m => m.fcp!);
  const ttfbValues = validMetrics.map(m => m.ttfb!);
  const loadCompleteValues = validMetrics.map(m => m.loadComplete!);

  return {
    sampleSize: validMetrics.length,
    coreWebVitals: {
      lcp: {
        p50: calculatePercentile(lcpValues, 50),
        p75: calculatePercentile(lcpValues, 75),
        p90: calculatePercentile(lcpValues, 90),
        p95: calculatePercentile(lcpValues, 95),
      },
      cls: {
        p50: calculatePercentile(clsValues, 50),
        p75: calculatePercentile(clsValues, 75),
        p90: calculatePercentile(clsValues, 90),
        p95: calculatePercentile(clsValues, 95),
      },
      fcp: {
        p50: calculatePercentile(fcpValues, 50),
        p75: calculatePercentile(fcpValues, 75),
        p90: calculatePercentile(fcpValues, 90),
        p95: calculatePercentile(fcpValues, 95),
      },
      ttfb: {
        p50: calculatePercentile(ttfbValues, 50),
        p75: calculatePercentile(ttfbValues, 75),
        p90: calculatePercentile(ttfbValues, 90),
        p95: calculatePercentile(ttfbValues, 95),
      },
    },
    loadTimes: {
      p50: calculatePercentile(loadCompleteValues, 50),
      p75: calculatePercentile(loadCompleteValues, 75),
      p90: calculatePercentile(loadCompleteValues, 90),
      p95: calculatePercentile(loadCompleteValues, 95),
    },
    deviceInfo: {
      connectionTypes: [...new Set(validMetrics.map(m => m.connectionType).filter(Boolean))],
      avgMemory: validMetrics
        .filter(m => m.deviceMemory)
        .reduce((acc, m) => acc + m.deviceMemory!, 0) / validMetrics.filter(m => m.deviceMemory).length || 0,
      avgConcurrency: validMetrics
        .filter(m => m.hardwareConcurrency)
        .reduce((acc, m) => acc + m.hardwareConcurrency!, 0) / validMetrics.filter(m => m.hardwareConcurrency).length || 0,
    },
  };
}