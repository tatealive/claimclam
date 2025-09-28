import { z } from 'zod';

/**
 * Zod schema for receipt form validation
 * 
 * Defines validation rules for all receipt form fields including
 * amount, date, vendor, category, description, employee info, and file upload.
 * 
 * @example
 * ```tsx
 * const result = receiptSchema.safeParse(formData);
 * if (result.success) {
 *   // Process valid data
 * } else {
 *   // Handle validation errors
 * }
 * ```
 * 
 * @features
 * - Amount validation (min $0.01, max $999,999.99)
 * - Date validation (no future dates)
 * - String length validation for all text fields
 * - File type and size validation
 * - Type-safe form data inference
 */
export const receiptSchema = z.object({
  amount: z
    .number({ message: 'Amount is required' })
    .min(0.01, 'Amount must be at least $0.01')
    .max(999999.99, 'Amount cannot exceed $999,999.99'),
  
  date: z
    .string({ message: 'Date is required' })
    .min(1, 'Date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      return selectedDate <= today;
    }, 'Date cannot be in the future'),
  
  vendor: z
    .string({ message: 'Vendor is required' })
    .min(1, 'Vendor is required')
    .max(100, 'Vendor name cannot exceed 100 characters'),
  
  category: z
    .string({ message: 'Category is required' })
    .min(1, 'Category is required'),
  
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  
  employeeName: z
    .string({ message: 'Employee name is required' })
    .min(1, 'Employee name is required')
    .max(100, 'Employee name cannot exceed 100 characters'),
  
  department: z
    .string({ message: 'Department is required' })
    .min(1, 'Department is required'),
  
  attachment: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSize;
    }, 'File size cannot exceed 10MB')
    .refine((file) => {
      if (!file) return true;
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return allowedTypes.includes(file.type);
    }, 'Only JPG, PNG, and PDF files are allowed')
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;
