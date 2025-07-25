# Previous Donations Upload Implementation Plan

## Overview

This document outlines the plan for implementing a one-time functionality to upload previous donations that were made before the current system was designed. These donations were all bank transfers and need to be imported from a Google Spreadsheet without creating Razorpay payment objects.

## Problem Statement

- Previous donations exist in a Google Spreadsheet
- All previous donations were bank transfers (no Razorpay integration)
- Current system creates Razorpay orders for all payments, which is not applicable for historical data
- Need a one-time admin functionality to import this data without exposing it to end users

## Current System Analysis

### Existing Architecture
- **API**: Express.js with TypeScript using Sequelize ORM
- **Database**: PostgreSQL with models for donations, payments, and payment_history
- **Admin Interface**: React-based admin interface at `/apps/frontend/src/pages/admin/donation/`
- **Payment Integration**: Razorpay integration for current donations
- **Google Sheets**: Integration for donation tracking

### Current Models
- **Payment**: Stores payment records with optional `order_id` (Razorpay)
- **PaymentHistory**: Tracks payment transactions and methods
- **Donation**: Main donation records with status tracking and sponsorship types

## Solution Architecture

### 1. Admin-Only Interface

**Location**: `/Users/admin/Projects/14trees-web-monorepo/apps/frontend/src/pages/admin/donation/ImportPrevious.tsx`

**Features**:
- Protected admin route (requires admin authentication)
- CSV/Excel file upload interface
- Data validation and preview
- Bulk import functionality
- Progress tracking and error reporting
- Integration with existing admin layout

### 2. Backend API Endpoints

#### 2.1 New API Endpoint: `POST /api/donations/import-previous`

**Purpose**: Import previous donations with bank transfer payments

**Request Body**:
```json
{
  "donations": [
    {
      "sponsor_name": "John Doe",
      "sponsor_email": "john@example.com",
      "sponsor_phone": "9876543210",
      "amount": 15000,
      "trees_count": 10,
      "donation_date": "2023-01-15",
      "payment_method": "Bank Transfer",
      "payment_reference": "NEFT123456789",
      "category": "Foundation",
      "grove": "Green Grove",
      "donation_type": "donate",
      "donation_method": "trees",
      "pan_number": "ABCDE1234F",
      "comments": "Previous donation import",
      "users": [
        {
          "recipient_name": "Jane Doe",
          "recipient_email": "jane@example.com",
          "trees_count": 5,
          "assignee_name": "John Doe",
          "relation": "Father"
        }
      ]
    }
  ]
}
```

#### 2.2 Enhanced Payment Controller

**File**: `/Users/admin/Projects/14trees-web-monorepo/apps/api/src/controllers/paymentController.ts`

Add new function:
```typescript
export const createPreviousPayment = async (paymentData: {
  amount: number;
  donor_type?: string;
  pan_number?: string;
  payment_date: Date;
  payment_method: string;
  payment_reference?: string;
}) => {
  // Create payment without Razorpay order_id
  const request: PaymentCreationAttributes = {
    amount: paymentData.amount,
    donor_type: paymentData.donor_type || 'Individual',
    pan_number: paymentData.pan_number || null,
    order_id: null, // No Razorpay order for previous donations
    consent: true, // Assume consent for previous donations
    created_at: paymentData.payment_date,
    updated_at: paymentData.payment_date,
  };
  
  const payment = await PaymentRepository.createPayment(request);
  
  // Create payment history record
  const historyData: PaymentHistoryCreationAttributes = {
    payment_id: payment.id,
    amount: paymentData.amount,
    payment_method: paymentData.payment_method,
    payment_proof: paymentData.payment_reference || null,
    amount_received: paymentData.amount,
    payment_date: paymentData.payment_date,
    payment_received_date: paymentData.payment_date,
    status: 'payment_received', // Mark as received for historical data
    created_at: paymentData.payment_date,
    updated_at: paymentData.payment_date,
  };
  
  await PaymentRepository.createPaymentHistory(historyData);
  
  return payment;
};
```

#### 2.3 Enhanced Donation Service

**File**: `/Users/admin/Projects/14trees-web-monorepo/apps/api/src/facade/donationService.ts`

Add new method:
```typescript
public static async createPreviousDonation(donationData: {
  sponsor_name: string;
  sponsor_email: string;
  sponsor_phone?: string;
  category: LandCategory;
  grove?: string;
  trees_count: number;
  amount_donated: number;
  donation_type: DonationType;
  donation_method: DonationMethod;
  comments?: string;
  tags?: string[];
  payment_data: {
    amount: number;
    payment_date: Date;
    payment_method: string;
    payment_reference?: string;
    pan_number?: string;
  };
  users?: DonationUserRequest[];
}) {
  // 1. Create payment record without Razorpay
  const payment = await createPreviousPayment(donationData.payment_data);
  
  // 2. Create donation record with payment_id
  const donation = await this.createDonation({
    sponsor_name: donationData.sponsor_name,
    sponsor_email: donationData.sponsor_email,
    sponsor_phone: donationData.sponsor_phone,
    category: donationData.category,
    grove: donationData.grove || '',
    trees_count: donationData.trees_count,
    amount_donated: donationData.amount_donated,
    donation_type: donationData.donation_type,
    donation_method: donationData.donation_method,
    comments: donationData.comments,
    tags: donationData.tags,
    payment_id: payment.id,
    status: 'Paid', // Mark as paid since it's historical data
    pledged_area_acres: null,
    contribution_options: [],
    visit_date: null,
  });
  
  // 3. Update donation with historical data
  await DonationRepository.updateDonation(donation.id, {
    donation_date: donationData.payment_data.payment_date,
    amount_received: donationData.payment_data.amount,
    sponsorship_type: 'Donation Received',
    created_at: donationData.payment_data.payment_date,
    updated_at: donationData.payment_data.payment_date,
  });
  
  // 4. Create donation users if provided
  if (donationData.users && donationData.users.length > 0) {
    await this.createDonationUsers(donation.id, donationData.users);
  }
  
  // 5. Insert into Google Sheets
  await this.insertDonationIntoGoogleSheet(
    donation,
    donationData.sponsor_name,
    donationData.sponsor_email,
    donationData.amount_donated
  );
  
  return donation;
}
```

#### 2.4 New Donations Controller Method

**File**: `/Users/admin/Projects/14trees-web-monorepo/apps/api/src/controllers/donationsController.ts`

Add new function:
```typescript
export const importPreviousDonations = async (req: Request, res: Response) => {
  const { donations } = req.body;
  
  if (!donations || !Array.isArray(donations)) {
    return res.status(status.bad).json({
      message: 'Invalid request format. Expected donations array.'
    });
  }
  
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[]
  };
  
  try {
    for (const donationData of donations) {
      try {
        // Validate required fields
        if (!donationData.sponsor_name || !donationData.sponsor_email || 
            !donationData.amount || !donationData.donation_date) {
          throw new Error(`Missing required fields for donation: ${JSON.stringify(donationData)}`);
        }
        
        await DonationService.createPreviousDonation({
          sponsor_name: donationData.sponsor_name,
          sponsor_email: donationData.sponsor_email,
          sponsor_phone: donationData.sponsor_phone,
          category: donationData.category || 'Foundation',
          grove: donationData.grove,
          trees_count: donationData.trees_count || 0,
          amount_donated: donationData.amount,
          donation_type: donationData.donation_type || 'donate',
          donation_method: donationData.donation_method || 'amount',
          comments: donationData.comments,
          tags: donationData.tags,
          payment_data: {
            amount: donationData.amount,
            payment_date: new Date(donationData.donation_date),
            payment_method: donationData.payment_method || 'Bank Transfer',
            payment_reference: donationData.payment_reference,
            pan_number: donationData.pan_number,
          },
          users: donationData.users,
        });
        
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Failed to import donation for ${donationData.sponsor_name}: ${error.message}`);
        console.error('[ERROR] importPreviousDonations:', error);
      }
    }
    
    res.status(status.success).json({
      message: 'Import completed',
      results
    });
    
  } catch (error: any) {
    console.error('[ERROR] importPreviousDonations:', error);
    res.status(status.error).json({
      message: 'Failed to import donations',
      error: error.message
    });
  }
};
```

#### 2.5 Route Addition

**File**: `/Users/admin/Projects/14trees-web-monorepo/apps/api/src/routes/donationRoutes.ts`

Add new route:
```typescript
routes.post('/import-previous', donations.importPreviousDonations);
```

### 3. Database Considerations

#### 3.1 Payment Records
- `order_id`: Will be `null` for previous donations (no Razorpay integration)
- `created_at`/`updated_at`: Use actual donation date from spreadsheet
- `consent`: Set to `true` (assume consent for historical data)
- `donor_type`: Default to 'Individual' unless specified
- `pan_number`: Use provided PAN or set to null

#### 3.2 Payment History Records
- `payment_method`: "Bank Transfer" or as specified in data
- `payment_proof`: Use payment reference if available
- `payment_date`: Use actual date from spreadsheet
- `payment_received_date`: Same as payment_date for historical data
- `status`: Set to 'payment_received' for completed historical payments
- `amount_received`: Same as amount for historical data

#### 3.3 Donation Records
- `status`: Set to "Paid" (since these are completed donations)
- `donation_date`: Use actual donation date from historical data
- `amount_received`: Use actual amount from historical data
- `sponsorship_type`: "Donation Received" for completed donations
- `created_at`/`updated_at`: Use actual donation date from historical data
- `prs_status`: Set appropriately based on trees_count

### 4. Frontend Implementation

#### 4.1 Admin Interface Component

**File**: `/Users/admin/Projects/14trees-web-monorepo/apps/frontend/src/pages/admin/donation/ImportPrevious.tsx`

```typescript
import React, { useState } from 'react';
import { Box, Button, Typography, Alert, LinearProgress } from '@mui/material';
import { FileInputComponent } from '../../../components/FileInputComponent';
import { apiClient } from '../../../api/apiClient/apiClient';

interface ImportResult {
  successful: number;
  failed: number;
  errors: string[];
}

export const ImportPrevious: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    // Parse and preview first few rows
    // Implementation for CSV/Excel parsing
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    try {
      // Parse file and convert to required format
      const donations = await parseFileTodonations(file);
      
      const response = await apiClient.post('/donations/import-previous', {
        donations
      });
      
      setResult(response.data.results);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Import Previous Donations
      </Typography>
      
      <FileInputComponent
        onFileSelect={handleFileSelect}
        accept=".csv,.xlsx,.xls"
      />
      
      {preview.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Preview (First 5 rows):</Typography>
          {/* Preview table implementation */}
        </Box>
      )}
      
      <Box mt={2}>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!file || importing}
        >
          {importing ? 'Importing...' : 'Import Donations'}
        </Button>
      </Box>
      
      {importing && <LinearProgress />}
      
      {result && (
        <Box mt={2}>
          <Alert severity={result.failed > 0 ? 'warning' : 'success'}>
            Import completed: {result.successful} successful, {result.failed} failed
          </Alert>
          {result.errors.length > 0 && (
            <Box mt={1}>
              <Typography variant="subtitle2">Errors:</Typography>
              {result.errors.map((error, index) => (
                <Typography key={index} variant="body2" color="error">
                  {error}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
```

#### 4.2 Integration with Admin Layout

Update admin routing to include the new import page and ensure proper authentication.

### 5. Data Validation

#### 5.1 Required Fields Validation
- Sponsor name, email (basic format validation)
- Amount (positive number)
- Donation date (valid date format, not future dates)
- Trees count (positive integer if donation_method is 'trees')

#### 5.2 Business Logic Validation
- Email format validation using regex
- Phone number format (if provided)
- PAN number format validation (if provided)
- Date range validation (historical dates only)
- Amount validation (positive numbers only)

#### 5.3 Duplicate Detection
- Check for existing donations with same sponsor email + amount + date
- Warn about potential duplicates before import
- Option to skip or update duplicates

### 6. Implementation Steps

#### Phase 1: Backend API Development
1. Add `createPreviousPayment` function to payment controller
2. Add `createPreviousDonation` method to donation service  
3. Add `importPreviousDonations` function to donations controller
4. Add route to donation routes
5. Add validation and error handling
6. Test with sample data using Postman/API testing

#### Phase 2: Frontend Development
1. Create `ImportPrevious.tsx` component
2. Implement CSV/Excel parsing functionality
3. Add data preview and validation UI
4. Implement bulk import with progress tracking
5. Add error reporting and success feedback
6. Integrate with existing admin layout and routing

#### Phase 3: Testing & Data Migration
1. Unit test all new functions
2. Integration test the complete flow
3. Export data from Google Spreadsheet to CSV
4. Clean and format data according to API requirements
5. Test import with small batch (5-10 records)
6. Perform full import in production
7. Verify data integrity and completeness

### 7. File Structure

```
apps/
├── api/src/
│   ├── controllers/
│   │   ├── paymentController.ts (add createPreviousPayment)
│   │   └── donationsController.ts (add importPreviousDonations)
│   ├── facade/
│   │   └── donationService.ts (add createPreviousDonation)
│   └── routes/
│       └── donationRoutes.ts (add import route)
├── frontend/src/pages/admin/donation/
│   └── ImportPrevious.tsx (new component)
└── frontend/docs/donations/
    └── PREVIOUS_DONATIONS_UPLOAD_PLAN.md (this file)
```

### 8. Security Considerations

#### 8.1 Access Control
- Admin-only functionality (verify admin role in middleware)
- Rate limiting on import endpoint to prevent abuse
- File size limits for uploads (max 10MB)
- File type validation (only CSV/Excel files)

#### 8.2 Data Validation
- Sanitize all input data before processing
- Validate file formats and content structure
- Prevent SQL injection through parameterized queries
- XSS prevention through input sanitization

#### 8.3 Audit Trail
- Log all import activities with timestamps
- Track which admin user performed the import
- Store original file metadata for reference
- Log success/failure counts and error details

### 9. Error Handling

#### 9.1 File Processing Errors
- Invalid file format (not CSV/Excel)
- Missing required columns in file
- Data format errors (invalid dates, non-numeric amounts)
- File corruption or parsing failures

#### 9.2 Database Errors
- Duplicate entries (handle gracefully)
- Foreign key constraint violations
- Transaction rollback on critical failures
- Connection timeout handling

#### 9.3 User Feedback
- Clear, actionable error messages
- Progress indicators during import
- Detailed success/failure summaries
- Option to download error report

### 10. Testing Strategy

#### 10.1 Unit Tests
- Test `createPreviousPayment` function
- Test `createPreviousDonation` method
- Test data validation functions
- Test file parsing utilities

#### 10.2 Integration Tests
- End-to-end import process testing
- Database integrity checks after import
- API endpoint testing with various data scenarios
- Error handling and rollback testing

#### 10.3 Manual Testing
- File upload and processing with sample data
- Error scenarios (malformed data, missing fields)
- Data verification in database and Google Sheets
- Admin interface usability testing

### 11. Rollback Plan

#### 11.1 Data Backup
- Full database backup before import operation
- Store original spreadsheet data securely
- Document all changes made during import
- Keep transaction logs for audit purposes

#### 11.2 Rollback Procedure
- Identify imported records using timestamp or special flag
- Delete imported donations, donation_users, payments, and payment_history
- Restore from backup if necessary
- Verify system integrity after rollback

### 12. Post-Implementation

#### 12.1 Data Verification
- Compare imported data counts with original spreadsheet
- Verify payment amounts and donation counts match
- Check user assignments and tree counts are correct
- Validate Google Sheets integration worked properly

#### 12.2 Cleanup
- Remove or disable admin import functionality after use
- Archive original data files securely
- Update system documentation
- Remove any temporary files or logs

#### 12.3 Monitoring
- Monitor system performance after import
- Check for any data inconsistencies
- Verify normal donation flow still works correctly
- Monitor Google Sheets for proper data sync

## Conclusion

This updated plan provides a comprehensive approach to importing previous donations while leveraging the current system architecture. The solution:

1. **Maintains Data Integrity**: Uses existing models and relationships
2. **Avoids Razorpay Conflicts**: Creates payments without order_id for historical data
3. **Preserves System Consistency**: Follows existing patterns and conventions
4. **Ensures Security**: Admin-only access with proper validation
5. **Provides Auditability**: Comprehensive logging and error tracking

The implementation will be done in phases to ensure thorough testing and validation at each step. The admin interface integrates seamlessly with the existing React-based admin panel, maintaining consistency with the current user experience.