# CSR API Integration Documentation

## Overview

The CSR frontend integrates with various backend APIs to manage corporate social responsibility features. This document outlines the API endpoints, data structures, and integration patterns used throughout the CSR module.

## API Client Architecture

### ApiClient Class
**Location:** `src/api/apiClient/apiClient.ts`

The CSR module uses a centralized `ApiClient` class that provides:
- Consistent error handling
- Authentication token management
- Request/response interceptors
- Standardized API communication

```typescript
const apiClient = new ApiClient();
```

## Core API Endpoints

### 1. Groups Management

#### Get Groups
```typescript
// Endpoint: GET /api/groups
const getGroups = async (offset: number, limit: number, filters: GridFilterItem[], orderBy?: Order[]) => {
  return await apiClient.getGroups(offset, limit, filters, orderBy);
};
```

**Usage in Components:**
```typescript
// CSRHeader.tsx
const getGroupsData = async () => {
  const groupNameFilter = {
    columnField: "name",
    value: groupNameInput,
    operatorValue: "contains",
  };
  const filters = [groupNameFilter];
  getGroups(groupPage * 10, 10, filters);
};
```

#### Update Group
```typescript
// Endpoint: PUT /api/groups/:id
const updateGroup = async (group: Group) => {
  return await apiClient.updateGroup(group);
};
```

**Data Structure:**
```typescript
interface Group {
  id: number;
  name: string;
  type: string;
  description: string;
  logo_url: string | null;
  address: string | null;
  billing_email: string;
  created_at: Date;
  updated_at: Date;
  sponsored_trees?: number;
}
```

### 2. Gift Cards Management

#### Get Gift Cards
```typescript
// Endpoint: GET /api/gift-cards
const getGiftCards = async (offset: number, limit: number, filters: GridFilterItem[], orderBy?: Order[]) => {
  return await apiClient.getGiftCards(offset, limit, filters, orderBy);
};
```

**Filter Implementation:**
```typescript
// CSRGiftRequests.tsx
const getFilters = (filters: any, groupId: number) => {
  let filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
  
  // Status filter transformation
  const statusFilterIndex = filtersData.findIndex(item => item.columnField === 'status');
  if (statusFilterIndex !== -1) {
    const statusFilter = filtersData[statusFilterIndex];
    const statuses: string[] = [];
    
    if ((statusFilter.value as string[]).includes('Pending Tree Allocation')) {
      statuses.push('pending_plot_selection');
    }
    
    if ((statusFilter.value as string[]).includes('Trees Allocated')) {
      statuses.push('pending_assignment', 'completed');
    }
    
    filtersData[statusFilterIndex].value = statuses;
  }

  return [
    ...filtersData, 
    { columnField: 'group_id', operatorValue: 'equals', value: groupId },
    { columnField: 'tags', operatorValue: 'contains', value: ['PrePurchased'] }
  ];
};
```

**Data Structure:**
```typescript
interface GiftCard {
  id: number;
  no_of_cards: number;
  created_by_name: string;
  status: string;
  total_amount: number;
  amount_received: number;
  payment_status: string;
  created_at: Date;
  payment_id?: string;
  request_id: string;
}
```

### 3. Donations Management

#### Get Donations
```typescript
// Endpoint: GET /api/donations
const getDonations = async (offset: number, limit: number, filters: GridFilterItem[], orderBy?: Order[]) => {
  return await apiClient.getDonations(offset, limit, filters, orderBy);
};
```

#### Bulk Assign Trees to Donation Users
```typescript
// Endpoint: POST /api/donations/bulk-assign-trees
const bulkAssignTreesToDonationUsers = async (groupId: number, recipients: any[]) => {
  return await apiClient.bulkAssignTreesToDonationUsers(groupId, recipients);
};
```

**Usage Example:**
```typescript
// CSRDonations.tsx
const handleBulkSubmit = async (recipients: any[]) => {
  const updatedRecipients = recipients.map(item => {
    item.recipient_name = item.recipient_name?.trim();
    item.assignee_name = item.assignee_name?.trim() || item.recipient_name;
    
    // Auto-generate email if not provided
    item.recipient_email = item.recipient_email?.trim() 
      ? item.recipient_email?.trim()
      : `${item.recipient_name.toLowerCase().split(" ").join(".")}${userName?.toLowerCase().replaceAll(" ", "")}@14trees`;
    
    return item;
  });

  try {
    await apiClient.bulkAssignTreesToDonationUsers(selectedGroup.id, updatedRecipients);
    toast.success('Trees assigned successfully!');
  } catch (error) {
    toast.error(error.message);
  }
};
```

**Data Structure:**
```typescript
interface Donation {
  id: number;
  user_name: string;
  trees_count: number;
  amount_donated: number;
  status: string;
  payment_status: string;
  created_at: Date;
  booked: number;
  amount_received: number;
  payment_id?: string;
  request_id: string;
}
```

### 4. Trees Management

#### Get Trees
```typescript
// Endpoint: GET /api/trees
const getTrees = async (groupId: number, filter: string, searchUser: string) => {
  // Implementation varies based on filter type
};
```

**Filter Types:**
- `gifted` - Trees that have been gifted
- `non-gifted` - Available trees for gifting
- `all` - All trees regardless of status

**Data Structure:**
```typescript
interface Tree {
  id: number;
  sapling_id: string;
  plant_type: string;
  gifted_by?: string;
  gift_card_id?: number;
  logo_url?: string;
  // Additional tree properties
}
```

### 5. Gift Redeem Transactions

#### Get Gift Transactions
```typescript
// Endpoint: GET /api/gift-transactions
const getGiftTransactions = async (groupId: number, filters: any) => {
  return await apiClient.getGiftTransactions(groupId, filters);
};
```

**Data Structure:**
```typescript
interface GiftRedeemTransaction {
  id: number;
  tree_id: number;
  recipient_name: string;
  recipient_email: string;
  message: string;
  created_at: Date;
  status: string;
  // Additional transaction properties
}
```

### 6. Payment Processing

#### Create Payment Order
```typescript
// Endpoint: POST /api/payments/create-order
const createPaymentOrder = async (amount: number, currency: string, receipt: string) => {
  return await apiClient.createPaymentOrder(amount, currency, receipt);
};
```

#### Verify Payment
```typescript
// Endpoint: POST /api/payments/verify
const verifyPayment = async (paymentData: any) => {
  return await apiClient.verifyPayment(paymentData);
};
```

**Razorpay Integration:**
```typescript
// PurchaseTreesForm.tsx
const handlePaymentSuccess = async (response: any) => {
  try {
    const verificationResult = await apiClient.verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });
    
    if (verificationResult.success) {
      setPaymentStatus('success');
      onSuccess?.();
    }
  } catch (error) {
    setPaymentStatus('failed');
    setError(error.message);
  }
};
```

### 7. File Upload Management

#### AWS S3 Integration
```typescript
// AWSUtils class for file uploads
const awsUtils = new AWSUtils();

const uploadFile = async (bucketName: string, file: File, folder: string) => {
  return await awsUtils.uploadFileToS3(bucketName, file, folder);
};
```

**Usage in Components:**
```typescript
// CSRSettings.tsx
const handleSaveOrganization = async (updatedData: any, logoFile?: File) => {
  if (logoFile) {
    const awsUtil = new AWSUtils();
    const url = await awsUtil.uploadFileToS3("gift-request", logoFile, "logos");
    updatedData.logo_url = url;
  }
  
  const response = await apiClient.updateGroup(updatedData);
  onGroupChange(response);
};
```

### 8. View Management

#### Get View Details
```typescript
// Endpoint: GET /api/views/details
const getViewDetails = async (viewPath: string) => {
  return await apiClient.getViewDetails(viewPath);
};
```

#### Verify View Access
```typescript
// Endpoint: POST /api/views/verify-access
const verifyViewAccess = async (viewId: string, userId: number, pathname: string) => {
  return await apiClient.verifyViewAccess(viewId, userId, pathname);
};
```

**Usage in Authentication:**
```typescript
// CSRPage.tsx
useEffect(() => {
  const intervalId = setTimeout(async () => {
    try {
      const viewId = searchParams.get("v") || "";
      const apiClient = new ApiClient();
      const resp = await apiClient.verifyViewAccess(viewId, userId, location.pathname);
      setStatus(resp);
    } catch (error) {
      toast.error(error.message);
    }
  }, 300);
}, [location]);
```

#### Add/Remove View Users
```typescript
// Endpoint: POST /api/views/:id/users
const addViewUsers = async (viewId: number, users: any[]) => {
  return await apiClient.addViewUsers(viewId, users);
};

// Endpoint: DELETE /api/views/:id/users
const deleteViewUsers = async (viewId: number, users: any[]) => {
  return await apiClient.deleteViewUsers(viewId, users);
};
```

## Error Handling Patterns

### Standard Error Response
```typescript
interface ApiError {
  message: string;
  code: number;
  details?: any;
}
```

### Error Handling in Components
```typescript
try {
  const result = await apiClient.someMethod();
  // Handle success
} catch (error: any) {
  toast.error(error.message || 'An error occurred');
  console.error('API Error:', error);
}
```

### Global Error Handling
The ApiClient implements global error handling for:
- Network errors
- Authentication failures
- Server errors
- Validation errors

## Data Transformation Patterns

### Filter Transformation
```typescript
const transformFilters = (filters: Record<string, GridFilterItem>, groupId: number) => {
  const filtersData = Object.values(filters).map(filter => {
    // Transform filter values based on field type
    if (filter.columnField === 'status') {
      return transformStatusFilter(filter);
    }
    return filter;
  });
  
  // Add group filter
  filtersData.push({
    columnField: 'group_id',
    operatorValue: 'equals',
    value: groupId
  });
  
  return filtersData;
};
```

### Data Normalization
```typescript
const normalizeRecipientData = (recipients: any[], userName: string) => {
  return recipients.map(item => ({
    ...item,
    recipient_name: item.recipient_name?.trim(),
    assignee_name: item.assignee_name?.trim() || item.recipient_name,
    recipient_email: item.recipient_email?.trim() || generateEmail(item.recipient_name, userName),
    assignee_email: item.assignee_email?.trim() || generateEmail(item.recipient_name, userName)
  }));
};
```

## Caching Strategy

### Redux Store Caching
- API responses are cached in Redux store
- Pagination mapping for efficient data access
- Selective updates to minimize re-renders

### Local Storage
- Authentication tokens
- User preferences
- Session data

## Rate Limiting & Optimization

### Debounced API Calls
```typescript
useEffect(() => {
  const handler = setTimeout(() => {
    getGroupsData();
  }, 300);

  return () => clearTimeout(handler);
}, [groupPage, groupNameInput]);
```

### Pagination
- Server-side pagination for large datasets
- Client-side pagination mapping
- Lazy loading of data

## Security Considerations

### Authentication
- JWT tokens in request headers
- Token refresh handling
- Secure token storage

### Data Validation
- Client-side validation before API calls
- Server-side validation responses
- Input sanitization

### CORS & CSP
- Proper CORS configuration
- Content Security Policy headers
- Secure API endpoints

This API integration architecture ensures robust, scalable, and secure communication between the CSR frontend and backend services.