import { describe, it, expect } from 'vitest';
import { validatePhone, validateSpanishPhone, validateInternationalPhone } from '@/lib/phone-validation';

describe('Phone Validation', () => {
  describe('validateSpanishPhone', () => {
    it('should accept valid Spanish international format', () => {
      const result = validateSpanishPhone('+34 612 345 678');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('+34 612 345 678');
    });

    it('should accept valid Spanish national mobile format', () => {
      const result = validateSpanishPhone('612 345 678');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('612 345 678');
    });

    it('should accept valid Spanish landline format', () => {
      const result = validateSpanishPhone('91 234 56 78');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('912 345 678');
    });

    it('should reject invalid Spanish format', () => {
      const result = validateSpanishPhone('invalid-phone');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Formato de teléfono español no válido');
    });

    it('should accept empty phone number', () => {
      const result = validateSpanishPhone('');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateInternationalPhone', () => {
    it('should accept valid international format', () => {
      const result = validateInternationalPhone('+1 555 123 4567');
      expect(result.isValid).toBe(true);
    });

    it('should accept valid UK format', () => {
      const result = validateInternationalPhone('+44 20 1234 5678');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid international format', () => {
      const result = validateInternationalPhone('not-a-phone');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Formato de teléfono internacional no válido');
    });

    it('should accept empty phone number', () => {
      const result = validateInternationalPhone('');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePhone', () => {
    it('should accept Spanish phone numbers', () => {
      const result = validatePhone('+34 612 345 678');
      expect(result.isValid).toBe(true);
    });

    it('should accept international phone numbers', () => {
      const result = validatePhone('+1 555 123 4567');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      const result = validatePhone('invalid-phone');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Formato de teléfono no válido');
    });

    it('should accept empty phone number', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(true);
    });

    it('should handle whitespace', () => {
      const result = validatePhone('   ');
      expect(result.isValid).toBe(true);
    });
  });
});