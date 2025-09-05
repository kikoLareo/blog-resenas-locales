# 🟠 No unsaved changes warning

**Form:** All Forms
**Category:** ux
**Severity:** high

## Description
Users can lose work by navigating away without warning

## Reproduction Steps
1. Fill form partially
2. Click browser back or navigate away

## Expected Behavior
Should warn about unsaved changes

## Current Behavior
Data is lost without warning

## Recommendation
Add beforeunload event listener and form dirty state tracking

## Acceptance Criteria
- [ ] Should warn about unsaved changes
- [ ] No regression in existing functionality
- [ ] Manual testing confirms fix

**Labels:** severity: high, category: ux, form: all forms