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
  ColumnResizeMode,
} from '@tanstack/react-table';
import { useReceipts } from '../store/receiptStore';
import type { Receipt } from '../types';
import { ReceiptDetailsModal } from './ReceiptDetailsModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  XMarkIcon as RejectIcon,
  EyeIcon,
  CalendarDaysIcon,
  UserIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon
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
  const [columnSizing, setColumnSizing] = useState({});
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
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
        size: 50,
        minSize: 50,
        maxSize: 50,
      }),
      columnHelper.accessor('submittedDate', {
        header: () => (
          <div className="flex items-center space-x-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Date Submitted</span>
          </div>
        ),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        sortingFn: 'datetime',
        size: 120,
        minSize: 100,
        maxSize: 150,
      }),
      columnHelper.accessor('employeeName', {
        header: () => (
          <div className="flex items-center space-x-1">
            <UserIcon className="h-4 w-4" />
            <span>Employee</span>
          </div>
        ),
        cell: (info) => info.getValue(),
        size: 150,
        minSize: 120,
        maxSize: 200,
      }),
      columnHelper.accessor('department', {
        header: () => (
          <div className="flex items-center space-x-1">
            <BriefcaseIcon className="h-4 w-4" />
            <span>Department</span>
          </div>
        ),
        cell: (info) => info.getValue(),
        size: 120,
        minSize: 100,
        maxSize: 150,
      }),
      columnHelper.accessor('amount', {
        header: () => (
          <div className="flex items-center space-x-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>Amount</span>
          </div>
        ),
        cell: (info) => `$${info.getValue().toFixed(2)}`,
        sortingFn: 'basic',
        size: 100,
        minSize: 80,
        maxSize: 120,
      }),
      columnHelper.accessor('vendor', {
        header: () => (
          <div className="flex items-center space-x-1">
            <BuildingStorefrontIcon className="h-4 w-4" />
            <span>Vendor</span>
          </div>
        ),
        cell: (info) => info.getValue(),
        size: 150,
        minSize: 120,
        maxSize: 200,
      }),
      columnHelper.accessor('category', {
        header: () => (
          <div className="flex items-center space-x-1">
            <TagIcon className="h-4 w-4" />
            <span>Category</span>
          </div>
        ),
        cell: (info) => info.getValue(),
        size: 120,
        minSize: 100,
        maxSize: 150,
      }),
      columnHelper.accessor('description', {
        header: () => (
          <div className="flex items-center space-x-1">
            <ClipboardDocumentListIcon className="h-4 w-4" />
            <span>Description</span>
          </div>
        ),
        cell: (info) => info.getValue() || '-',
        size: 200,
        minSize: 150,
        maxSize: 300,
      }),
      columnHelper.accessor('status', {
        header: () => (
          <div className="flex items-center space-x-1">
            <Cog6ToothIcon className="h-4 w-4" />
            <span>Status</span>
          </div>
        ),
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
        size: 100,
        minSize: 80,
        maxSize: 120,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => (
          <div className="flex items-center space-x-1">
            <Cog6ToothIcon className="h-4 w-4" />
            <span>Actions</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedReceipt(row.original)}
              className="text-blue-600 hover:text-blue-900"
              title="View details"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            {/* Only show approve/reject buttons for pending receipts */}
            {row.original.status === 'Pending' && (
              <>
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
              </>
            )}
          </div>
        ),
        enableSorting: false,
        size: 120,
        minSize: 100,
        maxSize: 150,
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
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange' as ColumnResizeMode,
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
    setConfirmationDialog({
      isOpen: true,
      title: 'Approve Receipts',
      message: `Are you sure you want to approve ${selectedRows.length} selected receipt(s)?`,
      onConfirm: () => {
        const ids = selectedRows.map(row => row.original.id);
        bulkUpdateStatus(ids, 'Approved');
        setRowSelection({});
      },
      variant: 'default'
    });
  };

  const handleBulkReject = () => {
    setConfirmationDialog({
      isOpen: true,
      title: 'Reject Receipts',
      message: `Are you sure you want to reject ${selectedRows.length} selected receipt(s)?`,
      onConfirm: () => {
        const ids = selectedRows.map(row => row.original.id);
        bulkUpdateStatus(ids, 'Rejected');
        setRowSelection({});
      },
      variant: 'danger'
    });
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
      <div className={`px-4 py-6 sm:px-0 transition-all duration-200 ${selectedRows.length > 0 ? 'pb-20' : ''}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Review Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and review submitted expense receipts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-4 sm:p-6">
            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3">
              {/* Search - Full Width */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search receipts..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              {/* Filter Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FunnelIcon className="h-4 w-4 mr-1" />
                  Filters
                </button>
                <button
                  onClick={clearAllFilters}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Clear
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-4">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
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
                        <span className="ml-2 text-sm font-semibold text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
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
                        <span className="ml-2 text-sm font-semibold text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date To</label>
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

        {/* Floating Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedRows.length} receipt{selectedRows.length !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={() => setRowSelection({})}
                    className="text-sm text-gray-500 hover:text-gray-700 underline min-h-[44px] px-2 py-1"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {canBulkApprove && (
                    <button
                      onClick={handleBulkApprove}
                      className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px]"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Approve Selected
                    </button>
                  )}
                  {canBulkReject && (
                    <button
                      onClick={handleBulkReject}
                      className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px]"
                    >
                      <RejectIcon className="h-5 w-5 mr-2" />
                      Reject Selected
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table 
              className="min-w-full divide-y divide-gray-200"
              style={{ width: table.getCenterTotalSize() }}
            >
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 relative"
                        style={{ width: header.getSize() }}
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
                              {header.column.getIsSorted() === 'asc' ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ChevronDownIcon className="h-4 w-4" />
                              ) : (
                                <ChevronUpDownIcon className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </div>
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none ${
                              header.column.getIsResizing() ? 'bg-blue-500' : 'hover:bg-gray-400'
                            }`}
                            style={{
                              transform: 'translateX(50%)',
                            }}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => {
                      const isCheckboxCell = cell.column.id === 'select';
                      const isActionsCell = cell.column.id === 'actions';
                      
                      return (
                        <td 
                          key={cell.id} 
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                            !isCheckboxCell && !isActionsCell ? 'cursor-pointer' : ''
                          }`}
                          style={{ width: cell.column.getSize() }}
                          onClick={!isCheckboxCell && !isActionsCell ? () => setSelectedReceipt(row.original) : undefined}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {table.getRowModel().rows.map(row => {
            const receipt = row.original;
            const statusColors = {
              Pending: 'bg-yellow-100 text-yellow-800',
              Approved: 'bg-green-100 text-green-800',
              Rejected: 'bg-red-100 text-red-800',
            };
            
            return (
              <div 
                key={row.id} 
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
              >
                {/* Card Header - Compact with Status Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      onChange={(e) => {
                        e.stopPropagation();
                        row.toggleSelected(!!e.target.checked);
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <div 
                      className="cursor-pointer flex-1"
                      onClick={() => setSelectedReceipt(receipt)}
                    >
                      <h3 className="text-base font-semibold text-gray-900">{receipt.employeeName}</h3>
                      <p className="text-lg font-bold text-gray-900">${receipt.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[receipt.status]}`}>
                    {receipt.status}
                  </span>
                </div>

                {/* Card Content - Two Column Layout */}
                <div 
                  className="grid grid-cols-2 gap-2 mb-3 text-sm cursor-pointer"
                  onClick={() => setSelectedReceipt(receipt)}
                >
                  <div>
                    <p className="text-gray-600">{receipt.vendor}</p>
                    <p className="text-gray-500 text-xs">{receipt.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{new Date(receipt.submittedDate).toLocaleDateString()}</p>
                    {receipt.description && (
                      <p className="text-gray-500 text-xs truncate" title={receipt.description}>
                        {receipt.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions - Full Width Stacked with Better Touch Targets */}
                <div className="space-y-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReceipt(receipt);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    View Details
                  </button>
                  
                  {/* Only show approve/reject buttons for pending receipts */}
                  {receipt.status === 'Pending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateReceipt(receipt.id, { status: 'Approved' });
                        }}
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                      >
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateReceipt(receipt.id, { status: 'Rejected' });
                        }}
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
                      >
                        <RejectIcon className="h-5 w-5 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                  
                  {/* Show status message for non-pending receipts */}
                  {receipt.status !== 'Pending' && (
                    <div className="text-center py-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        receipt.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {receipt.status === 'Approved' ? (
                          <>
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Already Approved
                          </>
                        ) : (
                          <>
                            <RejectIcon className="h-4 w-4 mr-1" />
                            Already Rejected
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          {/* Mobile Pagination - Enhanced */}
          <div className="flex-1 flex flex-col space-y-3 sm:hidden">
            {/* Page Info */}
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
                <span className="font-medium">{table.getPageCount()}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )} of {table.getFilteredRowModel().rows.length} results
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Page Jump - Quick Access */}
            {table.getPageCount() > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs text-gray-500">Go to page:</span>
                <select
                  value={table.getState().pagination.pageIndex}
                  onChange={(e) => table.setPageIndex(Number(e.target.value))}
                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <option key={i} value={i}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
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

      {/* Receipt Details Modal */}
      {selectedReceipt && (
        <ReceiptDetailsModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        variant={confirmationDialog.variant}
      />
    </div>
  );
}
