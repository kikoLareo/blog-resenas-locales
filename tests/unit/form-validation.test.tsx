// Form validation tests
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { validatePhone } from '@/lib/phone-validation';
import { isValidUrl, getUrlErrorMessage } from '@/lib/validation';
import QRVenueForm from '@/components/QrVenueForm';
import CreateUserForm from '@/components/admin/CreateUserForm';

describe('Phone Validation', () => {
  it('validates Spanish phone numbers correctly', () => {
    expect(validatePhone('+34 600 123 456').isValid).toBe(true);
    expect(validatePhone('600 123 456').isValid).toBe(true);
    expect(validatePhone('12345').isValid).toBe(false);
    expect(validatePhone('').isValid).toBe(true); // Empty is allowed
  });

  it('provides proper error messages for invalid phones', () => {
    const result = validatePhone('invalid-phone');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Formato de teléfono no válido');
  });
});

describe('URL Validation', () => {
  it('validates URLs correctly', () => {
    expect(isValidUrl('https://www.example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('ftp://example.com')).toBe(false); // Only http/https allowed
    expect(isValidUrl('invalid-url')).toBe(false);
    expect(isValidUrl('')).toBe(true); // Empty is allowed
  });

  it('provides helpful error messages', () => {
    expect(getUrlErrorMessage('www.example.com')).toContain('debe comenzar con http://');
    expect(getUrlErrorMessage('invalid')).toContain('URL válida');
  });
});

describe('QRVenueForm', () => {
  const mockProps = {
    venueId: 'test-venue',
    venueName: 'Test Venue',
    qrCode: 'test-qr-code'
  };

  it('renders with proper ARIA attributes', () => {
    render(<QRVenueForm {...mockProps} />);
    
    // Check form has proper role and labelledby
    expect(screen.getByRole('form')).toHaveAttribute('aria-labelledby', 'qr-form-title');
    
    // Check required fields have aria-required
    expect(screen.getByLabelText(/nombre/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/fecha de visita/i)).toHaveAttribute('aria-required', 'true');
    
    // Check fields have proper descriptions
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-describedby', 'email-help');
    expect(screen.getByLabelText(/teléfono/i)).toHaveAttribute('aria-describedby', 'phone-help phone-error');
  });

  it('validates phone number input', async () => {
    render(<QRVenueForm {...mockProps} />);
    
    const phoneInput = screen.getByLabelText(/teléfono/i);
    const nameInput = screen.getByLabelText(/nombre/i);
    const dateInput = screen.getByLabelText(/fecha de visita/i);
    const submitButton = screen.getByRole('button', { name: /enviar información/i });
    
    // Fill required fields first
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    // Enter invalid phone and submit
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/formato de teléfono no válido/i)).toBeInTheDocument();
      expect(screen.getByText(/formato de teléfono no válido/i)).toHaveAttribute('role', 'alert');
    });
  });

  it('clears phone error when user starts typing', async () => {
    render(<QRVenueForm {...mockProps} />);
    
    const phoneInput = screen.getByLabelText(/teléfono/i);
    const nameInput = screen.getByLabelText(/nombre/i);
    const dateInput = screen.getByLabelText(/fecha de visita/i);
    const submitButton = screen.getByRole('button', { name: /enviar información/i });
    
    // Fill required fields
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    // Enter invalid phone and submit to trigger error
    fireEvent.change(phoneInput, { target: { value: 'invalid' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/formato de teléfono no válido/i)).toBeInTheDocument();
    });
    
    // Start typing valid phone - error should clear
    fireEvent.change(phoneInput, { target: { value: '+34 600' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/formato de teléfono no válido/i)).not.toBeInTheDocument();
    });
  });
});

describe('CreateUserForm', () => {
  it('renders with proper ARIA attributes', () => {
    render(<CreateUserForm />);
    
    // Check form has proper role and labelledby
    expect(screen.getByRole('form')).toHaveAttribute('aria-labelledby', 'create-user-title');
    
    // Check required fields have aria-required
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/admin api secret/i)).toHaveAttribute('aria-required', 'true');
    
    // Check fields have proper descriptions
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-describedby', 'email-help');
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute('aria-describedby', 'password-help');
    expect(screen.getByLabelText(/rol/i)).toHaveAttribute('aria-describedby', 'role-help');
  });

  it('shows proper help text for fields', () => {
    render(<CreateUserForm />);
    
    expect(screen.getByText(/email único del usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/selecciona el nivel de acceso/i)).toBeInTheDocument();
  });

  it('has password minimum length validation', () => {
    render(<CreateUserForm />);
    
    const passwordInput = screen.getByLabelText(/contraseña/i);
    expect(passwordInput).toHaveAttribute('minLength', '8');
  });
});