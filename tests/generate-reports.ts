#!/usr/bin/env tsx

import { writeFileSync } from 'fs';
import { report, individualIssues, testResults } from './dashboard-forms-testing';

// Generate main report
writeFileSync('./DASHBOARD_FORMS_TESTING_REPORT.md', report);

// Generate individual issue files
individualIssues.forEach((issueContent, index) => {
  const issue = testResults.filter(r => r.severity === 'critical' || r.severity === 'high')[index];
  const filename = `./ISSUE_${issue.form.replace(/\s+/g, '_')}_${issue.issue.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.md`;
  writeFileSync(filename, issueContent);
});

console.log(`Generated main report: DASHBOARD_FORMS_TESTING_REPORT.md`);
console.log(`Generated ${individualIssues.length} individual issue files`);

// Show summary
const criticalCount = testResults.filter(r => r.severity === 'critical').length;
const highCount = testResults.filter(r => r.severity === 'high').length;
const mediumCount = testResults.filter(r => r.severity === 'medium').length;
const lowCount = testResults.filter(r => r.severity === 'low').length;

console.log('\nSummary:');
console.log(`🔴 Critical: ${criticalCount}`);
console.log(`🟠 High: ${highCount}`);
console.log(`🟡 Medium: ${mediumCount}`);
console.log(`🟢 Low: ${lowCount}`);
console.log(`📊 Total: ${testResults.length} issues found`);