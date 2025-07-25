# Gift Cards API Documentation

This document describes the key API endpoints used in the gift cards functionality.

## API Endpoints

### 1. `/api/gift-cards/book` (POST)

**Purpose**: Books trees for a gift card request

**Description**: This endpoint is used to reserve/assign specific trees to a gift card request. It can either automatically select trees based on criteria or use a provided list of tree IDs.

**Request Body**:
```json
{
  "gift_card_request_id": 1,
  "gift_card_trees": [
    {
      "tree_id": 101
    }
  ],
  "diversify": true,
  "book_non_giftable": false,
  "book_all_habits": false
}
```

**Parameters**:
- `gift_card_request_id` (integer, required): ID of the gift card request
- `gift_card_trees` (array, optional): Array of tree objects with tree_id. If not provided, trees will be automatically selected
- `diversify` (boolean, optional): Whether to diversify tree selection
- `book_non_giftable` (boolean, optional): Whether to include non-giftable trees
- `book_all_habits` (boolean, optional): Whether to include trees of all habits

**Functionality**:
- Validates that the gift card request exists
- Checks if plots are assigned to the request (required before booking trees)
- If no specific trees provided, automatically selects trees based on:
  - Available trees in assigned plots
  - Number of cards needed (no_of_cards - already booked)
  - Diversification and filtering criteria
- Maps selected trees to the user and group associated with the request
- Returns error if insufficient trees are available

**Response**: 
- Success: Trees booked successfully
- Error: Validation errors or insufficient trees available

---

### 2. `/api/gift-cards/users` (POST)

**Purpose**: Adds or updates users associated with a gift card request (Upsert operation)

**Description**: This endpoint manages the recipient and assignee information for gift cards. It can create new user associations or update existing ones for a gift card request.

**Request Body**:
```json
{
  "gift_card_request_id": 1,
  "users": [
    {
      "id": 1,
      "gifted_to": 1,
      "gifted_to_name": "John Doe",
      "gifted_to_email": "john.doe@example.com",
      "gifted_to_phone": "9876543210",
      "gifted_to_dob": "1990-01-01",
      "assigned_to": 2,
      "assigned_to_name": "Jane Doe",
      "assigned_to_email": "jane.doe@example.com",
      "assigned_to_phone": "9876543211",
      "assigned_to_dob": "1991-01-01",
      "relation": "Friend",
      "profile_image_url": "https://example.com/profile.jpg",
      "count": 1
    }
  ]
}
```

**Parameters**:
- `gift_card_request_id` (integer, required): ID of the gift card request
- `users` (array, required): Array of user objects containing:
  - `id` (integer): User record ID (for updates)
  - `gifted_to` (integer): ID of the recipient user
  - `gifted_to_name` (string): Name of the gift recipient
  - `gifted_to_email` (string): Email of the gift recipient
  - `gifted_to_phone` (string): Phone number of the gift recipient
  - `gifted_to_dob` (string): Date of birth of the gift recipient (YYYY-MM-DD format)
  - `assigned_to` (integer): ID of the person assigning/giving the gift
  - `assigned_to_name` (string): Name of the gift giver
  - `assigned_to_email` (string): Email of the gift giver
  - `assigned_to_phone` (string): Phone number of the gift giver
  - `assigned_to_dob` (string): Date of birth of the gift giver (YYYY-MM-DD format)
  - `relation` (string): Relationship between giver and recipient
  - `profile_image_url` (string): URL to profile image
  - `count` (integer): Number of gift cards for this user relationship

**Functionality**:
- Validates that the gift card request exists
- Performs upsert operations (insert new or update existing user associations)
- Manages relationships between gift givers and recipients
- Updates user data and relationships in the database
- Returns updated gift card request with presentation IDs

**Response**: 
- Success: Updated gift card request object with filtered presentation IDs
- Error: Validation errors or database operation failures

---

## Usage Flow

1. **Create Gift Card Request**: First create a gift card request using `/api/gift-cards/requests`
2. **Assign Plots**: Assign plots to the request using `/api/gift-cards/plots`
3. **Book Trees**: Use `/api/gift-cards/book` to reserve trees for the gift cards
4. **Add Recipients**: Use `/api/gift-cards/users` to specify who will receive the gift cards and who is giving them

## Notes

- The `/book` endpoint requires plots to be assigned to the gift card request before trees can be booked
- The `/users` endpoint supports both creating new user associations and updating existing ones
- Both endpoints validate the existence of the gift card request before processing
- Tree booking considers various criteria like diversification and tree availability
- User management handles complex relationships between gift givers and recipients