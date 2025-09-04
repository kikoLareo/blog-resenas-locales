import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewVenuePage from '@/app/dashboard/venues/new/page';

// Mock next/link and next/navigation
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => 
    <a href={href}>{children}</a>
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock window.location and alert
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock alert
const mockAlert = vi.fn();
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true,
});

describe('URL Validation Fix', () => {
  beforeEach(() => {
    mockLocation.href = '';
    mockAlert.mockClear();
    vi.clearAllMocks();
  });

  it('should have type="url" attribute on website input', () => {
    render(<NewVenuePage />);
    
    const websiteInput = screen.getByLabelText(/sitio web/i);
    expect(websiteInput).toHaveAttribute('type', 'url');
  });

  it('should validate website URL format and show error for invalid URL', async () => {
    const user = userEvent.setup();
    render(<NewVenuePage />);
    
    const titleInput = screen.getByLabelText(/nombre del local/i);
    const addressInput = screen.getByLabelText(/dirección/i);
    const websiteInput = screen.getByLabelText(/sitio web/i);
    const saveButton = screen.getByRole('button', { name: /guardar local/i });
    
    // Fill required fields
    await user.type(titleInput, 'Test Restaurant');
    await user.type(addressInput, 'Test Address 123');
    
    // Enter invalid URL
    await user.type(websiteInput, 'not-a-url');
    await user.click(saveButton);
    
    // Should show validation error
    expect(mockAlert).toHaveBeenCalledWith('Por favor, introduce una URL válida (ej: https://www.ejemplo.com)');
  });

  it('should accept valid URL and not show error', async () => {
    const user = userEvent.setup();
    
    // Mock fetch to avoid actual API call
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    render(<NewVenuePage />);
    
    const titleInput = screen.getByLabelText(/nombre del local/i);
    const addressInput = screen.getByLabelText(/dirección/i);
    const websiteInput = screen.getByLabelText(/sitio web/i);
    const saveButton = screen.getByRole('button', { name: /guardar local/i });
    
    // Fill required fields
    await user.type(titleInput, 'Test Restaurant');
    await user.type(addressInput, 'Test Address 123');
    
    // Enter valid URL
    await user.type(websiteInput, 'https://www.restaurant.com');
    await user.click(saveButton);
    
    // Should not show URL validation error
    expect(mockAlert).not.toHaveBeenCalledWith('Por favor, introduce una URL válida (ej: https://www.ejemplo.com)');
    
    vi.restoreAllMocks();
  });

  it('should allow empty website field (optional field)', async () => {
    const user = userEvent.setup();
    
    // Mock fetch to avoid actual API call
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    render(<NewVenuePage />);
    
    const titleInput = screen.getByLabelText(/nombre del local/i);
    const addressInput = screen.getByLabelText(/dirección/i);
    const saveButton = screen.getByRole('button', { name: /guardar local/i });
    
    // Fill only required fields, leave website empty
    await user.type(titleInput, 'Test Restaurant');
    await user.type(addressInput, 'Test Address 123');
    
    await user.click(saveButton);
    
    // Should not show URL validation error for empty field
    expect(mockAlert).not.toHaveBeenCalledWith('Por favor, introduce una URL válida (ej: https://www.ejemplo.com)');
    
    vi.restoreAllMocks();
  });

  it('should validate various URL formats correctly', async () => {
    const user = userEvent.setup();
    
    const testCases = [
      { url: 'https://www.example.com', shouldPass: true },
      { url: 'http://localhost:3000', shouldPass: true },
      { url: 'https://subdomain.example.co.uk', shouldPass: true },
      { url: 'example.com', shouldPass: false },
      { url: 'www.example.com', shouldPass: false },
      { url: 'not-a-url', shouldPass: false },
      { url: 'ftp://example.com', shouldPass: true }, // Valid URL, just not HTTP
    ];
    
    for (const testCase of testCases) {
      const { unmount } = render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/nombre del local/i);
      const addressInput = screen.getByLabelText(/dirección/i);
      const websiteInput = screen.getByLabelText(/sitio web/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      // Fill required fields
      await user.type(titleInput, 'Test Restaurant');
      await user.type(addressInput, 'Test Address 123');
      await user.type(websiteInput, testCase.url);
      await user.click(saveButton);
      
      if (testCase.shouldPass) {
        expect(mockAlert).not.toHaveBeenCalledWith('Por favor, introduce una URL válida (ej: https://www.ejemplo.com)');
      } else {
        expect(mockAlert).toHaveBeenCalledWith('Por favor, introduce una URL válida (ej: https://www.ejemplo.com)');
      }
      
      // Clear for next test
      mockAlert.mockClear();
      unmount();
    }
  });
});