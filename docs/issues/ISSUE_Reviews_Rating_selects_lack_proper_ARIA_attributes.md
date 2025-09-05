# 🟠 Rating selects lack proper ARIA attributes

**Form:** Reviews
**Category:** accessibility
**Severity:** high

## Description
Rating fields use Select components without proper accessibility support

## Reproduction Steps
1. Use screen reader
2. Navigate to rating fields

## Expected Behavior
Should have clear ARIA labels and role descriptions

## Current Behavior
Generic select announcement without context

## Recommendation
Add aria-label and aria-describedby to rating selects

## Acceptance Criteria
- [ ] Should have clear ARIA labels and role descriptions
- [ ] No regression in existing functionality
- [ ] Manual testing confirms fix

**Labels:** severity: high, category: accessibility, form: reviews