import { describe, it, expect } from 'vitest';
import { receiptSchema } from '../../src/schemas/receiptSchema';

describe('Receipt Schema Validation', () => {
  it('should validate a valid receipt form data', () => {
    const validData = {
      amount: 25.50,
      date: '2024-01-15',
      vendor: 'Starbucks',
      category: 'Meals',
      description: 'Coffee meeting',
      employeeName: 'John Doe',
      department: 'Engineering',
    };

    const result = receiptSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject amount less than 0.01', () => {
    const invalidData = {
      amount: 0.005,
      date: '2024-01-15',
      vendor: 'Starbucks',
      category: 'Meals',
      employeeName: 'John Doe',
      department: 'Engineering',
    };

    const result = receiptSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Amount must be at least $0.01');
    }
  });

  it('should reject future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    const invalidData = {
      amount: 25.50,
      date: futureDateString,
      vendor: 'Starbucks',
      category: 'Meals',
      employeeName: 'John Doe',
      department: 'Engineering',
    };

    const result = receiptSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Date cannot be in the future');
    }
  });

  it('should reject vendor name longer than 100 characters', () => {
    const invalidData = {
      amount: 25.50,
      date: '2024-01-15',
      vendor: 'A'.repeat(101),
      category: 'Meals',
      employeeName: 'John Doe',
      department: 'Engineering',
    };

    const result = receiptSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Vendor name cannot exceed 100 characters');
    }
  });

  it('should reject description longer than 500 characters', () => {
    const invalidData = {
      amount: 25.50,
      date: '2024-01-15',
      vendor: 'Starbucks',
      category: 'Meals',
      description: 'A'.repeat(501),
      employeeName: 'John Doe',
      department: 'Engineering',
    };

    const result = receiptSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Description cannot exceed 500 characters');
    }
  });

  it('should accept valid file attachment', () => {
    const file = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
    
    const validData = {
      amount: 25.50,
      date: '2024-01-15',
      vendor: 'Starbucks',
      category: 'Meals',
      employeeName: 'John Doe',
      department: 'Engineering',
      attachment: file,
    };

    const result = receiptSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject file larger than 10MB', () => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    
    const invalidData = {
      amount: 25.50,
      date: '2024-01-15',
      vendor: 'Starbucks',
      category: 'Meals',
      employeeName: 'John Doe',
      department: 'Engineering',
      attachment: largeFile,
    };

    const result = receiptSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('File size cannot exceed 10MB');
    }
  });

  it('should reject unsupported file types', () => {
    const unsupportedFile = new File(['test'], 'receipt.txt', { type: 'text/plain' });
    
    const invalidData = {
      amount: 25.50,
      date: '2024-01-15',
      vendor: 'Starbucks',
      category: 'Meals',
      employeeName: 'John Doe',
      department: 'Engineering',
      attachment: unsupportedFile,
    };

    const result = receiptSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Only JPG, PNG, and PDF files are allowed');
    }
  });
});
