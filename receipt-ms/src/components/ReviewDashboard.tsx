import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table';
import { useReceipts } from '../store/receiptStore';
import type { Receipt } from '../types';
import { ReceiptDetailsModal } from './ReceiptDetailsModal';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  XMarkIcon as RejectIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Fuse from 'fuse.js';

const columnHelper = createColumnHelper<Receipt>();

/**
 * ReviewDashboard Component
 * 
 * A comprehensive dashboard for reviewing and managing submitted receipts.
 * Features advanced filtering, sorting, pagination, and bulk actions.
 * 
 * @component
 * @returns {JSX.Element} The review dashboard
 * 
 * @example
 * ```tsx
 * <ReviewDashboard />
 * ```
 * 
 * @features
 * - Advanced filtering (status, category, date range)
 * - Fuzzy search using Fuse.js
 * - Sortable columns with visual indicators
 * - Pagination (10 items per page)
 * - Bulk approve/reject actions
 * - Responsive table (cards on mobile)
 * - Row selection with checkboxes
 * - Receipt details modal integration
 */
export function ReviewDashboard() {
  const { receipts, updateReceipt, bulkUpdateStatus } = useReceipts();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fuse.js setup for fuzzy search
  const fuse = useMemo(() => new Fuse(receipts, {
    keys: ['employeeName', 'vendor', 'description'],
    threshold: 0.3,
  }), [receipts]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = receipts;

    // Global search
    if (globalFilter) {
      const searchResults = fuse.search(globalFilter);
      filtered = searchResults.map(result => result.item);
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(receipt => statusFilter.includes(receipt.status));
    }

    // Category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(receipt => categoryFilter.includes(receipt.category));
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(receipt => receipt.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(receipt => receipt.date <= dateTo);
    }

    return filtered;
  }, [receipts, globalFilter, statusFilter, categoryFilter, dateFrom, dateTo, fuse]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(!!e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      columnHelper.accessor('submittedDate', {
        header: 'Date Submitted',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        sortingFn: 'datetime',
      }),
      columnHelper.accessor('employeeName', {
        header: 'Employee',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => `$${info.getValue().toFixed(2)}`,
        sortingFn: 'basic',
      }),
      columnHelper.accessor('vendor', {
        header: 'Vendor',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          const statusColors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Approved: 'bg-green-100 text-green-800',
            Rejected: 'bg-red-100 text-red-800',
          };
          return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedReceipt(row.original)}
              className="text-blue-600 hover:text-blue-900"
              title="View details"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateReceipt(row.original.id, { status: 'Approved' })}
              className="text-green-600 hover:text-green-900"
              title="Approve"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateReceipt(row.original.id, { status: 'Rejected' })}
              className="text-red-600 hover:text-red-900"
              title="Reject"
            >
              <RejectIcon className="h-4 w-4" />
            </button>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [updateReceipt]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const canBulkApprove = selectedRows.length > 0 && selectedRows.some(row => row.original.status === 'Pending');
  const canBulkReject = selectedRows.length > 0 && selectedRows.some(row => row.original.status === 'Pending');

  const handleBulkApprove = () => {
    if (window.confirm(`Approve ${selectedRows.length} selected receipt(s)?`)) {
      const ids = selectedRows.map(row => row.original.id);
      bulkUpdateStatus(ids, 'Approved');
      setRowSelection({});
    }
  };

  const handleBulkReject = () => {
    if (window.confirm(`Reject ${selectedRows.length} selected receipt(s)?`)) {
      const ids = selectedRows.map(row => row.original.id);
      bulkUpdateStatus(ids, 'Rejected');
      setRowSelection({});
    }
  };

  const clearAllFilters = () => {
    setGlobalFilter('');
    setStatusFilter([]);
    setCategoryFilter([]);
    setDateFrom('');
    setDateTo('');
    setColumnFilters([]);
  };

  const statusOptions = ['Pending', 'Approved', 'Rejected'];
  const categoryOptions = ['Meals', 'Travel', 'Office Supplies', 'Other'];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Review Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and review submitted expense receipts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by employee, vendor, or description..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Clear
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-1">
                    {statusOptions.map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStatusFilter([...statusFilter, status]);
                            } else {
                              setStatusFilter(statusFilter.filter(s => s !== status));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="space-y-1">
                    {categoryOptions.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={categoryFilter.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCategoryFilter([...categoryFilter, category]);
                            } else {
                              setCategoryFilter(categoryFilter.filter(c => c !== category));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedRows.length} receipt(s) selected
              </span>
              <div className="flex space-x-2">
                {canBulkApprove && (
                  <button
                    onClick={handleBulkApprove}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Approve Selected
                  </button>
                )}
                {canBulkReject && (
                  <button
                    onClick={handleBulkReject}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <RejectIcon className="h-4 w-4 mr-1" />
                    Reject Selected
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          <span>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: '↑',
                                desc: '↓',
                              }[header.column.getIsSorted() as string] ?? '↕'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Details Modal */}
      {selectedReceipt && (
        <ReceiptDetailsModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
