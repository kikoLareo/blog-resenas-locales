# 🔴 No URL validation for website field

**Form:** Venues
**Category:** validation
**Severity:** critical

## Description
Website field accepts any text, not validated as URL

## Reproduction Steps
1. Enter "not-a-url" in website field
2. Try to save

## Expected Behavior
Should validate URL format and show error

## Current Behavior
Accepts invalid URLs without validation

## Recommendation
Add URL format validation with regex or HTML5 validation

## Acceptance Criteria
- [ ] Should validate URL format and show error
- [ ] No regression in existing functionality
- [ ] Manual testing confirms fix

**Labels:** severity: critical, category: validation, form: venues