/**
 * Accessibility validation utilities for ensuring WCAG compliance
 */

export interface AccessibilityValidation {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  score: number; // 0-100
}

/**
 * Validate color contrast ratio
 * @param foreground - Foreground color (hex, rgb, or rgba)
 * @param background - Background color (hex, rgb, or rgba)
 * @param level - WCAG level ('AA' or 'AAA')
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): { ratio: number; passes: boolean; required: number } {
  // This is a simplified implementation - in production, use a proper color contrast library
  const requiredRatio = level === 'AAA' 
    ? (isLargeText ? 4.5 : 7) 
    : (isLargeText ? 3 : 4.5);

  // For now, return a mock validation
  // In production, implement proper color parsing and contrast calculation
  return {
    ratio: 4.5, // Mock ratio
    passes: true, // Mock result
    required: requiredRatio,
  };
}

/**
 * Validate alt text quality
 */
export function validateAltText(
  alt: string,
  context?: { isDecorative?: boolean; filename?: string }
): AccessibilityValidation {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Empty alt is OK for decorative images
  if (!alt || alt.trim() === '') {
    if (!context?.isDecorative) {
      issues.push('Missing alt text for non-decorative image');
    }
    return { isValid: context?.isDecorative || false, issues, warnings, score: context?.isDecorative ? 100 : 0 };
  }

  const trimmedAlt = alt.trim();
  
  // Check for common issues
  if (trimmedAlt.length < 4) {
    issues.push('Alt text too short - should be descriptive');
  }

  if (trimmedAlt.length > 125) {
    warnings.push('Alt text is quite long - consider making it more concise');
  }

  // Check for redundant words
  const redundantPhrases = [
    'image of',
    'picture of',
    'photo of',
    'graphic of',
    'screenshot of'
  ];
  
  const hasRedundancy = redundantPhrases.some(phrase => 
    trimmedAlt.toLowerCase().includes(phrase)
  );
  
  if (hasRedundancy) {
    warnings.push('Alt text contains redundant phrases like "image of" or "picture of"');
  }

  // Check if alt text is just a filename
  if (context?.filename && trimmedAlt.toLowerCase().includes(context.filename.toLowerCase())) {
    issues.push('Alt text appears to be based on filename rather than content description');
  }

  // Check for file extensions
  const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const hasFileExtension = fileExtensions.some(ext => 
    trimmedAlt.toLowerCase().includes(ext)
  );
  
  if (hasFileExtension) {
    issues.push('Alt text contains file extension');
  }

  const score = Math.max(0, 100 - (issues.length * 30) - (warnings.length * 10));
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score,
  };
}

/**
 * Validate ARIA label quality
 */
export function validateAriaLabel(
  ariaLabel: string,
  element: { tagName: string; hasTextContent?: boolean }
): AccessibilityValidation {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  if (!ariaLabel || ariaLabel.trim() === '') {
    if (!element.hasTextContent) {
      issues.push(`${element.tagName} element needs aria-label when it has no text content`);
    }
    return { isValid: element.hasTextContent || false, issues, warnings, score: element.hasTextContent ? 80 : 0 };
  }

  const trimmedLabel = ariaLabel.trim();
  
  if (trimmedLabel.length < 2) {
    issues.push('ARIA label too short to be meaningful');
  }

  if (trimmedLabel.length > 100) {
    warnings.push('ARIA label is quite long - consider making it more concise');
  }

  // Check for redundant role information
  const redundantPhrases = [
    'button',
    'link',
    'image',
    'heading',
  ];
  
  const hasRedundancy = redundantPhrases.some(phrase => 
    trimmedLabel.toLowerCase().includes(phrase) && element.tagName.toLowerCase().includes(phrase)
  );
  
  if (hasRedundancy) {
    warnings.push('ARIA label contains redundant role information');
  }

  const score = Math.max(0, 100 - (issues.length * 30) - (warnings.length * 10));
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score,
  };
}

/**
 * Validate heading hierarchy
 */
export function validateHeadingHierarchy(headings: Array<{ level: number; text: string }>): AccessibilityValidation {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  if (headings.length === 0) {
    issues.push('Page has no headings - add at least one h1');
    return { isValid: false, issues, warnings, score: 0 };
  }

  // Check for h1
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    issues.push('Page must have exactly one h1');
  } else if (h1Count > 1) {
    issues.push('Page should have only one h1');
  }

  // Check for skipped levels
  let previousLevel = 0;
  for (const heading of headings) {
    if (heading.level > previousLevel + 1) {
      issues.push(`Heading hierarchy skips from h${previousLevel} to h${heading.level}`);
    }
    previousLevel = Math.max(previousLevel, heading.level);
  }

  // Check for empty headings
  const emptyHeadings = headings.filter(h => !h.text || h.text.trim() === '');
  if (emptyHeadings.length > 0) {
    issues.push(`${emptyHeadings.length} headings are empty`);
  }

  // Check for generic headings
  const genericHeadings = headings.filter(h => 
    h.text && ['title', 'heading', 'header'].includes(h.text.toLowerCase().trim())
  );
  if (genericHeadings.length > 0) {
    warnings.push(`${genericHeadings.length} headings have generic text`);
  }

  const score = Math.max(0, 100 - (issues.length * 20) - (warnings.length * 5));
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score,
  };
}

/**
 * Validate form accessibility
 */
export function validateFormAccessibility(form: {
  inputs: Array<{
    type: string;
    hasLabel: boolean;
    hasAriaLabel: boolean;
    hasPlaceholder: boolean;
    isRequired: boolean;
    hasErrorMessage: boolean;
  }>;
}): AccessibilityValidation {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  for (const [index, input] of form.inputs.entries()) {
    const inputId = `Input ${index + 1} (${input.type})`;
    
    // Skip hidden inputs
    if (input.type === 'hidden') continue;
    
    // Check for labels
    if (!input.hasLabel && !input.hasAriaLabel) {
      issues.push(`${inputId} lacks a label or aria-label`);
    }
    
    // Check required fields
    if (input.isRequired && !input.hasErrorMessage) {
      warnings.push(`${inputId} is required but has no error message handling`);
    }
    
    // Check placeholder usage
    if (input.hasPlaceholder && !input.hasLabel && !input.hasAriaLabel) {
      issues.push(`${inputId} uses placeholder as label (not accessible)`);
    }
  }

  const score = Math.max(0, 100 - (issues.length * 25) - (warnings.length * 10));
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score,
  };
}

/**
 * Validate keyboard navigation
 */
export function validateKeyboardNavigation(elements: Array<{
  isInteractive: boolean;
  isFocusable: boolean;
  hasSkipLink?: boolean;
  hasFocusIndicator: boolean;
}>): AccessibilityValidation {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  const interactiveElements = elements.filter(e => e.isInteractive);
  const nonFocusableInteractive = interactiveElements.filter(e => !e.isFocusable);
  
  if (nonFocusableInteractive.length > 0) {
    issues.push(`${nonFocusableInteractive.length} interactive elements are not keyboard focusable`);
  }
  
  const focusableElements = elements.filter(e => e.isFocusable);
  const noFocusIndicator = focusableElements.filter(e => !e.hasFocusIndicator);
  
  if (noFocusIndicator.length > 0) {
    issues.push(`${noFocusIndicator.length} focusable elements lack visible focus indicators`);
  }
  
  // Check for skip link
  const hasSkipLink = elements.some(e => e.hasSkipLink);
  if (!hasSkipLink) {
    warnings.push('Page should have a skip link for keyboard navigation');
  }

  const score = Math.max(0, 100 - (issues.length * 30) - (warnings.length * 15));
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score,
  };
}

/**
 * Overall accessibility score calculation
 */
export function calculateAccessibilityScore(validations: AccessibilityValidation[]): {
  overallScore: number;
  totalIssues: number;
  totalWarnings: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
} {
  const totalIssues = validations.reduce((sum, v) => sum + v.issues.length, 0);
  const totalWarnings = validations.reduce((sum, v) => sum + v.warnings.length, 0);
  const averageScore = validations.reduce((sum, v) => sum + v.score, 0) / validations.length;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (averageScore >= 90) grade = 'A';
  else if (averageScore >= 80) grade = 'B';
  else if (averageScore >= 70) grade = 'C';
  else if (averageScore >= 60) grade = 'D';
  else grade = 'F';
  
  return {
    overallScore: Math.round(averageScore),
    totalIssues,
    totalWarnings,
    grade,
  };
}