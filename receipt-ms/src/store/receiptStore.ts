import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Receipt, ReceiptStore } from '../types';
import { mockReceipts } from '../data/mockReceipts';

/**
 * Zustand store for managing receipt data
 * 
 * Provides state management for receipts with localStorage persistence.
 * Includes CRUD operations and bulk actions for receipt management.
 * 
 * @example
 * ```tsx
 * const { receipts, addReceipt, updateReceipt } = useReceipts();
 * ```
 * 
 * @features
 * - Persistent storage via localStorage
 * - CRUD operations for receipts
 * - Bulk status updates
 * - Notes management
 * - Type-safe state management
 */
export const useReceipts = create<ReceiptStore>()(
  persist(
    (set, get) => ({
      receipts: mockReceipts,
      
      addReceipt: (receiptData) => {
        const newReceipt: Receipt = {
          ...receiptData,
          id: Math.max(...get().receipts.map(r => r.id)) + 1,
          submittedDate: new Date().toISOString(),
          notes: []
        };
        set((state) => ({
          receipts: [...state.receipts, newReceipt]
        }));
      },
      
      updateReceipt: (id, updates) => {
        set((state) => ({
          receipts: state.receipts.map(receipt =>
            receipt.id === id ? { ...receipt, ...updates } : receipt
          )
        }));
      },
      
      deleteReceipt: (id) => {
        set((state) => ({
          receipts: state.receipts.filter(receipt => receipt.id !== id)
        }));
      },
      
      bulkUpdateStatus: (ids, status) => {
        set((state) => ({
          receipts: state.receipts.map(receipt =>
            ids.includes(receipt.id) ? { ...receipt, status } : receipt
          )
        }));
      },
      
      addNote: (id, note) => {
        set((state) => ({
          receipts: state.receipts.map(receipt =>
            receipt.id === id 
              ? { ...receipt, notes: [...(receipt.notes || []), note] }
              : receipt
          )
        }));
      },
      
      deleteNote: (id, noteIndex) => {
        set((state) => ({
          receipts: state.receipts.map(receipt =>
            receipt.id === id 
              ? { 
                  ...receipt, 
                  notes: receipt.notes?.filter((_, index) => index !== noteIndex) || []
                }
              : receipt
          )
        }));
      }
    }),
    {
      name: 'receipts-storage',
    }
  )
);
