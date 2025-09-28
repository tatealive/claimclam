import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';
import { ReceiptSubmissionForm } from '../../src/components/ReceiptSubmissionForm';
import { ReviewDashboard } from '../../src/components/ReviewDashboard';

// Helper to wrap components that need router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Core Component Rendering', () => {
  it('App component renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Receipt Management System')).toBeInTheDocument();
  });

  it('ReceiptSubmissionForm renders without crashing', () => {
    render(
      <RouterWrapper>
        <ReceiptSubmissionForm />
      </RouterWrapper>
    );
    expect(screen.getByText('Submit Receipt')).toBeInTheDocument();
  });

  it('ReviewDashboard renders without crashing', () => {
    render(
      <RouterWrapper>
        <ReviewDashboard />
      </RouterWrapper>
    );
    expect(screen.getByText('Review Dashboard')).toBeInTheDocument();
  });

  it('App navigation renders correctly', () => {
    render(<App />);
    expect(screen.getAllByText('Submit Receipt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Review Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
  });
});
