# 🟠 No phone number format validation

**Form:** Venues
**Category:** validation
**Severity:** high

## Description
Phone field accepts any text without format validation

## Reproduction Steps
1. Enter "invalid-phone" in phone field
2. Try to save

## Expected Behavior
Should validate phone format (international/local)

## Current Behavior
Accepts any text as phone number

## Recommendation
Add phone number validation with formatting

## Acceptance Criteria
- [ ] Should validate phone format (international/local)
- [ ] No regression in existing functionality
- [ ] Manual testing confirms fix

**Labels:** severity: high, category: validation, form: venues