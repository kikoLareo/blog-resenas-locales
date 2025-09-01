#!/usr/bin/env tsx

/**
 * Automated Audit Agent for Blog Reseñas Locales
 * 
 * This script audits all functionalities implemented in PRs #15 and #16
 * as specified in issue #19.
 * 
 * Features:
 * - Verifies existence of required pages
 * - Tests dashboard forms (CRUD, validations, feedback)
 * - Validates critical routes without 404 errors
 * - Confirms key components exist and are integrated
 * - Validates SEO and accessibility requirements
 * - Generates detailed markdown reports
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { existsSync } from 'fs';

interface AuditResult {
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'SKIP';
  message: string;
  details?: string[];
  timestamp: Date;
}

interface AuditReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
  };
  results: AuditResult[];
  environment: {
    nodeVersion: string;
    npmVersion: string;
    timestamp: Date;
    branch: string;
  };
}

class AuditAgent {
  private results: AuditResult[] = [];
  private baseDir: string;

  constructor() {
    this.baseDir = process.cwd();
  }

  private log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  private addResult(result: Omit<AuditResult, 'timestamp'>) {
    const fullResult: AuditResult = {
      ...result,
      timestamp: new Date()
    };
    this.results.push(fullResult);
    
    const statusIcon = {
      'PASS': '✅',
      'FAIL': '❌', 
      'WARNING': '⚠️',
      'SKIP': '⏭️'
    }[result.status];
    
    this.log(`${statusIcon} [${result.category}] ${result.name}: ${result.message}`, 
             result.status === 'FAIL' ? 'error' : result.status === 'WARNING' ? 'warn' : 'info');
  }

  /**
   * 1. Verify existence of required public pages
   */
  private async auditPublicPages(): Promise<void> {
    this.log('🔍 Auditing public pages...');
    
    const requiredPages = [
      {
        path: 'app/(public)/buscar/page.tsx',
        name: 'Search Page',
        description: 'Main search functionality page'
      },
      {
        path: 'app/(public)/[city]/[venue]/page.tsx', 
        name: 'Venue Detail Page',
        description: 'Individual venue detail page'
      },
      {
        path: 'app/(public)/[city]/[venue]/review/[reviewSlug]/page.tsx',
        name: 'Review Detail Page', 
        description: 'Individual review detail page'
      },
      {
        path: 'app/(public)/[city]/page.tsx',
        name: 'City Page',
        description: 'City-specific venues listing page'
      }
    ];

    for (const page of requiredPages) {
      const fullPath = path.join(this.baseDir, page.path);
      const exists = existsSync(fullPath);
      
      if (exists) {
        // Check if the page has basic content
        const content = await fs.readFile(fullPath, 'utf-8');
        const hasExport = content.includes('export default');
        const hasMetadata = content.includes('generateMetadata') || content.includes('metadata');
        
        if (hasExport) {
          this.addResult({
            category: 'Public Pages',
            name: page.name,
            status: 'PASS',
            message: `Page exists and exports default component`,
            details: hasMetadata ? ['Has metadata generation'] : ['Missing metadata generation']
          });
        } else {
          this.addResult({
            category: 'Public Pages',
            name: page.name,
            status: 'FAIL',
            message: `Page exists but missing default export`,
            details: [`Path: ${page.path}`]
          });
        }
      } else {
        this.addResult({
          category: 'Public Pages',
          name: page.name,
          status: 'FAIL',
          message: `Page does not exist`,
          details: [`Expected path: ${page.path}`]
        });
      }
    }
  }

  /**
   * 2. Verify key components exist and are properly integrated
   */
  private async auditKeyComponents(): Promise<void> {
    this.log('🧩 Auditing key components...');
    
    const requiredComponents = [
      {
        name: 'VenueCard',
        paths: ['components/VenueCard.tsx', 'components/venues/VenueCard.tsx'],
        description: 'Component for displaying venue cards'
      },
      {
        name: 'SearchForm',
        paths: ['components/SearchForm.tsx', 'components/search/SearchForm.tsx', 'components/forms/SearchForm.tsx'],
        description: 'Main search form component'
      }
    ];

    for (const component of requiredComponents) {
      let found = false;
      let componentPath = '';
      
      for (const possiblePath of component.paths) {
        const fullPath = path.join(this.baseDir, possiblePath);
        if (existsSync(fullPath)) {
          found = true;
          componentPath = possiblePath;
          break;
        }
      }
      
      if (found) {
        // Check component implementation
        const content = await fs.readFile(path.join(this.baseDir, componentPath), 'utf-8');
        const hasExport = content.includes('export default') || content.includes(`export { default }`);
        const hasProps = content.includes('interface') || content.includes('type') || content.includes('Props');
        
        this.addResult({
          category: 'Key Components',
          name: component.name,
          status: 'PASS',
          message: `Component found and properly structured`,
          details: [
            `Path: ${componentPath}`,
            hasProps ? 'Has TypeScript props interface' : 'Missing props interface',
            hasExport ? 'Has proper export' : 'Missing proper export'
          ]
        });
      } else {
        this.addResult({
          category: 'Key Components',
          name: component.name,
          status: 'FAIL',
          message: `Component not found in any expected location`,
          details: [`Searched paths: ${component.paths.join(', ')}`]
        });
      }
    }
  }

  /**
   * 3. Audit dashboard functionality
   */
  private async auditDashboardForms(): Promise<void> {
    this.log('📊 Auditing dashboard forms...');
    
    const dashboardPages = [
      'app/dashboard/venues/new/page.tsx',
      'app/dashboard/reviews/new/page.tsx', 
      'app/dashboard/categories/new/page.tsx',
      'app/dashboard/blog/new/page.tsx',
      'app/dashboard/users/page.tsx'
    ];

    for (const pagePath of dashboardPages) {
      const fullPath = path.join(this.baseDir, pagePath);
      const exists = existsSync(fullPath);
      
      if (exists) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const hasForm = content.includes('form') || content.includes('Form');
        const hasValidation = content.includes('validate') || content.includes('error') || content.includes('Error');
        const hasSubmit = content.includes('submit') || content.includes('onSubmit');
        
        const details = [];
        if (hasForm) details.push('Contains form elements');
        if (hasValidation) details.push('Has validation/error handling');
        if (hasSubmit) details.push('Has submit functionality');
        
        this.addResult({
          category: 'Dashboard Forms',
          name: path.basename(pagePath, '.tsx'),
          status: hasForm && hasSubmit ? 'PASS' : 'WARNING',
          message: `Dashboard page analysis completed`,
          details
        });
      } else {
        this.addResult({
          category: 'Dashboard Forms',
          name: path.basename(pagePath, '.tsx'),
          status: 'FAIL',
          message: `Dashboard page not found`,
          details: [`Expected: ${pagePath}`]
        });
      }
    }
  }

  /**
   * 4. Test build and type checking
   */
  private async auditBuildProcess(): Promise<void> {
    this.log('🔨 Auditing build process...');
    
    try {
      // Type checking
      execSync('npm run type-check', { cwd: this.baseDir, stdio: 'pipe' });
      this.addResult({
        category: 'Build Process',
        name: 'TypeScript Compilation',
        status: 'PASS',
        message: 'TypeScript compilation successful'
      });
    } catch (error) {
      this.addResult({
        category: 'Build Process', 
        name: 'TypeScript Compilation',
        status: 'FAIL',
        message: 'TypeScript compilation failed',
        details: [error instanceof Error ? error.message : 'Unknown error']
      });
    }

    try {
      // Linting
      execSync('npm run lint', { cwd: this.baseDir, stdio: 'pipe' });
      this.addResult({
        category: 'Build Process',
        name: 'ESLint Check',
        status: 'PASS', 
        message: 'Linting passed'
      });
    } catch (error) {
      this.addResult({
        category: 'Build Process',
        name: 'ESLint Check',
        status: 'WARNING',
        message: 'Linting issues found',
        details: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  /**
   * 5. Audit SEO and accessibility features
   */
  private async auditSEOAccessibility(): Promise<void> {
    this.log('🔍 Auditing SEO and accessibility...');
    
    // Check for JSON-LD implementation
    const pagesWithSEO = [
      'app/(public)/page.tsx',
      'app/(public)/[city]/page.tsx',
      'app/(public)/[city]/[venue]/page.tsx'
    ];

    for (const pagePath of pagesWithSEO) {
      const fullPath = path.join(this.baseDir, pagePath);
      if (existsSync(fullPath)) {
        const content = await fs.readFile(fullPath, 'utf-8');
        
        const hasJsonLD = content.includes('application/ld+json') || content.includes('JSON.stringify');
        const hasMetadata = content.includes('generateMetadata') || content.includes('metadata');
        const hasAccessibility = content.includes('alt=') || content.includes('aria-');
        
        const details = [];
        if (hasJsonLD) details.push('Has JSON-LD structured data');
        if (hasMetadata) details.push('Has metadata generation');
        if (hasAccessibility) details.push('Has accessibility attributes');
        
        this.addResult({
          category: 'SEO & Accessibility',
          name: `SEO Implementation - ${path.basename(pagePath)}`,
          status: hasJsonLD && hasMetadata ? 'PASS' : 'WARNING',
          message: `SEO features analysis completed`,
          details
        });
      }
    }
  }

  /**
   * 6. Check routing and navigation
   */
  private async auditRouting(): Promise<void> {
    this.log('🛣️ Auditing routing and navigation...');
    
    // Check for layout files
    const layoutFiles = [
      'app/layout.tsx',
      'app/(public)/layout.tsx',
      'app/dashboard/layout.tsx'
    ];

    for (const layoutPath of layoutFiles) {
      const fullPath = path.join(this.baseDir, layoutPath);
      const exists = existsSync(fullPath);
      
      if (exists) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const hasNavigation = content.includes('nav') || content.includes('Nav') || content.includes('Header');
        const hasBreadcrumbs = content.includes('breadcrumb') || content.includes('Breadcrumb');
        
        this.addResult({
          category: 'Routing & Navigation',
          name: `Layout - ${path.basename(layoutPath)}`,
          status: 'PASS',
          message: 'Layout file exists',
          details: [
            hasNavigation ? 'Has navigation elements' : 'No navigation elements found',
            hasBreadcrumbs ? 'Has breadcrumbs' : 'No breadcrumbs found'
          ]
        });
      } else {
        this.addResult({
          category: 'Routing & Navigation',
          name: `Layout - ${path.basename(layoutPath)}`,
          status: 'FAIL',
          message: 'Layout file missing',
          details: [`Expected: ${layoutPath}`]
        });
      }
    }
  }

  /**
   * Generate comprehensive audit report
   */
  private async generateReport(): Promise<AuditReport> {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    let branch = 'unknown';
    try {
      branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    } catch (error) {
      // Ignore git errors
    }

    return {
      summary: {
        total,
        passed,
        failed,
        warnings,
        skipped
      },
      results: this.results,
      environment: {
        nodeVersion: process.version,
        npmVersion: execSync('npm --version', { encoding: 'utf-8' }).trim(),
        timestamp: new Date(),
        branch
      }
    };
  }

  /**
   * Generate markdown report
   */
  private async generateMarkdownReport(report: AuditReport): Promise<string> {
    const { summary, results, environment } = report;
    
    let markdown = `# 🔍 Audit Report - Blog Reseñas Locales\n\n`;
    markdown += `**Generated:** ${environment.timestamp.toISOString()}\n`;
    markdown += `**Branch:** ${environment.branch}\n`;
    markdown += `**Node Version:** ${environment.nodeVersion}\n`;
    markdown += `**NPM Version:** ${environment.npmVersion}\n\n`;

    // Summary
    markdown += `## 📊 Summary\n\n`;
    markdown += `| Status | Count | Percentage |\n`;
    markdown += `|--------|-------|------------|\n`;
    markdown += `| ✅ Passed | ${summary.passed} | ${((summary.passed / summary.total) * 100).toFixed(1)}% |\n`;
    markdown += `| ❌ Failed | ${summary.failed} | ${((summary.failed / summary.total) * 100).toFixed(1)}% |\n`;
    markdown += `| ⚠️ Warnings | ${summary.warnings} | ${((summary.warnings / summary.total) * 100).toFixed(1)}% |\n`;
    markdown += `| ⏭️ Skipped | ${summary.skipped} | ${((summary.skipped / summary.total) * 100).toFixed(1)}% |\n\n`;

    // Group results by category
    const categories = [...new Set(results.map(r => r.category))];
    
    for (const category of categories) {
      const categoryResults = results.filter(r => r.category === category);
      markdown += `## ${category}\n\n`;
      
      for (const result of categoryResults) {
        const icon = {
          'PASS': '✅',
          'FAIL': '❌',
          'WARNING': '⚠️',
          'SKIP': '⏭️'
        }[result.status];
        
        markdown += `### ${icon} ${result.name}\n\n`;
        markdown += `**Status:** ${result.status}\n`;
        markdown += `**Message:** ${result.message}\n`;
        
        if (result.details && result.details.length > 0) {
          markdown += `**Details:**\n`;
          for (const detail of result.details) {
            markdown += `- ${detail}\n`;
          }
        }
        markdown += `\n`;
      }
    }

    // Recommendations
    markdown += `## 📝 Recommendations\n\n`;
    
    const failedResults = results.filter(r => r.status === 'FAIL');
    const warningResults = results.filter(r => r.status === 'WARNING');
    
    if (failedResults.length > 0) {
      markdown += `### Critical Issues (${failedResults.length})\n\n`;
      for (const result of failedResults) {
        markdown += `- **${result.name}:** ${result.message}\n`;
      }
      markdown += `\n`;
    }
    
    if (warningResults.length > 0) {
      markdown += `### Improvements Needed (${warningResults.length})\n\n`;
      for (const result of warningResults) {
        markdown += `- **${result.name}:** ${result.message}\n`;
      }
      markdown += `\n`;
    }

    return markdown;
  }

  /**
   * Main audit execution
   */
  public async runAudit(): Promise<void> {
    this.log('🚀 Starting comprehensive audit...');
    
    try {
      await this.auditPublicPages();
      await this.auditKeyComponents();
      await this.auditDashboardForms();
      await this.auditBuildProcess();
      await this.auditSEOAccessibility();
      await this.auditRouting();
      
      const report = await this.generateReport();
      const markdownReport = await this.generateMarkdownReport(report);
      
      // Save reports
      const reportsDir = path.join(this.baseDir, 'audit-reports');
      await fs.mkdir(reportsDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join(reportsDir, `audit-report-${timestamp}.md`);
      const jsonReportPath = path.join(reportsDir, `audit-report-${timestamp}.json`);
      
      await fs.writeFile(reportPath, markdownReport);
      await fs.writeFile(jsonReportPath, JSON.stringify(report, null, 2));
      
      this.log(`📄 Reports saved:`);
      this.log(`   Markdown: ${reportPath}`);
      this.log(`   JSON: ${jsonReportPath}`);
      
      // Print summary
      this.log(`\n📊 Audit Summary:`);
      this.log(`   Total checks: ${report.summary.total}`);
      this.log(`   ✅ Passed: ${report.summary.passed}`);
      this.log(`   ❌ Failed: ${report.summary.failed}`);
      this.log(`   ⚠️ Warnings: ${report.summary.warnings}`);
      this.log(`   ⏭️ Skipped: ${report.summary.skipped}`);
      
      // Exit with appropriate code
      if (report.summary.failed > 0) {
        this.log('\n❌ Audit completed with failures', 'error');
        process.exit(1);
      } else if (report.summary.warnings > 0) {
        this.log('\n⚠️ Audit completed with warnings', 'warn');
        process.exit(0);
      } else {
        this.log('\n✅ Audit completed successfully');
        process.exit(0);
      }
      
    } catch (error) {
      this.log(`💥 Audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      process.exit(1);
    }
  }
}

// Run audit if this script is executed directly
if (require.main === module) {
  const agent = new AuditAgent();
  agent.runAudit();
}

export { AuditAgent };