# API Documentation: Payments and Donations

This document explains how the payment and donation APIs work in the 14Trees platform.

## Overview

The platform has two main API endpoints for handling payments and donations:
- `POST /api/payments` - Creates payment records and integrates with Razorpay
- `POST /api/donations/requests` - Creates donation requests with tree plantation details

## POST /api/payments

### Purpose
Creates a new payment record in the system and generates a Razorpay order for online payments.

### Endpoint
```
POST /api/payments
```

### Request Body
```json
{
  "amount": 1000.0,
  "donor_type": "Individual",
  "pan_number": "ABCDE1234F",
  "consent": true,
  "notes": {
    "purpose": "Tree donation"
  }
}
```

### Request Parameters
- `amount` (required): Payment amount in INR
- `donor_type` (optional): Type of donor ("Individual", "Corporate", etc.)
- `pan_number` (optional): PAN number for tax purposes
- `consent` (optional): Boolean indicating user consent
- `notes` (optional): Additional metadata for the payment

### How it Works

1. **Validation**: Checks if amount is provided and greater than 0
2. **Payment Method Logic**: 
   - **If amount ≤ ₹5,00,000**: Creates a Razorpay order for online payment
     - Generates unique order ID for payment tracking
     - Integrates with Razorpay payment gateway
   - **If amount > ₹5,00,000**: Skips Razorpay order creation
     - Sets `order_id` as `null` in payment record
     - Requires manual bank transfer/offline payment
     - Payment proof must be uploaded via `/api/payments/history`
3. **Database Storage**: Creates payment record with:
   - Payment amount
   - Donor details
   - Razorpay order ID (null for amounts > ₹5,00,000)
   - Consent status
   - Timestamps

### Response
```json
{
  "id": 123,
  "amount": 1000.0,
  "donor_type": "Individual",
  "pan_number": "ABCDE1234F",
  "consent": true,
  "order_id": "order_9A33XWu170gUtm",
  "created_at": "2023-10-01T12:34:56Z",
  "updated_at": "2023-10-01T12:34:56Z"
}
```

### Error Responses
- `400`: Missing or invalid amount
- `500`: Razorpay order creation failed or database error

## POST /api/donations/requests

### Purpose
Creates a donation request with sponsor details, tree plantation information, and optional payment integration.

### Endpoint
```
POST /api/donations/requests
```

### Request Body
```json
{
  "sponsor_name": "John Doe",
  "sponsor_email": "john.doe@example.com",
  "sponsor_phone": "1234567890",
  "payment_id": "PAY12345",
  "category": "Foundation",
  "grove": "Green Grove",
  "grove_type_other": "Custom Grove",
  "trees_count": 10,
  "contribution_options": ["Planning visit", "CSR"],
  "comments": "This is a comment.",
  "donation_type": "donate",
  "donation_method": "trees",
  "amount_donated": 1000,
  "tags": ["corporate", "event2023"],
  "users": [
    {
      "recipient": "Recipient Name",
      "assignee": "Assignee Name",
      "count": 5
    }
  ]
}
```

### Request Parameters

#### Required Fields
- `sponsor_name`: Name of the sponsor/donor
- `sponsor_email`: Email address of the sponsor
- `category`: Land category for plantation

#### Optional Fields
- `sponsor_phone`: Phone number
- `payment_id`: Reference to existing payment record
- `grove`: Grove name for plantation
- `grove_type_other`: Custom grove type
- `trees_count`: Number of trees to plant
- `contribution_options`: Array of contribution types
- `comments`: Additional comments
- `donation_type`: "adopt" or "donate"
- `donation_method`: "trees" or "amount"
- `amount_donated`: Monetary amount
- `tags`: Array of tags for categorization
- `users`: Array of recipient/assignee details

### How it Works

1. **Validation**: 
   - Validates sponsor details (name, email)
   - Checks donation type specific requirements
   - Validates land category information

2. **Donation Creation**:
   - Creates donation record using DonationService
   - Links to payment if payment_id provided
   - Sets default values for missing fields

3. **Payment Integration**:
   - If payment_id exists, updates Razorpay order with donation ID
   - Links donation to payment record

4. **User Management**:
   - Creates donation_users records for recipients/assignees
   - Handles tree allocation per user

5. **External Integrations**:
   - Inserts donation data into Google Sheets
   - Updates Razorpay order metadata

### Response
```json
{
  "id": 456,
  "sponsor_name": "John Doe",
  "sponsor_email": "john.doe@example.com",
  "trees_count": 10,
  "category": "Foundation",
  "status": "PendingPayment",
  "created_at": "2023-10-01T12:34:56Z"
}
```

### Error Responses
- `400`: Invalid sponsor details or missing required fields
- `500`: Database error or external service failure

## POST /api/donations/requests/v2 (Simplified Version)

### Purpose
A simplified version of donation creation with automatic payment integration.

### Key Differences from V1
- Simplified request structure
- Automatic payment creation if `amount_donated` provided
- Returns both donation and Razorpay order_id
- Fewer required fields

### Request Body
```json
{
  "group_id": 123,
  "sponsor_name": "John Doe",
  "sponsor_email": "john.doe@example.com",
  "sponsor_phone": "1234567890",
  "trees_count": 10,
  "amount_donated": 1000,
  "tags": ["corporate", "event2023"],
  "users": [
    {
      "recipient": "Recipient Name",
      "assignee": "Assignee Name",
      "trees_count": 5
    }
  ]
}
```

### Response
```json
{
  "donation": {
    "id": 456,
    "sponsor_name": "John Doe",
    "trees_count": 10,
    "status": "PendingPayment"
  },
  "order_id": "order_9A33XWu170gUtm"
}
```

## Integration Flow

### Payment Flow Based on Amount

#### For amounts ≤ ₹5,00,000 (Razorpay Payment)

1. **Frontend creates payment**:
   ```
   POST /api/payments
   {
     "amount": 1000,
     "donor_type": "Individual"
   }
   ```

2. **System returns payment with order_id**:
   ```json
   {
     "id": 123,
     "order_id": "order_9A33XWu170gUtm"
   }
   ```

3. **Frontend initiates Razorpay payment** using order_id

4. **On successful payment, verify transaction**:
   ```
   POST /api/payments/verify
   {
     "order_id": "order_9A33XWu170gUtm",
     "razorpay_payment_id": "pay_29QQoUBi66xm2f",
     "razorpay_signature": "signature_hash"
   }
   ```

5. **Create donation with payment_id**:
   ```
   POST /api/donations/requests
   {
     "sponsor_name": "John Doe",
     "sponsor_email": "john@example.com",
     "payment_id": 123,
     "trees_count": 10
   }
   ```

#### For amounts > ₹5,00,000 (Bank Transfer)

1. **Frontend creates payment** (without Razorpay order):
   ```
   POST /api/payments
   {
     "amount": 600000,
     "donor_type": "Individual"
   }
   ```

2. **System returns payment without order_id**:
   ```json
   {
     "id": 124,
     "order_id": null
   }
   ```

3. **User makes bank transfer** using provided bank details

4. **User uploads payment proof**:
   ```
   POST /api/payments/history
   {
     "payment_id": 124,
     "amount": 600000,
     "payment_method": "Bank Transfer",
     "payment_proof": "https://s3.amazonaws.com/proof.jpg"
   }
   ```

5. **Create donation with payment_id**:
   ```
   POST /api/donations/requests
   {
     "sponsor_name": "John Doe",
     "sponsor_email": "john@example.com",
     "payment_id": 124,
     "trees_count": 400
   }
   ```

### UI Behavior (donationSummary.tsx)

- **Amount ≤ ₹5,00,000**: Shows "Pay Securely via Razorpay" button
- **Amount > ₹5,00,000**: Shows bank transfer details with QR code and file upload for payment proof
- **After successful Razorpay payment**: Shows "Complete Donation" button
- **For bank transfers**: Requires payment proof upload before allowing donation completion

## Database Models

### Payment Model
```typescript
interface PaymentAttributes {
  id: number;
  amount: number;
  donor_type: string | null;
  pan_number: string | null;
  consent: boolean;
  order_id: string | null;  // Razorpay order ID
  qr_id: string | null;     // QR code ID
  created_at: Date;
  updated_at: Date;
}
```

### Donation Model
```typescript
interface DonationAttributes {
  id: number;
  user_id: number;
  payment_id: number | null;
  category: LandCategory;
  grove: string;
  trees_count: number;
  amount_donated: number | null;
  donation_type: 'adopt' | 'donate';
  donation_method: 'trees' | 'amount';
  status: 'PendingPayment' | 'Paid' | 'OrderFulfilled';
  // ... other fields
}
```

## Error Handling

Both APIs implement comprehensive error handling:

- **Validation Errors**: Return 400 status with descriptive messages
- **Database Errors**: Return 500 status with generic error message
- **External Service Errors**: Logged internally, return 500 status
- **Not Found Errors**: Return 404 status for missing resources

## Security Considerations

- Payment verification using Razorpay signature validation
- Input validation and sanitization
- Error logging without exposing sensitive data
- Consent tracking for compliance

## Related Endpoints

### Payment Management
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `POST /api/payments/verify` - Verify Razorpay payment
- `POST /api/payments/history` - Add payment history

## Payment Verification & History APIs

### POST /api/payments/verify

#### When it's invoked
- **Automatically called after successful Razorpay payment** in the frontend
- Triggered in the Razorpay payment success handler
- Used to verify the authenticity of the payment transaction

#### Purpose
Validates the Razorpay payment signature to ensure the payment is legitimate and hasn't been tampered with.

#### Request Body
```json
{
  "order_id": "order_9A33XWu170gUtm",
  "razorpay_payment_id": "pay_29QQoUBi66xm2f",
  "razorpay_signature": "5b1e5c9e5f1e5c9e5f1e5c9e5f1e5c9e5f1e5c9e"
}
```

#### How it Works
1. Uses Razorpay's signature verification algorithm
2. Validates the signature against order_id and payment_id
3. Returns success/failure status

#### Response
```json
{
  "message": "Transaction is legit!"
}
```

### POST /api/payments/history

#### When it's invoked
- **For amounts > ₹5,00,000**: When user uploads payment proof for bank transfer
- **For offline payments**: When manual payment confirmation is needed
- Called from the donation form when `isAboveLimit` is true and payment proof is uploaded

#### Purpose
Records payment history with proof of payment for bank transfers and offline payments.

#### Request Body
```json
{
  "payment_id": 123,
  "amount": 600000,
  "payment_method": "Bank Transfer",
  "payment_proof": "https://s3.amazonaws.com/bucket/payment-proof.jpg"
}
```

#### How it Works
1. Links payment proof to existing payment record
2. Records payment method and amount
3. Sets payment and received dates
4. Stores proof URL for verification

#### Response
```json
{
  "id": 456,
  "payment_id": 123,
  "amount": 600000,
  "payment_method": "Bank Transfer",
  "payment_proof": "https://s3.amazonaws.com/bucket/payment-proof.jpg",
  "payment_date": "2023-10-01T12:34:56Z"
}
```

### Donation Management
- `POST /api/donations/requests/get` - Get donations with filters
- `PUT /api/donations/requests/:id` - Update donation
- `DELETE /api/donations/requests/:id` - Delete donation
- `POST /api/donations/:id/process` - Mark donation as processed

This documentation provides a comprehensive overview of how the payment and donation APIs work together to handle the complete donation flow in the 14Trees platform.