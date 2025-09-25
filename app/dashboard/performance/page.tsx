"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CoreWebVitalsStats {
  lcp: { p50: number; p75: number; p90: number; p95: number };
  cls: { p50: number; p75: number; p90: number; p95: number };
  fcp: { p50: number; p75: number; p90: number; p95: number };
  ttfb: { p50: number; p75: number; p90: number; p95: number };
}

interface PerformanceData {
  totalSessions: number;
  totalMetrics: number;
  timeframe: string;
  aggregatedStats: {
    sampleSize: number;
    coreWebVitals: CoreWebVitalsStats;
    loadTimes: { p50: number; p75: number; p90: number; p95: number };
    deviceInfo: {
      connectionTypes: string[];
      avgMemory: number;
      avgConcurrency: number;
    };
  } | null;
}

interface BundleAnalysis {
  totalSize: number;
  totalGzipSize: number;
  files: Array<{
    file: string;
    size: number;
    gzipSize?: number;
    type: string;
  }>;
  breakdown: {
    javascript: number;
    css: number;
    sourceMaps: number;
    other: number;
  };
  recommendations: string[];
}

export default function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState(1); // hours

  useEffect(() => {
    const loadData = async () => {
      await fetchPerformanceData();
      await fetchBundleAnalysis();
    };
    loadData();
  }, [timeframe]); // fetchPerformanceData and fetchBundleAnalysis are stable

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`/api/performance/metrics?hours=${timeframe}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch performance data');
      }
      
      setPerformanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const fetchBundleAnalysis = async () => {
    try {
      const response = await fetch('/api/performance/bundle-analysis');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bundle analysis');
      }
      
      setBundleAnalysis(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Bundle analysis failed:', err);
      // Don't set error for bundle analysis as it requires build files
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getVitalStatus = (vital: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (vital) {
      case 'lcp':
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
      case 'fcp':
        if (value <= 1800) return 'good';
        if (value <= 3000) return 'needs-improvement';
        return 'poor';
      case 'cls':
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
      case 'ttfb':
        if (value <= 800) return 'good';
        if (value <= 1800) return 'needs-improvement';
        return 'poor';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: 'good' | 'needs-improvement' | 'poor'): string => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(Number(e.target.value))}
          className="px-3 py-2 border rounded-md"
        >
          <option value={1}>Last 1 hour</option>
          <option value={6}>Last 6 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={168}>Last 7 days</option>
        </select>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals */}
      {performanceData?.aggregatedStats && (
        <>
          <h2 className="text-2xl font-semibold">Core Web Vitals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(performanceData.aggregatedStats.coreWebVitals).map(([vital, stats]) => (
              <Card key={vital}>
                <CardHeader>
                  <CardTitle className="text-lg uppercase">{vital}</CardTitle>
                  <CardDescription>
                    {vital === 'lcp' && 'Largest Contentful Paint'}
                    {vital === 'fcp' && 'First Contentful Paint'}
                    {vital === 'cls' && 'Cumulative Layout Shift'}
                    {vital === 'ttfb' && 'Time to First Byte'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>P50:</span>
                      <span className={getStatusColor(getVitalStatus(vital, stats.p50))}>
                        {vital === 'cls' ? stats.p50.toFixed(3) : formatTime(stats.p50)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>P75:</span>
                      <span className={getStatusColor(getVitalStatus(vital, stats.p75))}>
                        {vital === 'cls' ? stats.p75.toFixed(3) : formatTime(stats.p75)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>P95:</span>
                      <span className={getStatusColor(getVitalStatus(vital, stats.p95))}>
                        {vital === 'cls' ? stats.p95.toFixed(3) : formatTime(stats.p95)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Session Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performanceData.totalSessions}</div>
                <p className="text-gray-600">in {performanceData.timeframe}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performanceData.totalMetrics}</div>
                <p className="text-gray-600">metrics collected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sample Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performanceData.aggregatedStats.sampleSize}</div>
                <p className="text-gray-600">valid measurements</p>
              </CardContent>
            </Card>
          </div>

          {/* Device Information */}
          <Card>
            <CardHeader>
              <CardTitle>Device & Network Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Connection Types</h4>
                  <ul className="space-y-1">
                    {performanceData.aggregatedStats.deviceInfo.connectionTypes.map((type) => (
                      <li key={type} className="text-sm">{type}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Average Device Memory</h4>
                  <p className="text-2xl font-bold">
                    {performanceData.aggregatedStats.deviceInfo.avgMemory.toFixed(1)} GB
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Average CPU Cores</h4>
                  <p className="text-2xl font-bold">
                    {performanceData.aggregatedStats.deviceInfo.avgConcurrency.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Bundle Analysis */}
      {bundleAnalysis && (
        <>
          <h2 className="text-2xl font-semibold">Bundle Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bundle Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Size:</span>
                    <span className="font-bold">{formatSize(bundleAnalysis.totalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compressed:</span>
                    <span className="font-bold">{formatSize(bundleAnalysis.totalGzipSize)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Compression:</span>
                    <span>
                      {((1 - bundleAnalysis.totalGzipSize / bundleAnalysis.totalSize) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breakdown by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>JavaScript:</span>
                    <span>{formatSize(bundleAnalysis.breakdown.javascript)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CSS:</span>
                    <span>{formatSize(bundleAnalysis.breakdown.css)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Source Maps:</span>
                    <span>{formatSize(bundleAnalysis.breakdown.sourceMaps)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other:</span>
                    <span>{formatSize(bundleAnalysis.breakdown.other)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {bundleAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Largest Files */}
          <Card>
            <CardHeader>
              <CardTitle>Largest Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bundleAnalysis.files.slice(0, 10).map((file, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="truncate flex-1 mr-2">{file.file}</span>
                    <div className="flex space-x-2">
                      <span className="text-gray-600">{file.type}</span>
                      <span className="font-mono">{formatSize(file.size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!performanceData?.aggregatedStats && !bundleAnalysis && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">
              No performance data available yet. Visit some pages to start collecting metrics.
              {!bundleAnalysis && " Run 'npm run build' to enable bundle analysis."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}