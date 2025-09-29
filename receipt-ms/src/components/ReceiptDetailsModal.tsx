import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useReceipts } from '../store/receiptStore';
import type { Receipt } from '../types';
import FilePreview from './FilePreview';
import { ConfirmationDialog } from './ConfirmationDialog';

interface ReceiptDetailsModalProps {
  receipt: Receipt;
  onClose: () => void;
}

/**
 * Modal component for displaying detailed receipt information
 * Includes image preview, notes section, and approve/reject actions
 */
export function ReceiptDetailsModal({ receipt, onClose }: ReceiptDetailsModalProps) {
  const { updateReceipt, addNote, deleteNote, receipts } = useReceipts();
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'default' | 'danger' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
  // Get the current receipt state to show updated notes immediately
  const currentReceipt = receipts.find(r => r.id === receipt.id) || receipt;

  const handleApprove = () => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Approve Receipt',
      message: 'Are you sure you want to approve this receipt?',
      onConfirm: () => {
        updateReceipt(receipt.id, { status: 'Approved' });
        onClose();
      },
      variant: 'default'
    });
  };

  const handleReject = () => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Reject Receipt',
      message: 'Are you sure you want to reject this receipt?',
      onConfirm: () => {
        updateReceipt(receipt.id, { status: 'Rejected' });
        onClose();
      },
      variant: 'danger'
    });
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      addNote(receipt.id, newNote.trim());
      setNewNote('');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDeleteNote = (noteIndex: number) => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note?',
      onConfirm: () => {
        deleteNote(receipt.id, noteIndex);
      },
      variant: 'danger'
    });
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Transition appear show={!!receipt} as="div">
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center space-x-3">
                    <span>Receipt Status:</span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      receipt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      receipt.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {receipt.status}
                    </span>
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">

                  {/* Receipt Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Amount</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(receipt.amount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date</span>
                      <p className="text-gray-900">{formatDate(receipt.date)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Vendor</span>
                      <p className="text-gray-900">{receipt.vendor}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Category</span>
                      <p className="text-gray-900">{receipt.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Employee</span>
                      <p className="text-gray-900">{receipt.employeeName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Department</span>
                      <p className="text-gray-900">{receipt.department}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Description</span>
                      <p className="text-gray-900">{receipt.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Submitted</span>
                      <p className="text-gray-900">{formatDateTime(receipt.submittedDate)}</p>
                    </div>
                  </div>

                  {/* Attachment */}
                  {receipt.attachmentName && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Attachment</span>
                      <div className="mt-2 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FilePreview 
                          fileName={receipt.attachmentName} 
                          width={80} 
                          height={80} 
                          showModal={true}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {receipt.attachmentName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {receipt.attachmentName.split('.').pop()?.toUpperCase()} file
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes Section */}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Notes</span>
                    <div className="mt-2 space-y-3">
                      {currentReceipt.notes && currentReceipt.notes.length > 0 ? (
                        <div className="space-y-2">
                          {currentReceipt.notes.map((note, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between group">
                              <p className="text-sm text-gray-900 flex-1 pr-2">{note}</p>
                              <button
                                onClick={() => handleDeleteNote(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Delete note"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No notes added yet</p>
                      )}
                      
                      {/* Add Note Form */}
                      <form onSubmit={handleAddNote} className="flex space-x-2">
                        <input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                          type="submit"
                          disabled={!newNote.trim() || isSubmittingNote}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmittingNote ? 'Adding...' : 'Add Note'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                  {receipt.status === 'Pending' && (
                    <>
                      <button
                        onClick={handleReject}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                      <button
                        onClick={handleApprove}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      </Transition>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        variant={confirmationDialog.variant}
      />
    </>
  );
}
