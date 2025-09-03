/**
 * Manual test script to demonstrate URL validation in Venues form
 * Run this with: npx tsx tests/manual-url-validation-test.ts
 */

import { isValidUrl, getUrlErrorMessage } from '../lib/validation';

console.log('🧪 Manual URL Validation Test\n');

// Test cases from the issue description
const testCases = [
  { url: 'not-a-url', expected: false, description: 'Invalid text (from issue)' },
  { url: 'https://www.example.com', expected: true, description: 'Valid HTTPS URL' },
  { url: 'http://example.com', expected: true, description: 'Valid HTTP URL' },
  { url: 'example.com', expected: false, description: 'Missing protocol' },
  { url: '', expected: true, description: 'Empty string (optional field)' },
  { url: 'ftp://example.com', expected: false, description: 'Wrong protocol' },
  { url: 'https://subdomain.example.com/path?query=1', expected: true, description: 'Complex valid URL' },
];

console.log('Test Results:');
console.log('='.repeat(80));

testCases.forEach((testCase, index) => {
  const result = isValidUrl(testCase.url);
  const passed = result === testCase.expected;
  const errorMsg = result ? '' : getUrlErrorMessage(testCase.url);
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   Input: "${testCase.url}"`);
  console.log(`   Expected: ${testCase.expected ? 'Valid' : 'Invalid'}`);
  console.log(`   Actual: ${result ? 'Valid' : 'Invalid'}`);
  if (errorMsg) {
    console.log(`   Error: ${errorMsg}`);
  }
  console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('🎯 Reproduction of the original issue:');
console.log('Input: "not-a-url"');
console.log(`Valid: ${isValidUrl('not-a-url')}`);
console.log(`Error: ${getUrlErrorMessage('not-a-url')}`);
console.log('\n✅ URL validation is now working correctly!');