import { test, expect } from 'vitest';
import { isValidUrl, getUrlErrorMessage } from '@/lib/validation';

test('URL validation should accept valid URLs', () => {
  expect(isValidUrl('https://www.example.com')).toBe(true);
  expect(isValidUrl('http://example.com')).toBe(true);
  expect(isValidUrl('https://subdomain.example.com/path?query=1')).toBe(true);
  expect(isValidUrl('')).toBe(true); // Empty string should be valid (optional field)
  expect(isValidUrl('   ')).toBe(true); // Whitespace should be valid (optional field)
});

test('URL validation should reject invalid URLs', () => {
  expect(isValidUrl('not-a-url')).toBe(false);
  expect(isValidUrl('example.com')).toBe(false); // Missing protocol
  expect(isValidUrl('ftp://example.com')).toBe(false); // Wrong protocol
  expect(isValidUrl('javascript:alert(1)')).toBe(false); // Dangerous protocol
  expect(isValidUrl('www.example.com')).toBe(false); // Missing protocol
});

test('URL error messages should be helpful', () => {
  expect(getUrlErrorMessage('')).toBe('');
  expect(getUrlErrorMessage('   ')).toBe('');
  expect(getUrlErrorMessage('example.com')).toBe('La URL debe comenzar con http:// o https://');
  expect(getUrlErrorMessage('www.example.com')).toBe('La URL debe comenzar con http:// o https://');
  expect(getUrlErrorMessage('not-a-url')).toBe('Por favor, introduce una URL válida (ej: https://www.ejemplo.com)');
});