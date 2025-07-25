# Production Testing Plan for Donation System

## Overview
This document outlines a comprehensive plan for testing the donation system in production using separate Razorpay accounts for internal testing users, while maintaining the production Razorpay account for all end users.

## Current System Analysis

### Payment Flow
1. **Adoption Flow**: ₹3,000 per tree
2. **Donation Flow**: 
   - Trees method: ₹1,500 per tree
   - Amount method: Custom amount
3. **Bank Transfer**: For amounts > ₹5,00,000
4. **Razorpay Integration**: For amounts ≤ ₹5,00,000

### Key Files
- **Main Component**: `apps/front-page/app/donate/page.tsx`
- **API Client**: `apps/front-page/src/api/apiClient.ts`
- **Payment Creation**: Lines 503-520 in donate page
- **Razorpay Integration**: Lines 582-643 in donate page

## Testing Strategy

### 1. Dual Razorpay Account Approach

#### Internal Testing User Identification
Switch to test Razorpay account for internal testing users based on email:

**Internal Testing Emails:**
- Any email ending with `@14trees.org`
- Specific email: `vivayush@gmail.com`

**Razorpay Account Switching:**
- **Production Users**: Use production Razorpay account (current keys)
- **Internal Testing Users**: Use test Razorpay account (separate keys)
- **Same pricing for both**: Original amounts maintained (₹1,500, ₹3,000, etc.)

**Benefits:**
- Real payment amounts for testing (no artificial reductions)
- Test Razorpay account provides safe testing environment
- Seamless experience for end users (production account)
- Clear separation between test and production transactions
- Easy to add/remove internal emails

### 2. Test Transaction Identification

#### Tagging Strategy
1. **Email-based tagging**:
   - Add "INTERNAL_TEST" tag when email matches internal criteria
   - Modify tags array: `tags: ["WebSite", ...(isInternalTestUser ? ["INTERNAL_TEST"] : [])]`

2. **Database identification**:
   - Add internal test flag to donation requests
   - Include test indicator in payment notes
   - Add test prefix to sponsor names for internal testing

3. **Visual indicators** (for internal testing users only):
   - Orange banner indicating "Internal Testing Mode - Using Test Razorpay Account"
   - Test watermark on success pages
   - Different confirmation messages for internal test transactions

#### Test Data Markers
```javascript
// Internal testing modifications
const internalTestData = {
  sponsor_name: isInternalTestUser ? `[INTERNAL_TEST] ${formData.fullName}` : formData.fullName,
  tags: ["WebSite", ...(isInternalTestUser ? ["INTERNAL_TEST", "TEST_RAZORPAY"] : [])],
  comments: isInternalTestUser ? `[INTERNAL TEST - ${new Date().toISOString()}] ${formData.comments}` : formData.comments,
  // Add internal test metadata
  ...(isInternalTestUser && {
    internal_test_mode: true,
    test_timestamp: new Date().toISOString(),
    test_user_email: formData.email,
    razorpay_account: 'test', // Indicate test Razorpay account used
    amount: calculatedAmount // Same amount, different account
  })
}
```

## Environment Variables Setup

### Required Environment Variables
Add the following environment variables for test Razorpay account:

```bash
# Test Razorpay Account (for internal testing users)
RAZORPAY_TEST_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_TEST_KEY_SECRET=XXXXXXXXXX

# Production Razorpay Account (existing - for regular users)
RAZORPAY_KEY_ID=rzp_test_tPc5Kq7AB5xesn
RAZORPAY_KEY_SECRET=BDdHHy2KgNlzaP9hEQUerayR
```

**Note**: Replace the test credentials with actual test Razorpay account keys once obtained.

## Implementation Plan

### Phase 1: Utility Functions Setup
1. **Create internal testing utilities**:
   ```typescript
   // utils/internalTesting.ts
   const INTERNAL_TEST_EMAILS = [
     'vivayush@gmail.com'
   ];
   
   const INTERNAL_TEST_DOMAINS = [
     '@14trees.org'
   ];
   
   // Razorpay account configurations
   const RAZORPAY_PRODUCTION = {
     key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_tPc5Kq7AB5xesn",
     key_secret: process.env.RAZORPAY_KEY_SECRET || "BDdHHy2KgNlzaP9hEQUerayR"
   };
   
   const RAZORPAY_TEST = {
     key_id: process.env.RAZORPAY_TEST_KEY_ID || "rzp_test_XXXXXXXXXX", // Test account keys
     key_secret: process.env.RAZORPAY_TEST_KEY_SECRET || "XXXXXXXXXX"
   };
   
   export const isInternalTestUser = (email: string): boolean => {
     if (!email) return false;
     
     // Check specific emails
     if (INTERNAL_TEST_EMAILS.includes(email.toLowerCase())) {
       return true;
     }
     
     // Check domains
     return INTERNAL_TEST_DOMAINS.some(domain => 
       email.toLowerCase().endsWith(domain.toLowerCase())
     );
   };
   
   export const getRazorpayConfig = (email: string) => {
     if (isInternalTestUser(email)) {
       return RAZORPAY_TEST;
     }
     return RAZORPAY_PRODUCTION;
   };
   
   export const getInternalTestMetadata = (email: string) => {
     if (!isInternalTestUser(email)) return {};
     
     return {
       internal_test_mode: true,
       test_timestamp: new Date().toISOString(),
       test_user_email: email,
       razorpay_account: 'test'
     };
   };
   ```

### Phase 2: Code Modifications

#### 2.1 Razorpay Configuration Updates
**File**: `apps/front-page/app/donate/page.tsx`

**Import the utility functions**:
```typescript
import { isInternalTestUser, getRazorpayConfig, getInternalTestMetadata } from '@/utils/internalTesting';
```

**Locations to modify**:
1. Line 582-643: Razorpay integration - Use appropriate Razorpay account based on email
2. Line 542-546: Donation request - Include internal test metadata
3. Line 584: Razorpay key_id - Use email-based account selection
4. Payment creation API calls - Pass correct Razorpay credentials

#### 2.2 Internal Testing Indicators (for internal users only)
1. **Visual banner component**:
   ```tsx
   const InternalTestBanner = ({ userEmail }: { userEmail: string }) => {
     if (!isInternalTestUser(userEmail)) return null;
     return (
       <div className="bg-orange-500 text-white p-2 text-center font-bold">
         🔧 Internal Testing Mode - Using Test Razorpay Account
       </div>
     );
   };
   ```

2. **Success dialog modifications**:
   - Add internal test indicators for qualifying emails
   - Show test account usage information
   - Different messaging for internal test transactions

#### 2.3 Data Tagging
1. **Donation request modifications**:
   ```typescript
   const isInternalTest = isInternalTestUser(formData.email);
   const razorpayConfig = getRazorpayConfig(formData.email);
   
   const donationRequest = {
     // ... existing fields
     sponsor_name: isInternalTest ? `[INTERNAL_TEST] ${formData.fullName}` : formData.fullName,
     tags: ["WebSite", ...(isInternalTest ? ["INTERNAL_TEST", "TEST_RAZORPAY"] : [])],
     comments: isInternalTest 
       ? `[INTERNAL TEST - ${new Date().toISOString()}] ${formData.comments}` 
       : formData.comments,
     amount: calculatedAmount, // Same amount, different account
     ...getInternalTestMetadata(formData.email)
   };
   ```

2. **Razorpay notes modification**:
   ```typescript
   const isInternalTest = isInternalTestUser(formData.email);
   const razorpayConfig = getRazorpayConfig(formData.email);
   
   notes: {
     "Donation Id": donId,
     ...(isInternalTest && {
       "Internal Test": "true",
       "Test User Email": formData.email,
       "Razorpay Account": "test",
       "Test Timestamp": new Date().toISOString()
     })
   }
   ```

3. **Razorpay initialization**:
   ```typescript
   const razorpayConfig = getRazorpayConfig(formData.email);
   
   const options = {
     key: razorpayConfig.key_id, // Use appropriate account
     amount: amount * 100,
     currency: "INR",
     // ... other options
   };
   ```

### Phase 3: Testing Scenarios

#### 3.1 Internal Testing Users (vivayush@gmail.com, @14trees.org emails)
- **Test Case 1**: Single tree adoption (₹3,000 using test Razorpay account)
- **Test Case 2**: Multiple tree adoption (₹15,000 for 5 trees using test account)
- **Test Case 3**: Large adoption (₹3,00,000 for 100 trees using test account)
- **Test Case 4**: Tree-based donation (₹1,500 per tree using test account)
- **Test Case 5**: Amount-based donation (custom amounts using test account)
- **Test Case 6**: Large donation that would normally trigger bank transfer (using test account)

#### 3.2 Regular End Users (All other emails)
- **Test Case 7**: Verify original pricing maintained (₹3,000 per adoption tree using production account)
- **Test Case 8**: Verify donation pricing unchanged (₹1,500 per tree using production account)
- **Test Case 9**: Verify no internal test tags or modifications applied
- **Test Case 10**: Confirm normal user experience with no test indicators
- **Test Case 11**: Verify production Razorpay account is used for all regular users

#### 3.3 Edge Cases
- **Test Case 12**: CSV upload with mixed internal/external recipients
- **Test Case 13**: Referral link donations for internal users
- **Test Case 14**: Payment failures and retries for both user types
- **Test Case 15**: Email case sensitivity (@14TREES.ORG vs @14trees.org)
- **Test Case 16**: Account switching verification (internal vs production keys)

### Phase 4: Monitoring & Analytics

#### 4.1 Internal Test Transaction Identification
1. **Database queries** to filter internal test transactions:
   ```sql
   SELECT * FROM donations 
   WHERE tags LIKE '%INTERNAL_TEST%' 
   OR sponsor_name LIKE '[INTERNAL_TEST]%'
   OR internal_test_mode = true;
   ```

2. **Analytics approach**:
   - Keep internal test transactions in main analytics (they represent real functionality testing)
   - Add filters to distinguish internal test vs production user data
   - Create separate reports for internal testing metrics vs end user metrics

#### 4.2 Data Management Strategy
1. **Retain internal test transactions** (they represent real system testing)
2. **Regular monitoring** of internal test transaction volumes
3. **Monthly reporting** on internal testing activity vs end user activity

## Risk Mitigation

### 1. Accidental Full Charges for Internal Users
- **Clear visual indicators** when internal testing pricing is active
- **Amount display** showing both original and reduced amounts
- **Confirmation dialogs** highlighting the reduced pricing
- **Email notifications** to admin for internal test transactions

### 2. Incorrect Pricing for End Users
- **Thorough testing** to ensure end users always get original pricing
- **Email validation** logic with comprehensive test coverage
- **Monitoring** for any pricing anomalies in production

### 3. Data Integrity
- **Clear tagging** of internal test transactions
- **Metadata preservation** of original amounts
- **Audit trails** for all internal testing activities

### 4. User Experience Issues
- **Minimal visual changes** for end users (no indicators shown)
- **Consistent experience** for non-internal users
- **Clear messaging** for internal users about reduced pricing

## Rollback Plan

### Emergency Disable
1. **Remove internal test emails** from the utility functions
2. **Deploy updated code** (can be done via hot-fix)
3. **All users get original pricing** immediately

**Quick Fix Code:**
```typescript
// Temporarily disable internal testing
export const isInternalTestUser = (email: string): boolean => {
  return false; // Disable all internal testing
};
```

### Data Recovery
1. **Internal test transactions** are clearly marked and can be easily identified
2. **No data cleanup needed** - internal test transactions are legitimate
3. **Monitoring tools** can filter out internal test data for regular analytics

## Success Metrics

### Testing Coverage
- [ ] All payment flows tested for internal users (reduced pricing)
- [ ] All payment flows verified for end users (original pricing)
- [ ] Edge cases covered for both user types
- [ ] Performance under load
- [ ] Error handling verified

### Cost Control
- [ ] Internal testing uses test Razorpay account (safe environment)
- [ ] No accidental charges to production account for internal users
- [ ] No pricing changes for end users
- [ ] All internal test transactions clearly identified
- [ ] Test account transactions properly isolated

### User Experience
- [ ] End users experience unchanged (no visible differences)
- [ ] Internal users get clear feedback about test account usage
- [ ] No confusion between user types
- [ ] Proper email-based identification working
- [ ] Correct Razorpay account selection for each user type

## Next Steps

1. **Review this updated plan** with the development team
2. **Set up test Razorpay account** and obtain test credentials
3. **Add test Razorpay credentials** to environment variables
4. **Implement Phase 1** (create utility functions for email-based detection and account switching)
5. **Create feature branch** for internal testing modifications
6. **Test with vivayush@gmail.com** to verify test account usage works
7. **Test with regular email** to ensure production account maintained
8. **Deploy to production** after validation
9. **Monitor both user types** and iterate based on results

## Implementation Priority

1. **High Priority**: Set up test Razorpay account and credentials
2. **High Priority**: Create `utils/internalTesting.ts` with email detection and account switching logic
3. **High Priority**: Modify Razorpay integration in donate page to use appropriate account
4. **Medium Priority**: Add visual indicators for internal users
5. **Medium Priority**: Update data tagging and metadata
6. **Low Priority**: Analytics and monitoring enhancements

## Notes

- **End users get production Razorpay account** - no changes to their experience
- **Internal team gets test Razorpay account** for safe testing environment
- **Same pricing for both user types** - no artificial reductions
- **Clear identification** of internal test transactions
- **Easy to add/remove** internal testing emails
- **Environment variables needed** for test Razorpay credentials
- **Simple rollback** by disabling email detection function

---

**Document Version**: 3.0  
**Last Updated**: [Current Date]  
**Author**: Development Team  
**Review Status**: Updated for Dual Razorpay Account Approach  
**Key Change**: Switched from amount reduction to separate test/production Razorpay accounts based on email identification