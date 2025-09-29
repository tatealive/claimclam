import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReceiptSubmissionForm } from '../../src/components/ReceiptSubmissionForm';

// Mock the router
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    navigate: mockNavigate,
  }),
}));

// Helper to wrap components that need router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ReceiptSubmissionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <RouterWrapper>
        <ReceiptSubmissionForm />
      </RouterWrapper>
    );

    // Check for form elements by placeholder text
    expect(screen.getByPlaceholderText(/john smith/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter dollar amount/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/officeworks/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/team lunch meeting/i)).toBeInTheDocument();
    expect(screen.getByText(/attach your receipt/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(
      <RouterWrapper>
        <ReceiptSubmissionForm />
      </RouterWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /submit receipt/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/employee name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/vendor is required/i)).toBeInTheDocument();
      expect(screen.getByText(/receipt attachment is required/i)).toBeInTheDocument();
    });
  });

  it('validates amount is greater than 0', async () => {
    render(
      <RouterWrapper>
        <ReceiptSubmissionForm />
      </RouterWrapper>
    );

    const amountInput = screen.getByPlaceholderText(/enter dollar amount/i);
    const submitButton = screen.getByRole('button', { name: /submit receipt/i });

    // Enter 0 as amount
    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount must be more than \$0/i)).toBeInTheDocument();
    });
  });

  it('allows valid form submission', async () => {
    render(
      <RouterWrapper>
        <ReceiptSubmissionForm />
      </RouterWrapper>
    );

    // Fill in all required fields using placeholder text
    fireEvent.change(screen.getByPlaceholderText(/john smith/i), { 
      target: { value: 'John Smith' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/enter dollar amount/i), { 
      target: { value: '25.50' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/officeworks/i), { 
      target: { value: 'Officeworks' } 
    });

    // Mock file upload
    const fileInput = screen.getByText(/upload your receipt/i).closest('div')?.querySelector('input[type="file"]');
    if (fileInput) {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });
    }

    const submitButton = screen.getByRole('button', { name: /submit receipt/i });
    fireEvent.click(submitButton);

    // Should not show validation errors for filled fields
    await waitFor(() => {
      expect(screen.queryByText(/employee name is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/amount is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/vendor is required/i)).not.toBeInTheDocument();
    });
  });

  it('shows required field indicators', () => {
    render(
      <RouterWrapper>
        <ReceiptSubmissionForm />
      </RouterWrapper>
    );

    // Check for red asterisks on required fields
    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThan(0);
  });

  it('shows optional field indicators', () => {
    render(
      <RouterWrapper>
        <ReceiptSubmissionForm />
      </RouterWrapper>
    );

    // Check for optional indicator on description field
    expect(screen.getByText(/description \(optional\)/i)).toBeInTheDocument();
  });
});
