import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const { readFile, readdir, stat } = fs;

interface BundleStats {
  file: string;
  size: number;
  gzipSize?: number;
  type: 'js' | 'css' | 'map' | 'other';
}

interface BundleAnalysis {
  totalSize: number;
  totalGzipSize: number;
  files: BundleStats[];
  breakdown: {
    javascript: number;
    css: number;
    sourceMaps: number;
    other: number;
  };
  recommendations: string[];
}

export async function GET() {
  try {
    const buildPath = join(process.cwd(), '.next');
    const staticPath = join(buildPath, 'static');
    
    // Check if build exists
    try {
      await stat(buildPath);
    } catch {
      return NextResponse.json({ 
        error: 'No build found. Run `npm run build` first.' 
      }, { status: 404 });
    }

    const bundleStats = await analyzeBundles(staticPath);
    const analysis = generateAnalysis(bundleStats);

    return NextResponse.json(analysis);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error analyzing bundles:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze bundles' 
    }, { status: 500 });
  }
}

async function analyzeBundles(staticPath: string): Promise<BundleStats[]> {
  const stats: BundleStats[] = [];
  
  try {
    const entries = await readdir(staticPath);
    
    for (const entry of entries) {
      const entryPath = join(staticPath, entry);
      const entryStat = await stat(entryPath);
      
      if (entryStat.isDirectory()) {
        // Recursively analyze subdirectories
        const subStats = await analyzeBundles(entryPath);
        stats.push(...subStats);
      } else {
        // Analyze individual files
        const fileStats = await getFileStats(entryPath, entry);
        if (fileStats) {
          stats.push(fileStats);
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be accessible
    // eslint-disable-next-line no-console
    console.debug('Could not analyze directory:', staticPath);
  }
  
  return stats;
}

async function getFileStats(filePath: string, fileName: string): Promise<BundleStats | null> {
  try {
    const fileStats = await stat(filePath);
    const size = fileStats.size;
    
    // Determine file type
    let type: 'js' | 'css' | 'map' | 'other' = 'other';
    if (fileName.endsWith('.js')) type = 'js';
    else if (fileName.endsWith('.css')) type = 'css';
    else if (fileName.endsWith('.map')) type = 'map';
    
    // Try to estimate gzip size (rough approximation)
    let gzipSize: number | undefined;
    if (type === 'js' || type === 'css') {
      try {
        const content = await readFile(filePath, 'utf8');
        // Rough estimation: gzip typically reduces text files by 60-80%
        gzipSize = Math.round(size * 0.3);
      } catch {
        // Could not read file content
      }
    }
    
    return {
      file: fileName,
      size,
      gzipSize,
      type,
    };
  } catch {
    return null;
  }
}

function generateAnalysis(bundleStats: BundleStats[]): BundleAnalysis {
  const totalSize = bundleStats.reduce((sum, stat) => sum + stat.size, 0);
  const totalGzipSize = bundleStats.reduce((sum, stat) => sum + (stat.gzipSize || stat.size), 0);
  
  const breakdown = {
    javascript: bundleStats.filter(s => s.type === 'js').reduce((sum, s) => sum + s.size, 0),
    css: bundleStats.filter(s => s.type === 'css').reduce((sum, s) => sum + s.size, 0),
    sourceMaps: bundleStats.filter(s => s.type === 'map').reduce((sum, s) => sum + s.size, 0),
    other: bundleStats.filter(s => s.type === 'other').reduce((sum, s) => sum + s.size, 0),
  };
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  // Check for large JavaScript bundles
  const largeJSFiles = bundleStats
    .filter(s => s.type === 'js' && s.size > 500 * 1024) // > 500KB
    .sort((a, b) => b.size - a.size);
    
  if (largeJSFiles.length > 0) {
    recommendations.push(
      `Large JavaScript files detected: ${largeJSFiles.slice(0, 3).map(f => f.file).join(', ')}. Consider code splitting.`
    );
  }
  
  // Check total bundle size
  if (totalSize > 2 * 1024 * 1024) { // > 2MB
    recommendations.push('Total bundle size is large. Consider lazy loading and code splitting.');
  }
  
  // Check for source maps in production
  const sourceMaps = bundleStats.filter(s => s.type === 'map');
  if (sourceMaps.length > 0) {
    recommendations.push('Source maps detected in build. Consider excluding them from production.');
  }
  
  // Check CSS size
  if (breakdown.css > 200 * 1024) { // > 200KB
    recommendations.push('CSS bundle is large. Consider critical CSS extraction and lazy loading.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Bundle size looks good! No immediate optimization needed.');
  }
  
  return {
    totalSize,
    totalGzipSize,
    files: bundleStats.sort((a, b) => b.size - a.size), // Sort by size descending
    breakdown,
    recommendations,
  };
}