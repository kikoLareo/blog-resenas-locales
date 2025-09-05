#!/usr/bin/env tsx

/**
 * GitHub Issues Creation Guide
 * 
 * This script provides instructions for creating GitHub issues
 * from the generated issue files.
 */

import { readdirSync } from 'fs';

console.log('📋 GITHUB ISSUES CREATION GUIDE\n');

console.log('🎯 OBJECTIVE:');
console.log('Create individual GitHub issues for each critical and high-priority dashboard form problem.\n');

console.log('📁 GENERATED ISSUE FILES:');
const issueFiles = readdirSync('.').filter(file => file.startsWith('ISSUE_'));
issueFiles.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`);
});
console.log('');

console.log('🔧 HOW TO CREATE ISSUES:');
console.log('');
console.log('METHOD 1 - Manual Creation:');
console.log('1. Go to https://github.com/kikoLareo/blog-resenas-locales/issues/new');
console.log('2. Copy content from each ISSUE_*.md file');
console.log('3. Use the title from the # heading');
console.log('4. Add labels as specified at the bottom of each file');
console.log('5. Assign priority based on severity (🔴 Critical, 🟠 High)');
console.log('');

console.log('METHOD 2 - Using GitHub CLI (if available):');
console.log('```bash');
issueFiles.forEach(file => {
  const title = file.replace('ISSUE_', '').replace('.md', '').replace(/_/g, ' ');
  console.log(`gh issue create --title "${title}" --body-file ${file}`);
});
console.log('```\n');

console.log('🏷️ SUGGESTED LABELS:');
console.log('Create these labels in your repository if they don\'t exist:');
console.log('');
console.log('Severity Labels:');
console.log('• severity: critical (🔴 #D73A49)');
console.log('• severity: high (🟠 #FF8C00)');
console.log('• severity: medium (🟡 #FFAB00)');
console.log('• severity: low (🟢 #28A745)');
console.log('');
console.log('Category Labels:');
console.log('• category: validation (🔍 #0052CC)');
console.log('• category: ux (🎨 #8B5CF6)');
console.log('• category: crud (💾 #059669)');
console.log('• category: accessibility (♿ #6F42C1)');
console.log('• category: edge-case (⚠️ #F59E0B)');
console.log('');
console.log('Form Labels:');
console.log('• form: reviews (📝 #E11D48)');
console.log('• form: venues (🏪 #0891B2)');
console.log('• form: categories (🏷️ #7C3AED)');
console.log('• form: cities (🌍 #059669)');
console.log('• form: featured items (⭐ #DC2626)');
console.log('• form: all forms (📋 #374151)');
console.log('');

console.log('📊 PRIORITY ORDER:');
console.log('Process issues in this order for maximum impact:');
console.log('');
console.log('🔴 CRITICAL (Fix Immediately):');
console.log('1. Reviews - No client-side validation');
console.log('2. Reviews - No API integration');
console.log('3. Venues - No URL validation');
console.log('4. Venues - No venue creation in CMS');
console.log('');
console.log('🟠 HIGH (Fix This Week):');
console.log('5. Reviews - Poor navigation pattern');
console.log('6. Reviews - Rating accessibility issues');
console.log('7. Venues - No phone validation');
console.log('8. Featured Items - Complex error handling');
console.log('9. All Forms - No unsaved changes warning');
console.log('');

console.log('🎯 MILESTONE SUGGESTIONS:');
console.log('');
console.log('Milestone: "Dashboard Forms - Critical Fixes"');
console.log('• All critical severity issues');
console.log('• Due: End of current sprint');
console.log('');
console.log('Milestone: "Dashboard Forms - UX Improvements"');
console.log('• All high severity issues');
console.log('• Due: Next sprint');
console.log('');
console.log('Milestone: "Dashboard Forms - Polish"');
console.log('• Medium and low severity issues');
console.log('• Due: Following sprint');
console.log('');

console.log('✅ VALIDATION CHECKLIST:');
console.log('After creating issues, verify:');
console.log('• [ ] All critical issues are created');
console.log('• [ ] Labels are applied correctly');
console.log('• [ ] Milestones are assigned');
console.log('• [ ] Issues are assigned to team members');
console.log('• [ ] Project board is updated (if using one)');
console.log('• [ ] Stakeholders are notified of critical issues');
console.log('');

console.log('📈 TRACKING PROGRESS:');
console.log('Use the main report for tracking:');
console.log('• DASHBOARD_FORMS_TESTING_REPORT.md - Technical details');
console.log('• DASHBOARD_FORMS_EXECUTIVE_SUMMARY.md - Business impact');
console.log('• Individual ISSUE_*.md files - Specific implementation details');
console.log('');

console.log('🎉 READY TO CREATE ISSUES!');
console.log(`Total issues to create: ${issueFiles.length}`);
console.log('Estimated time: 15-20 minutes for manual creation');
console.log('Expected resolution time: 2-3 sprints for all issues');

export {};