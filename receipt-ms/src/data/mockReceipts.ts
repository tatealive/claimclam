import type { Receipt } from '../types';

export const mockReceipts: Receipt[] = [
  {
    id: 1,
    amount: 45.67,
    date: "2024-01-15",
    vendor: "Starbucks",
    category: "Meals",
    description: "Client meeting coffee",
    employeeName: "Sarah Johnson",
    department: "Sales",
    status: "Pending",
    submittedDate: "2024-01-16T10:30:00Z",
    attachmentName: "starbucks_receipt.jpg",
    notes: []
  },
  {
    id: 2,
    amount: 120.00,
    date: "2024-01-10",
    vendor: "Delta Airlines",
    category: "Travel",
    description: "Flight to client site",
    employeeName: "Mike Chen",
    department: "Engineering",
    status: "Approved",
    submittedDate: "2024-01-11T14:45:00Z",
    attachmentName: "boarding_pass.pdf",
    notes: []
  },
  {
    id: 3,
    amount: 89.99,
    date: "2024-01-12",
    vendor: "Office Depot",
    category: "Office Supplies",
    description: "Printer paper and pens",
    employeeName: "Lisa Rodriguez",
    department: "HR",
    status: "Rejected",
    submittedDate: "2024-01-13T09:15:00Z",
    attachmentName: "office_depot.jpg"
  },
  {
    id: 4,
    amount: 156.78,
    date: "2024-01-08",
    vendor: "Hilton Hotel",
    category: "Travel",
    description: "Business trip accommodation",
    employeeName: "David Kim",
    department: "Marketing",
    status: "Approved",
    submittedDate: "2024-01-09T08:20:00Z",
    attachmentName: "hotel_receipt.pdf"
  },
  {
    id: 5,
    amount: 23.45,
    date: "2024-01-14",
    vendor: "Subway",
    category: "Meals",
    description: "Lunch with team",
    employeeName: "Emma Wilson",
    department: "Finance",
    status: "Pending",
    submittedDate: "2024-01-15T12:30:00Z",
    attachmentName: "subway_receipt.jpg"
  },
  {
    id: 6,
    amount: 67.89,
    date: "2024-01-11",
    vendor: "Amazon",
    category: "Office Supplies",
    description: "Desk organizer and notebooks",
    employeeName: "Alex Thompson",
    department: "Engineering",
    status: "Approved",
    submittedDate: "2024-01-12T16:45:00Z",
    attachmentName: "amazon_receipt.pdf"
  },
  {
    id: 7,
    amount: 234.50,
    date: "2024-01-09",
    vendor: "Uber",
    category: "Travel",
    description: "Airport transportation",
    employeeName: "Maria Garcia",
    department: "Sales",
    status: "Pending",
    submittedDate: "2024-01-10T11:15:00Z",
    attachmentName: "uber_receipt.jpg"
  },
  {
    id: 8,
    amount: 45.00,
    date: "2024-01-13",
    vendor: "Panera Bread",
    category: "Meals",
    description: "Team breakfast meeting",
    employeeName: "James Brown",
    department: "HR",
    status: "Approved",
    submittedDate: "2024-01-14T09:00:00Z",
    attachmentName: "panera_receipt.jpg"
  },
  {
    id: 9,
    amount: 89.99,
    date: "2024-01-07",
    vendor: "Best Buy",
    category: "Office Supplies",
    description: "Wireless mouse and keyboard",
    employeeName: "Sarah Johnson",
    department: "Sales",
    status: "Rejected",
    submittedDate: "2024-01-08T14:20:00Z",
    attachmentName: "bestbuy_receipt.pdf"
  },
  {
    id: 10,
    amount: 178.90,
    date: "2024-01-06",
    vendor: "Enterprise Rent-A-Car",
    category: "Travel",
    description: "Rental car for client visit",
    employeeName: "Mike Chen",
    department: "Engineering",
    status: "Approved",
    submittedDate: "2024-01-07T10:30:00Z",
    attachmentName: "enterprise_receipt.pdf"
  },
  {
    id: 11,
    amount: 34.56,
    date: "2024-01-05",
    vendor: "Chipotle",
    category: "Meals",
    description: "Working lunch",
    employeeName: "Lisa Rodriguez",
    department: "HR",
    status: "Pending",
    submittedDate: "2024-01-06T13:45:00Z",
    attachmentName: "chipotle_receipt.jpg"
  },
  {
    id: 12,
    amount: 123.45,
    date: "2024-01-04",
    vendor: "FedEx",
    category: "Office Supplies",
    description: "Shipping costs for documents",
    employeeName: "David Kim",
    department: "Marketing",
    status: "Approved",
    submittedDate: "2024-01-05T15:30:00Z",
    attachmentName: "fedex_receipt.pdf"
  },
  {
    id: 13,
    amount: 67.89,
    date: "2024-01-03",
    vendor: "Lyft",
    category: "Travel",
    description: "Client meeting transportation",
    employeeName: "Emma Wilson",
    department: "Finance",
    status: "Rejected",
    submittedDate: "2024-01-04T11:20:00Z",
    attachmentName: "lyft_receipt.jpg"
  },
  {
    id: 14,
    amount: 45.67,
    date: "2024-01-02",
    vendor: "McDonald's",
    category: "Meals",
    description: "Team dinner",
    employeeName: "Alex Thompson",
    department: "Engineering",
    status: "Approved",
    submittedDate: "2024-01-03T18:15:00Z",
    attachmentName: "mcdonalds_receipt.jpg"
  },
  {
    id: 15,
    amount: 234.56,
    date: "2024-01-01",
    vendor: "Staples",
    category: "Office Supplies",
    description: "Office furniture and supplies",
    employeeName: "Maria Garcia",
    department: "Sales",
    status: "Pending",
    submittedDate: "2024-01-02T09:30:00Z",
    attachmentName: "staples_receipt.pdf",
    notes: []
  }
];

// Add notes property to all receipts if not present
mockReceipts.forEach(receipt => {
  if (!receipt.notes) {
    receipt.notes = [];
  }
});

export const departments = ["Engineering", "Sales", "Marketing", "Finance", "HR"] as const;
export const categories = ["Meals", "Travel", "Office Supplies", "Other"] as const;
export const statuses = ["Pending", "Approved", "Rejected"] as const;
