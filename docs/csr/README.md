# CSR (Corporate Social Responsibility) Frontend Documentation

## Overview

The CSR module is a comprehensive Corporate Social Responsibility dashboard system that enables organizations to manage their environmental impact through tree sponsorship, donations, and gift programs. This documentation provides a detailed technical overview of the frontend implementation.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Features](#features)
4. [Data Flow](#data-flow)
5. [Routing](#routing)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [User Interface](#user-interface)
9. [Security & Authentication](#security--authentication)
10. [File Structure](#file-structure)

## Architecture Overview

The CSR frontend is built using React with TypeScript, following a modular component-based architecture. The system is designed around the concept of corporate groups that can manage their environmental initiatives through various features.

### Key Technologies
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Ant Design** for data tables
- **Razorpay** for payment integration
- **AWS S3** for file uploads

## Core Components

### 1. CSRPage (Main Dashboard)
**File:** `CSRPage.tsx`

The main dashboard component that serves as the entry point for the CSR module. It provides a tabbed interface with the following sections:

- **Green Tribute Wall** - Display and manage gifted trees
- **Pre-Purchase** - Manage tree purchase requests
- **Gift History** - View historical gift transactions
- **Donations** - Manage donation campaigns
- **Corporate Settings** - Organization configuration

**Key Features:**
- Authentication and authorization checks
- Dynamic tab navigation
- Responsive design for mobile and desktop
- Integration with user roles (Admin, SuperAdmin)

### 2. CSRHeader
**File:** `CSRHeader.tsx`

Provides the header section with organization selection and branding.

**Features:**
- Corporate group selection with autocomplete
- Organization logo display
- Share page functionality
- Responsive layout

### 3. CSRInventory / CSRGiftTrees
**File:** `CSRInventory.tsx`, `CSRGiftTrees.tsx`

Manages the Green Tribute Wall functionality for displaying and managing tree gifts.

**Features:**
- Tree filtering (gifted, non-gifted, all)
- Search functionality by recipient name
- Gift analytics dashboard
- Individual and bulk tree gifting
- Tree grid display with pagination
- Image viewing modal
- Transaction management

### 4. CSRGiftRequests
**File:** `CSRGiftRequests.tsx`

Handles pre-purchase tree requests and order management.

**Features:**
- Purchase request table with filtering and sorting
- Status tracking (Pending Tree Allocation, Trees Allocated)
- Payment status management
- Purchase form integration
- Export functionality

### 5. CSRDonations
**File:** `CSRDonations.tsx`

Manages donation campaigns and tracking.

**Features:**
- Donation analytics
- Donation history table
- Bulk donation assignment
- Payment processing
- Status tracking (Pending, Completed)

### 6. CSRSettings
**File:** `CSRSettings.tsx`

Organization configuration and user management.

**Features:**
- Organization profile editing
- Logo upload and management
- User onboarding and removal
- Share page functionality

## Features

### 1. Green Tribute Wall
A visual representation of all trees gifted by the organization, featuring:
- **Tree Cards Display**: Visual grid of tree cards with recipient information
- **Filtering Options**: Filter by gifted/non-gifted status
- **Search Functionality**: Search trees by recipient name
- **Analytics Dashboard**: Statistics on total trees, gifted trees, and available inventory
- **Individual Gifting**: Gift single trees to recipients
- **Bulk Gifting**: Mass gift trees using CSV upload or manual entry
- **Image Gallery**: View tree and location images

### 2. Pre-Purchase System
Enables organizations to pre-purchase trees for future gifting:
- **Purchase Forms**: Multi-step forms for tree purchasing
- **Order Management**: Track purchase requests and status
- **Payment Integration**: Razorpay integration for online payments
- **File Upload**: Support for payment proof uploads
- **Status Tracking**: Monitor allocation and completion status

### 3. Donation Management
Comprehensive donation tracking and management:
- **Donation Forms**: Create donation campaigns
- **Analytics**: Track donation progress and impact
- **Bulk Assignment**: Assign trees to multiple recipients
- **Payment Processing**: Handle donation payments
- **Status Monitoring**: Track completion status

### 4. Corporate Settings
Organization configuration and user management:
- **Profile Management**: Edit organization details and branding
- **User Onboarding**: Add and remove users from the dashboard
- **Access Control**: Manage user permissions and access
- **Share Functionality**: Generate shareable dashboard links

## Data Flow

### 1. Authentication Flow
```
User Access → Route Guard → Auth Check → Role Verification → Dashboard Access
```

### 2. Data Loading Flow
```
Component Mount → API Call → Redux Store Update → Component Re-render
```

### 3. Form Submission Flow
```
Form Input → Validation → API Call → Success/Error Handling → State Update
```

## Routing

The CSR module uses the following routing structure:

```
/csr/dashboard/:groupId - Main CSR dashboard for specific group
/admin/corporate-dashboard - Admin view for CSR management
```

### Route Protection
- All CSR routes are protected by `RequireAuth` component
- Role-based access control (Admin, SuperAdmin)
- Group-specific access verification

## State Management

### Redux Store Structure
```typescript
interface CSRState {
  groupsData: GroupsDataState;
  giftCardsData: GiftCardsDataState;
  donationsData: DonationsDataState;
  treesData: TreesDataState;
}
```

### Key Actions
- `getGroups` - Fetch corporate groups
- `getGiftCards` - Fetch gift card requests
- `getDonations` - Fetch donation data
- `getTrees` - Fetch tree inventory

## API Integration

### Key API Endpoints
- `/api/groups` - Group management
- `/api/gift-cards` - Gift card operations
- `/api/donations` - Donation management
- `/api/trees` - Tree inventory
- `/api/payments` - Payment processing

### API Client
Uses a centralized `ApiClient` class for all API communications with:
- Request/response interceptors
- Error handling
- Authentication token management

## User Interface

### Design System
- **Material-UI Components**: Consistent design language
- **Responsive Design**: Mobile-first approach
- **Theme Integration**: Custom color schemes and typography
- **Accessibility**: WCAG compliant components

### Key UI Patterns
- **Data Tables**: Ant Design tables with filtering and sorting
- **Forms**: Multi-step forms with validation
- **Modals**: Dialog-based interactions
- **Cards**: Information display cards
- **Charts**: Analytics visualization

## Security & Authentication

### Authentication Methods
- JWT token-based authentication
- Role-based access control
- Session management
- Secure API communication

### Authorization Levels
- **SuperAdmin**: Full system access
- **Admin**: Organization-specific access
- **User**: Limited dashboard access

### Security Features
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure file uploads

## File Structure

```
apps/frontend/src/pages/admin/csr/
├── CSRPage.tsx                 # Main dashboard component
├── CSRAdminPage.tsx           # Admin-specific dashboard
├── CSRHeader.tsx              # Header with group selection
├── CSRInventory.tsx           # Tree inventory wrapper
├── CSRGiftTrees.tsx           # Green Tribute Wall
├── CSRGiftRequests.tsx        # Pre-purchase management
├── CSRGiftHistory.tsx         # Gift transaction history
├── CSRDonations.tsx           # Donation management
├── CSRSettings.tsx            # Organization settings
├── CSRBulkGift.tsx           # Bulk gifting functionality
├── CSRBulkDonation.tsx       # Bulk donation assignment
├── CSRSharePageDialog.tsx     # Share functionality
├── EditOrganizationDialog.tsx # Organization editing
├── SinglePageDrawer.tsx       # Navigation drawer
├── SitesMap.tsx              # Map visualization
├── components/               # Shared components
│   ├── DonationCSV.tsx
│   ├── DonationManual.tsx
│   ├── ManualUserAdd.tsx
│   └── PaymentDialog.tsx
└── form/                     # Form components
    ├── CSRForm.tsx
    ├── DonateTreesForm.tsx
    ├── PurchaseTreesForm.tsx
    └── components/
        ├── DonationSummary.tsx
        ├── FileUploadField.tsx
        ├── PlantationInfoTab.tsx
        ├── PurchaseSummary.tsx
        ├── RecipientDetailsTab.tsx
        ├── SponsorDetailsTab.tsx
        └── TreesCount.tsx
```

## Technical Implementation Details

### Component Patterns
- **Functional Components**: All components use React hooks
- **TypeScript**: Strong typing throughout the codebase
- **Custom Hooks**: Reusable logic extraction
- **Error Boundaries**: Graceful error handling

### Performance Optimizations
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Pagination**: Large datasets handled with pagination
- **Debouncing**: Search and filter operations debounced

### Testing Strategy
- **Unit Tests**: Component-level testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User workflow testing
- **Accessibility Tests**: WCAG compliance testing

## Deployment Considerations

### Build Configuration
- **Environment Variables**: Configuration management
- **Asset Optimization**: Image and bundle optimization
- **CDN Integration**: Static asset delivery
- **Caching Strategy**: Browser and API caching

### Monitoring
- **Error Tracking**: Runtime error monitoring
- **Performance Metrics**: Core web vitals tracking
- **User Analytics**: Usage pattern analysis
- **API Monitoring**: Backend service health

---

*This documentation is maintained by the 14Trees development team and should be updated with any significant changes to the CSR module.*