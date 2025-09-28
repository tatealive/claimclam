import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { receiptSchema, ReceiptFormData } from '../schemas/receiptSchema';
import { useReceipts } from '../store/receiptStore';
import { departments, categories } from '../data/mockReceipts';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * ReceiptSubmissionForm Component
 * 
 * A comprehensive form component for submitting new expense receipts.
 * Features real-time validation, file upload simulation, and success feedback.
 * 
 * @component
 * @returns {JSX.Element} The receipt submission form
 * 
 * @example
 * ```tsx
 * <ReceiptSubmissionForm />
 * ```
 * 
 * @features
 * - Real-time form validation using Zod schema
 * - File upload simulation with progress bar
 * - Mobile-first responsive design
 * - Success feedback with auto-redirect
 * - Currency input with proper formatting
 * - Date validation (no future dates)
 * - File type and size validation
 */
export function ReceiptSubmissionForm() {
  const router = useRouter();
  const { addReceipt } = useReceipts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      category: '',
      description: '',
      employeeName: '',
      department: '',
    }
  });

  const selectedFile = watch('attachment');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('attachment', file);
    }
  };

  const simulateFileUpload = (): Promise<void> => {
    return new Promise((resolve) => {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    });
  };

  const onSubmit = async (data: ReceiptFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate file upload if file is selected
      if (data.attachment) {
        await simulateFileUpload();
      }

      // Add receipt to store
      addReceipt({
        amount: data.amount,
        date: data.date,
        vendor: data.vendor,
        category: data.category as any,
        description: data.description || '',
        employeeName: data.employeeName,
        department: data.department as any,
        status: 'Pending',
        attachmentName: data.attachment?.name
      });

      setShowSuccess(true);
      reset();
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.navigate({ to: '/dashboard' });
      }, 2000);
    } catch (error) {
      console.error('Error submitting receipt:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Receipt Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your receipt has been submitted and is now pending review.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit New Receipt</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0.01"
                    inputMode="decimal"
                    className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  {...register('date')}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Vendor */}
              <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
                  Vendor/Merchant *
                </label>
                <input
                  {...register('vendor')}
                  type="text"
                  maxLength={100}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.vendor ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor name"
                />
                {errors.vendor && (
                  <p className="mt-1 text-sm text-red-600">{errors.vendor.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  maxLength={500}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Optional description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {watch('description')?.length || 0}/500 characters
                </p>
              </div>

              {/* Employee Name */}
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
                  Employee Name *
                </label>
                <input
                  {...register('employeeName')}
                  type="text"
                  maxLength={100}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.employeeName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.employeeName && (
                  <p className="mt-1 text-sm text-red-600">{errors.employeeName.message}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department *
                </label>
                <select
                  {...register('department')}
                  className={`mt-1 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a department</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                  Receipt Image/PDF
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="attachment"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="attachment"
                          name="attachment"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      {selectedFile.name}
                    </div>
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                )}
                
                {errors.attachment && (
                  <p className="mt-1 text-sm text-red-600">{errors.attachment.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.navigate({ to: '/dashboard' })}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
