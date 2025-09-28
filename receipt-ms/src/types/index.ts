export interface Receipt {
  id: number;
  amount: number;
  date: string;
  vendor: string;
  category: 'Meals' | 'Travel' | 'Office Supplies' | 'Other';
  description?: string;
  employeeName: string;
  department: 'Engineering' | 'Sales' | 'Marketing' | 'Finance' | 'HR';
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  attachmentName?: string;
  notes?: string[];
}

export interface ReceiptFormData {
  amount: number;
  date: string;
  vendor: string;
  category: string;
  description: string;
  employeeName: string;
  department: string;
  attachment?: File;
}

export interface ReceiptStore {
  receipts: Receipt[];
  addReceipt: (receipt: Omit<Receipt, 'id' | 'submittedDate'>) => void;
  updateReceipt: (id: number, updates: Partial<Receipt>) => void;
  deleteReceipt: (id: number) => void;
  bulkUpdateStatus: (ids: number[], status: Receipt['status']) => void;
  addNote: (id: number, note: string) => void;
}
