import { z } from 'zod';

export const receiptSchema = z.object({
  amount: z
    .number({ message: 'Please enter an amount' })
    .min(0.01, 'Amount must be at least $0.01')
    .max(999999.99, 'Amount cannot exceed $999,999.99'),
  
  date: z
    .string({ message: 'Please choose a purchase date' })
    .min(1, 'Please choose a purchase date')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      return selectedDate <= today;
    }, 'Date cannot be in the future'),
  
  vendor: z
    .string({ message: 'Please enter a vendor name' })
    .min(1, 'Please enter a vendor name')
    .max(100, 'Vendor name cannot exceed 100 characters'),
  
  category: z
    .string({ message: 'Please select an expense category' })
    .min(1, 'Please select an expense category'),
  
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  
  employeeName: z
    .string({ message: 'Please enter your full name' })
    .min(1, 'Please enter your full name')
    .max(100, 'Name cannot exceed 100 characters'),
  
  department: z
    .string({ message: 'Please select a department' })
    .min(1, 'Please select a department'),
  
  attachment: z
    .instanceof(File, { message: 'Please upload a receipt file' })
    .refine(file => file.size <= 10 * 1024 * 1024, 'File size cannot exceed 10MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      'Only JPG, PNG, and PDF files are allowed'
    ),
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;
