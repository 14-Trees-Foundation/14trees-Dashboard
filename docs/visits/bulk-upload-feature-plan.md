# Bulk Upload Feature Enhancement for Visit Request Type

## Overview
This document outlines the plan to enhance the bulk upload functionality for the gift request module to support two different CSV upload formats based on the request type:
- **Gift Request**: Current implementation (existing CSV format)
- **Visit**: New enhanced CSV format with Tree ID field and automatic plot reservation/tree assignment

## Key Insight: Corrected Backend Architecture
**Important**: The bulk upload for gift requests is handled by the **Gift Card Controller** (`giftCardController.ts`), not the Visit Users Controller. The CSV parsing happens in the **frontend** using Papa.parse, and the processed data is sent to the existing `/api/gift-cards/users` endpoint. This is different from other modules that use server-side CSV parsing.

## Current System Analysis

### Frontend Structure
- **Main Component**: `/apps/frontend/src/pages/admin/gift/Components/user/components/CSVUploadForm.tsx`
- **Usage**: Used in `/apps/frontend/src/pages/admin/gift/Components/workflow/UserDetails.tsx`
- **CSV Template**: Google Sheets template with recipient/assignee details

### Backend Structure
- **Controller**: `/apps/api/src/controllers/giftCardController.ts` (main gift request handling)
- **Service**: `/apps/api/src/facade/giftCardsService.ts` (business logic for `upsertGiftRequestUsers`)
- **Helper**: `/apps/api/src/controllers/helper/giftRequestHelper.ts` (gift request processing)
- **Models**: 
  - `GiftCardRequest` with `request_type` field
  - `GiftRequestUser` for gift request user management
  - `User` for general user management
  - `Tree` for tree assignments

### Current CSV Format
```csv
"Recipient Name","Recipient Email","Recipient Communication Email (optional)","Recipient Phone (optional)","Number of trees to assign","Assignee Name","Assignee Email (optional)","Assignee Communication Email (optional)","Assignee Phone (optional)","Image Name (optional)"
```

### Current Flow
1. User uploads CSV file through `CSVUploadForm`
2. Frontend parses CSV using Papa.parse library in `UserDetails.tsx`
3. Processed user data is sent to `POST /api/gift-cards/users` endpoint
4. `giftCardController.upsertGiftRequestUsers` handles the bulk creation
5. `GiftCardsService.upsertGiftRequestUsers` creates/updates users and gift request users
6. Tree assignments are handled separately through plot booking and assignment flow

## Proposed Enhancement

### 1. Frontend Changes

#### A. Enhanced CSVUploadForm Component
**File**: `/apps/frontend/src/pages/admin/gift/Components/user/components/CSVUploadForm.tsx`

**Changes**:
- Add `requestType` prop to component interface
- Conditionally render different instructions based on request type
- Provide separate CSV template links for each request type
- Update component to handle two different CSV formats

**New Interface**:
```typescript
interface CSVUploadFormProps {
  requestId: string | null;
  onFileChange: (file: File) => void;
  requestType: 'Gift Request' | 'Visit'; // New prop
}
```

**New Features**:
- Separate Google Sheets templates for each request type
- Dynamic instruction text based on request type
- Different validation messages for each format

#### B. New CSV Template for Visit Type
**Visit CSV Format**:
```csv
"Recipient Name","Recipient Email","Recipient Communication Email (optional)","Recipient Phone (optional)","Number of trees to assign","Assignee Name","Assignee Email (optional)","Assignee Communication Email (optional)","Assignee Phone (optional)","Tree ID","Image Name (optional)"
```

**Key Addition**: `Tree ID` field for pre-assigned trees during visits

#### C. Update Parent Components
**Files to Update**:
- `/apps/frontend/src/pages/admin/gift/Components/workflow/UserDetails.tsx`
- `/apps/frontend/src/pages/admin/donation/Forms/UserDetails.tsx`

**Changes**:
- Pass `requestType` prop to `CSVUploadForm`
- Handle different CSV field mappings based on request type
- Update validation logic for the new Tree ID field

### 2. Backend Changes

#### A. Enhanced Frontend CSV Parser
**File**: `/apps/frontend/src/pages/admin/gift/Components/workflow/UserDetails.tsx`

**Changes**:
- Add `requestType` parameter to CSV parsing logic
- Support two different CSV formats based on request type
- Add validation for Tree ID field in Visit type
- Enhanced error handling for tree assignment validation

**New CSV Field Mapping for Visit Type**:
```typescript
const CSV_FIELD_MAPPING_VISIT = {
  recipientName: 'Recipient Name',
  recipientEmail: 'Recipient Email',
  recipientCommEmail: 'Recipient Communication Email (optional)',
  recipientPhone: 'Recipient Phone (optional)',
  assigneeName: 'Assignee Name',
  assigneeEmail: 'Assignee Email (optional)',
  assigneeCommEmail: 'Assignee Communication Email (optional)',
  assigneePhone: 'Assignee Phone (optional)',
  count: 'Number of trees to assign',
  treeId: 'Tree ID',  // New field for Visit type
  imageName: 'Image Name (optional)',
  relation: 'Relation with person'
};
```

**Visit-specific Validations**:
- Tree ID must be valid format and exist in the system
- Tree must be available for assignment
- Tree must be in the correct plot/site for the visit

#### B. Enhanced Gift Card Service
**File**: `/apps/api/src/facade/giftCardsService.ts`

**New Function**: `upsertGiftRequestUsersWithTrees`
- Handle bulk upload with tree assignments for Visit type
- Validate tree availability
- Perform automatic plot reservation
- Assign trees to users
- Handle rollback on failure

**Enhanced Workflow for Visit Type**:
1. Validate tree IDs provided in CSV
2. Check tree availability and ownership
3. Reserve plots for the visit
4. Create/update users via existing `upsertGiftRequestUsers`
5. Assign specific trees to users
6. Update tree status to assigned
7. Create visit-user relationships

#### C. New Services/Helpers

**File**: `/apps/api/src/services/treeAssignmentService.ts` (New)
- `validateTreeAvailability(treeIds: string[])`
- `reserveTreesForVisit(treeIds: string[], visitId: number)`
- `assignTreesToUsers(assignments: TreeUserAssignment[])`
- `rollbackTreeAssignments(treeIds: string[])`

**File**: `/apps/api/src/services/plotReservationService.ts` (New)
- `reservePlotForVisit(plotId: number, visitId: number)`
- `getPlotsByTreeIds(treeIds: string[])`
- `validatePlotAvailability(plotId: number, visitDate: Date)`

### 3. Database Changes

#### A. Enhanced Existing Tables
- `gift_request_users` table already handles user-tree assignments
- `trees` table already has assignment tracking via `assigned_to` field
- `gift_cards` table links gift requests to specific trees
- `visits` table already exists and is linked to `gift_card_requests` via `visit_id`

#### B. New Fields (if needed)
- Add `tree_id` field to `gift_request_users` table for direct tree assignment
- Add `visit_tree_assignment_status` field to track visit-specific assignment status

#### C. Updated Models
**File**: `/apps/api/src/models/gift_request_user.ts` (Enhanced)
```typescript
interface GiftRequestUserAttributes {
  // ... existing fields
  tree_id?: string;  // New field for direct tree assignment in Visit type
  visit_assignment_status?: 'assigned' | 'completed' | 'cancelled';
}
```

### 4. API Routes Enhancement

#### A. New Endpoints
- `POST /api/gift-cards/users/bulk-with-trees` - Bulk upload with tree assignments for Visit type
- `GET /api/gift-cards/:id/tree-assignments` - Get tree assignments for a gift request
- `POST /api/gift-cards/:id/validate-trees` - Validate tree availability for a gift request

#### B. Enhanced Existing Endpoints
- Update `POST /api/gift-cards/users` to accept request type parameter
- Add tree assignment information to gift request user responses
- Update `upsertGiftRequestUsers` to handle Visit type with tree assignments

### 5. Error Handling & Validation

#### A. Frontend Validation
- Real-time CSV format validation
- Tree ID format validation
- Duplicate tree assignment detection
- User-friendly error messages

#### B. Backend Validation
- Tree existence validation
- Tree availability validation
- Plot capacity validation
- User assignment limit validation
- Transaction rollback on any failure

### 6. Testing Strategy

#### A. Unit Tests
- CSV parser tests for both formats
- Tree assignment service tests
- Plot reservation service tests
- Controller endpoint tests

#### B. Integration Tests
- End-to-end bulk upload flow
- Error handling scenarios
- Rollback functionality
- Database consistency checks

#### C. User Acceptance Tests
- Upload both CSV formats
- Verify tree assignments
- Check plot reservations
- Validate error messages

## Implementation Plan

### Phase 1: Backend Core Services (Week 1)
1. Create tree assignment service
2. Create plot reservation service
3. Enhance GiftCardsService for Visit type with tree assignments
4. Add database field migrations if needed

### Phase 2: API Endpoints (Week 2)
1. Enhance existing `POST /api/gift-cards/users` endpoint for Visit type
2. Add tree validation endpoints
3. Update upsertGiftRequestUsers to handle tree assignments
4. Add comprehensive error handling

### Phase 3: Frontend Components (Week 3)
1. Update CSVUploadForm component with requestType support
2. Create new CSV templates for Visit type
3. Update UserDetails.tsx CSV parsing logic
4. Add client-side tree ID validation

### Phase 4: Integration & Testing (Week 4)
1. End-to-end integration testing
2. Error scenario testing for tree assignments
3. Performance testing with large CSV files
4. User acceptance testing for both request types

## Risk Assessment

### High Priority Risks
1. **Data Consistency**: Tree assignments must be atomic with gift request creation
2. **Performance**: Bulk operations may impact database performance
3. **User Experience**: Clear error messages are critical for tree assignment failures
4. **Tree Conflicts**: Multiple users trying to assign the same tree simultaneously

### Mitigation Strategies
1. Use database transactions for atomic operations in GiftCardsService
2. Implement batch processing for large CSV files with tree validation
3. Provide detailed validation feedback for tree availability
4. Add progress indicators for bulk operations
5. Implement tree locking mechanism during assignment process

## Success Criteria

### Functional Requirements
- [ ] Support both Gift Request and Visit CSV formats
- [ ] Automatic tree assignment for Visit type
- [ ] Automatic plot reservation for Visit type
- [ ] Comprehensive error handling and rollback
- [ ] Backward compatibility with existing Gift Request flow

### Non-Functional Requirements
- [ ] Process up to 1000 records in under 30 seconds
- [ ] Maintain 99.9% data consistency
- [ ] Provide real-time feedback to users
- [ ] Support concurrent uploads without conflicts

## Documentation Updates

### Developer Documentation
- API endpoint documentation
- Database schema changes
- Service layer documentation
- Testing procedures

### User Documentation
- CSV format guides
- Error message explanations
- Best practices for bulk uploads
- Troubleshooting guide

## Future Enhancements

### Phase 2 Features
1. Bulk tree reassignment
2. Visit scheduling integration
3. Advanced tree filtering
4. Automated notifications

### Long-term Vision
1. Real-time tree availability updates
2. GPS-based tree assignment
3. Mobile app integration
4. Analytics and reporting

---

## Summary of Key Changes

### Frontend Changes
1. **CSVUploadForm.tsx**: Add `requestType` prop and conditional rendering for different CSV templates
2. **UserDetails.tsx**: Enhanced CSV parsing logic with `CSV_FIELD_MAPPING_VISIT` for Tree ID field
3. **New CSV Template**: Google Sheets template with Tree ID field for Visit type

### Backend Changes
1. **giftCardController.ts**: Enhance `upsertGiftRequestUsers` to handle Visit type with tree assignments
2. **giftCardsService.ts**: New method `upsertGiftRequestUsersWithTrees` for Visit-specific processing
3. **treeAssignmentService.ts**: New service for tree availability validation and assignment
4. **Database**: Optional new fields in `gift_request_users` table for direct tree assignment

### API Changes
1. **Enhanced Endpoint**: `POST /api/gift-cards/users` to accept `requestType` parameter
2. **New Endpoints**: Tree validation and assignment endpoints
3. **Response Format**: Include tree assignment information in responses

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Author**: Development Team  
**Reviewers**: [To be assigned]  
**Status**: Draft - Pending Review