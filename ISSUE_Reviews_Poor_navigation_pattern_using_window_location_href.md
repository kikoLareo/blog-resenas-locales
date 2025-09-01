# 🟠 Poor navigation pattern using window.location.href

**Form:** Reviews
**Category:** ux
**Severity:** high

## Description
Using window.location.href instead of Next.js router

## Reproduction Steps
1. Click cancel or save
2. Observe page navigation

## Expected Behavior
Should use Next.js router for SPA navigation

## Current Behavior
Full page reload occurs

## Recommendation
Replace window.location.href with useRouter().push()

## Acceptance Criteria
- [ ] Should use Next.js router for SPA navigation
- [ ] No regression in existing functionality
- [ ] Manual testing confirms fix

**Labels:** severity: high, category: ux, form: reviews